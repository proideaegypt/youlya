import { afterEach, describe, expect, test, vi } from "vitest";
import { createCODOrder } from "@/lib/services/shopify-order-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

describe("shopify order service", () => {
  const resetEnv = () => {
    process.env.MOCK_MODE = "true";
    process.env.OWNER_APPROVES_LIVE_ORDER = "false";
    delete process.env.SHOPIFY_STORE_URL;
    delete process.env.SHOPIFY_ADMIN_API_KEY;
  };

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

  const liveEnv = () => {
    process.env.MOCK_MODE = "false";
    process.env.OWNER_APPROVES_LIVE_ORDER = "true";
    process.env.SHOPIFY_STORE_URL = "https://example.myshopify.com";
    process.env.SHOPIFY_ADMIN_API_KEY = "test-admin-key";
  };

  const blockedEnv = () => {
    process.env.MOCK_MODE = "false";
    process.env.OWNER_APPROVES_LIVE_ORDER = "false";
    process.env.SHOPIFY_STORE_URL = "https://example.myshopify.com";
    process.env.SHOPIFY_ADMIN_API_KEY = "test-admin-key";
  };

  resetEnv();

  test("happy path: order created + audit log written", async () => {
    resetEnv();
    const before = getMockState().auditLogs.length;
    const result = await createCODOrder({ ...baseInput, idempotency_key: "happy-path-1" });
    expect(result.success).toBe(true);
    expect(getMockState().auditLogs.length).toBeGreaterThan(before);
  });

  test("real order blocked when owner approval is missing", async () => {
    blockedEnv();
    const createOrderFn = vi.fn(async () => ({ id: "shop-live-1", name: "#LIVE-1" }));
    const result = await createCODOrder({ ...baseInput, idempotency_key: "approval-blocked-1" }, { createOrderFn });
    expect(createOrderFn).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe("owner_approval_required");
      expect(result.action).toBe("owner_approval_required");
      expect(result.reply).toContain("الأوردر جاهز للمراجعة");
    }
  });

  test("real order allowed only when owner approval is true", async () => {
    liveEnv();
    const createOrderFn = vi.fn(async () => ({ id: "shop-live-2", name: "#LIVE-2" }));
    const result = await createCODOrder({ ...baseInput, idempotency_key: "approval-allowed-1" }, { createOrderFn });
    expect(createOrderFn).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.shopify_order_id).toBe("shop-live-2");
      expect(result.order_name).toBe("#LIVE-2");
    }
  });

  test("duplicate call returns existing, no second Shopify call", async () => {
    liveEnv();
    const createOrderFn = vi.fn(async () => ({ id: "shop-dup-1", name: "#DUP-1" }));
    const first = await createCODOrder({ ...baseInput, idempotency_key: "dup-key-1" }, { createOrderFn });
    const second = await createCODOrder({ ...baseInput, idempotency_key: "dup-key-1" }, { createOrderFn });
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (second.success) expect(second.duplicate).toBe(true);
    expect(createOrderFn).toHaveBeenCalledTimes(1);
  });

  test("OOS recheck blocks order", async () => {
    resetEnv();
    const result = await createCODOrder({ ...baseInput, variant_id: "gid://shopify/ProductVariant/21" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.reason).toBe("out_of_stock");
  });

  test("missing field blocks order via cart validation", async () => {
    resetEnv();
    const result = await createCODOrder({ ...baseInput, phone: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.missing_fields).toContain("phone");
  });

  test("Shopify 429 triggers retry", async () => {
    liveEnv();
    let calls = 0;
    const createOrderFn = vi.fn(async () => {
      calls += 1;
      if (calls < 3) {
        const err = new Error("shopify_rate_limit_exhausted");
        throw err;
      }
      return { id: "shop-429", name: "#429" };
    });
    const result = await createCODOrder({ ...baseInput, idempotency_key: "retry-429-unique" }, { createOrderFn });
    expect(createOrderFn).toHaveBeenCalledTimes(3);
    expect(result.success).toBe(true);
  });

  test("Shopify 500 error returns failure with no fake order", async () => {
    liveEnv();
    const createOrderFn = vi.fn(async () => {
      throw new Error("shopify_server_error");
    });
    const result = await createCODOrder({ ...baseInput, idempotency_key: "shop-500-unique" }, { createOrderFn });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.reason).toBe("shopify_error");
    if (result.success) expect(result.order_name).toBeFalsy();
  });

  test("testMode always uses mock order and ignores injected live adapter", async () => {
    blockedEnv();
    const createOrderFn = vi.fn(async () => ({ id: "live-order", name: "#LIVE" }));
    const result = await createCODOrder({ ...baseInput, idempotency_key: "test-mode-1", testMode: true }, { createOrderFn });
    expect(createOrderFn).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.shopify_order_id.startsWith("MOCK-")).toBe(true);
      expect(result.duplicate).not.toBe(true);
    }
  });

  test("MOCK_MODE=true still uses mock order even when owner approval is false", async () => {
    resetEnv();
    const createOrderFn = vi.fn(async () => ({ id: "live-order", name: "#LIVE" }));
    const result = await createCODOrder({ ...baseInput, idempotency_key: "mock-mode-1" }, { createOrderFn });
    expect(createOrderFn).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    if (result.success) expect(result.shopify_order_id.startsWith("MOCK-")).toBe(true);
  });

  afterEach(() => {
    resetEnv();
  });
});
