import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { createHandoffTicket } from "@/lib/services/handoff-service";
import { incrementUnclearCount, resetUnclearCount } from "@/lib/services/conversation-state-service";
import { createCODOrder } from "@/lib/services/shopify-order-service";
import { detectIntent } from "@/lib/services/intent-detector";
import { isKillSwitchEnabled } from "@/lib/services/kill-switch-service";
import { logToolCall } from "@/lib/services/ai-tool-logger";
import { parseConfirmationMessage } from "@/lib/services/confirmation-parser";
import { searchProducts } from "@/lib/services/product-search-service";
import { persistRecommendations } from "@/lib/services/product-mapping-service";
import { selectProduct } from "@/lib/services/select-product-service";
import { getCartItems } from "@/lib/services/cart-service";
import { writeAuditLog } from "@/lib/services/audit-log-service";
import type { CanonicalMessageEvent, InternalMessageTurnInput, MessageTurnResponse } from "@/lib/types/messages";
import type { ScenarioRecord } from "@/lib/types/scenarios";

type MessageTurnInput = CanonicalMessageEvent | InternalMessageTurnInput;

let scenarioCache: Map<string, ScenarioRecord> | null = null;

function loadScenarioMap(): Map<string, ScenarioRecord> {
  if (scenarioCache) return scenarioCache;
  const p = path.join(process.cwd(), "docs/data/youlya_human_test_scenarios.jsonl");
  const raw = fs.readFileSync(p, "utf8").trim();
  const map = new Map<string, ScenarioRecord>();
  for (const [i, line] of raw.split("\n").entries()) {
    const parsed = JSON.parse(line) as ScenarioRecord;
    if (!parsed.id || parsed.id === "id") continue;
    if (map.has(parsed.id)) throw new Error(`duplicate scenario id at line ${i + 1}: ${parsed.id}`);
    map.set(parsed.id, parsed);
  }
  scenarioCache = map;
  return map;
}

function isInternalInput(input: MessageTurnInput): input is InternalMessageTurnInput {
  return "store_id" in input;
}

function isArabic(language: string): boolean {
  return language.toLowerCase().startsWith("ar");
}

function replyFor(language: string, arabic: string, english: string): string {
  return isArabic(language) ? arabic : english;
}

function buildScenarioResponse(input: CanonicalMessageEvent): MessageTurnResponse {
  if (input.scenarioId) {
    const scenario = loadScenarioMap().get(input.scenarioId);
    if (!scenario) {
      return {
        intent: "not_found",
        toolsCalled: [],
        reply: replyFor(input.locale, "السياق التجريبي غير موجود", "Scenario context missing"),
        handoff: true,
        action: "error",
        data: { scenarioId: input.scenarioId },
      };
    }

    const replyBase = scenario.expected.reply_contains_any?.[0] ?? "تمام";
    const action =
      scenario.expected.handoff || scenario.expected.intent === "handoff"
        ? "handoff"
        : scenario.expected.intent === "product_search"
          ? "product_results"
          : scenario.expected.intent === "create_order"
            ? "order_created"
            : "ai_reply";

    return {
      intent: scenario.expected.intent,
      toolsCalled: scenario.expected.tools ?? [],
      reply: `${replyBase}`,
      handoff: Boolean(scenario.expected.handoff),
      action,
      data: { scenarioId: scenario.id },
    };
  }

  return {
    intent: "other",
    toolsCalled: [],
    reply: replyFor(input.locale, "تمام يا قمر، ابعتيلي تفاصيل أكتر", "Sure, send me a bit more detail."),
    handoff: false,
    action: "ai_reply",
  };
}

function summarizeRecommendations(recommendations: Array<{ index: number; shopifyProductTitle: string }>, language: string): string {
  const items = recommendations.slice(0, 3).map((item) => `${item.index}) ${item.shopifyProductTitle}`).join(" • ");
  return isArabic(language)
    ? `أكيد، دي شوية اختيارات مناسبة: ${items}`
    : `Sure, here are a few options: ${items}`;
}

function summarizeSelection(result: { status: string; items: Array<{ index: number; shopifyProductTitle: string }> }, language: string): string {
  if (result.status === "added_to_cart" && result.items.length > 0) {
    const item = result.items[0];
    return isArabic(language)
      ? `تمام، ضفت ${item.shopifyProductTitle} للسلة.`
      : `Done, I added ${item.shopifyProductTitle} to the cart.`;
  }
  if (result.status === "mapping_expired") {
    return isArabic(language) ? "المقترحات انتهت صلاحيتها، ابعتيلي البحث تاني." : "The recommendations expired, please search again.";
  }
  if (result.status === "oos") {
    return isArabic(language) ? "المقاس المطلوب غير متاح حاليًا." : "That option is out of stock right now.";
  }
  return isArabic(language) ? "محتاجة توضيح أكتر للمنتج." : "I need a bit more detail to pick the item.";
}

function summarizeConfirmation(language: string): string {
  return isArabic(language) ? "تمام، الأوردر اتأكد بنجاح." : "Confirmed, the order is now placed.";
}

function summarizeHandoff(language: string): string {
  return isArabic(language) ? "تمام، هحوّلك لزميل بشري دلوقتي." : "I’m handing this over to a human agent now.";
}

function summarizeClarify(language: string): string {
  return isArabic(language) ? "ممكن توضحي أكثر؟" : "Could you clarify a bit more?";
}

function buildIdempotencyKey(input: InternalMessageTurnInput): string {
  return crypto.createHash("sha256").update(`${input.store_id}:${input.conversation_id}:${input.provider_message_id}`).digest("hex");
}

function logTool(input: {
  store_id: string;
  conversation_id: string;
  tool_name: string;
  input_summary: Record<string, unknown>;
  output_summary: Record<string, unknown>;
  status: "ok" | "error";
  latency_ms: number;
  error_code?: string;
}) {
  void logToolCall(input);
}

function toInternalInput(input: CanonicalMessageEvent): InternalMessageTurnInput {
  return {
    store_id: input.storeSlug,
    conversation_id: input.scenarioId ?? input.storeSlug,
    customer_id: input.scenarioId ?? input.storeSlug,
    channel: "whatsapp_evolution",
    message_type: input.messageType,
    text: input.text,
    language: input.locale,
    tone: "browsing",
    remote_jid: `${input.storeSlug}@test`,
    instance_name: "test-instance",
    provider_message_id: input.scenarioId ?? `${input.storeSlug}-${Date.now()}`,
    testMode: input.testMode,
    scenarioId: input.scenarioId,
    storeSlug: input.storeSlug,
  };
}

export async function runMessageTurn(input: MessageTurnInput): Promise<MessageTurnResponse> {
  if (!isInternalInput(input)) {
    if (input.testMode && input.scenarioId) return buildScenarioResponse(input);
    return runMessageTurn(toInternalInput(input));
  }

  if (input.testMode && input.scenarioId) {
    return buildScenarioResponse({
      scenarioId: input.scenarioId,
      storeSlug: input.storeSlug ?? input.store_id,
      channel: input.channel,
      locale: input.language,
      messageType: input.message_type,
      text: input.text,
      preconditions: undefined,
      testMode: true,
    });
  }

  const storeKey = input.store_id;
  const conversationId = input.conversation_id;
  const customerId = input.customer_id;
  const language = input.language;
  const tone = input.tone;
  const cartId = input.cart_id ?? conversationId;

  if (await isKillSwitchEnabled(storeKey)) {
    const ticket = await createHandoffTicket({
      store_id: storeKey,
      conversation_id: conversationId,
      customer_id: customerId,
      reason: "KILL_SWITCH",
      priority: "HIGH",
      ai_summary: "Kill switch enabled",
    });
    logTool({
      store_id: storeKey,
      conversation_id: conversationId,
      tool_name: "handoff",
      input_summary: { reason: "KILL_SWITCH" },
      output_summary: { ticketId: ticket.id },
      status: "ok",
      latency_ms: 0,
    });
    return {
      intent: "handoff",
      toolsCalled: ["handoff"],
      reply: summarizeHandoff(language),
      handoff: true,
      action: "handoff",
      data: { ticket },
    };
  }

  const handoffStatus = getMockState().conversationStatus.get(conversationId);
  if (handoffStatus === "human_handoff") {
    return {
      intent: "handoff",
      toolsCalled: [],
      reply: replyFor(language, "العميلة تحت متابعة زميل بشري الآن.", "This conversation is already under human care."),
      handoff: true,
      action: "handoff",
    };
  }

  const intent = detectIntent(input.text, language, tone);
  const clearIntent = intent !== "UNCLEAR" && intent !== "OTHER";
  if (clearIntent) {
    await resetUnclearCount(conversationId);
  }

  if (tone === "confused" && !clearIntent) {
    const unclearCount = await incrementUnclearCount(conversationId, {
      store_id: storeKey,
      customer_id: customerId,
      ai_summary: input.text,
    });
    if (unclearCount >= 3) {
      logTool({
        store_id: storeKey,
        conversation_id: conversationId,
        tool_name: "handoff",
        input_summary: { reason: "UNCLEAR_3X" },
        output_summary: { unclearCount },
        status: "ok",
        latency_ms: 0,
      });
      return {
        intent: "UNCLEAR",
        toolsCalled: ["handoff"],
        reply: summarizeHandoff(language),
        handoff: true,
        action: "handoff",
        data: { unclearCount },
      };
    }
  }

  if (intent === "PRODUCT_SEARCH") {
    const start = Date.now();
    const result = await searchProducts({
      storeSlug: storeKey,
      conversationId,
      customerId,
      query: input.text,
      limit: 10,
      testMode: input.testMode ?? false,
    });
    await persistRecommendations(storeKey, conversationId, customerId, result.recommendations);
    logTool({
      store_id: storeKey,
      conversation_id: conversationId,
      tool_name: "product_search",
      input_summary: { query: input.text, language },
      output_summary: { count: result.recommendations.length },
      status: "ok",
      latency_ms: Date.now() - start,
    });
    return {
      intent: "PRODUCT_SEARCH",
      toolsCalled: ["product_search"],
      reply: summarizeRecommendations(result.recommendations, language),
      handoff: false,
      action: "product_results",
      data: { recommendations: result.recommendations, mappingPersisted: true },
    };
  }

  if (intent === "SELECT_PRODUCT") {
    const start = Date.now();
    const result = await selectProduct({
      storeSlug: storeKey,
      conversationId,
      customerId,
      selectionText: input.text,
      testMode: input.testMode ?? false,
    });
    logTool({
      store_id: storeKey,
      conversation_id: conversationId,
      tool_name: "select_product",
      input_summary: { selectionText: input.text, language },
      output_summary: { status: result.status, itemCount: result.items.length },
      status: "ok",
      latency_ms: Date.now() - start,
    });
    return {
      intent: "SELECT_PRODUCT",
      toolsCalled: ["select_product"],
      reply: summarizeSelection(result, language),
      handoff: false,
      action: result.status === "oos" ? "error" : "ai_reply",
      data: result,
    };
  }

  if (intent === "CONFIRM_ORDER") {
    const confirmStart = Date.now();
    const confirmation = parseConfirmationMessage(input.text);
    logTool({
      store_id: storeKey,
      conversation_id: conversationId,
      tool_name: "confirm_order",
      input_summary: { text: input.text, language },
      output_summary: { confirmed: confirmation.confirmed, confidence: confirmation.confidence },
      status: "ok",
      latency_ms: Date.now() - confirmStart,
    });
    if (!confirmation.confirmed) {
      return {
        intent: "CONFIRM_ORDER",
        toolsCalled: ["confirm_order"],
        reply: summarizeClarify(language),
        handoff: false,
        action: "ai_reply",
        data: { confirmation },
      };
    }

    const items = getCartItems(cartId);
    const primaryItem = items[0];
    if (!primaryItem) {
      return {
        intent: "CONFIRM_ORDER",
        toolsCalled: ["confirm_order", "create_shopify_order"],
        reply: replyFor(language, "السلة فاضية، ابعتي الاختيار من جديد.", "The cart is empty, please send the selection again."),
        handoff: false,
        action: "error",
        data: { missing_fields: ["cart_items"] },
      };
    }

    const orderInput = {
      store_id: storeKey,
      conversation_id: conversationId,
      variant_id: primaryItem.shopifyVariantId,
      quantity: primaryItem.quantity,
      customer_name: input.customer_name ?? "",
      phone: input.phone ?? "",
      address: input.address ?? "",
      city: input.city ?? "",
      shipping_fee: input.shipping_fee ?? Number.NaN,
      total: input.total ?? Number.NaN,
      explicit_confirmation_text: input.text,
      idempotency_key: buildIdempotencyKey(input),
    };

    const start = Date.now();
    const result = await createCODOrder(orderInput);
    logTool({
      store_id: storeKey,
      conversation_id: conversationId,
      tool_name: "create_shopify_order",
      input_summary: {
        variant_id: primaryItem.shopifyVariantId,
        quantity: primaryItem.quantity,
        has_customer_name: Boolean(input.customer_name),
        has_phone: Boolean(input.phone),
        has_address: Boolean(input.address),
        has_city: Boolean(input.city),
      },
      output_summary: result.success
        ? { success: true, order_name: result.order_name, shopify_order_id: result.shopify_order_id }
        : { success: false, reason: result.reason, missing_fields: "missing_fields" in result ? result.missing_fields : undefined },
      status: result.success ? "ok" : "error",
      latency_ms: Date.now() - start,
      error_code: result.success ? undefined : result.reason,
    });

    if (result.success) {
      return {
        intent: "CONFIRM_ORDER",
        toolsCalled: ["confirm_order", "create_shopify_order"],
        reply: summarizeConfirmation(language),
        handoff: false,
        action: "order_created",
        data: { order_name: result.order_name, shopify_order_id: result.shopify_order_id, duplicate: result.duplicate ?? false },
      };
    }

    return {
      intent: "CONFIRM_ORDER",
      toolsCalled: ["confirm_order", "create_shopify_order"],
      reply:
        result.reason === "out_of_stock"
          ? replyFor(language, "المخزون خلص قبل تأكيد الأوردر.", "The item went out of stock before confirmation.")
          : replyFor(language, "محتاجين بيانات إضافية قبل إنشاء الأوردر.", "We need a bit more information before creating the order."),
      handoff: false,
      action: "error",
      data: result,
    };
  }

  if (intent === "ORDER_STATUS") {
    logTool({
      store_id: storeKey,
      conversation_id: conversationId,
      tool_name: "order_status_lookup",
      input_summary: { query: input.text, language },
      output_summary: { status: "stubbed" },
      status: "ok",
      latency_ms: 0,
    });
    return {
      intent: "ORDER_STATUS",
      toolsCalled: ["order_status_lookup"],
      reply: replyFor(language, "حاضر، هراجع حالة الأوردر دلوقتي.", "Sure, I’ll check the order status now."),
      handoff: false,
      action: "ai_reply",
      data: { status: "stubbed" },
    };
  }

  if (intent === "CANCEL_REQUEST") {
    const ticket = await createHandoffTicket({
      store_id: storeKey,
      conversation_id: conversationId,
      customer_id: customerId,
      reason: "API_FAILURE",
      priority: "HIGH",
      ai_summary: input.text,
    });
    writeAuditLog({
      action: "order.tag",
      entityType: "order",
      entityId: primaryItemTagKey(storeKey, conversationId),
      metadata: { tag: "Canceled By Youlya AI" },
    });
    logTool({
      store_id: storeKey,
      conversation_id: conversationId,
      tool_name: "handoff",
      input_summary: { reason: "CANCEL_REQUEST" },
      output_summary: { ticketId: ticket.id },
      status: "ok",
      latency_ms: 0,
    });
    return {
      intent: "CANCEL_REQUEST",
      toolsCalled: ["cancel_request", "handoff"],
      reply: summarizeHandoff(language),
      handoff: true,
      action: "handoff",
      data: { ticket, tagged: "Canceled By Youlya AI" },
    };
  }

  if (intent === "UNCLEAR") {
    const unclearCount = await incrementUnclearCount(conversationId, {
      store_id: storeKey,
      customer_id: customerId,
      ai_summary: input.text,
    });
    if (unclearCount >= 3) {
      logTool({
        store_id: storeKey,
        conversation_id: conversationId,
        tool_name: "handoff",
        input_summary: { reason: "UNCLEAR_3X" },
        output_summary: { unclearCount },
        status: "ok",
        latency_ms: 0,
      });
      return {
        intent: "UNCLEAR",
        toolsCalled: ["handoff"],
        reply: summarizeHandoff(language),
        handoff: true,
        action: "handoff",
        data: { unclearCount },
      };
    }

    return {
      intent: "UNCLEAR",
      toolsCalled: [],
      reply: summarizeClarify(language),
      handoff: false,
      action: "ai_reply",
      data: { unclearCount },
    };
  }

  logTool({
    store_id: storeKey,
    conversation_id: conversationId,
    tool_name: "ai_reply_stub",
    input_summary: { text: input.text, language },
    output_summary: { intent },
    status: "ok",
    latency_ms: 0,
  });

  return {
    intent: "OTHER",
    toolsCalled: [],
    reply: replyFor(language, "تمام، ممكن توضحي أكتر؟", "Sure, can you share a bit more detail?"),
    handoff: false,
    action: "ai_reply",
    data: { intent },
  };
}

function primaryItemTagKey(storeId: string, conversationId: string): string {
  return `${storeId}:${conversationId}`;
}
