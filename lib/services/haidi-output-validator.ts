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

const INTERNAL_ID_PATTERNS = [
  /provider_message_id/i,
  /conversation_id/i,
  /customer_id/i,
  /store_id/i,
  /variant_id/i,
  /shopify_order_id/i,
  /shopify_variant_id/i,
  /shopify_product_id/i,
  /gid:\/\//i,
  /remote_jid/i,
  /#MOCK-/i,
  /mock-/i,
];

function containsUnsafeOrderClaim(text: string, appAction: string): boolean {
  if (appAction === "order_created") return false;
  const lower = text.toLowerCase();
  return [...UNSAFE_ORDER_PHRASES_AR, ...UNSAFE_ORDER_PHRASES_EN].some((phrase) =>
    lower.includes(phrase.toLowerCase())
  );
}

function containsInternalIdExposure(text: string): boolean {
  return INTERNAL_ID_PATTERNS.some((pattern) => pattern.test(text));
}

function containsPriceClaim(text: string): boolean {
  const lower = text.toLowerCase();
  return /\d/.test(text) && (
    lower.includes("جنيه") ||
    lower.includes("ج.م") ||
    lower.includes("egp") ||
    lower.includes("ريال") ||
    lower.includes("sar") ||
    lower.includes("usd")
  );
}

function containsStockClaim(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("متوفر") ||
    lower.includes("غير متوفر") ||
    lower.includes("available") ||
    lower.includes("in stock") ||
    lower.includes("out of stock") ||
    lower.includes("stock") ||
    lower.includes("خلص") ||
    lower.includes("نفد")
  );
}

export type HaidiValidationResult =
  | { ok: true; output: HaidiOutput }
  | { ok: false; fallbackReply: string; reason: string };

export function validateHaidiOutput(
  raw: unknown,
  appAction: string,
  appReply: string,
  context: {
    products?: Array<{ price?: number; available?: boolean }>;
    blockedReason?: string | null;
  } = {}
): HaidiValidationResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, fallbackReply: appReply, reason: "Haidi output is not an object" };
  }

  const obj = raw as Record<string, unknown>;
  const finalReply = obj.final_reply;

  if (typeof finalReply !== "string" || finalReply.trim().length === 0) {
    return { ok: false, fallbackReply: appReply, reason: "Haidi final_reply missing or empty" };
  }

  if (containsUnsafeOrderClaim(finalReply, appAction)) {
    return {
      ok: false,
      fallbackReply: appReply,
      reason: "Haidi output contains unsafe order confirmation claim",
    };
  }

  if (containsInternalIdExposure(finalReply)) {
    return {
      ok: false,
      fallbackReply: appReply,
      reason: "Haidi output contains internal identifiers or mock values",
    };
  }

  const products = context.products ?? [];
  const knownPrices = products
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

  if (containsStockClaim(finalReply)) {
    const hasAvailableFact = products.some((product) => product.available === true);
    const hasUnavailableFact = products.some((product) => product.available === false);
    const lower = finalReply.toLowerCase();
    const mentionsAvailable = lower.includes("متوفر") || lower.includes("available") || lower.includes("in stock");
    const mentionsUnavailable = lower.includes("غير متوفر") || lower.includes("out of stock") || lower.includes("نفد") || lower.includes("خلص");

    if (mentionsAvailable && !hasAvailableFact) {
      return {
        ok: false,
        fallbackReply: appReply,
        reason: "Haidi output contains unsupported stock claims",
      };
    }
    if (mentionsUnavailable && !hasUnavailableFact && context.blockedReason !== "out_of_stock") {
      return {
        ok: false,
        fallbackReply: appReply,
        reason: "Haidi output contains unsupported stock claims",
      };
    }
  }

  const usedUpsell = typeof obj.used_upsell === "boolean" ? obj.used_upsell : false;

  const allowedIntents: HaidiOutput["intent_label"][] = [
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

  const allowedTones: HaidiOutput["tone"][] = [
    "friendly",
    "premium",
    "concise",
    "excited",
    "empathetic",
    "neutral",
  ];

  const intentLabel =
    typeof obj.intent_label === "string" && allowedIntents.includes(obj.intent_label as HaidiOutput["intent_label"])
      ? (obj.intent_label as HaidiOutput["intent_label"])
      : "fallback";

  const tone =
    typeof obj.tone === "string" && allowedTones.includes(obj.tone as HaidiOutput["tone"])
      ? (obj.tone as HaidiOutput["tone"])
      : "friendly";

  const recommendedNextStep =
    typeof obj.recommended_next_step === "string" ? obj.recommended_next_step : "";

  const safetyNotes = Array.isArray(obj.safety_notes)
    ? obj.safety_notes.filter((value): value is string => typeof value === "string")
    : [];

  return {
    ok: true,
    output: {
      final_reply: finalReply.trim(),
      intent_label: intentLabel,
      tone,
      used_upsell: usedUpsell,
      recommended_next_step: recommendedNextStep,
      safety_notes: safetyNotes,
    },
  };
}
