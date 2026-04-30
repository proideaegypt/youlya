import type { CartItem, CustomerInfo } from "@/lib/services/conversation-flow-service";

export async function placeOrder(
  conversationId: string,
  cart: CartItem[],
  customerInfo: CustomerInfo,
  storeId: string,
): Promise<{ order_id: string; order_name: string; total: number }> {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const payload = {
    line_items: cart.map((item) => ({
      variant_id: item.variant_id,
      quantity: 1,
      title: item.title,
      size: item.size,
      price: item.price,
    })),
    customer: { name: customerInfo.name, phone: customerInfo.phone },
    shipping_address: { address1: customerInfo.address },
    tags: "COD,WhatsApp-AI",
    note: `WhatsApp order via Youlya AI | conv: ${conversationId}`,
    financial_status: "pending",
    store_id: storeId,
  };

  console.log("[MOCK-SHOPIFY] Order payload:", JSON.stringify(payload, null, 2));

  return {
    order_id: `MOCK-${Date.now()}`,
    order_name: `#MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
    total,
  };
}
