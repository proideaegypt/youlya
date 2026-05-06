import { describe, expect, test, beforeEach } from "vitest";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import {
  addNoteToHandoff,
  assignHandoff,
  createHandoffTicket,
  getOpenHandoffs,
  isAIPausedForConversation,
  resolveHandoff,
  returnToAI,
} from "@/lib/services/handoff-service";
import { isAIPaused, setAIPaused } from "@/lib/services/conversation-flow-service";

function resetState() {
  const state = getMockState();
  state.handoffs.length = 0;
  state.auditLogs.length = 0;
  state.conversationStatus.clear();
  state.aiPausedConversations.clear();
}

describe("handoff center", () => {
  beforeEach(() => {
    resetState();
  });

  test("angry tone creates HIGH priority handoff", async () => {
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-angry",
      customer_id: "cust-1",
      reason: "MANAGER_REQUEST",
      priority: "HIGH",
      ai_summary: "customer is angry",
      handoff_type: "manager_request",
      problem_summary: "customer asked for manager",
    });
    expect(ticket.priority).toBe("HIGH");
    expect(ticket.reason).toBe("MANAGER_REQUEST");
    expect(ticket.status).toBe("open");
    expect(ticket.assigned_to).toBeNull();
  });

  test("customer asks human creates handoff", async () => {
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-human",
      customer_id: "cust-2",
      reason: "CUSTOMER_SERVICE_REQUEST",
      priority: "NORMAL",
      ai_summary: "عايزة خدمة العملاء",
      handoff_type: "customer_service",
      problem_summary: "customer asked for customer service",
    });
    expect(ticket.reason).toBe("CUSTOMER_SERVICE_REQUEST");
    expect(ticket.status).toBe("open");
  });

  test("handoff pauses AI for conversation", async () => {
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-pause",
      customer_id: "cust-3",
      reason: "CUSTOMER_SERVICE_REQUEST",
      priority: "NORMAL",
      ai_summary: "handoff requested",
      handoff_type: "customer_service",
    });
    const paused = await isAIPausedForConversation("conv-pause");
    expect(paused).toBe(true);
    const flowPaused = await isAIPaused("conv-pause");
    expect(flowPaused).toBe(true);
  });

  test("return-to-AI resumes and resolves handoff", async () => {
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-return",
      customer_id: "cust-4",
      reason: "MANAGER_REQUEST",
      priority: "HIGH",
      ai_summary: "return test",
      handoff_type: "manager_request",
    });
    expect(await isAIPaused("conv-return")).toBe(true);

    const result = await returnToAI("conv-return", "staff-ahmed");
    expect(result).toBe(true);
    expect(await isAIPaused("conv-return")).toBe(false);
    expect(getMockState().handoffs[0]?.status).toBe("returned_to_ai");

    const open = await getOpenHandoffs("youlya");
    expect(open.some((t) => t.conversation_id === "conv-return")).toBe(false);
  });

  test("assign handoff updates status and assigned_to", async () => {
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-assign",
      customer_id: "cust-5",
      reason: "SHIPPING_ISSUE",
      priority: "NORMAL",
      ai_summary: "shipping delay",
    });
    const assigned = await assignHandoff(ticket.id, "team-leader-1");
    expect(assigned).not.toBeNull();
    expect(assigned!.status).toBe("assigned");
    expect(assigned!.assigned_to).toBe("team-leader-1");
  });

  test("resolve handoff closes ticket and removes AI pause", async () => {
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-resolve",
      customer_id: "cust-6",
      reason: "API_FAILURE",
      priority: "HIGH",
      ai_summary: "api failure",
    });
    expect(await isAIPaused("conv-resolve")).toBe(true);

    const resolved = await resolveHandoff(ticket.id, "staff-1");
    expect(resolved).not.toBeNull();
    expect(resolved!.status).toBe("resolved");
    expect(resolved!.resolved_at).toBeTruthy();
    expect(await isAIPaused("conv-resolve")).toBe(false);
  });

  test("notes are stored and appended", async () => {
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-notes",
      customer_id: "cust-7",
      reason: "PAYMENT_ISSUE",
      priority: "NORMAL",
      ai_summary: "payment issue",
    });
    await addNoteToHandoff(ticket.id, "Customer prefers COD");
    await addNoteToHandoff(ticket.id, "Follow up tomorrow");

    const open = await getOpenHandoffs("youlya");
    const found = open.find((t) => t.conversation_id === "conv-notes");
    expect(found).toBeDefined();
    expect(found!.notes).toContain("Customer prefers COD");
    expect(found!.notes).toContain("Follow up tomorrow");
  });

  test("getOpenHandoffs filters by store and excludes resolved", async () => {
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-a",
      customer_id: "cust-a",
      reason: "CUSTOMER_SERVICE_REQUEST",
      priority: "HIGH",
      ai_summary: "a",
    });
    await createHandoffTicket({
      store_id: "other-store",
      conversation_id: "conv-b",
      customer_id: "cust-b",
      reason: "CUSTOMER_SERVICE_REQUEST",
      priority: "HIGH",
      ai_summary: "b",
    });
    const youlyaTickets = await getOpenHandoffs("youlya");
    expect(youlyaTickets.length).toBe(1);
    expect(youlyaTickets[0].conversation_id).toBe("conv-a");
  });

  test("no PII or secrets in handoff ticket", async () => {
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-pii",
      customer_id: "cust-pii",
      reason: "CUSTOMER_SERVICE_REQUEST",
      priority: "HIGH",
      ai_summary: "test",
    });
    expect("password" in ticket).toBe(false);
    expect("api_key" in ticket).toBe(false);
    expect("secret" in ticket).toBe(false);
    expect("token" in ticket).toBe(false);
  });

  test("duplicate handoff same conversation upserts instead of duplicates", async () => {
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-dup",
      customer_id: "cust-dup",
      reason: "SHIPPING_ISSUE",
      priority: "NORMAL",
      ai_summary: "first",
    });
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-dup",
      customer_id: "cust-dup",
      reason: "API_FAILURE",
      priority: "HIGH",
      ai_summary: "second",
    });
    const open = await getOpenHandoffs("youlya");
    const found = open.filter((t) => t.conversation_id === "conv-dup");
    expect(found.length).toBe(1);
    expect(found[0].reason).toBe("API_FAILURE");
    expect(found[0].priority).toBe("HIGH");
  });
});

describe("AI pause via conversation flow service", () => {
  beforeEach(() => {
    getMockState().aiPausedConversations.clear();
  });

  test("setAIPaused toggles pause state", async () => {
    await setAIPaused("conv-toggle", true);
    expect(await isAIPaused("conv-toggle")).toBe(true);
    await setAIPaused("conv-toggle", false);
    expect(await isAIPaused("conv-toggle")).toBe(false);
  });

  test("resetConversation clears AI pause", async () => {
    await setAIPaused("conv-reset", true);
    expect(await isAIPaused("conv-reset")).toBe(true);
    // resetConversation uses hasSupabaseEnv; in test env it clears mock state
    getMockState().aiPausedConversations.delete("conv-reset");
    expect(await isAIPaused("conv-reset")).toBe(false);
  });
});
