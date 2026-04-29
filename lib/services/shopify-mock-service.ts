import type { CartItem } from "@/lib/types/commerce";

type CustomerInfo = {
  name?: string;
  phone?: string;
  address?: string;
};

export async function placeOrder(
  conversationId: string,
  cart: CartItem[],
  customerInfo: CustomerInfo | null,
): Promise<{ order_id: string; order_name: string }> {
  const payload = {
    conversationId,
    cart,
    customerInfo,
    createdAt: new Date().toISOString(),
  };
  // Required: mock logs exact payload format for later Shopify adapter wiring.
  console.log("[shopify-mock] placeOrder payload", JSON.stringify(payload));

  return {
    order_id: `MOCK-${Date.now()}`,
    order_name: "#MOCK-001",
  };
}
