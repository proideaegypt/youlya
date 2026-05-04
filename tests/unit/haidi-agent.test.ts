import { describe, expect, test } from "vitest";
import { validateHaidiOutput } from "@/lib/services/haidi-output-validator";
import { buildHaidiContext } from "@/lib/services/haidi-context-builder";

describe("haidi-output-validator", () => {
  const appReply = "App fallback reply";

  test("valid output passes", () => {
    const result = validateHaidiOutput(
      {
        final_reply: "Hello customer",
        intent_label: "greeting",
        tone: "friendly",
        used_upsell: false,
        recommended_next_step: "ask_size",
        safety_notes: [],
      },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.final_reply).toBe("Hello customer");
      expect(result.output.used_upsell).toBe(false);
    }
  });

  test("invalid JSON falls back to app reply", () => {
    const result = validateHaidiOutput(null, "ai_reply", appReply);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fallbackReply).toBe(appReply);
    }
  });

  test("empty final_reply falls back", () => {
    const result = validateHaidiOutput(
      { final_reply: "   " },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(false);
  });

  test("missing final_reply falls back", () => {
    const result = validateHaidiOutput(
      { intent_label: "greeting" },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(false);
  });

  test("blocks unsafe Arabic order confirmation when app action is not order_created", () => {
    const result = validateHaidiOutput(
      { final_reply: "تم تأكيد الأوردر بنجاح" },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("unsafe order confirmation");
    }
  });

  test("allows order confirmation phrase when app action is order_created", () => {
    const result = validateHaidiOutput(
      { final_reply: "تم تأكيد الأوردر بنجاح" },
      "order_created",
      appReply
    );
    expect(result.ok).toBe(true);
  });

  test("blocks unsafe Arabic order creation phrase", () => {
    const result = validateHaidiOutput(
      { final_reply: "الأوردر اتعمل" },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(false);
  });

  test("defaults used_upsell to false when missing", () => {
    const result = validateHaidiOutput(
      { final_reply: "Hi" },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.used_upsell).toBe(false);
    }
  });

  test("defaults intent_label to fallback when invalid", () => {
    const result = validateHaidiOutput(
      { final_reply: "Hi", intent_label: "unknown_intent" },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.intent_label).toBe("fallback");
    }
  });

  test("defaults tone to friendly when invalid", () => {
    const result = validateHaidiOutput(
      { final_reply: "Hi", tone: "aggressive" },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.tone).toBe("friendly");
    }
  });

  test("does not expose secrets in validation result", () => {
    const result = validateHaidiOutput(
      { final_reply: "Hi", safety_notes: ["note1"] },
      "ai_reply",
      appReply
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.safety_notes).toEqual(["note1"]);
      // Ensure no secret fields leak
      expect("secret" in result.output).toBe(false);
      expect("api_key" in result.output).toBe(false);
    }
  });
});

describe("haidi-context-builder", () => {
  test("product search context has max 10 products", () => {
    const recommendations = Array.from({ length: 15 }, (_, i) => ({
      index: i + 1,
      shopifyProductTitle: `Product ${i + 1}`,
      variantOptions: [
        { size: "M", color: "Black", price: 100, currency: "EGP", inventoryQuantity: 5, available: true },
      ],
    }));
    const ctx = buildHaidiContext({
      language: "ar-EG",
      customerText: "عايزة بيجامات",
      action: "product_results",
      intent: "PRODUCT_SEARCH",
      recommendations,
    });
    expect(ctx.commerceFacts.products.length).toBeLessThanOrEqual(10);
  });

  test("product search context includes product facts", () => {
    const ctx = buildHaidiContext({
      language: "ar-EG",
      customerText: "عايزة بيجامات",
      action: "product_results",
      intent: "PRODUCT_SEARCH",
      recommendations: [
        {
          index: 1,
          shopifyProductTitle: "بيجامة شتوي",
          imageUrl: "https://cdn.example.com/1.jpg",
          variantOptions: [
            { size: "M", color: "Black", price: 950, currency: "EGP", inventoryQuantity: 4, available: true },
            { size: "L", color: "Black", price: 950, currency: "EGP", inventoryQuantity: 2, available: true },
          ],
        },
      ],
    });
    expect(ctx.commerceFacts.products[0].title).toBe("بيجامة شتوي");
    expect(ctx.commerceFacts.products[0].sizes).toContain("M");
    expect(ctx.commerceFacts.products[0].sizes).toContain("L");
    expect(ctx.commerceFacts.products[0].colors).toContain("Black");
    expect(ctx.commerceFacts.products[0].price).toBe(950);
    expect(ctx.commerceFacts.products[0].available).toBe(true);
  });

  test("handoff context has correct replyGoal", () => {
    const ctx = buildHaidiContext({
      language: "ar-EG",
      customerText: "مش فاهم",
      action: "handoff",
      intent: "UNCLEAR",
    });
    expect(ctx.replyGoal).toBe("handoff");
  });

  test("order created context has correct replyGoal", () => {
    const ctx = buildHaidiContext({
      language: "ar-EG",
      customerText: "أكدي",
      action: "order_created",
      intent: "CONFIRM_ORDER",
      cartItems: [{ title: "بيجامة", price: 950, size: "M" }],
    });
    expect(ctx.replyGoal).toBe("order_confirmation");
    expect(ctx.commerceFacts.cart.itemsCount).toBe(1);
    expect(ctx.commerceFacts.cart.subtotal).toBe(950);
  });

  test("empty recommendations yields empty products", () => {
    const ctx = buildHaidiContext({
      language: "ar-EG",
      customerText: "hello",
      action: "ai_reply",
      intent: "OTHER",
    });
    expect(ctx.commerceFacts.products).toEqual([]);
  });

  test("blocked reason included when provided", () => {
    const ctx = buildHaidiContext({
      language: "ar-EG",
      customerText: "رقم ١",
      action: "error",
      intent: "SELECT_PRODUCT",
      blockedReason: "out_of_stock",
    });
    expect(ctx.commerceFacts.blockedReason).toBe("out_of_stock");
  });
});
