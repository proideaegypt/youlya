import { describe, expect, test } from "vitest";
import { validateCartForOrder } from "@/lib/services/cart-validation-service";
import { checkIdempotencyKey, generateOrderIdempotencyKey, markIdempotencyCreated } from "@/lib/services/idempotency-service";
import { parseConfirmationMessage } from "@/lib/services/confirmation-parser";

describe("cart validation + idempotency + confirmation parser", () => {
  test("all fields present -> valid", () => {
    const result = validateCartForOrder({
      variant_id: "gid://shopify/ProductVariant/11",
      quantity: 1,
      customer_full_name: "Sara Ahmed",
      phone: "201001234567",
      address: "Nasr City, Cairo",
      shipping_fee: 70,
      total: 1020,
      explicit_confirmation_text: "أيوه أكدي",
    });
    expect(result.valid).toBe(true);
    expect(result.missing_fields).toEqual([]);
  });

  test("missing variant_id -> invalid + missing field name", () => {
    const result = validateCartForOrder({
      quantity: 1,
      customer_full_name: "Sara Ahmed",
      phone: "201001234567",
      address: "Nasr City, Cairo",
      shipping_fee: 70,
      total: 1020,
      explicit_confirmation_text: "أيوه أكدي",
    });
    expect(result.valid).toBe(false);
    expect(result.missing_fields).toContain("variant_id");
  });

  test("missing phone -> invalid", () => {
    const result = validateCartForOrder({
      variant_id: "gid://shopify/ProductVariant/11",
      quantity: 1,
      customer_full_name: "Sara Ahmed",
      address: "Nasr City, Cairo",
      shipping_fee: 70,
      total: 1020,
      explicit_confirmation_text: "أيوه أكدي",
    });
    expect(result.valid).toBe(false);
    expect(result.missing_fields).toContain("phone");
  });

  test("duplicate idempotency key returns existing order", () => {
    const key = generateOrderIdempotencyKey({
      store_id: "youlya",
      conversation_id: "conv-1",
      variant_id: "gid://shopify/ProductVariant/11",
      quantity: 1,
      address: "Nasr City, Cairo",
    });
    markIdempotencyCreated("youlya", key, { id: "ord-1", name: "#1001" });
    const result = checkIdempotencyKey("youlya", key);
    expect(result.exists).toBe(true);
    expect(result.order?.id).toBe("ord-1");
  });

  test("confirmation parser Arabic + English explicit phrases", () => {
    const ar = parseConfirmationMessage("أيوه موافق");
    const en = parseConfirmationMessage("yes confirm");
    expect(ar.confirmed).toBe(true);
    expect(en.confirmed).toBe(true);
    expect(ar.confidence).toBeGreaterThanOrEqual(0.8);
    expect(en.confidence).toBeGreaterThanOrEqual(0.8);
  });

  test("ambiguous message below threshold -> not confirmed", () => {
    const parsed = parseConfirmationMessage("تمام");
    expect(parsed.confirmed).toBe(false);
    expect(parsed.confidence).toBeLessThan(0.8);
  });
});

