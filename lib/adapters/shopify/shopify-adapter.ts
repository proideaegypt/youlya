import type { CartItem, CreateShopifyOrderOutput } from "@/lib/types/commerce";

export type CreateOrderPayload = {
  storeSlug: string;
  idempotencyKey: string;
  cartItems: CartItem[];
  testMode: boolean;
};

export interface ShopifyAdapter {
  createCodOrder(payload: CreateOrderPayload): Promise<CreateShopifyOrderOutput>;
  recheckInventory(items: CartItem[]): Promise<boolean>;
}

