import { describe, expect, test } from "vitest";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { logToolCall } from "@/lib/services/ai-tool-logger";
import { incrementUnclearCount } from "@/lib/services/conversation-state-service";
import { createHandoffTicket } from "@/lib/services/handoff-service";
import { isKillSwitchEnabled, setKillSwitchForStore } from "@/lib/services/kill-switch-service";

function resetState() {
  const state = getMockState();
  state.handoffs.length = 0;
  state.auditLogs.length = 0;
  state.toolLogs.length = 0;
  state.unclearCounts.clear();
  state.conversationStatus.clear();
  state.killSwitchByStore.clear();
}

describe("handoff + kill switch + ai tool logs", () => {
  test("angry tone -> HIGH priority ticket created", async () => {
    resetState();
    const ticket = await createHandoffTicket({
      store_id: "youlya",
      conversation_id: "conv-1",
      customer_id: "cust-1",
      reason: "ANGRY_TONE",
      priority: "HIGH",
      ai_summary: "customer angry",
    });
    expect(ticket.priority).toBe("HIGH");
  });

  test("unclear 3x -> handoff auto-triggered", async () => {
    resetState();
    await incrementUnclearCount("conv-2", { store_id: "youlya", customer_id: "cust-2" });
    await incrementUnclearCount("conv-2", { store_id: "youlya", customer_id: "cust-2" });
    await incrementUnclearCount("conv-2", { store_id: "youlya", customer_id: "cust-2" });
    expect(getMockState().handoffs.length).toBe(1);
    expect(getMockState().handoffs[0]?.reason).toBe("UNCLEAR_3X");
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

