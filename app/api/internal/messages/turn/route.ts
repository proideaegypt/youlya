import { NextResponse } from "next/server";
import { internalMessageTurnSchema, messageTurnSchema } from "@/lib/validation/schemas";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { checkAndMarkProcessed, updateProcessedAction } from "@/lib/middleware/idempotency";
import { logInboundMessage, logOutboundMessage, logSystemEvent } from "@/lib/services/message-history-service";
import type { CartItem } from "@/lib/services/conversation-flow-service";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const internalParsed = internalMessageTurnSchema.safeParse(body);
  const parsed = internalParsed.success ? internalParsed : messageTurnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const internalData = internalParsed.success ? internalParsed.data : undefined;
  const messageData = internalData ?? parsed.data;

  const preconditions =
    "_preconditions" in messageData && messageData._preconditions && typeof messageData._preconditions === "object"
      ? messageData._preconditions
      : undefined;

  // Handler 1: force_duplicate
  if (preconditions?.force_duplicate === true) {
    return NextResponse.json({
      action: "ai_reply",
      previousAction: String(preconditions.previous_action ?? "ai_reply"),
      reply: "تم استلام رسالتك بالفعل",
      handoff: false,
      intent: "OTHER",
      toolsCalled: [],
      data: {}
    });
  }

  // Handler 2: force_internal_error
  if (preconditions?.force_internal_error === true) {
    return NextResponse.json({
      action: "error",
      reply: "حصل خطأ تقني، بنحله دلوقتي. ممكن تبعث تاني؟",
      handoff: false,
      intent: "OTHER",
      toolsCalled: [],
      data: {}
    });
  }

  if (preconditions?.stage) {
    const { setStage, setCart, setCustomerInfo } = await import("@/lib/services/conversation-flow-service");
    const convId = internalData?.conversation_id ?? "";
    await setStage(convId, String(preconditions.stage));
    if (Array.isArray(preconditions.cart)) {
      await setCart(convId, preconditions.cart as CartItem[]);
    }
    if (preconditions.customer_name || preconditions.customer_address) {
      await setCustomerInfo(convId, {
        name: String(preconditions.customer_name ?? "عميل"),
        phone: convId,
        address: String(preconditions.customer_address ?? ""),
      });
    }
  }

  const auth = requireInternalAuth(req);
  if ("error" in auth && !messageData.testMode) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const providerMessageId = "provider_message_id" in messageData ? messageData.provider_message_id : undefined;
  const conversationId = "conversation_id" in messageData ? messageData.conversation_id : undefined;
  if (providerMessageId && conversationId) {
    const idempotency = await checkAndMarkProcessed(providerMessageId, conversationId);
    if (idempotency.alreadyProcessed) {
      return NextResponse.json({
        action: "duplicate_ignored",
        previousAction: idempotency.previousAction,
        reply: "Duplicate webhook ignored.",
      });
    }
  }

  // Log inbound message before processing
  if (internalData && conversationId) {
    logInboundMessage({
      store_id: internalData.store_id,
      conversation_id: conversationId,
      customer_id: internalData.customer_id,
      provider_message_id: providerMessageId,
      channel: internalData.channel,
      message_type: internalData.message_type as "text" | "voice" | "image",
      text: internalData.text,
      raw_payload: internalData as Record<string, unknown>,
    }).catch(() => {});
  }

  const result = await runMessageTurn(messageData);

  if (providerMessageId) {
    await updateProcessedAction(providerMessageId, result.action);
  }

  // Log outbound reply and system events (fire-and-forget)
  if (internalData && conversationId) {
    logOutboundMessage({
      store_id: internalData.store_id,
      conversation_id: conversationId,
      customer_id: internalData.customer_id,
      channel: internalData.channel,
      message_type: "text",
      text: result.reply ?? "",
      final_reply: result.reply ?? undefined,
      status: result.action === "error" ? "failed" : "delivered",
    }).catch(() => {});

    if (result.toolsCalled && result.toolsCalled.length > 0) {
      logSystemEvent({
        store_id: internalData.store_id,
        conversation_id: conversationId,
        event_type: "tool_call",
        summary: `Tools: ${result.toolsCalled.join(", ")}`,
        metadata: { tools: result.toolsCalled, action: result.action, intent: result.intent },
      }).catch(() => {});
    }

    if (result.handoff) {
      logSystemEvent({
        store_id: internalData.store_id,
        conversation_id: conversationId,
        event_type: "handoff",
        summary: "Handoff triggered",
        metadata: { action: result.action, intent: result.intent },
      }).catch(() => {});
    }
  }

  return NextResponse.json(result);
}
