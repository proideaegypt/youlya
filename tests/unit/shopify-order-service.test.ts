import { describe, expect, test, vi } from "vitest";
import { createCODOrder } from "@/lib/services/shopify-order-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

describe("shopify order service", () => {
  const baseInput = {
    store_id: "youlya",
    conversation_id: "conv-200",
    variant_id: "gid://shopify/ProductVariant/11",
    quantity: 1,
    customer_name: "Sara Ahmed",
    phone: "201001234567",
    address: "Nasr City",
    city: "Cairo",
    shipping_fee: 70,
    total: 1020,
    explicit_confirmation_text: "yes confirm",
  };

  test("happy path: order created + audit log written", async () => {
    const before = getMockState().auditLogs.length;
    const result = await createCODOrder(baseInput);
    expect(result.success).toBe(true);
    expect(getMockState().auditLogs.length).toBeGreaterThan(before);
  });

  test("duplicate call returns existing, no second Shopify call", async () => {
    const createOrderFn = vi.fn(async () => ({ id: "shop-dup-1", name: "#DUP-1" }));
    const first = await createCODOrder({ ...baseInput, idempotency_key: "dup-key-1" }, { createOrderFn });
    const second = await createCODOrder({ ...baseInput, idempotency_key: "dup-key-1" }, { createOrderFn });
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (second.success) expect(second.duplicate).toBe(true);
    expect(createOrderFn).toHaveBeenCalledTimes(1);
  });

  test("OOS recheck blocks order", async () => {
    const result = await createCODOrder({ ...baseInput, variant_id: "gid://shopify/ProductVariant/21" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.reason).toBe("out_of_stock");
  });

  test("missing field blocks order via cart validation", async () => {
    const result = await createCODOrder({ ...baseInput, phone: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.missing_fields).toContain("phone");
  });

  test("Shopify 429 triggers retry", async () => {
    let calls = 0;
    const createOrderFn = vi.fn(async () => {
      calls += 1;
      if (calls < 3) {
        const err = new Error("shopify_rate_limit_exhausted");
        throw err;
      }
      return { id: "shop-429", name: "#429" };
    });
    const result = await createCODOrder({ ...baseInput, idempotency_key: "retry-429" }, { createOrderFn });
    expect(createOrderFn).toHaveBeenCalledTimes(3);
    expect(result.success).toBe(true);
  });

  test("Shopify 500 error returns failure with no fake order", async () => {
    const createOrderFn = vi.fn(async () => {
      throw new Error("shopify_server_error");
    });
    const result = await createCODOrder({ ...baseInput, idempotency_key: "shop-500" }, { createOrderFn });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.reason).toBe("shopify_error");
    if (result.success) expect(result.order_name).toBeFalsy();
  });
});
