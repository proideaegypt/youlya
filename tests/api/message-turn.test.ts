import { afterEach, describe, expect, test } from "vitest";
import { POST as turnRoute } from "@/app/api/internal/messages/turn/route";

describe("message turn route", () => {
  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    delete process.env.INTERNAL_API_SECRET;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.EVOLUTION_API_URL;
    delete process.env.EVOLUTION_API_KEY;
    delete process.env.SHOPIFY_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_API_TOKEN;
    delete process.env.OPENAI_API_KEY;
  });

  test("returns required shape in testMode", async () => {
    const req = new Request("http://localhost/api/internal/messages/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        scenarioId: "CONV-001",
        storeSlug: "youlya",
        channel: "whatsapp_evolution",
        locale: "ar-EG",
        messageType: "text",
        text: "عايزة بيجامات شتوي",
        preconditions: {},
        testMode: true,
      }),
    });
    const res = await turnRoute(req);
    const body = (await res.json()) as Record<string, unknown>;
    expect(typeof body.intent).toBe("string");
    expect(Array.isArray(body.toolsCalled)).toBe(true);
    expect(typeof body.reply).toBe("string");
    expect(typeof body.handoff).toBe("boolean");
  });

  test("rejects unauthenticated testMode in production", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.INTERNAL_API_SECRET = "test-secret";
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
    process.env.SUPABASE_ANON_KEY = "test-anon";
    process.env.EVOLUTION_API_URL = "https://example-evolution.local";
    process.env.EVOLUTION_API_KEY = "test-evolution-key";
    process.env.SHOPIFY_STORE_DOMAIN = "example.myshopify.com";
    process.env.SHOPIFY_ADMIN_API_TOKEN = "test-shopify-token";
    process.env.OPENAI_API_KEY = "test-openai-key";

    const req = new Request("http://localhost/api/internal/messages/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        scenarioId: "CONV-001",
        storeSlug: "youlya",
        channel: "whatsapp_evolution",
        locale: "ar-EG",
        messageType: "text",
        text: "عايزة بيجامات شتوي",
        preconditions: {},
        testMode: true,
      }),
    });

    const res = await turnRoute(req);
    expect(res.status).toBe(401);
  });

  test("derives conversation id from remote_jid when missing", async () => {
    const req = new Request("http://localhost/api/internal/messages/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        store_id: "youlya",
        customer_id: "customer-1",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "مرحبا",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201001234567@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-remote-jid-1",
        _preconditions: { ai_enabled: false },
        testMode: true,
      }),
    });
    const res = await turnRoute(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.action).toBe("ai_disabled");
    expect(typeof body.reply).toBe("string");
  });

  test("unauthenticated request with _preconditions does not mutate conversation state", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.INTERNAL_API_SECRET = "test-secret";
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
    process.env.SUPABASE_ANON_KEY = "test-anon";
    process.env.EVOLUTION_API_URL = "https://example-evolution.local";
    process.env.EVOLUTION_API_KEY = "test-evolution-key";
    process.env.SHOPIFY_STORE_DOMAIN = "example.myshopify.com";
    process.env.SHOPIFY_ADMIN_API_TOKEN = "test-shopify-token";
    process.env.OPENAI_API_KEY = "test-openai-key";

    const { getMockState } = await import("@/lib/adapters/supabase/mock-store");
    const mockBefore = getMockState().conversationFlow.get("conv-precondition-auth-test");

    const req = new Request("http://localhost/api/internal/messages/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        store_id: "youlya",
        conversation_id: "conv-precondition-auth-test",
        customer_id: "cust-1",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "test",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201001234567@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-precondition-auth-test",
        _preconditions: { stage: "browsing", cart: [{ product_id: "p1", quantity: 2, name: "Test", price: 100 }] },
        testMode: false,
      }),
    });

    const res = await turnRoute(req);
    expect(res.status).toBe(401);

    const mockAfter = getMockState().conversationFlow.get("conv-precondition-auth-test");
    expect(mockAfter).toBe(mockBefore);
    expect(mockAfter).toBeUndefined();
  });

  test("rejects missing conversation id when no fallback exists", async () => {
    const req = new Request("http://localhost/api/internal/messages/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        store_id: "youlya",
        customer_id: "customer-1",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "مرحبا",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "   ",
        instance_name: "youlya",
        provider_message_id: "msg-missing-conv-1",
        testMode: true,
      }),
    });
    const res = await turnRoute(req);
    expect(res.status).toBe(400);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.error).toBe("missing_conversation_id");
  });

  test("customer service request triggers handoff", async () => {
    process.env.INTERNAL_API_SECRET = "test-secret";
    const req = new Request("http://localhost/api/internal/messages/turn", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": "test-secret",
      },
      body: JSON.stringify({
        store_id: "youlya",
        conversation_id: "conv-customer-service",
        customer_id: "cust-1",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "عايزه حد من خدمة العملاء",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201001234567@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-customer-service",
        testMode: true,
      }),
    });
    const res = await turnRoute(req);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.action).toBe("handoff");
    expect(body.handoff).toBe(true);
  });

  test("manager request triggers high priority handoff", async () => {
    process.env.INTERNAL_API_SECRET = "test-secret";
    const req = new Request("http://localhost/api/internal/messages/turn", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": "test-secret",
      },
      body: JSON.stringify({
        store_id: "youlya",
        conversation_id: "conv-manager-request",
        customer_id: "cust-2",
        channel: "whatsapp_evolution",
        message_type: "text",
        text: "ممكن اتواصل مع حد من المديرين",
        language: "ar-EG",
        tone: "browsing",
        remote_jid: "201001234567@s.whatsapp.net",
        instance_name: "youlya",
        provider_message_id: "msg-manager-request",
        testMode: true,
      }),
    });
    const res = await turnRoute(req);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.action).toBe("handoff");
    expect(body.handoff).toBe(true);
  });
});
