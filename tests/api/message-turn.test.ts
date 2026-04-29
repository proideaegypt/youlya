import { describe, expect, test } from "vitest";
import { POST as turnRoute } from "@/app/api/internal/messages/turn/route";

describe("message turn route", () => {
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
});

