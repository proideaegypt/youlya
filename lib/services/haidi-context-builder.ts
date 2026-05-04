export type HaidiProductFact = {
  index: number;
  title: string;
  material?: string;
  colors: string[];
  sizes: string[];
  price: number;
  currency: string;
  available: boolean;
  stockSummary: string;
  imageUrl?: string;
};

export type HaidiCartSummary = {
  itemsCount: number;
  subtotal: number;
  missingFields: string[];
};

export type HaidiCommerceFacts = {
  products: HaidiProductFact[];
  cart: HaidiCartSummary;
  allowedUpsells: HaidiProductFact[];
  blockedReason: string | null;
};

export type HaidiStyleInstructions = {
  tone: string;
  mustInclude: string[];
  mustNotSay: string[];
};

export type HaidiContext = {
  language: string;
  customerText: string;
  replyGoal:
    | "present_product_options"
    | "ask_size"
    | "confirm_cart"
    | "handoff"
    | "fallback"
    | "collect_address"
    | "order_confirmation";
  commerceFacts: HaidiCommerceFacts;
  styleInstructions: HaidiStyleInstructions;
};

export type HaidiOutput = {
  final_reply: string;
  intent_label:
    | "greeting"
    | "product_search"
    | "select_product"
    | "collect_address"
    | "confirm_order"
    | "handoff"
    | "unclear"
    | "support"
    | "fallback";
  tone: "friendly" | "premium" | "concise" | "excited" | "empathetic" | "neutral";
  used_upsell: boolean;
  recommended_next_step: string;
  safety_notes: string[];
};

function toHaidiProductFact(
  rec: {
    index: number;
    shopifyProductTitle: string;
    imageUrl?: string;
    variantOptions: Array<{
      size?: string;
      color?: string;
      price: number;
      currency: string;
      inventoryQuantity: number;
      available: boolean;
    }>;
  },
  currency = "EGP"
): HaidiProductFact {
  const colors = [...new Set(rec.variantOptions.map((v) => v.color).filter((c): c is string => Boolean(c)))];
  const sizes = [...new Set(rec.variantOptions.map((v) => v.size).filter((s): s is string => Boolean(s)))];
  const availableVariants = rec.variantOptions.filter((v) => v.available && (v.inventoryQuantity ?? 0) > 0);
  const available = availableVariants.length > 0;
  const price = availableVariants[0]?.price ?? rec.variantOptions[0]?.price ?? 0;
  const stockSummary = available
    ? `متوفر بمقاسات: ${sizes.join(", ")}`
    : "غير متوفر حالياً";

  return {
    index: rec.index,
    title: rec.shopifyProductTitle,
    colors,
    sizes,
    price,
    currency,
    available,
    stockSummary,
    imageUrl: rec.imageUrl,
  };
}

export function buildHaidiContext(options: {
  language: string;
  customerText: string;
  action: string;
  intent: string;
  recommendations?: Array<{
    index: number;
    shopifyProductTitle: string;
    imageUrl?: string;
    variantOptions: Array<{
      size?: string;
      color?: string;
      price: number;
      currency: string;
      inventoryQuantity: number;
      available: boolean;
    }>;
  }>;
  cartItems?: Array<{ title: string; price: number; size: string }>;
  blockedReason?: string | null;
}): HaidiContext {
  const { language, customerText, action, intent, recommendations, cartItems, blockedReason } = options;

  const products = (recommendations ?? [])
    .slice(0, 10)
    .map((rec) => toHaidiProductFact(rec));

  const itemsCount = cartItems?.length ?? 0;
  const subtotal = cartItems?.reduce((sum, item) => sum + (item.price ?? 0), 0) ?? 0;
  const missingFields: string[] = [];

  if (action === "product_results" && itemsCount === 0) {
    missingFields.push("size_selection");
  }
  if (action === "ai_reply" && intent === "COLLECT_ADDRESS") {
    missingFields.push("address");
  }

  const replyGoal = inferReplyGoal(action, intent, itemsCount);
  const styleInstructions = buildStyleInstructions(action, intent, blockedReason ?? null);

  return {
    language,
    customerText,
    replyGoal,
    commerceFacts: {
      products,
      cart: { itemsCount, subtotal, missingFields },
      allowedUpsells: [], // populated later when upsell service exists
      blockedReason: blockedReason ?? null,
    },
    styleInstructions,
  };
}

function buildStyleInstructions(
  action: string,
  intent: string,
  blockedReason: string | null
): HaidiStyleInstructions {
  const mustInclude: string[] = [];
  const mustNotSay: string[] = [
    "رقم ١ =",
    "variant_id",
    "provider_message_id",
    "customer_id",
    "store_id",
  ];

  if (action === "handoff") {
    mustInclude.push("هحولك", "فريق الدعم");
  }
  if (action === "order_created") {
    mustInclude.push("تم", "الأوردر");
  }
  if (action === "product_results" || intent === "PRODUCT_SEARCH") {
    mustInclude.push("اختاري", "رقم");
  }
  if (blockedReason) {
    mustNotSay.push(blockedReason);
  }

  return {
    tone: "warm_egyptian_sales",
    mustInclude: [...new Set(mustInclude)],
    mustNotSay: [...new Set(mustNotSay)],
  };
}

function inferReplyGoal(
  action: string,
  intent: string,
  itemsCount: number
): HaidiContext["replyGoal"] {
  if (action === "handoff") return "handoff";
  if (action === "order_created") return "order_confirmation";
  if (action === "product_results") return "present_product_options";
  if (intent === "COLLECT_ADDRESS") return "collect_address";
  if (intent === "CONFIRM_ORDER" && itemsCount > 0) return "confirm_cart";
  if (intent === "SELECT_PRODUCT") return "ask_size";
  return "fallback";
}
