import { NextResponse } from "next/server";
import { internalMessageTurnSchema, messageTurnSchema } from "@/lib/validation/schemas";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { checkAndMarkProcessed, updateProcessedAction } from "@/lib/middleware/idempotency";
import { logInboundMessage, logOutboundMessage, logSystemEvent } from "@/lib/services/message-history-service";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { rateLimit, rateLimitResponse } from "@/lib/middleware/rate-limit";
import { createRequestContext, logRequest } from "@/lib/middleware/request-logger";
import type { CartItem } from "@/lib/services/conversation-flow-service";
import type { CanonicalMessageEvent, InternalMessageTurnInput } from "@/lib/types/messages";

const turnRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 180 });

function extractConversationId(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const fromConversationId = typeof record.conversation_id === "string" ? record.conversation_id.trim() : "";
  if (fromConversationId) return fromConversationId;
  const fromRemoteJid = typeof record.remote_jid === "string" ? record.remote_jid.trim() : "";
  if (fromRemoteJid) return fromRemoteJid;
  const fromPhone = typeof record.phone === "string" ? record.phone.trim() : "";
  if (fromPhone) return fromPhone;
  const customer = record.customer;
  if (customer && typeof customer === "object") {
    const customerPhone = typeof (customer as Record<string, unknown>).phone === "string" ? String((customer as Record<string, unknown>).phone).trim() : "";
    if (customerPhone) return customerPhone;
  }
  return null;
}

function normalizeReplyText(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

async function shouldSuppressDuplicateOutbound(
  storeId: string,
  conversationId: string,
  action: string,
  reply: string,
): Promise<boolean> {
  const normalized = normalizeReplyText(reply);
  if (!normalized) return false;
  const windowSeconds = action === "product_results" ? 300 : 120;
  const thresholdIso = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const mock = getMockState();
    const recent = mock.messageHistory
      .filter((m: Record<string, unknown>) => m.store_id === storeId && m.conversation_id === conversationId && m.direction === "outbound")
      .filter((m: Record<string, unknown>) => new Date(String(m.created_at ?? 0)).getTime() >= new Date(thresholdIso).getTime());
    return recent.some((m: Record<string, unknown>) => normalizeReplyText(String(m.body ?? m.text ?? m.final_reply ?? "")) === normalized);
  }

  const { data } = await supabase
    .from("messages")
    .select("body,text,final_reply,created_at")
    .eq("store_id", storeId)
    .eq("conversation_id", conversationId)
    .eq("direction", "outbound")
    .gte("created_at", thresholdIso)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []).some((m) => normalizeReplyText(String(m.body ?? m.text ?? m.final_reply ?? "")) === normalized);
}

export async function POST(req: Request) {
  const ctx = createRequestContext(req);
  const limit = turnRateLimit(req);
  if (!limit.allowed) {
    logRequest(ctx, req, { rateLimited: true });
    return rateLimitResponse(limit.retryAfter);
  }

  const body = await req.json().catch(() => null);
  const internalParsed = internalMessageTurnSchema.safeParse(body);
  const parsed = internalParsed.success ? internalParsed : messageTurnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const normalizedConversationId = internalParsed.success ? extractConversationId(body) : null;
  if (internalParsed.success && !normalizedConversationId) {
    return NextResponse.json({ error: "missing_conversation_id" }, { status: 400 });
  }
  const internalData: InternalMessageTurnInput | undefined = internalParsed.success
    ? ({
        ...internalParsed.data,
        conversation_id: normalizedConversationId as string,
      } as InternalMessageTurnInput)
    : undefined;
  const messageData = internalData ?? parsed.data;

  const auth = requireInternalAuth(req);
  const isProduction = process.env.NODE_ENV === "production";
  const allowTestModeAuthBypass = !isProduction && Boolean(messageData.testMode);
  if ("error" in auth && !allowTestModeAuthBypass) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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

  const result = await runMessageTurn(messageData as CanonicalMessageEvent | InternalMessageTurnInput);
  let finalResult = result;

  if (internalData && conversationId && result.reply) {
    const duplicateSuppressed = await shouldSuppressDuplicateOutbound(
      internalData.store_id,
      conversationId,
      String(result.action ?? "ai_reply"),
      result.reply,
    );
    if (duplicateSuppressed) {
      finalResult = {
        ...result,
        action: "duplicate_outbound_suppressed",
        shouldSend: false,
        data: {
          ...(typeof result.data === "object" && result.data ? result.data : {}),
          duplicate_window_suppressed: true,
        },
      };
      logSystemEvent({
        store_id: internalData.store_id,
        conversation_id: conversationId,
        event_type: "system",
        summary: "Duplicate outbound suppressed",
        metadata: { action: result.action, duplicate_action: "duplicate_outbound_suppressed" },
      }).catch(() => {});
    }
  }

  if (providerMessageId) {
    await updateProcessedAction(providerMessageId, finalResult.action);
  }

  // Log outbound reply and system events (fire-and-forget)
  if (internalData && conversationId) {
    if (finalResult.reply) {
      logOutboundMessage({
        store_id: internalData.store_id,
        conversation_id: conversationId,
        customer_id: internalData.customer_id,
        channel: internalData.channel,
        message_type: "text",
        text: finalResult.reply,
        final_reply: finalResult.reply,
        status: finalResult.action === "error" || finalResult.action === "owner_approval_required" ? "blocked" : "delivered",
      }).catch(() => {});
    }

    if (finalResult.toolsCalled && finalResult.toolsCalled.length > 0) {
      logSystemEvent({
        store_id: internalData.store_id,
        conversation_id: conversationId,
        event_type: "tool_call",
        summary: `Tools: ${finalResult.toolsCalled.join(", ")}`,
        metadata: { tools: finalResult.toolsCalled, action: finalResult.action, intent: finalResult.intent },
      }).catch(() => {});
    }

    if (finalResult.handoff) {
      logSystemEvent({
        store_id: internalData.store_id,
        conversation_id: conversationId,
        event_type: "handoff",
        summary: "Handoff triggered",
        metadata: { action: finalResult.action, intent: finalResult.intent },
      }).catch(() => {});
    }
  }

  logRequest(ctx, req, { action: finalResult.action, handoff: finalResult.handoff });
  return NextResponse.json(finalResult);
}
