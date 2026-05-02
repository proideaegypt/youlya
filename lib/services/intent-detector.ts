export type Intent =
  | "PRODUCT_SEARCH"
  | "SELECT_PRODUCT"
  | "CONFIRM_ORDER"
  | "ORDER_STATUS"
  | "CANCEL_REQUEST"
  | "UNCLEAR"
  | "OTHER";

const productKeywords = [
  "فستان",
  "بيجامة",
  "بيجامه",
  "بيجامات",
  "روب",
  "عندكم",
  "عايز",
  "عايزة",
  "محتاج",
  "show me",
  "do you have",
];

const selectPatterns = [/رقم\s*[0-9٠-٩]+/i, /#\s*[0-9٠-٩]+/i, /number\s*[0-9٠-٩]+/i];
const confirmPatterns = [/أيوه/i, /تأكيد/i, /\byes\b/i, /\bconfirm\b/i, /go ahead/i, /أكدي/i];
const cancelPatterns = [/الغاء/i, /إلغاء/i, /مش عايز/i, /مش عايزة/i, /\bcancel\b/i, /stop/i];
const orderStatusPatterns = [/طلبي/i, /أوردر/i, /order status/i, /where is my order/i, /tracking/i, /فين/i];

function containsAny(text: string, patterns: Array<RegExp | string>): boolean {
  return patterns.some((pattern) => (typeof pattern === "string" ? text.includes(pattern.toLowerCase()) : pattern.test(text)));
}

export function detectIntent(text: string, language: string, tone: string): Intent {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return "UNCLEAR";

  if (containsAny(normalized, cancelPatterns)) return "CANCEL_REQUEST";
  if (containsAny(normalized, confirmPatterns)) return "CONFIRM_ORDER";
  if (containsAny(normalized, orderStatusPatterns)) return "ORDER_STATUS";
  if (containsAny(normalized, selectPatterns)) return "SELECT_PRODUCT";
  if (containsAny(normalized, productKeywords)) return "PRODUCT_SEARCH";

  if (tone === "confused") return "UNCLEAR";
  if (language.startsWith("ar") && normalized.length <= 3) return "UNCLEAR";
  return "OTHER";
}
