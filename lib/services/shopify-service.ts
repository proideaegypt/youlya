import { getServerEnv, isMockMode } from "@/lib/config/env";
import { LiveShopifyAdapter } from "@/lib/adapters/shopify/live-shopify-adapter";
import { MockShopifyAdapter } from "@/lib/adapters/shopify/mock-shopify-adapter";
import { getCartItems } from "@/lib/services/cart-service";
import { getIdempotentResult, setIdempotentResult } from "@/lib/services/idempotency-service";
import { writeAuditLog } from "@/lib/services/audit-log-service";
import { writeToolLog } from "@/lib/services/tool-log-service";
import type { CreateShopifyOrderInput, CreateShopifyOrderOutput } from "@/lib/types/commerce";

export async function createShopifyOrder(input: CreateShopifyOrderInput): Promise<CreateShopifyOrderOutput> {
  const start = Date.now();
  const cached = getIdempotentResult(input.idempotencyKey);
  if (cached) {
    return { status: "idempotent_return", testMode: input.testMode, duplicate: true, shopifyOrderId: cached.id, shopifyOrderName: cached.name };
  }

  const env = getServerEnv();
  const adapter = input.testMode || isMockMode() || !env.SHOPIFY_ADMIN_ACCESS_TOKEN ? new MockShopifyAdapter() : new LiveShopifyAdapter();
  const items = getCartItems(input.cartId);
  const inventoryOk = await adapter.recheckInventory(items);
  if (!inventoryOk) return { status: "failed", testMode: input.testMode, duplicate: false, error: "inventory_recheck_failed" };

  const result = await adapter.createCodOrder({
    storeSlug: input.storeSlug,
    idempotencyKey: input.idempotencyKey,
    cartItems: items,
    testMode: input.testMode,
  });

  writeToolLog({
    toolName: "create_shopify_order",
    inputSummary: { cartId: input.cartId, testMode: input.testMode, itemCount: items.length },
    outputSummary: { status: result.status, shopifyOrderName: result.shopifyOrderName ?? null },
    status: result.status === "failed" ? "error" : "ok",
    latencyMs: Date.now() - start,
    errorMessage: result.error,
  });
  if (result.status !== "failed" && result.shopifyOrderId && result.shopifyOrderName) {
    setIdempotentResult(input.idempotencyKey, { id: result.shopifyOrderId, name: result.shopifyOrderName });
    writeAuditLog({ action: "order.create", entityType: "order", entityId: result.shopifyOrderId, metadata: { testMode: input.testMode } });
  }
  return result;
}

