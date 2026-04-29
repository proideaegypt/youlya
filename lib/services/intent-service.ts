export function inferIntentFromText(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("رقم") || t.includes("number")) return "select_product";
  if (t.includes("الشحن") || t.includes("delivery")) return "shipping_question";
  if (t.includes("أكدي") || t.includes("confirm")) return "create_order";
  if (t.includes("كلم")) return "human_handoff";
  return "product_search";
}

