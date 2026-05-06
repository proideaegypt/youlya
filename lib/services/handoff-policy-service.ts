export type HandoffType = "customer_service" | "manager_request";

export type HandoffPolicyResult = {
  shouldHandoff: boolean;
  handoffType: HandoffType | null;
  priority: "normal" | "high";
  reason: string;
  problemSummary: string;
};

type NormalizedMatch = {
  type: HandoffType;
  reason: string;
  priority: "normal" | "high";
  problemSummary: string;
};

const MANAGER_TERMS = [
  "مدير",
  "المدير",
  "المديرين",
  "الإدارة",
  "الادارة",
  "مسؤول",
  "مسئول",
  "admin",
  "administrator",
  "manager",
  "responsible",
];

const CUSTOMER_SERVICE_TERMS = [
  "خدمة العملاء",
  "خدمه العملاء",
  "customer service",
  "support",
];

const REQUEST_TERMS = [
  "يكلمني",
  "يكلمني حد",
  "اكلم",
  "أكلم",
  "اتواصل",
  "أتواصل",
  "خلي حد",
  "حد من",
  "حد مسؤول",
  "حد من المسؤولين",
];

const NEGATIVE_PATTERNS = [
  /^(هاي|اهلا|سلام|مرحبا|hello|hi|hey)$/i,
  /بيجام/i,
  /فستان/i,
  /مقاس/i,
  /لون/i,
  /سعر/i,
  /غالي/i,
  /مش\s*عارفة/i,
  /مش\s*عارف/i,
  /مش\s*فاهم/i,
  /product/i,
  /do you have/i,
  /show me/i,
];

function normalizeArabic(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsTerm(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(normalizeArabic(term)));
}

function isNegativeContext(text: string): boolean {
  return NEGATIVE_PATTERNS.some((pattern) => pattern.test(text));
}

function makeResult(match: NormalizedMatch, text: string): HandoffPolicyResult {
  return {
    shouldHandoff: true,
    handoffType: match.type,
    priority: match.priority,
    reason: match.reason,
    problemSummary: `${match.problemSummary}: ${text.slice(0, 180)}`,
  };
}

export function evaluateHandoffPolicy(messageText: string): HandoffPolicyResult {
  const normalized = normalizeArabic(messageText);

  if (!normalized) {
    return {
      shouldHandoff: false,
      handoffType: null,
      priority: "normal",
      reason: "empty_message",
      problemSummary: "empty_message",
    };
  }

  if (isNegativeContext(normalized)) {
    return {
      shouldHandoff: false,
      handoffType: null,
      priority: "normal",
      reason: "non_handoff_context",
      problemSummary: "message_is_greeting_or_product_or_unclear_context",
    };
  }

  const customerServiceSignals =
    containsTerm(normalized, CUSTOMER_SERVICE_TERMS) &&
    (containsTerm(normalized, REQUEST_TERMS) || normalized.includes("خدمة العملاء") || normalized.includes("خدمه العملاء"));

  if (customerServiceSignals) {
    return makeResult(
      {
        type: "customer_service",
        reason: "explicit_customer_service_request",
        priority: "normal",
        problemSummary: "customer_service_request",
      },
      normalized,
    );
  }

  const managerSignals =
    containsTerm(normalized, MANAGER_TERMS) &&
    (containsTerm(normalized, REQUEST_TERMS) ||
      normalized.includes("مدير") ||
      normalized.includes("الادارة") ||
      normalized.includes("الاداره") ||
      normalized.includes("مسؤول"));

  if (managerSignals) {
    return makeResult(
      {
        type: "manager_request",
        reason: "explicit_manager_request",
        priority: "high",
        problemSummary: "manager_request",
      },
      normalized,
    );
  }

  return {
    shouldHandoff: false,
    handoffType: null,
    priority: "normal",
    reason: "no_explicit_handoff_request",
    problemSummary: "no_explicit_handoff_request",
  };
}
