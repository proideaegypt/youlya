import { describe, expect, test } from "vitest";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { logToolCall } from "@/lib/services/ai-tool-logger";
import { createHandoffTicket } from "@/lib/services/handoff-service";
import { isKillSwitchEnabled, setKillSwitchForStore } from "@/lib/services/kill-switch-service";

function resetState() {
  const state = getMockState();
  state.handoffs.length = 0;
  state.auditLogs.length = 0;
  state.toolLogs.length = 0;
  state.conversationStatus.clear();
  state.killSwitchByStore.clear();
  state.handoffNotifications.length = 0;
}

describe("handoff + notifications + ai tool logs", () => {
  test("customer service ticket creates notification", async () => {
    resetState();
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-1",
      customer_id: "cust-1",
      reason: "CUSTOMER_SERVICE_REQUEST",
      priority: "NORMAL",
      ai_summary: "customer service",
      handoff_type: "customer_service",
      problem_summary: "customer wants support",
    });
    expect(ticket.priority).toBe("NORMAL");
    expect(getMockState().handoffNotifications.length).toBe(1);
    expect(getMockState().handoffNotifications[0]?.handoff_ticket_id).toBe(ticket.id);
  });

  test("kill switch on -> true", async () => {
    resetState();
    setKillSwitchForStore("youlya", true);
    const enabled = await isKillSwitchEnabled("youlya");
    expect(enabled).toBe(true);
  });

  test("kill switch off -> false", async () => {
    resetState();
    setKillSwitchForStore("youlya", false);
    const enabled = await isKillSwitchEnabled("youlya");
    expect(enabled).toBe(false);
  });

  test("tool logger strips phone/address from input_summary", async () => {
    resetState();
    await logToolCall({
      store_id: "youlya",
      conversation_id: "conv-3",
      tool_name: "product_search",
      input_summary: { phone: "201001234567", address: "Cairo", query: "pajama" },
      output_summary: { count: 3 },
      status: "ok",
      latency_ms: 120,
    });
    await new Promise((resolve) => setImmediate(resolve));
    const logged = getMockState().toolLogs[0] as { input_summary?: Record<string, unknown> } | undefined;
    expect(logged?.input_summary?.phone).toBeUndefined();
    expect(logged?.input_summary?.address).toBeUndefined();
    expect(logged?.input_summary?.query).toBe("pajama");
  });

  test("duplicate handoff same conversation -> upsert not duplicate", async () => {
    resetState();
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-4",
      customer_id: "cust-4",
      reason: "SHIPPING_ISSUE",
      priority: "NORMAL",
      ai_summary: "shipping",
    });
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-4",
      customer_id: "cust-4",
      reason: "API_FAILURE",
      priority: "HIGH",
      ai_summary: "api down",
    });
    expect(getMockState().handoffs.length).toBe(1);
    expect(getMockState().handoffs[0]?.reason).toBe("API_FAILURE");
  });
});
