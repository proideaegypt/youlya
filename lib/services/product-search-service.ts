import type { ProductRecommendation, ProductSearchInput, ProductSearchOutput } from "@/lib/types/commerce";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const mockCatalog: ProductRecommendation[] = [
  {
    index: 1,
    productId: "p-1",
    shopifyProductId: "gid://shopify/Product/1",
    shopifyProductTitle: "بيجامة شتوي أسود",
    shopifyHandle: "winter-pajama-black",
    variantOptions: [
      { shopifyVariantId: "gid://shopify/ProductVariant/11", sku: "YLY-PJ-BLK-M", codeMissing: false, title: "M / Black", size: "M", color: "Black", price: 950, currency: "EGP", inventoryQuantity: 4, available: true },
      { shopifyVariantId: "gid://shopify/ProductVariant/12", sku: "YLY-PJ-BLK-XL", codeMissing: false, title: "XL / Black", size: "XL", color: "Black", price: 950, currency: "EGP", inventoryQuantity: 2, available: true },
    ],
  },
  {
    index: 2,
    productId: "p-2",
    shopifyProductId: "gid://shopify/Product/2",
    shopifyProductTitle: "روب قطن وردي",
    shopifyHandle: "cotton-robe-pink",
    variantOptions: [
      { shopifyVariantId: "gid://shopify/ProductVariant/21", sku: "YLY-RB-PNK-L", codeMissing: false, title: "L / Pink", size: "L", color: "Pink", price: 850, currency: "EGP", inventoryQuantity: 0, available: false },
      { shopifyVariantId: "gid://shopify/ProductVariant/22", sku: "YLY-RB-PNK-XL", codeMissing: false, title: "XL / Pink", size: "XL", color: "Pink", price: 900, currency: "EGP", inventoryQuantity: 3, available: true },
    ],
  },
  {
    index: 3,
    productId: "p-3",
    shopifyProductId: "gid://shopify/Product/3",
    shopifyProductTitle: "بوركيني أسود",
    shopifyHandle: "burkini-black",
    variantOptions: [{ shopifyVariantId: "gid://shopify/ProductVariant/31", sku: "YLY-BRK-BLK-L", codeMissing: false, title: "L / Black", size: "L", color: "Black", price: 1200, currency: "EGP", inventoryQuantity: 5, available: true }],
  },
];

async function searchSupabaseCache(storeSlug: string, query: string, limit: number): Promise<ProductRecommendation[] | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    // Search products by title match
    const { data: initialProducts, error: productError } = await client
      .from("products")
      .select("id,shopify_product_id,shopify_product_gid,shopify_title,shopify_handle,image_url")
      .eq("store_id", storeSlug)
      .eq("status", "active")
      .eq("ai_visible", true)
      .ilike("shopify_title", `%${query}%`)
      .limit(limit);

    let products = initialProducts;
    if (productError || !products || products.length === 0) {
      // Fallback: try broader search or return null
      const { data: allProducts, error: allError } = await client
        .from("products")
        .select("id,shopify_product_id,shopify_product_gid,shopify_title,shopify_handle,image_url")
        .eq("store_id", storeSlug)
        .eq("status", "active")
        .eq("ai_visible", true)
        .limit(limit);

      if (allError || !allProducts || allProducts.length === 0) {
        return null;
      }
      products = allProducts;
    }

    const productIds = products.map((p) => p.id);

    // Fetch variants for these products
    const { data: variants, error: variantError } = await client
      .from("product_variants")
      .select("product_id,shopify_variant_id,shopify_variant_gid,sku,variant_title,size,color,price,inventory_quantity,available_for_ai,code_missing")
      .eq("store_id", storeSlug)
      .in("product_id", productIds)
      .eq("available_for_ai", true)
      .order("price", { ascending: true });

    if (variantError || !variants) {
      return null;
    }

    // Group variants by product
    const variantMap = new Map<string, typeof variants>();
    for (const v of variants) {
      const pid = v.product_id;
      if (!variantMap.has(pid)) variantMap.set(pid, []);
      variantMap.get(pid)!.push(v);
    }

    const recommendations: ProductRecommendation[] = [];
    let index = 1;

    for (const product of products) {
      const productVariants = variantMap.get(product.id) || [];
      if (productVariants.length === 0) continue;

      recommendations.push({
        index,
        productId: String(product.id),
        shopifyProductId: product.shopify_product_gid || `gid://shopify/Product/${product.shopify_product_id}`,
        shopifyProductTitle: product.shopify_title,
        shopifyHandle: product.shopify_handle || "",
        imageUrl: product.image_url || undefined,
        variantOptions: productVariants.map((v) => ({
          shopifyVariantId: v.shopify_variant_gid || `gid://shopify/ProductVariant/${v.shopify_variant_id}`,
          sku: v.sku || null,
          codeMissing: v.code_missing ?? false,
          title: v.variant_title || "",
          size: v.size || undefined,
          color: v.color || undefined,
          price: Number(v.price) || 0,
          currency: "EGP",
          inventoryQuantity: v.inventory_quantity ?? 0,
          available: v.available_for_ai ?? false,
        })),
      });
      index += 1;
      if (recommendations.length >= limit) break;
    }

    return recommendations;
  } catch (err) {
    console.error("searchSupabaseCache failed", err);
    return null;
  }
}

export async function searchProducts(input: ProductSearchInput): Promise<ProductSearchOutput> {
  const query = input.query.toLowerCase();
  const limit = input.limit ?? 10;

  // Try Supabase cache first
  const cacheResults = await searchSupabaseCache(input.storeSlug, query, limit);
  if (cacheResults && cacheResults.length > 0) {
    return { recommendations: cacheResults, mappingPersisted: true };
  }

  // Fallback to mock catalog for development/test
  const filtered = mockCatalog
    .filter((p) => p.shopifyProductTitle.toLowerCase().includes(query) || query.includes("عايزة") || query.includes("show"))
    .slice(0, limit)
    .map((p, i) => ({ ...p, index: i + 1 }));
  return { recommendations: filtered.length ? filtered : mockCatalog.slice(0, 3), mappingPersisted: true };
}

export function getCachedVariantInventory(variantId: string): number | null {
  for (const product of mockCatalog) {
    const found = product.variantOptions.find((variant) => variant.shopifyVariantId === variantId);
    if (found) return found.inventoryQuantity;
  }
  return null;
}
