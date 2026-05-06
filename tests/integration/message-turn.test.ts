import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { POST as turnRoute } from "@/app/api/internal/messages/turn/route";
import { addCartItems } from "@/lib/services/cart-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { resetKillSwitchCache, setKillSwitchForStore } from "@/lib/services/kill-switch-service";

const INTERNAL_SECRET = "test-internal-secret";

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/internal/messages/turn", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-secret": INTERNAL_SECRET,
    },
    body: JSON.stringify(body),
  });
}

function resetState() {
  const state = getMockState();
  state.handoffs.length = 0;
  state.auditLogs.length = 0;
  state.toolLogs.length = 0;
  state.unclearCounts.clear();
  state.conversationStatus.clear();
  state.killSwitchByStore.clear();
  state.carts.clear();
  state.orderByIdempotency.clear();
  resetKillSwitchCache();
}

beforeAll(() => {
  process.env.INTERNAL_API_SECRET = INTERNAL_SECRET;
  process.env.MOCK_MODE = "true";
});

beforeEach(() => {
  resetState();
});

describe("message turn integration", () => {
  test("text message -> intent -> product search -> reply", async () => {
    const res = await turnRoute(
      makeRequest({
        store_id: "11111111-1111-1111-1111-111111111111",
        conversation_id: "22222222-2222-2222-2222-222222222222",
        customer_id: "33333333-3333-3333-3333-333333333333",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "عايزة بيجامة شتوي",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201000000000@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-1",
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.intent).toBe("PRODUCT_SEARCH");
    expect(body.action).toBe("product_results");
    expect(Array.isArray(body.toolsCalled)).toBe(true);
    expect(body.handoff).toBe(false);
  });

  test("confirm -> idempotency check -> order created", async () => {
    addCartItems("22222222-2222-2222-2222-222222222222", [
      { index: 1, shopifyProductTitle: "بيجامة شتوي أسود", shopifyVariantId: "gid://shopify/ProductVariant/11", sku: "YLY-PJ-BLK-XL", size: "XL", quantity: 1, price: 950, inStock: true },
    ]);

    const res = await turnRoute(
      makeRequest({
        store_id: "11111111-1111-1111-1111-111111111111",
        conversation_id: "22222222-2222-2222-2222-222222222222",
        customer_id: "33333333-3333-3333-3333-333333333333",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "أيوه أكدي",
        language: "ar-EG",
        tone: "ready_to_buy",
        remote_jid: "201000000000@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-2",
        customer_name: "Sara Ahmed",
        phone: "201001234567",
        address: "Nasr City, Cairo",
        city: "Cairo",
        shipping_fee: 70,
        total: 1020,
        cart_id: "22222222-2222-2222-2222-222222222222",
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.intent).toBe("CONFIRM_ORDER");
    expect(body.action).toBe("order_created");
    expect(body.handoff).toBe(false);
    expect(body.data && typeof body.data === "object").toBe(true);
  });

  test("kill switch ON -> immediate handoff", async () => {
    setKillSwitchForStore("11111111-1111-1111-1111-111111111111", true);

    const res = await turnRoute(
      makeRequest({
        store_id: "11111111-1111-1111-1111-111111111111",
        conversation_id: "44444444-4444-4444-4444-444444444444",
        customer_id: "33333333-3333-3333-3333-333333333333",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "عايزة بيجامة",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201000000000@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-3",
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.action).toBe("ai_disabled");
    expect(body.handoff).toBe(false);
  });

  test("explicit customer service request -> immediate handoff", async () => {
    const res = await turnRoute(
      makeRequest({
        store_id: "11111111-1111-1111-1111-111111111111",
        conversation_id: "66666666-6666-6666-6666-666666666666",
        customer_id: "33333333-3333-3333-3333-333333333333",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "عايزه حد من خدمة العملاء",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201000000000@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-human-request",
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.intent).toBe("handoff");
    expect(body.action).toBe("handoff");
    expect(body.handoff).toBe(true);
    expect(String(body.reply ?? "")).toContain("تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.");
    expect(String(body.reply ?? "")).toContain("تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.");
  });

  test("explicit manager request -> immediate handoff", async () => {
    const res = await turnRoute(
      makeRequest({
        store_id: "11111111-1111-1111-1111-111111111111",
        conversation_id: "77777777-7777-7777-7777-777777777777",
        customer_id: "33333333-3333-3333-3333-333333333333",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "ممكن اتواصل مع حد من المديرين",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201000000000@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-manager-request",
      }),
    );
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.intent).toBe("handoff");
    expect(body.action).toBe("handoff");
    expect(body.handoff).toBe(true);
    expect(String(body.reply ?? "")).toContain("تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.");
    expect(String(body.reply ?? "")).toContain("تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.");
  });

  test("greeting and unclear messages do not handoff", async () => {
    const bodyTemplate = {
      store_id: "11111111-1111-1111-1111-111111111111",
      conversation_id: "55555555-5555-5555-5555-555555555555",
      customer_id: "33333333-3333-3333-3333-333333333333",
      channel: "whatsapp_evolution" as const,
      message_type: "text" as const,
      text: "هاي",
      language: "ar-EG",
      tone: "browsing" as const,
      remote_jid: "201000000000@s.whatsapp.net",
      instance_name: "youlya",
      provider_message_id: "msg-unclear",
    };

    const res = await turnRoute(makeRequest(bodyTemplate));
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.handoff).toBe(false);
    expect(String(body.reply ?? "")).not.toContain("خدمة العملاء");
  });
});
