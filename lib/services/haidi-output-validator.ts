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
  const lower = text.toLowerCase();
  // Detect price invention patterns in Arabic
  if (/\b\d+\s*جنيه\b/.test(lower) && !lower.includes("app_price")) {
    // This is a heuristic; in practice we check against commerceFacts
    return false; // too broad to flag
  }
  return false;
}

export type HaidiValidationResult =
  | { ok: true; output: HaidiOutput }
  | { ok: false; fallbackReply: string; reason: string };

export function validateHaidiOutput(
  raw: unknown,
  appAction: string,
  appReply: string
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
