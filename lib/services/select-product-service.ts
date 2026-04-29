import { addCartItems } from "@/lib/services/cart-service";
import { getLegacyRecommendations } from "@/lib/services/product-mapping-service";
import type { CartItem, SelectProductInput, SelectProductOutput } from "@/lib/types/commerce";

function parseSelection(selectionText: string) {
  const indexMatches = [...selectionText.matchAll(/رقم\s*(\d+)|number\s*(\d+)|#\s*(\d+)/gi)];
  const indexes = indexMatches.map((m) => Number(m[1] ?? m[2] ?? m[3])).filter((n) => Number.isInteger(n));
  const sizeMatch = selectionText.match(/\b(XL|L|M|S|3XL)\b/i);
  return { indexes, size: sizeMatch?.[1]?.toUpperCase() };
}

export async function selectProduct(input: SelectProductInput): Promise<SelectProductOutput> {
  const recs = await getLegacyRecommendations(input.storeSlug, input.conversationId, input.customerId);
  if (!recs.length) return { status: "mapping_expired", items: [], missing: ["mapping"], blocked: [] };

  const { indexes, size } = parseSelection(input.selectionText);
  if (indexes.length === 0) return { status: "not_found", items: [], missing: ["index"], blocked: [] };
  const selectedItems: CartItem[] = [];

  for (const index of indexes) {
    const rec = recs.find((r) => r.index === index);
    if (!rec) return { status: "not_found", items: [], missing: ["index"], blocked: [] };
    const variant = rec.variantOptions.find((v) => (size ? v.size === size : true)) ?? rec.variantOptions[0];
    if (!variant.size && !size) return { status: "needs_size", items: [], missing: ["size"], blocked: [] };
    if (!variant.available || variant.inventoryQuantity <= 0) {
      return { status: "oos", items: [], missing: [], blocked: ["out_of_stock"] };
    }
    selectedItems.push({
      index: rec.index,
      shopifyProductTitle: rec.shopifyProductTitle,
      shopifyVariantId: variant.shopifyVariantId,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      quantity: 1,
      price: variant.price,
      inStock: true,
    });
  }

  addCartItems(input.conversationId, selectedItems);
  return { status: "added_to_cart", items: selectedItems, missing: [], blocked: [] };
}
