import { getServerEnv } from "@/lib/config/env";
import { validateCartForOrder } from "@/lib/services/cart-validation-service";
import {
  checkIdempotencyKey,
  checkOrderIdempotencyKey,
  generateOrderIdempotencyKey,
  markIdempotencyCreated,
  markOrderIdempotencyCreated,
} from "@/lib/services/idempotency-service";
import { getCachedVariantInventory } from "@/lib/services/product-search-service";
import { writeAuditLog } from "@/lib/services/audit-log-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createOrder, ShopifyAPIError, type ShopifyOrder } from "@/lib/adapters/shopify/shopify-client";
import { isOwnerApprovedLiveOrder } from "@/lib/config/env";

export type CreateOrderInput = {
  store_id: string;
  conversation_id: string;
  variant_id: string;
  quantity: number;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  shipping_fee: number;
  total: number;
  explicit_confirmation_text: string;
  idempotency_key?: string;
  testMode?: boolean;
};

export type CreateOrderResult =
  | { success: true; order_name: string; shopify_order_id: string; duplicate?: boolean }
  | {
      success: false;
      missing_fields?: string[];
      reason: "validation_failed" | "out_of_stock" | "shopify_error" | "owner_approval_required";
      message?: string;
      action?: "owner_approval_required";
      reply?: string;
    };

const mockOrders = new Map<string, { id: string; name: string }>();

async function persistOrderRecord(input: CreateOrderInput, order: ShopifyOrder, idempotencyKey: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.from("orders").insert({
      store_id: input.store_id,
      conversation_id: input.conversation_id,
      shopify_order_id: order.id,
      shopify_order_name: order.name,
      customer_id: input.customer_name,
      channel: "whatsapp_evolution",
      total_price: input.total,
      currency: "EGP",
      line_items_json: [{ variant_id: input.variant_id, quantity: input.quantity, price: input.total }],
      safety_status: "SAFE_TO_CREATE",
      created_by: "AI",
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
    });
    if (error) console.error("orders insert error", error);
  } catch (error) {
    console.error("persistOrderRecord exception", error);
  }
}

async function createOrderWithRetry(
  orderFn: typeof createOrder,
  input: Parameters<typeof createOrder>,
): Promise<ShopifyOrder> {
  let attempt = 0;
  while (attempt < 3) {
    attempt += 1;
    try {
      return await orderFn(input[0], input[1]);
    } catch (error) {
      const isRateLimit = error instanceof ShopifyAPIError ? error.statusCode === 429 : String((error as Error).message).includes("rate_limit");
      if (isRateLimit && attempt < 3) continue;
      throw error;
    }
  }
  throw new Error("shopify_rate_limit_exhausted");
}

const OWNER_APPROVAL_REPLY = "الأوردر جاهز للمراجعة، وفريق Youlya هيأكد معاكِ قبل التنفيذ.";

// Simple in-memory order rate cap per store (resets every hour)
const orderCapStore = new Map<string, { count: number; resetAt: number }>();
const ORDER_CAP_HOURLY = 30;

function checkOrderCap(storeId: string): { allowed: true } | { allowed: false; retryAfterMinutes: number } {
  const now = Date.now();
  const entry = orderCapStore.get(storeId);
  if (!entry || entry.resetAt < now) {
    orderCapStore.set(storeId, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return { allowed: true };
  }
  if (entry.count >= ORDER_CAP_HOURLY) {
    return { allowed: false, retryAfterMinutes: Math.ceil((entry.resetAt - now) / 60_000) };
  }
  entry.count += 1;
  return { allowed: true };
}

function buildOwnerApprovalBlocker(input: CreateOrderInput, key: string): CreateOrderResult {
  writeAuditLog({
    action: "order.owner_approval_required",
    entityType: "orders",
    entityId: key,
    metadata: {
      store_id: input.store_id,
      conversation_id: input.conversation_id,
      idempotency_key: key,
      testMode: input.testMode === true,
    },
  });
  return {
    success: false,
    reason: "owner_approval_required",
    action: "owner_approval_required",
    reply: OWNER_APPROVAL_REPLY,
    message: "owner approval required",
  };
}

export async function createCODOrder(
  input: CreateOrderInput,
  deps: { createOrderFn?: typeof createOrder } = {},
): Promise<CreateOrderResult> {
  const cap = checkOrderCap(input.store_id);
  if (!cap.allowed) {
    console.warn("order_cap_exceeded", { store_id: input.store_id, retryAfterMinutes: cap.retryAfterMinutes });
    return {
      success: false,
      reason: "owner_approval_required",
      action: "owner_approval_required",
      reply: OWNER_APPROVAL_REPLY,
      message: `hourly order cap reached (${ORDER_CAP_HOURLY}). retry in ${cap.retryAfterMinutes} minutes.`,
    };
  }

  const validation = validateCartForOrder({
    variant_id: input.variant_id,
    quantity: input.quantity,
    customer_full_name: input.customer_name,
    phone: input.phone,
    address: input.address,
    shipping_fee: input.shipping_fee,
    total: input.total,
    explicit_confirmation_text: input.explicit_confirmation_text,
  });
  if (!validation.valid) return { success: false, reason: "validation_failed", missing_fields: validation.missing_fields };

  const key =
    input.idempotency_key ??
    generateOrderIdempotencyKey({
      store_id: input.store_id,
      conversation_id: input.conversation_id,
      variant_id: input.variant_id,
      quantity: input.quantity,
      address: input.address,
    });
  const existing = await checkOrderIdempotencyKey(input.store_id, key);
  const fallbackExisting = existing.exists ? existing : checkIdempotencyKey(input.store_id, key);
  if (fallbackExisting.exists && fallbackExisting.order) {
    return { success: true, order_name: fallbackExisting.order.name, shopify_order_id: fallbackExisting.order.id, duplicate: true };
  }

  const inventory = getCachedVariantInventory(input.variant_id);
  if (inventory === null || inventory < input.quantity) {
    return { success: false, reason: "out_of_stock" };
  }

  const env = getServerEnv();
  const isTestMode = input.testMode === true;
  const shouldMockOrder = isTestMode || env.MOCK_MODE === "true";

  if (!shouldMockOrder && !isOwnerApprovedLiveOrder()) {
    return buildOwnerApprovalBlocker(input, key);
  }

  try {
    let shopifyOrder: ShopifyOrder;
    if (shouldMockOrder) {
      shopifyOrder = { id: `MOCK-${key.slice(0, 10)}`, name: `MOCK-${input.conversation_id}` };
    } else if (!deps.createOrderFn && (!env.SHOPIFY_STORE_URL || !env.SHOPIFY_ADMIN_API_KEY)) {
      return { success: false, reason: "shopify_error", message: "shopify_not_configured" };
    } else {
      const orderFn = deps.createOrderFn ?? createOrder;
      shopifyOrder = await createOrderWithRetry(orderFn, [
        { storeUrl: env.SHOPIFY_STORE_URL ?? "http://localhost", adminApiKey: env.SHOPIFY_ADMIN_API_KEY ?? "mock" },
        {
          order: {
            financial_status: "pending",
            tags: "YoulyaAI,cod,whatsapp,AI-confirmed",
            note: "Made By AI",
            line_items: [{ variant_id: input.variant_id, quantity: input.quantity }],
            shipping_address: {
              name: input.customer_name,
              phone: input.phone,
              address1: input.address,
              city: input.city,
            },
            total_price: input.total.toFixed(2),
          },
        },
      ]);
    }

    await markOrderIdempotencyCreated(input.store_id, key, { id: shopifyOrder.id, name: shopifyOrder.name });
    markIdempotencyCreated(input.store_id, key, { id: shopifyOrder.id, name: shopifyOrder.name });
    await persistOrderRecord(input, shopifyOrder, key);
    mockOrders.set(`${input.store_id}:${key}`, { id: shopifyOrder.id, name: shopifyOrder.name });
    getMockState().auditLogs.push({
      action: "orders.persist",
      entityType: "orders",
      entityId: shopifyOrder.id,
      store_id: input.store_id,
      createdAt: new Date().toISOString(),
    });
    writeAuditLog({
      action: "order.create",
      entityType: "orders",
      entityId: shopifyOrder.id,
      metadata: { store_id: input.store_id, conversation_id: input.conversation_id, idempotency_key: key },
    });
    return { success: true, order_name: shopifyOrder.name, shopify_order_id: shopifyOrder.id };
  } catch (error) {
    const message = error instanceof ShopifyAPIError ? error.message : "shopify_unknown_error";
    return { success: false, reason: "shopify_error", message };
  }
}
