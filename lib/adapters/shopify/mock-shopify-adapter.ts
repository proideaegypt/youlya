import type { ShopifyAdapter, CreateOrderPayload } from "@/lib/adapters/shopify/shopify-adapter";
import type { CreateShopifyOrderOutput } from "@/lib/types/commerce";

export class MockShopifyAdapter implements ShopifyAdapter {
  async recheckInventory(_items: CreateOrderPayload["cartItems"]) {
    return true;
  }

  async createCodOrder(payload: CreateOrderPayload): Promise<CreateShopifyOrderOutput> {
    if (payload.testMode !== true) {
      return { status: "failed", testMode: false, duplicate: false, error: "mock adapter requires testMode" };
    }
    const suffix = payload.idempotencyKey.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || "DEFAULT";
    return {
      status: "created",
      testMode: true,
      duplicate: false,
      shopifyOrderId: `TEST-ID-${suffix}`,
      shopifyOrderName: `TEST-ORDER-${suffix}`,
    };
  }
}
