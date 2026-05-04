export function normalizeChannel(source?: string | null): string {
  if (!source) return "unknown";
  const s = source.toLowerCase();
  if (s.includes("whatsapp") || s.includes("evolution")) return "whatsapp";
  if (s.includes("instagram")) return "instagram";
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("facebook") || s.includes("messenger")) return "facebook";
  if (s.includes("manual")) return "manual";
  return "unknown";
}

export type VariantCounts = {
  total: number;
  available: number;
  aiVisible: number;
  missingSku: number;
  oos: number;
};

export function generateProductNotes(counts: VariantCounts): string[] {
  const notes: string[] = [];
  if (counts.aiVisible === 0) notes.push("غير مرئي للذكاء الاصطناعي");
  else if (counts.aiVisible > 0 && counts.aiVisible < counts.total) {
    notes.push("بعض المتغيرات غير مرئية للذكاء الاصطناعي");
  }
  if (counts.missingSku > 0) notes.push("SKU مفقود في " + counts.missingSku + " متغير");
  if (counts.oos > 0 && counts.oos === counts.total) notes.push("كل المتغيرات نفذت من المخزون");
  else if (counts.oos > 0) notes.push("متغيرات نفذت من المخزون: " + counts.oos);
  if (counts.aiVisible > 0 && counts.oos === 0 && counts.missingSku === 0) {
    notes.push("جاهز للبيع بالذكاء الاصطناعي");
  }
  return notes;
}

export function generateProductBadges(
  aiVisible: boolean,
  counts: VariantCounts
): string[] {
  const badges: string[] = [];
  if (counts.aiVisible > 0 && counts.oos === 0 && counts.missingSku === 0) {
    badges.push("ai_ready");
  }
  if (counts.missingSku > 0) badges.push("missing_sku");
  if (counts.oos > 0) badges.push("oos");
  if (counts.available > 0 && counts.available <= 3) badges.push("low_stock");
  if (!aiVisible) badges.push("hidden_from_ai");
  return badges;
}

export function calculateIntelligenceScore(
  totalVariants: number,
  aiVisibleVariants: number,
  missingSkuVariants: number,
  outOfStockVariants: number
): number {
  if (totalVariants <= 0) return 0;
  const aiScore = (aiVisibleVariants / totalVariants) * 40;
  const skuScore = ((totalVariants - missingSkuVariants) / totalVariants) * 30;
  const stockScore = ((totalVariants - outOfStockVariants) / totalVariants) * 30;
  return Math.round(aiScore + skuScore + stockScore);
}

export function computeVariantAggregates(
  variants: Array<{
    inventory_quantity?: number | null;
    available_for_ai?: boolean | null;
    code_missing?: boolean | null;
  }>
): VariantCounts {
  const counts: VariantCounts = { total: 0, available: 0, aiVisible: 0, missingSku: 0, oos: 0 };
  for (const v of variants) {
    counts.total += 1;
    if ((v.inventory_quantity ?? 0) > 0) counts.available += 1;
    if (v.available_for_ai) counts.aiVisible += 1;
    if (v.code_missing) counts.missingSku += 1;
    if ((v.inventory_quantity ?? 0) <= 0) counts.oos += 1;
  }
  return counts;
}

export function generateAiVisibilityReasons(variant: {
  inventory_quantity?: number | null;
  code_missing?: boolean | null;
  price?: number | null;
  shopify_variant_id?: string | null;
  available_for_ai?: boolean | null;
}): string[] {
  const reasons: string[] = [];
  if (variant.available_for_ai) return reasons;
  if ((variant.inventory_quantity ?? 0) <= 0) reasons.push("OOS");
  if (variant.code_missing) reasons.push("missing SKU");
  if (!variant.price || variant.price <= 0) reasons.push("missing price");
  if (!variant.shopify_variant_id) reasons.push("missing variant ID");
  if (reasons.length === 0) reasons.push("inactive");
  return reasons;
}
