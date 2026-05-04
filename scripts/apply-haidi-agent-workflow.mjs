#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function loadEnv(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {}
}

for (const file of [".env.production", ".env.local", ".env"]) {
  loadEnv(path.join(process.cwd(), file));
}

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;
const WORKFLOW_ID = "joqfame4HXG775JO";
const DATE = new Date().toISOString().slice(0, 10);
const TASK_DIR = path.join(
  process.cwd(),
  "qa-artifacts",
  "tasks",
  DATE,
  "apply-haidi-agent-draft-to-active-workflow"
);
const BACKUP_PATH = path.join(TASK_DIR, "backup-youlya-whatsapp-main.json");
const CANONICAL_PATH = path.join(process.cwd(), "n8n", "workflows", "youlya-whatsapp-main.json");
const DRAFT_PATH = path.join(process.cwd(), "n8n", "workflows", "youlya-whatsapp-main-haidi-draft.json");

if (!N8N_API_URL || !N8N_API_KEY) {
  console.error("ERROR: N8N_API_URL and N8N_API_KEY must be set.");
  process.exit(1);
}

function normalizeUrl(url) {
  return String(url).replace(/\/$/, "");
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeForBackup(value) {
  const clone = deepClone(value);
  if (Array.isArray(clone.nodes)) {
    for (const node of clone.nodes) {
      if (node.credentials) delete node.credentials;
    }
  }
  return clone;
}

function fetchJson(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "X-N8N-API-KEY": N8N_API_KEY,
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });
}

function buildHaidiAgentCode() {
  return `
const app = $json;
const appReply = String(app.reply || app.message || "حصل خطأ تقني بسيط، ممكن تبعتي الرسالة تاني؟").trim();
const appAction = String(app.action || "ai_reply");
const appIntent = String(app.intent || "fallback");
const haidiContext = app.haidi_context || {};
const commerceFacts = haidiContext.commerceFacts || {};
const products = Array.isArray(commerceFacts.products) ? commerceFacts.products : [];
const allowedUpsells = Array.isArray(commerceFacts.allowedUpsells) ? commerceFacts.allowedUpsells : [];
const language = String(haidiContext.language || "ar-EG");
const isArabic = language.toLowerCase().startsWith("ar");
const styleInstructions = haidiContext.styleInstructions || {};
const safetyNotes = [];

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

if (appAction === "handoff") {
  finalReply = isArabic ? "تمام يا قمر، هحولك لفريق الدعم دلوقتي 🤍" : "I’ll hand this over to a human agent now.";
  safetyNotes.push("handoff_preserved");
} else if (appAction === "order_created") {
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
  safety_notes: unique([
    ...safetyNotes,
    appAction === "order_created" ? "app_confirmed_order" : "app_action:" + appAction,
    products.length > 0 ? "products_available:" + String(products.length) : "no_products_available",
  ]),
};

return [{ json: output }];
`;
}

function buildValidatorCode() {
  return `
const app = $node["Call Turn Endpoint"].json || {};
const appReply = String(app.reply || app.message || "حصل خطأ تقني بسيط، ممكن تبعتي الرسالة تاني؟");
const appAction = String(app.action || "error");
const haidiContext = app.haidi_context || {};
const facts = haidiContext.commerceFacts || {};
const products = Array.isArray(facts.products) ? facts.products : [];
const raw = $json;

function fallback(reason) {
  return [{
    json: {
      ...app,
      reply: appReply,
      action: appAction,
      haidi_valid: false,
      haidi_fallback: true,
      validation_reason: reason,
      number: $node["Normalize Message"].json.send_number,
    },
  }];
}

let candidate = raw;
if (typeof candidate === "string") {
  try {
    candidate = JSON.parse(candidate);
  } catch (error) {
    return fallback("invalid_json");
  }
}
if (candidate && candidate.output && typeof candidate.output === "object") {
  candidate = candidate.output;
}
if (!candidate || typeof candidate !== "object") {
  return fallback("not_an_object");
}

const finalReply = candidate.final_reply;
if (typeof finalReply !== "string" || !finalReply.trim()) {
  return fallback("missing_final_reply");
}

const unsafeOrderClaims = [
  "تم تأكيد الأوردر",
  "الأوردر اتعمل",
  "الأوردر اتأكد",
  "تم إنشاء الأوردر",
  "order confirmed",
  "order created",
  "order placed",
  "your order is confirmed",
];
if (appAction !== "order_created") {
  const lower = finalReply.toLowerCase();
  if (unsafeOrderClaims.some((phrase) => lower.includes(phrase.toLowerCase()))) {
    return fallback("unsafe_order_claim");
  }
}

const internalIdPatterns = [
  /gid:\\/\\//i,
  /provider_message_id/i,
  /conversation_id/i,
  /customer_id/i,
  /store_id/i,
  /variant_id/i,
  /shopify_order_id/i,
  /shopify_variant_id/i,
  /remote_jid/i,
  /#MOCK-/i,
  /mock-/i,
];
if (internalIdPatterns.some((pattern) => pattern.test(finalReply))) {
  return fallback("internal_identifier_leak");
}

const hasPriceClaim = /\\b\\d+(?:[.,]\\d+)?\\s*(?:جنيه|ج\\.م|EGP|ريال|SAR|USD)\\b/i.test(finalReply);
const hasStockClaim = /\\b(?:متوفر|غير متوفر|in stock|out of stock|stock|خلص|نفد)\\b/i.test(finalReply);
const knownPrices = products
  .map((product) => product.price)
  .filter((price) => typeof price === "number" && Number.isFinite(price))
  .map((price) => String(price));
if (hasPriceClaim && !knownPrices.some((price) => finalReply.includes(price))) {
  return fallback("unsupported_price_claim");
}
if (hasStockClaim && products.length === 0 && facts.blockedReason !== "out_of_stock") {
  return fallback("unsupported_stock_claim");
}

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
const allowedTones = ["friendly", "premium", "concise", "excited", "empathetic", "neutral"];

const intentLabel =
  typeof candidate.intent_label === "string" && allowedIntents.includes(candidate.intent_label)
    ? candidate.intent_label
    : "fallback";
const tone =
  typeof candidate.tone === "string" && allowedTones.includes(candidate.tone)
    ? candidate.tone
    : "friendly";
const usedUpsell = typeof candidate.used_upsell === "boolean" ? candidate.used_upsell : false;
const recommendedNextStep =
  typeof candidate.recommended_next_step === "string" ? candidate.recommended_next_step : "";
const safetyNotes = Array.isArray(candidate.safety_notes)
  ? candidate.safety_notes.filter((item) => typeof item === "string")
  : [];

return [{
  json: {
    ...app,
    reply: finalReply.trim(),
    action: appAction,
    haidi_valid: true,
    haidi_fallback: false,
    haidi_output: {
      final_reply: finalReply.trim(),
      intent_label: intentLabel,
      tone,
      used_upsell: usedUpsell,
      recommended_next_step: recommendedNextStep,
      safety_notes: safetyNotes,
    },
    number: $node["Normalize Message"].json.send_number,
  },
}];
`;
}

function upsertNodes(workflow) {
  const nodes = Array.isArray(workflow.nodes) ? deepClone(workflow.nodes) : [];
  const nodeMap = new Map(nodes.map((node, index) => [node.name, { node, index }]));

  const haidiNode = {
    parameters: {
      jsCode: buildHaidiAgentCode(),
    },
    id: "Haidi AI Sales Agent",
    name: "Haidi AI Sales Agent",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [1360, 120],
  };

  const validatorNode = {
    parameters: {
      jsCode: buildValidatorCode(),
    },
    id: "Validate Haidi Output",
    name: "Validate Haidi Output",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [1580, 120],
  };

  const existingHaidi = nodeMap.get("Haidi AI Sales Agent");
  const existingValidator = nodeMap.get("Validate Haidi Output");
  const insertBefore = "Prepare Reply";
  const insertIndex = Math.max(
    0,
    nodes.findIndex((node) => node.name === insertBefore)
  );

  if (existingHaidi) {
    nodes[existingHaidi.index] = haidiNode;
  } else {
    nodes.splice(insertIndex, 0, haidiNode);
  }

  const validatorIndexAfterHaidi = Math.max(
    0,
    nodes.findIndex((node) => node.name === "Haidi AI Sales Agent") + 1
  );
  if (existingValidator) {
    const currentIndex = nodes.findIndex((node) => node.name === "Validate Haidi Output");
    nodes[currentIndex] = validatorNode;
  } else {
    nodes.splice(validatorIndexAfterHaidi, 0, validatorNode);
  }

  workflow.nodes = nodes;

  const connections = deepClone(workflow.connections || {});
  connections["Call Turn Endpoint"] = {
    main: [
      [
        {
          node: "Haidi AI Sales Agent",
          type: "main",
          index: 0,
        },
      ],
    ],
    error: connections["Call Turn Endpoint"]?.error || [
      [
        {
          node: "Dead Letter",
          type: "main",
          index: 0,
        },
      ],
    ],
  };

  connections["Haidi AI Sales Agent"] = {
    main: [
      [
        {
          node: "Validate Haidi Output",
          type: "main",
          index: 0,
        },
      ],
    ],
  };

  connections["Validate Haidi Output"] = {
    main: [
      [
        {
          node: "Prepare Reply",
          type: "main",
          index: 0,
        },
      ],
    ],
  };

  workflow.connections = connections;
  return workflow;
}

async function main() {
  const baseUrl = normalizeUrl(N8N_API_URL);
  const getRes = await fetchJson(`${baseUrl}/api/v1/workflows/${WORKFLOW_ID}`);
  if (!getRes.ok) {
    console.error("ERROR: Failed to fetch active workflow:", getRes.status, await getRes.text());
    process.exit(1);
  }

  const activeWorkflow = await getRes.json();
  fs.mkdirSync(TASK_DIR, { recursive: true });
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(sanitizeForBackup(activeWorkflow), null, 2));

  const patchedActive = upsertNodes(deepClone(activeWorkflow));
  const putRes = await fetchJson(`${baseUrl}/api/v1/workflows/${WORKFLOW_ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patchedActive),
  });
  if (!putRes.ok) {
    console.error("ERROR: Failed to update active workflow:", putRes.status, await putRes.text());
    process.exit(1);
  }

  const repoWorkflow = deepClone(patchedActive);
  repoWorkflow.active = false;
  repoWorkflow.name = "Youlya WhatsApp Main";
  fs.writeFileSync(CANONICAL_PATH, JSON.stringify(repoWorkflow, null, 2));

  const draftWorkflow = deepClone(patchedActive);
  draftWorkflow.active = false;
  draftWorkflow.name = "Youlya WhatsApp Main — Haidi Draft";
  fs.writeFileSync(DRAFT_PATH, JSON.stringify(draftWorkflow, null, 2));

  const confirmRes = await fetchJson(`${baseUrl}/api/v1/workflows/${WORKFLOW_ID}`);
  const confirm = await confirmRes.json();
  console.log(
    JSON.stringify(
      {
        workflowId: WORKFLOW_ID,
        active: confirm.active,
        name: confirm.name,
        nodes: Array.isArray(confirm.nodes) ? confirm.nodes.map((node) => node.name) : [],
        backup: BACKUP_PATH,
      },
      null,
      2,
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
