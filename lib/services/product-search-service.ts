import type { ProductRecommendation, ProductSearchInput, ProductSearchOutput } from "@/lib/types/commerce";

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

export async function searchProducts(input: ProductSearchInput): Promise<ProductSearchOutput> {
  const query = input.query.toLowerCase();
  const filtered = mockCatalog
    .filter((p) => p.shopifyProductTitle.toLowerCase().includes(query) || query.includes("عايزة") || query.includes("show"))
    .slice(0, input.limit ?? 10)
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
