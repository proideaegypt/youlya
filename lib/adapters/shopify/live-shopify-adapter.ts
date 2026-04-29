import type { ShopifyAdapter, CreateOrderPayload } from "@/lib/adapters/shopify/shopify-adapter";
import type { CreateShopifyOrderOutput } from "@/lib/types/commerce";

export class LiveShopifyAdapter implements ShopifyAdapter {
  async recheckInventory(_items: CreateOrderPayload["cartItems"]) {
    return false;
  }

  async createCodOrder(_payload: CreateOrderPayload): Promise<CreateShopifyOrderOutput> {
    return {
      status: "failed",
      testMode: false,
      duplicate: false,
      error: "LIVE_ADAPTER_BLOCKED_UNTIL_CREDENTIALS_AND_APPROVAL",
    };
  }
}
