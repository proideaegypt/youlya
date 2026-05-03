import { fetchAllShopifyProducts } from "@/lib/adapters/shopify/shopify-product-sync-adapter";
import { ProductSyncRepository, type GenericSupabaseClient } from "@/lib/adapters/supabase/product-sync-repository";
import { resolveStoreUuid } from "@/lib/adapters/supabase/store-resolver";
import { createClient } from "@supabase/supabase-js";

export type SyncMode = "full" | "inventory";
export type SyncSource = "manual" | "n8n_daily" | "api";

export type SyncResult = {
  ok: boolean;
  mode: SyncMode;
  source: SyncSource;
  storeId: string;
  syncedProducts: number;
  syncedVariants: number;
  missingSkuCount: number;
  unavailableCount: number;
  durationMs: number;
  startedAt: string;
  finishedAt: string;
  dryRun: boolean;
  errorCode?: string;
  safeMessage?: string;
};

function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "mock") return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function syncShopifyProducts({
  storeId,
  mode,
  source,
  dryRun = false,
}: {
  storeId: string;
  mode: SyncMode;
  source: SyncSource;
  dryRun?: boolean;
}): Promise<SyncResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const storeUuid = await resolveStoreUuid(storeId);
  if (!storeUuid) {
    return {
      ok: false,
      mode,
      source,
      storeId,
      syncedProducts: 0,
      syncedVariants: 0,
      missingSkuCount: 0,
      unavailableCount: 0,
      durationMs: Date.now() - startTime,
      startedAt,
      finishedAt: new Date().toISOString(),
      dryRun,
      errorCode: "STORE_NOT_FOUND",
      safeMessage: `Store not found for identifier: ${storeId}`,
    };
  }

  try {
    const client = getSupabaseServiceClient();
    const repo = new ProductSyncRepository(client as unknown as GenericSupabaseClient | null);

    // For inventory-only mode, we still fetch all products for now
    // (future: implement incremental inventory-only GraphQL query)
    const pageSize = mode === "inventory" ? 100 : 50;
    const fetchResult = await fetchAllShopifyProducts(pageSize, 100, (page, pageNum) => {
      console.log(`[sync] page ${pageNum}: ${page.productCount} products, ${page.variantCount} variants`);
    });

    if (!fetchResult.ok) {
      return {
        ok: false,
        mode,
        source,
        storeId,
        syncedProducts: 0,
        syncedVariants: 0,
        missingSkuCount: 0,
        unavailableCount: 0,
        durationMs: Date.now() - startTime,
        startedAt,
        finishedAt: new Date().toISOString(),
        dryRun,
        errorCode: fetchResult.errorCode || "SHOPIFY_FETCH_FAILED",
        safeMessage: fetchResult.error || "Failed to fetch products from Shopify",
      };
    }

    if (dryRun) {
      const unavailableCount = fetchResult.products.reduce(
        (sum, p) => sum + p.variants.filter((v) => v.inventoryQuantity <= 0).length,
        0,
      );
      return {
        ok: true,
        mode,
        source,
        storeId,
        syncedProducts: fetchResult.productCount,
        syncedVariants: fetchResult.variantCount,
        missingSkuCount: fetchResult.missingSkuCount,
        unavailableCount,
        durationMs: Date.now() - startTime,
        startedAt,
        finishedAt: new Date().toISOString(),
        dryRun,
      };
    }

    // Upsert products
    const productResult = await repo.upsertProducts(storeUuid, fetchResult.products);
    if (productResult.errors.length > 0) {
      return {
        ok: false,
        mode,
        source,
        storeId,
        syncedProducts: 0,
        syncedVariants: 0,
        missingSkuCount: 0,
        unavailableCount: 0,
        durationMs: Date.now() - startTime,
        startedAt,
        finishedAt: new Date().toISOString(),
        dryRun,
        errorCode: "SUPABASE_UPSERT_ERROR",
        safeMessage: productResult.errors[0],
      };
    }

    // Get product ID map for foreign key linking
    const shopifyProductIds = fetchResult.products.map((p) => p.shopifyProductId);
    const productIdMap = await repo.getProductIdMap(storeUuid, shopifyProductIds);

    // Flatten variants
    const allVariants = fetchResult.products.flatMap((p) => p.variants);

    // Upsert variants
    const variantResult = await repo.upsertVariants(storeUuid, productIdMap, allVariants);
    if (variantResult.errors.length > 0) {
      return {
        ok: false,
        mode,
        source,
        storeId,
        syncedProducts: productResult.upserted,
        syncedVariants: 0,
        missingSkuCount: fetchResult.missingSkuCount,
        unavailableCount: 0,
        durationMs: Date.now() - startTime,
        startedAt,
        finishedAt: new Date().toISOString(),
        dryRun,
        errorCode: "SUPABASE_UPSERT_ERROR",
        safeMessage: variantResult.errors[0],
      };
    }

    const unavailableCount = allVariants.filter((v) => v.inventoryQuantity <= 0).length;

    return {
      ok: true,
      mode,
      source,
      storeId,
      syncedProducts: productResult.upserted,
      syncedVariants: variantResult.upserted,
      missingSkuCount: fetchResult.missingSkuCount,
      unavailableCount,
      durationMs: Date.now() - startTime,
      startedAt,
      finishedAt: new Date().toISOString(),
      dryRun,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      mode,
      source,
      storeId,
      syncedProducts: 0,
      syncedVariants: 0,
      missingSkuCount: 0,
      unavailableCount: 0,
      durationMs: Date.now() - startTime,
      startedAt,
      finishedAt: new Date().toISOString(),
      dryRun,
      errorCode: "SYNC_UNEXPECTED_ERROR",
      safeMessage: message,
    };
  }
}
