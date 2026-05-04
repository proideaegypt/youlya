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

export const supportedInsightChannels = ["whatsapp", "instagram", "tiktok", "facebook"] as const;

export function channelDisplayLabel(channel: string): string {
  const labels: Record<string, string> = {
    whatsapp: "واتساب",
    instagram: "إنستغرام",
    tiktok: "تيك توك",
    facebook: "فيسبوك",
    manual: "يدوي",
    unknown: "غير معروف",
  };
  return labels[channel] ?? channel;
}

type OrderLikeRow = {
  created_by?: string | null;
  channel?: string | null;
  source_channel?: string | null;
  total_price?: number | string | null;
  line_items_json?: unknown;
  product_id?: string | null;
};

function readLineItems(lineItemsJson: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(lineItemsJson)) return [];
  return lineItemsJson.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
}

export function isAiCreatedOrder(order: OrderLikeRow): boolean {
  const createdBy = String(order.created_by ?? "").trim().toLowerCase();
  return createdBy === "ai" || createdBy === "youlya ai" || createdBy === "youlyaai";
}

export function getOrderChannel(order: OrderLikeRow): string {
  return normalizeChannel(order.channel ?? order.source_channel ?? null);
}

export function getOrderTotal(order: OrderLikeRow): number {
  const total = typeof order.total_price === "number" ? order.total_price : Number(order.total_price ?? 0);
  return Number.isFinite(total) ? total : 0;
}

export function getOrderProductKeys(order: OrderLikeRow): string[] {
  const keys = new Set<string>();
  if (order.product_id) keys.add(String(order.product_id));

  for (const item of readLineItems(order.line_items_json)) {
    const variantId = item.variant_id ?? item.shopify_variant_id ?? item.id;
    const productId = item.product_id ?? item.shopify_product_id;
    const title = item.title ?? item.name;
    if (productId) keys.add(String(productId));
    if (variantId) keys.add(String(variantId));
    if (title) keys.add(String(title));
  }

  return [...keys];
}

export function getPrimaryOrderProductKey(order: OrderLikeRow): string | null {
  return getOrderProductKeys(order)[0] ?? null;
}

export function getSafeMessagePreview(text?: string | null): string {
  if (!text) return "—";
  return text
    .replace(/https?:\/\/\S+/gi, "[link]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(/(?:\+?\d[\d\s().-]{5,}\d)/g, "[phone]")
    .replace(/\b\d{4,}\b/g, "[number]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
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
