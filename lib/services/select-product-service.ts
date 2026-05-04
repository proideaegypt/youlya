import { addCartItems } from "@/lib/services/cart-service";
import { getLegacyRecommendations } from "@/lib/services/product-mapping-service";
import type { CartItem, SelectProductInput, SelectProductOutput } from "@/lib/types/commerce";

const ARABIC_SIZE_MAP: Record<string, string> = {
  "اكس لارج": "XL",
  "اكسلارج": "XL",
  "اكسترا لارج": "XL",
  "اكس-لارج": "XL",
  "لارج": "L",
  "كبير": "L",
  "ميديم": "M",
  "ميديوم": "M",
  "متوسط": "M",
  "سمول": "S",
  "صغير": "S",
};

const ARABIC_ORDINAL_MAP: Record<string, number> = {
  "اول": 1,
  "اولى": 1,
  "الاول": 1,
  "الاولى": 1,
  "اول واحد": 1,
  "اول واحدة": 1,
  "التاني": 2,
  "التانية": 2,
  "الثاني": 2,
  "الثانية": 2,
  "تالت": 3,
  "تالتة": 3,
  "التالت": 3,
  "التالتة": 3,
  "الثالث": 3,
  "الثالثة": 3,
  "رابع": 4,
  "الرابع": 4,
  "الرابعة": 4,
  "خامس": 5,
  "الخامس": 5,
  "الخامسة": 5,
};

function normalizeArabicDigits(str: string): string {
  return str.replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x0030));
}

function normalizeSizeLabel(raw?: string): string | undefined {
  if (!raw) return undefined;
  const normalized = normalizeArabicDigits(raw).toLowerCase().trim();

  const englishMatch = normalized.match(/\b(3xl|xxl|xl|l|m|s)\b/i);
  if (englishMatch) {
    return englishMatch[1].toUpperCase();
  }

  for (const [phrase, mappedSize] of Object.entries(ARABIC_SIZE_MAP)) {
    if (normalized.includes(phrase)) {
      return mappedSize;
    }
  }

  return undefined;
}

function parseSelection(selectionText: string) {
  const normalized = normalizeArabicDigits(selectionText).toLowerCase();

  // Numeric patterns: رقم ١, number 1, #1, نمرة 2
  const indexMatches = [...normalized.matchAll(/(?:رقم|number|#|نمرة)\s*([0-9]+)/gi)];
  const indexes = indexMatches.map((m) => Number(m[1])).filter((n) => Number.isInteger(n) && n > 0);

  // Ordinal patterns: اول, التاني, تالت, etc.
  for (const [phrase, value] of Object.entries(ARABIC_ORDINAL_MAP)) {
    if (normalized.includes(phrase)) {
      indexes.push(value);
    }
  }

  // Deduplicate and sort
  const uniqueIndexes = [...new Set(indexes)].sort((a, b) => a - b);

  const size = normalizeSizeLabel(normalized);

  return { indexes: uniqueIndexes, size };
}

function variantMatchesSize(variantSize: string | undefined, requestedSize: string | undefined): boolean {
  if (!requestedSize) return true;
  const normalizedRequested = normalizeSizeLabel(requestedSize);
  const normalizedVariant = normalizeSizeLabel(variantSize);
  if (normalizedRequested && normalizedVariant) {
    return normalizedRequested === normalizedVariant;
  }

  if (!variantSize) return false;
  const lowerVariant = normalizeArabicDigits(variantSize).toLowerCase();
  const lowerRequested = normalizeArabicDigits(requestedSize).toLowerCase();
  return lowerVariant.includes(lowerRequested);
}

export async function selectProduct(input: SelectProductInput): Promise<SelectProductOutput> {
  const recs = await getLegacyRecommendations(input.storeSlug, input.conversationId, input.customerId);
  if (!recs.length) return { status: "mapping_expired", items: [], missing: ["mapping"], blocked: [] };

  const { indexes, size } = parseSelection(input.selectionText);
  if (indexes.length === 0) return { status: "not_found", items: [], missing: ["index"], blocked: [] };
  const selectedItems: CartItem[] = [];

  for (const index of indexes) {
    let rec = recs.find((r) => r.index === index);
    if (!rec && size) {
      rec = recs.find((candidate) => candidate.variantOptions.some((variant) => variantMatchesSize(variant.size, size)));
    }
    if (!rec) return { status: "not_found", items: [], missing: ["index"], blocked: [] };

    const variant =
      rec.variantOptions.find((candidate) => variantMatchesSize(candidate.size, size)) ?? rec.variantOptions[0];
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
