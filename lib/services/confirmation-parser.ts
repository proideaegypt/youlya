export type ConfirmationParseResult = {
  confirmed: boolean;
  confidence: number;
};

const strongArabic = [/تأكيد/i, /أيوه/i, /موافق/i, /اتفقنا/i, /اطلب/i, /اشتري/i];
const mediumArabic = [/تمام/i];
const strongEnglish = [/^yes$/i, /confirm/i, /go ahead/i, /place order/i, /buy/i];
const mediumEnglish = [/^ok$/i];
const negative = [/لسه/i, /هفكر/i, /later/i, /not now/i, /cancel/i];

export function parseConfirmationMessage(message: string): ConfirmationParseResult {
  const text = message.trim();
  if (!text) return { confirmed: false, confidence: 0 };
  if (negative.some((pattern) => pattern.test(text))) return { confirmed: false, confidence: 0.05 };

  let confidence = 0;
  if (strongArabic.some((pattern) => pattern.test(text)) || strongEnglish.some((pattern) => pattern.test(text))) {
    confidence = 0.9;
  } else if (mediumArabic.some((pattern) => pattern.test(text)) || mediumEnglish.some((pattern) => pattern.test(text))) {
    confidence = 0.6;
  }
  return { confirmed: confidence >= 0.8, confidence };
}

