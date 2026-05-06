import { NextResponse } from "next/server";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { logInboundMessage, logOutboundMessage, logSystemEvent } from "@/lib/services/message-history-service";
import { rateLimit, rateLimitResponse } from "@/lib/middleware/rate-limit";
import { createRequestContext, logRequest, logError } from "@/lib/middleware/request-logger";

const webhookRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 120 });

export async function POST(req: Request) {
  const ctx = createRequestContext(req);
  try {
    const limit = webhookRateLimit(req);
    if (!limit.allowed) {
      logRequest(ctx, req, { rateLimited: true });
      return rateLimitResponse(limit.retryAfter);
    }

    const secret = process.env.EVOLUTION_WEBHOOK_SECRET;
    const token = req.headers.get("x-evolution-token");
    if (!secret) {
      console.warn("EVOLUTION_WEBHOOK_SECRET is not set — webhook processing without token verification");
    }
    if (secret && token !== secret) {
      logRequest(ctx, req, { webhook: "invalid_token" });
      return NextResponse.json({ action: "ignored", error: "invalid token" }, { status: 200 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      event?: string;
      instance?: string;
      data?: { key?: { remoteJid?: string; id?: string; fromMe?: boolean }; message?: { conversation?: string; extendedTextMessage?: { text?: string } }; messageType?: string };
    };

    // Only process real inbound messages — skip outbound (fromMe) and non-message events
    const isMessageUpsert = !body.event || body.event === "messages.upsert";
    const data = body.data ?? {};
    const key = data.key ?? {};
    if (!isMessageUpsert || key.fromMe === true) {
      return NextResponse.json({ action: "ignored", reason: "not inbound message" }, { status: 200 });
    }

    const text = data.message?.conversation ?? data.message?.extendedTextMessage?.text ?? "";
    if (!text.trim()) {
      console.warn("evolution webhook ignored: empty text");
      return NextResponse.json({ action: "ignored", reason: "empty text" }, { status: 200 });
    }

    const conversationId = key.remoteJid ?? "unknown";
    const providerMessageId = key.id;

    logInboundMessage({
      store_id: "youlya",
      conversation_id: conversationId,
      customer_id: conversationId,
      provider_message_id: providerMessageId,
      channel: "whatsapp_evolution",
      message_type: "text",
      text,
      raw_payload: body as Record<string, unknown>,
    }).catch(() => {});

    const result = await runMessageTurn({
      store_id: "youlya",
      conversation_id: conversationId,
      customer_id: conversationId,
      channel: "whatsapp_evolution",
      message_type: "text",
      text,
      language: "ar-EG",
      tone: "neutral",
      remote_jid: conversationId,
      instance_name: body.instance ?? "YoulyaMain",
      provider_message_id: providerMessageId,
    });

    logOutboundMessage({
      store_id: "youlya",
      conversation_id: conversationId,
      customer_id: conversationId,
      channel: "whatsapp_evolution",
      message_type: "text",
      text: result.reply ?? "",
      final_reply: result.reply ?? undefined,
      status: result.action === "error" ? "failed" : "delivered",
    }).catch(() => {});

    if (result.toolsCalled && result.toolsCalled.length > 0) {
      logSystemEvent({
        store_id: "youlya",
        conversation_id: conversationId,
        event_type: "tool_call",
        summary: `Tools: ${result.toolsCalled.join(", ")}`,
        metadata: { tools: result.toolsCalled, action: result.action, intent: result.intent },
      }).catch(() => {});
    }

    if (result.handoff) {
      logSystemEvent({
        store_id: "youlya",
        conversation_id: conversationId,
        event_type: "handoff",
        summary: "Handoff triggered",
        metadata: { action: result.action, intent: result.intent },
      }).catch(() => {});
    }

    logRequest(ctx, req, { action: result.action, handoff: result.handoff });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logError(ctx, error, { path: "/api/webhooks/evolution" });
    return NextResponse.json({ action: "error" }, { status: 200 });
  }
}
