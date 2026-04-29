import { ProductMappingRepository } from "@/lib/adapters/supabase/product-mapping-repository";
import { getMockState, mappingKey } from "@/lib/adapters/supabase/mock-store";
import type { ProductRecommendation } from "@/lib/types/commerce";

export async function persistRecommendations(
  storeSlug: string,
  conversationId: string,
  customerId: string,
  recs: ProductRecommendation[],
  repository: ProductMappingRepository | null = null,
) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const entry = {
    recommendations: recs,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
  if (repository) {
    await repository.saveMapping(storeSlug, conversationId, customerId, recs.map((rec) => ({
      index: rec.index,
      productId: rec.productId,
      variantId: rec.variantOptions[0]?.shopifyVariantId ?? "",
      displayedTitle: rec.shopifyProductTitle,
      displayedSizeOptions: rec.variantOptions.map((v) => v.size).filter(Boolean),
      displayedPrice: rec.variantOptions[0]?.price,
      inventoryAtShowTime: rec.variantOptions[0]?.inventoryQuantity,
      imageUrl: rec.imageUrl,
      expiresAt: entry.expiresAt,
    })));
  } else {
    getMockState().mappings.set(mappingKey(storeSlug, conversationId, customerId), entry);
  }
}

export async function getRecommendations(
  storeSlug: string,
  conversationId: string,
  customerId: string,
  repository: ProductMappingRepository | null = null,
) {
  if (repository) {
    const recRows = await Promise.all(
      Array.from({ length: 10 }).map((_, i) => repository.getMapping(storeSlug, conversationId, i + 1)),
    );
    const filtered = recRows.filter((row): row is NonNullable<typeof row> => Boolean(row));
    return filtered.map((row) => ({
      index: row.index,
      productId: row.productId,
      shopifyProductId: row.productId,
      shopifyProductTitle: row.displayedTitle ?? "Product",
      shopifyHandle: "db-mapped",
      imageUrl: row.imageUrl,
      variantOptions: [
        {
          shopifyVariantId: row.variantId,
          sku: null,
          codeMissing: false,
          title: row.displayedTitle ?? "Variant",
          size: undefined,
          color: undefined,
          price: row.displayedPrice ?? 0,
          currency: "EGP",
          inventoryQuantity: row.inventoryAtShowTime ?? 0,
          available: (row.inventoryAtShowTime ?? 0) > 0,
        },
      ],
    }));
  }
  const entry = getMockState().mappings.get(mappingKey(storeSlug, conversationId, customerId));
  if (!entry) return [];
  if (new Date(entry.expiresAt).getTime() < Date.now()) return [];
  return entry.recommendations;
}

export async function expireRecommendations(
  storeSlug: string,
  conversationId: string,
  customerId: string,
  repository: ProductMappingRepository | null = null,
) {
  if (repository) {
    await repository.expireMapping(storeSlug, conversationId);
    return;
  }
  const entry = getMockState().mappings.get(mappingKey(storeSlug, conversationId, customerId));
  if (!entry) return;
  entry.expiresAt = new Date(Date.now() - 1000).toISOString();
  getMockState().mappings.set(mappingKey(storeSlug, conversationId, customerId), entry);
}
