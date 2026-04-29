import { describe, expect, test } from "vitest";
import { addCartItems } from "@/lib/services/cart-service";
import { evaluateConfirmation } from "@/lib/services/confirmation-service";

describe("confirmation gate", () => {
  test("explicit confirmation accepted", () => {
    addCartItems("cart-confirm", [{ index: 1, shopifyProductTitle: "x", shopifyVariantId: "v", sku: null, quantity: 1, price: 100, inStock: true }]);
    const result = evaluateConfirmation({
      cartId: "cart-confirm",
      customerMessage: "أيوه أكدي",
      lastBotMessageType: "final_summary",
      customerDataReady: true,
      shippingReady: true,
    });
    expect(result.safeToCreateOrder).toBe(true);
  });

  test("ambiguous confirmation needs clarification when no summary", () => {
    addCartItems("cart-ambiguous", [{ index: 1, shopifyProductTitle: "x", shopifyVariantId: "v", sku: null, quantity: 1, price: 100, inStock: true }]);
    const result = evaluateConfirmation({
      cartId: "cart-ambiguous",
      customerMessage: "تمام",
      customerDataReady: true,
      shippingReady: true,
    });
    expect(result.confirmationStatus).toBe("ambiguous_needs_clarification");
  });
});

