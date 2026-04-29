export class ShopifyAPIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export type ShopifyCredentials = {
  storeUrl: string;
  adminApiKey: string;
};

export type ShopifyOrderPayload = {
  order: {
    financial_status: "pending";
    tags: string;
    note: string;
    line_items: Array<{ variant_id: string; quantity: number }>;
    shipping_address: {
      name: string;
      phone: string;
      address1: string;
      city: string;
    };
    total_price: string;
  };
};

export type ShopifyOrder = {
  id: string;
  name: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createOrder(
  storeCredentials: ShopifyCredentials,
  orderPayload: ShopifyOrderPayload,
): Promise<ShopifyOrder> {
  const url = `${storeCredentials.storeUrl.replace(/\/$/, "")}/admin/api/2024-01/orders.json`;
  let attempt = 0;
  while (attempt < 3) {
    attempt += 1;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": storeCredentials.adminApiKey,
      },
      body: JSON.stringify(orderPayload),
    });
    if (res.status === 429 && attempt < 3) {
      await sleep(attempt === 1 ? 1000 : 2000);
      continue;
    }
    if (res.status >= 500) throw new ShopifyAPIError("shopify_server_error", res.status);
    if (!res.ok) {
      const bodyText = await res.text();
      throw new ShopifyAPIError(bodyText || "shopify_request_failed", res.status);
    }
    const parsed = (await res.json()) as { order?: { id?: number | string; name?: string } };
    if (!parsed.order?.id || !parsed.order.name) throw new ShopifyAPIError("invalid_shopify_order_response", 502);
    return { id: String(parsed.order.id), name: parsed.order.name };
  }
  throw new ShopifyAPIError("shopify_rate_limit_exhausted", 429);
}

