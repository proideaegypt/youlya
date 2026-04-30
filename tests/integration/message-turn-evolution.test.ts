import { beforeEach, describe, expect, test, vi } from "vitest";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

describe("message turn evolution integration", () => {
  beforeEach(() => {
    getMockState().conversationStatus.clear();
    getMockState().unclearCounts.clear();
    process.env.EVOLUTION_MOCK = "true";
  });

  test("whatsapp_evolution turn sends reply through evolution mock path", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await runMessageTurn({
      store_id: "youlya",
      conversation_id: "c-evo-1",
      customer_id: "u1",
      channel: "whatsapp_evolution",
      message_type: "text",
      text: "ممكن تفاصيل",
      language: "ar-EG",
      tone: "neutral",
      remote_jid: "201000000000@s.whatsapp.net",
      instance_name: "YoulyaMain",
      provider_message_id: "pmid-1",
    });
    expect(["ai_reply", "product_results", "handoff", "error", "order_created", "ai_disabled"]).toContain(result.action);
    expect(logSpy).toHaveBeenCalled();
  });

  test("duplicate provider_message_id returns cached result", async () => {
    const base = {
      store_id: "youlya",
      conversation_id: "c-evo-dup",
      customer_id: "u1",
      channel: "whatsapp_evolution" as const,
      message_type: "text" as const,
      text: "مرحبا",
      language: "ar-EG",
      tone: "neutral" as const,
      remote_jid: "201000000000@s.whatsapp.net",
      instance_name: "YoulyaMain",
      provider_message_id: "pmid-dup-1",
    };
    const first = await runMessageTurn(base);
    const second = await runMessageTurn(base);
    expect(second.action).toBe(first.action);
    expect(second.reply).toBe(first.reply);
  });
});
