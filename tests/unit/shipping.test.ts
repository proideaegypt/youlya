import { describe, expect, test } from "vitest";
import { addCartItems } from "@/lib/services/cart-service";
import { calculateShipping } from "@/lib/services/shipping-service";

describe("shipping", () => {
  test("cairo shipping 70", () => {
    addCartItems("cart-cairo", [{ index: 1, shopifyProductTitle: "x", shopifyVariantId: "v", sku: null, quantity: 1, price: 500, inStock: true }]);
    const quote = calculateShipping("cart-cairo", "القاهرة");
    expect(quote.shippingFee).toBe(70);
  });

  test("alex shipping 90", () => {
    addCartItems("cart-alex", [{ index: 1, shopifyProductTitle: "x", shopifyVariantId: "v", sku: null, quantity: 1, price: 500, inStock: true }]);
    const quote = calculateShipping("cart-alex", "اسكندرية");
    expect(quote.shippingFee).toBe(90);
  });
});

