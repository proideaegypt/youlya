import { describe, it, expect, beforeEach } from "vitest";
import {
  maskCustomerIdentifier,
  ensureConversation,
  logInboundMessage,
  logOutboundMessage,
  logSystemEvent,
  getConversationTimeline,
  listConversations,
} from "@/lib/services/message-history-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

describe("message-history-service", () => {
  beforeEach(() => {
    const mock = getMockState() as Record<string, unknown>;
    if (mock.conversationHistory instanceof Map) (mock.conversationHistory as Map<string, unknown>).clear();
    else mock.conversationHistory = new Map();
    if (Array.isArray(mock.messageHistory)) (mock.messageHistory as Array<unknown>).length = 0;
    else mock.messageHistory = [];
    if (Array.isArray(mock.conversationEvents)) (mock.conversationEvents as Array<unknown>).length = 0;
    else mock.conversationEvents = [];
  });

  describe("maskCustomerIdentifier", () => {
    it("masks a phone number", () => {
      expect(maskCustomerIdentifier("201000000001")).toBe("201****001");
    });
    it("masks a WhatsApp JID", () => {
      expect(maskCustomerIdentifier("201000000001@s.whatsapp.net")).toBe("201****001");
    });
    it("masks short strings", () => {
      expect(maskCustomerIdentifier("abc")).toBe("****");
    });
  });

  describe("ensureConversation", () => {
    it("creates a conversation in mock state", async () => {
      await ensureConversation("conv-1", "store-a", "whatsapp", "cust-1");
      const mock = getMockState();
      expect(mock.conversationHistory.has("conv-1")).toBe(true);
      const c = mock.conversationHistory.get("conv-1")!;
      expect(c.store_id).toBe("store-a");
      expect(c.channel).toBe("whatsapp");
    });
  });

  describe("logInboundMessage", () => {
    it("persists inbound message to mock state", async () => {
      await logInboundMessage({
        store_id: "store-a",
        conversation_id: "conv-1",
        customer_id: "cust-1",
        provider_message_id: "msg-1",
        channel: "whatsapp",
        message_type: "text",
        text: "Hello",
      });
      const mock = getMockState();
      expect(mock.messageHistory.length).toBe(1);
      expect(mock.messageHistory[0].direction).toBe("inbound");
      expect(mock.messageHistory[0].text).toBe("Hello");
    });

    it("strips secrets from inbound text", async () => {
      const secretSample = "sk-replace-with-placeholder";
      await logInboundMessage({
        store_id: "store-a",
        conversation_id: "conv-1",
        channel: "whatsapp",
        message_type: "text",
        text: `my key is ${secretSample} and bearer token`,
      });
      const mock = getMockState();
      const text = String(mock.messageHistory[0].text);
      expect(text).not.toContain(secretSample);
      expect(text).toContain("[REDACTED]");
    });
  });

  describe("logOutboundMessage", () => {
    it("persists outbound message to mock state", async () => {
      await logOutboundMessage({
        store_id: "store-a",
        conversation_id: "conv-1",
        channel: "whatsapp",
        message_type: "text",
        text: "Reply",
        final_reply: "Reply",
        status: "delivered",
      });
      const mock = getMockState();
      expect(mock.messageHistory.length).toBe(1);
      expect(mock.messageHistory[0].direction).toBe("outbound");
      expect(mock.messageHistory[0].status).toBe("delivered");
    });
  });

  describe("logSystemEvent", () => {
    it("persists a tool_call event", async () => {
      await logSystemEvent({
        store_id: "store-a",
        conversation_id: "conv-1",
        event_type: "tool_call",
        summary: "searchProducts",
        metadata: { query: "cotton" },
      });
      const mock = getMockState();
      expect(mock.conversationEvents.length).toBe(1);
      expect(mock.conversationEvents[0].event_type).toBe("tool_call");
    });
  });

  describe("getConversationTimeline", () => {
    it("returns sorted timeline newest first", async () => {
      await logInboundMessage({ store_id: "s", conversation_id: "conv-1", channel: "w", message_type: "text", text: "A" });
      await new Promise((r) => setTimeout(r, 10));
      await logOutboundMessage({ store_id: "s", conversation_id: "conv-1", channel: "w", message_type: "text", text: "B" });
      await new Promise((r) => setTimeout(r, 10));
      await logSystemEvent({ store_id: "s", conversation_id: "conv-1", event_type: "handoff", summary: "H" });

      const timeline = await getConversationTimeline("conv-1", "s", { limit: 10 });
      expect(timeline.length).toBe(3);
      expect(timeline[0].type).toBe("event");
      expect(timeline[0].event_type).toBe("handoff");
    });
  });

  describe("listConversations", () => {
    it("returns conversations for a store", async () => {
      await ensureConversation("conv-1", "store-a", "whatsapp");
      await ensureConversation("conv-2", "store-a", "whatsapp");
      const list = await listConversations("store-a", { limit: 10 });
      expect(list.length).toBe(2);
    });
  });

  describe("no secrets in responses", () => {
    it("does not include raw payload secrets in timeline", async () => {
      await logInboundMessage({
        store_id: "s",
        conversation_id: "conv-1",
        channel: "w",
        message_type: "text",
        text: "ok",
        raw_payload: { secret: "Bearer abc12345678901234567890" },
      });
      const timeline = await getConversationTimeline("conv-1", "s");
      const msg = timeline.find((t) => t.type === "message");
      expect(msg).toBeDefined();
      // raw_payload is not exposed in timeline by design (metadata is empty object when absent)
      expect(msg?.metadata).toEqual({});
    });
  });
});
