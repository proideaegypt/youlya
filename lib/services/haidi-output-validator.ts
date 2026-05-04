import type { HaidiOutput } from "@/lib/services/haidi-context-builder";

const UNSAFE_ORDER_PHRASES_AR = [
  "تم تأكيد الأوردر",
  "الأوردر اتعمل",
  "الأوردر اتأكد",
  "تم إنشاء الأوردر",
  "الطلب تم بنجاح",
  "تمام، الأوردر",
];

const UNSAFE_ORDER_PHRASES_EN = [
  "order confirmed",
  "order created",
  "order placed",
  "your order is confirmed",
];

function containsUnsafeOrderClaim(text: string, appAction: string): boolean {
  if (appAction === "order_created") return false; // app already confirmed
  const lower = text.toLowerCase();
  for (const phrase of UNSAFE_ORDER_PHRASES_AR) {
    if (lower.includes(phrase.toLowerCase())) return true;
  }
  for (const phrase of UNSAFE_ORDER_PHRASES_EN) {
    if (lower.includes(phrase.toLowerCase())) return true;
  }
  return false;
}

function containsSuspiciousInvention(text: string): boolean {
  return /\b(gid:\/\/|provider_message_id|conversation_id|customer_id|store_id|variant_id|shopify_order_id|shopify_variant_id|remote_jid|#mock-|mock-|test-instance)\b/i.test(text);
}

function containsPriceClaim(text: string): boolean {
  return /\b\d+(?:[.,]\d+)?\s*(?:جنيه|ج\.م|EGP|ريال|SAR|USD)\b/i.test(text);
}

function containsStockClaim(text: string): boolean {
  return /\b(?:متوفر|غير متوفر|in stock|out of stock|stock|خلص|نفد)\b/i.test(text);
}

export type HaidiValidationResult =
  | { ok: true; output: HaidiOutput }
  | { ok: false; fallbackReply: string; reason: string };

export function validateHaidiOutput(
  raw: unknown,
  appAction: string,
  appReply: string,
  appFacts: {
    products?: Array<{ price?: number; available?: boolean }>;
    blockedReason?: string | null;
  } = {}
): HaidiValidationResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, fallbackReply: appReply, reason: "Haidi output is not an object" };
  }

  const obj = raw as Record<string, unknown>;

  // final_reply must be a non-empty string
  const finalReply = obj.final_reply;
  if (typeof finalReply !== "string" || finalReply.trim().length === 0) {
    return { ok: false, fallbackReply: appReply, reason: "Haidi final_reply missing or empty" };
  }

  // Block unsafe order claims
  if (containsUnsafeOrderClaim(finalReply, appAction)) {
    return {
      ok: false,
      fallbackReply: appReply,
      reason: "Haidi output contains unsafe order confirmation claim",
    };
  }

  // Block internal IDs and operational identifiers from reaching customers
  if (containsSuspiciousInvention(finalReply)) {
    return {
      ok: false,
      fallbackReply: appReply,
      reason: "Haidi output contains internal identifiers or mock values",
    };
  }

  // Price / stock claims must be grounded in app facts
  const hasKnownProducts = Array.isArray(appFacts.products) && appFacts.products.length > 0;
  const knownPrices = (appFacts.products ?? [])
    .map((product) => product.price)
    .filter((price): price is number => typeof price === "number" && Number.isFinite(price))
    .map((price) => String(price));
  if (containsPriceClaim(finalReply) && !knownPrices.some((price) => finalReply.includes(price))) {
    return {
      ok: false,
      fallbackReply: appReply,
      reason: "Haidi output contains unsupported price claims",
    };
  }

  if (containsStockClaim(finalReply) && !hasKnownProducts && appFacts.blockedReason !== "out_of_stock") {
    return {
      ok: false,
      fallbackReply: appReply,
      reason: "Haidi output contains unsupported stock claims",
    };
  }

  // used_upsell should be boolean or default false
  const usedUpsell = typeof obj.used_upsell === "boolean" ? obj.used_upsell : false;

  // intent_label should be one of allowed values or fallback
  const allowedIntents = [
    "greeting",
    "product_search",
    "select_product",
    "collect_address",
    "confirm_order",
    "handoff",
    "unclear",
    "support",
    "fallback",
  ];
  const intentLabel =
    typeof obj.intent_label === "string" && allowedIntents.includes(obj.intent_label)
      ? obj.intent_label
      : "fallback";

  // tone should be one of allowed values
  const allowedTones = ["friendly", "premium", "concise", "excited", "empathetic", "neutral"];
  const tone =
    typeof obj.tone === "string" && allowedTones.includes(obj.tone)
      ? obj.tone
      : "friendly";

  const recommendedNextStep = typeof obj.recommended_next_step === "string"
    ? obj.recommended_next_step
    : "";

  const safetyNotes = Array.isArray(obj.safety_notes)
    ? obj.safety_notes.filter((s): s is string => typeof s === "string")
    : [];

  const validated: HaidiOutput = {
    final_reply: finalReply.trim(),
    intent_label: intentLabel as HaidiOutput["intent_label"],
    tone: tone as HaidiOutput["tone"],
    used_upsell: usedUpsell,
    recommended_next_step: recommendedNextStep,
    safety_notes: safetyNotes,
  };

  return { ok: true, output: validated };
}
