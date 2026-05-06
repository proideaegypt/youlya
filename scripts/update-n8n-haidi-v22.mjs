import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const backupPath = path.join(projectRoot, "n8n", "backups", "workflow-joqfame4HXG775JO-haidi-openai.json");
const mainPath = path.join(projectRoot, "n8n", "workflows", "youlya-whatsapp-main.json");

// ---- Update backup workflow (active in production) ----
const backupRaw = fs.readFileSync(backupPath, "utf-8");
const backup = JSON.parse(backupRaw);

// Find nodes by name
const buildPromptNode = backup.nodes.find((n) => n.name === "Build Haidi Prompt");
const callOpenAINode = backup.nodes.find((n) => n.name === "Call OpenAI");
const validateNode = backup.nodes.find((n) => n.name === "Validate Haidi Output");
const parseNode = backup.nodes.find((n) => n.name === "Parse Haidi Response");
const haidiSessionNode = backup.nodes.find((n) => n.name === "Haidi Session Memory");
const prepareReplyNode = backup.nodes.find((n) => n.name === "Prepare Reply");

if (!buildPromptNode) {
  console.error("Build Haidi Prompt node not found in backup workflow");
  process.exit(1);
}

// v2.2 system prompt
const v22SystemPrompt = `You are Haidi, the warm, smart Egyptian Arabic sales assistant for YOULYA HOME WEAR.

Identity:
- Your name is Haidi.
- You represent YOULYA HOME WEAR.
- You speak mainly Egyptian Arabic by default.
- You sound like a clever real human sales assistant, not a generic chatbot.
- You are warm, feminine, helpful, natural, concise, and sales-aware.
- You can use light emojis, but do not overuse them.
- You help the customer choose the right homewear product.

Your selling style:
- Understand what the customer really wants even if the message is messy.
- Ask one clear question when needed.
- Recommend products based on material, color, size, style, occasion, comfort, and availability.
- If customer asks for cotton, focus on cotton/soft/breathable products only if confirmed by product facts.
- If customer asks for a color, recommend matching or close colors only if product facts provide them.
- If customer asks for a size, mention available sizes only if product facts provide them.
- If customer is browsing, show a few good options and guide them gently.
- If customer chose a product, help complete the cart.
- If customer is close to free shipping threshold and app says upsell is allowed, suggest one relevant add-on.
- If customer picked pajamas, you may suggest robe/slippers/accessory only if app provides allowed upsell products.
- If customer seems uncertain, reduce options and ask a simple choice question.
- If customer is angry, confused, or asks for a human, suggest handoff.

Commerce safety rules:
- Never invent product title, material, color, size, price, SKU, inventory, discount, shipping, or delivery date.
- Never claim a product exists unless it is in app-provided product facts.
- Never say a size/color is available unless app-provided facts confirm it.
- Never use memory to resolve product indexes like "رقم ١".
- Product index resolution must be done by Youlya app from last_product_recommendations.
- Never create or confirm an order yourself.
- Never say order confirmed unless app action is order_created.
- Never bypass missing address/phone/city/confirmation.
- Never create or imply Shopify order before explicit customer confirmation.
- If app says blocked, unavailable, out of stock, missing data, duplicate, handoff, or kill switch, follow the app result.
- If product facts are missing, ask a clarification or say you will check.

Memory rules:
- You may remember conversational preferences, tone, and broad interests.
- You may remember that the customer likes soft cotton, certain colors, or short replies.
- Do not remember or rely on product index mapping.
- Do not remember or rely on price/stock/variant ID from chat memory.
- Product/variant truth comes only from app facts.

Upsell rules:
- One upsell only per cart flow unless app explicitly allows more.
- Upsell must be relevant:
  pajamas → robe/slippers/homewear add-on
  cotton → similar soft cotton pieces
  specific color → matching/neutral color if available
  high subtotal near free shipping → small add-on if app allows
- Do not upsell to angry customers.
- Do not upsell during complaints, delivery problems, or handoff.
- Do not upsell unavailable products.
- Do not pretend there is an offer unless app facts provide it.

Input format:
You receive JSON with:
- app_reply: the safe reply from the Youlya commerce brain
- action: the app action (ai_reply, product_results, order_created, handoff, error, etc.)
- intent: detected intent
- haidi_context:
  - language: ar-EG or en
  - customer_text: original customer message
  - reply_goal: present_product_options | ask_size | confirm_cart | handoff | fallback
  - commerce_facts:
    - products: array of product facts (max 10)
    - cart: { itemsCount, subtotal, missingFields }
    - allowedUpsells: array of upsell products (max 3)
    - blockedReason: null or string
  - style_instructions:
    - tone: warm_egyptian_sales
    - must_include: array of strings
    - must_not_say: array of strings

Output format:
Return valid JSON only:
{
  "final_reply": string,
  "intent_label": "greeting" | "product_search" | "select_product" | "collect_address" | "confirm_order" | "handoff" | "unclear" | "support" | "fallback",
  "tone": "friendly" | "premium" | "concise" | "excited" | "empathetic" | "neutral",
  "used_upsell": boolean,
  "recommended_next_step": string,
  "safety_notes": string[]
}

No markdown.
No internal IDs to the customer unless app explicitly allows.
No raw JSON in customer-facing reply.
Return valid JSON only.`;

// Updated Build Haidi Prompt code with JSON word in user content
const newBuildPromptCode = `
const app = $json;
const appReply = String(app.reply || app.message || "").trim();
const appAction = String(app.action || "ai_reply");
const appIntent = String(app.intent || "fallback");
const haidiContext = app.haidi_context || {};
const commerceFacts = haidiContext.commerceFacts || {};
const language = String(haidiContext.language || "ar-EG");
const styleInstructions = haidiContext.styleInstructions || {};
const customerText = String(haidiContext.customer_text || "");

const systemPrompt = ${JSON.stringify(v22SystemPrompt)};

const userPayload = {
  app_reply: appReply,
  action: appAction,
  intent: appIntent,
  haidi_context: {
    language,
    customer_text: customerText,
    reply_goal: haidiContext.replyGoal || "fallback",
    commerce_facts: commerceFacts,
    style_instructions: styleInstructions,
  }
};

const messages = [
  { role: "system", content: systemPrompt + "\\n\\nReturn valid JSON only." },
  { role: "user", content: "Return JSON only. Input JSON: " + JSON.stringify(userPayload) }
];

return [{ json: { messages } }];
`;

buildPromptNode.parameters.jsCode = newBuildPromptCode.trim();

// Update Call OpenAI node to ensure jsonBody includes response_format
if (callOpenAINode) {
  callOpenAINode.parameters.jsonBody = `={{ JSON.stringify({ model: $env.HAIDI_MODEL || 'gpt-4o-mini', messages: $json.messages, response_format: { type: 'json_object' } }) }}`;
}

// ---- Add Handoff Bypass nodes ----
// We need to add:
// 1. "Check Handoff Bypass" IF node
// 2. "Bypass Haidi" Code node (on true branch)
// And rewire connections

// Find current positions to place new nodes
const buildPromptPos = buildPromptNode.position;
const haidiSessionPos = haidiSessionNode ? haidiSessionNode.position : [1360, 120];

// Create Check Handoff Bypass IF node
const checkHandoffNode = {
  parameters: {
    conditions: {
      boolean: [],
      string: [
        {
          value1: '={{$json.action}}',
          operation: 'equal',
          value2: 'handoff'
        },
        {
          value1: '={{$json.action}}',
          operation: 'equal',
          value2: 'error'
        }
      ]
    }
  },
  id: 'Check Handoff Bypass',
  name: 'Check Handoff Bypass',
  type: 'n8n-nodes-base.if',
  typeVersion: 2,
  position: [haidiSessionPos[0] + 80, haidiSessionPos[1]]
};

// Create Bypass Haidi Code node
const bypassHaidiNode = {
  parameters: {
    jsCode: `
const app = $json;
const appReply = String(app.reply || app.message || "حصل خطأ تقني بسيط، ممكن تبعتي الرسالة تاني؟").trim();
const appAction = String(app.action || "error");
const haidiSessionKey = String(app.haidi_session_key || app.haidi_memory?.sessionKey || "");

return [{
  json: {
    ...app,
    reply: appReply,
    action: appAction,
    haidi_valid: true,
    haidi_bypassed: true,
    haidi_fallback: false,
    haidi_output: {
      final_reply: appReply,
      intent_label: appAction === "handoff" ? "handoff" : "fallback",
      tone: "friendly",
      used_upsell: false,
      recommended_next_step: appAction === "handoff" ? "human_handoff" : "continue",
      haidi_session_key: haidiSessionKey,
      safety_notes: ["haidi_bypassed:" + appAction],
    },
    haidi_session_key: haidiSessionKey,
    number: $node["Normalize Message"].json.send_number,
  },
}];
    `.trim()
  },
  id: 'Bypass Haidi',
  name: 'Bypass Haidi',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [checkHandoffNode.position[0] + 220, checkHandoffNode.position[1] - 80]
};

// Add new nodes
backup.nodes.push(checkHandoffNode);
backup.nodes.push(bypassHaidiNode);

// Update connections
// Haidi Session Memory → Check Handoff Bypass (instead of Build Haidi Prompt)
backup.connections["Haidi Session Memory"] = {
  main: [[
    { node: "Check Handoff Bypass", type: "main", index: 0 }
  ]]
};

// Check Handoff Bypass (true/index 0) → Bypass Haidi
// Check Handoff Bypass (false/index 1) → Build Haidi Prompt
backup.connections["Check Handoff Bypass"] = {
  main: [
    [{ node: "Bypass Haidi", type: "main", index: 0 }],
    [{ node: "Build Haidi Prompt", type: "main", index: 0 }]
  ]
};

// Bypass Haidi → Prepare Reply
backup.connections["Bypass Haidi"] = {
  main: [[
    { node: "Prepare Reply", type: "main", index: 0 }
  ]]
};

// Also update Validate Haidi Output to include haidi_bypassed passthrough
if (validateNode) {
  const oldValidateCode = validateNode.parameters.jsCode;
  // Add haidi_bypassed passthrough at the end of the return object
  validateNode.parameters.jsCode = oldValidateCode.replace(
    'haidi_session_key: haidiSessionKey,\n    number:',
    'haidi_bypassed: false,\n    haidi_session_key: haidiSessionKey,\n    number:'
  );
}

// Write updated backup
fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
console.log("✅ Updated backup workflow:", backupPath);

// ---- Update main repo workflow ----
const mainRaw = fs.readFileSync(mainPath, "utf-8");
const main = JSON.parse(mainRaw);

const mainHaidiNode = main.nodes.find((n) => n.name === "Haidi AI Sales Agent");
if (mainHaidiNode) {
  // Update the Haidi Code node to use v2.2 prompt and add explicit handoff bypass
  const updatedMainHaidiCode = `
const app = $json;
const appReply = String(app.reply || app.message || "حصل خطأ تقني بسيط، ممكن تبعتي الرسالة تاني؟").trim();
const appAction = String(app.action || "ai_reply");
const appIntent = String(app.intent || "fallback");
const haidiSessionKey = String(app.haidi_session_key || app.haidi_memory?.sessionKey || "");
const haidiContext = app.haidi_context || {};
const commerceFacts = haidiContext.commerceFacts || {};
const products = Array.isArray(commerceFacts.products) ? commerceFacts.products : [];
const allowedUpsells = Array.isArray(commerceFacts.allowedUpsells) ? commerceFacts.allowedUpsells : [];
const language = String(haidiContext.language || "ar-EG");
const isArabic = language.toLowerCase().startsWith("ar");
const styleInstructions = haidiContext.styleInstructions || {};
const safetyNotes = [];

// Handoff bypass: if app already decided handoff, preserve it immediately
if (appAction === "handoff") {
  return [{
    json: {
      final_reply: isArabic ? "تمام يا قمر، هحولك لفريق الدعم دلوقتي 🤍" : "I'll hand this over to a human agent now.",
      intent_label: "handoff",
      tone: "empathetic",
      used_upsell: false,
      recommended_next_step: "human_handoff",
      haidi_session_key: haidiSessionKey,
      safety_notes: ["handoff_preserved", "app_action:handoff", "haidi_bypassed"],
    },
  }];
}

function unique(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.trim()))];
}

function stripInternalDetails(text) {
  return String(text)
    .replace(/\\b(gid:\\/\\/[^\\s]+|provider_message_id|conversation_id|customer_id|store_id|variant_id|shopify_order_id|shopify_variant_id|remote_jid|test-instance|#MOCK-[A-Z0-9_-]+|mock-[A-Z0-9_-]+)\\b/gi, "")
    .replace(/\\s{2,}/g, " ")
    .trim();
}

function hasUnsafeOrderClaim(text) {
  const lower = String(text).toLowerCase();
  const phrases = [
    "تم تأكيد الأوردر",
    "الأوردر اتعمل",
    "الأوردر اتأكد",
    "تم إنشاء الأوردر",
    "order confirmed",
    "order created",
    "order placed",
    "your order is confirmed",
  ];
  return phrases.some((phrase) => lower.includes(phrase.toLowerCase()));
}

function hasPriceClaim(text) {
  return /\\b\\d+(?:[.,]\\d+)?\\s*(?:جنيه|ج\\.م|egp|ريال|sar|usd)\\b/i.test(String(text));
}

function hasStockClaim(text) {
  return /\\b(?:متوفر|غير متوفر|in stock|out of stock|stock|خلص|نفد)\\b/i.test(String(text));
}

function warmPrefix(text) {
  const prefix = isArabic ? "أكيد يا قمر، " : "Sure, ";
  const value = String(text).trim();
  if (!value) return value;
  if (
    value.startsWith(prefix) ||
    value.startsWith("تمام يا قمر،") ||
    value.startsWith("ولا يهمك يا قمر،") ||
    value.startsWith("أكيد،") ||
    value.startsWith("Sure,")
  ) {
    return value;
  }
  return prefix + value;
}

function appendUpsell(text) {
  if (appAction === "handoff" || appAction === "error") return text;
  if (!allowedUpsells.length) return text;
  const upsell = allowedUpsells[0];
  const title = String(upsell.title || "").trim();
  if (!title) return text;
  if (hasPriceClaim(text) || hasStockClaim(text)) return text;
  const suffix = isArabic
    ? " ولو تحبي، عندي كمان " + title + " مناسب جدًا."
    : " If you want, I also have " + title + ".";
  safetyNotes.push("upsell_applied");
  return text + suffix;
}

function deriveIntentLabel() {
  if (appAction === "handoff") return "handoff";
  if (appAction === "order_created") return "confirm_order";
  if (appAction === "product_results") return "product_search";
  if (appIntent === "SELECT_PRODUCT") return "select_product";
  if (appIntent === "CONFIRM_ORDER") return "confirm_order";
  if (appIntent === "COLLECT_ADDRESS") return "collect_address";
  if (appIntent === "UNCLEAR") return "unclear";
  if (appIntent === "PRODUCT_SEARCH") return "product_search";
  if (appIntent === "ORDER_STATUS" || appIntent === "CANCEL_REQUEST") return "support";
  if (appIntent === "OTHER") return "fallback";
  return "fallback";
}

function deriveTone() {
  if (appAction === "handoff") return "empathetic";
  if (appAction === "order_created") return "excited";
  if (appAction === "product_results") return "friendly";
  if (appIntent === "CONFIRM_ORDER") return "concise";
  if (appIntent === "UNCLEAR") return "empathetic";
  return "friendly";
}

function deriveNextStep() {
  const goal = String(haidiContext.replyGoal || "fallback");
  if (goal === "present_product_options") return "ask_size";
  if (goal === "ask_size") return "ask_size";
  if (goal === "confirm_cart") return "confirm_order";
  if (goal === "collect_address") return "collect_address";
  if (goal === "order_confirmation") return "close_conversation";
  if (goal === "handoff") return "human_handoff";
  return "continue";
}

let finalReply = stripInternalDetails(appReply);

if (!finalReply) {
  finalReply = isArabic ? "ممكن توضحي أكتر؟" : "Could you clarify a bit more?";
  safetyNotes.push("fallback_reply_used");
}

if (appAction === "order_created") {
  finalReply = warmPrefix(finalReply);
  safetyNotes.push("order_confirmed_by_app");
} else if (appAction === "product_results" || appIntent === "PRODUCT_SEARCH") {
  finalReply = warmPrefix(finalReply);
  if (Array.isArray(styleInstructions.mustInclude) && styleInstructions.mustInclude.length > 0) {
    const missing = styleInstructions.mustInclude.filter((part) => !finalReply.includes(part));
    if (missing.length > 0) {
      finalReply = finalReply + " " + missing.slice(0, 2).join(" ");
    }
  }
  finalReply = appendUpsell(finalReply);
} else if (appIntent === "SELECT_PRODUCT" || appIntent === "CONFIRM_ORDER" || appIntent === "COLLECT_ADDRESS") {
  finalReply = warmPrefix(finalReply);
} else if (appIntent === "UNCLEAR") {
  finalReply = isArabic ? "ممكن توضحيلي أكتر؟" : "Could you clarify a bit more?";
} else {
  finalReply = warmPrefix(finalReply);
}

if (Array.isArray(styleInstructions.mustNotSay)) {
  for (const banned of styleInstructions.mustNotSay) {
    if (banned && finalReply.includes(banned)) {
      finalReply = finalReply.replaceAll(banned, "").replace(/\\s{2,}/g, " ").trim();
    }
  }
}

if (hasUnsafeOrderClaim(finalReply) && appAction !== "order_created") {
  finalReply = appReply;
  safetyNotes.push("unsafe_order_claim_avoided");
}

const output = {
  final_reply: finalReply,
  intent_label: deriveIntentLabel(),
  tone: deriveTone(),
  used_upsell: Boolean(safetyNotes.includes("upsell_applied")),
  recommended_next_step: deriveNextStep(),
  haidi_session_key: haidiSessionKey,
  safety_notes: unique([
    ...safetyNotes,
    appAction === "order_created" ? "app_confirmed_order" : "app_action:" + appAction,
    products.length > 0 ? "products_available:" + String(products.length) : "no_products_available",
  ]),
};

return [{ json: output }];
  `.trim();

  mainHaidiNode.parameters.jsCode = updatedMainHaidiCode;
}

// Also update Validate Haidi Output in main workflow to include haidi_bypassed
const mainValidateNode = main.nodes.find((n) => n.name === "Validate Haidi Output");
if (mainValidateNode) {
  const oldCode = mainValidateNode.parameters.jsCode;
  mainValidateNode.parameters.jsCode = oldCode.replace(
    'haidi_session_key: haidiSessionKey,\n    number:',
    'haidi_bypassed: false,\n    haidi_session_key: haidiSessionKey,\n    number:'
  );
}

fs.writeFileSync(mainPath, JSON.stringify(main, null, 2));
console.log("✅ Updated main repo workflow:", mainPath);

console.log("\\n📝 Summary of changes:");
console.log("  - Backup: Updated Build Haidi Prompt to v2.2 with 'Return valid JSON only.'");
console.log("  - Backup: Updated user content to include 'Return JSON only. Input JSON:'");
console.log("  - Backup: Added 'Check Handoff Bypass' IF node");
console.log("  - Backup: Added 'Bypass Haidi' Code node for handoff/error paths");
console.log("  - Backup: Rewired connections to bypass OpenAI on handoff");
console.log("  - Main repo: Updated Haidi Code node with explicit handoff bypass at top");
