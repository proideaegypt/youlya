import { NextResponse } from "next/server";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { logInboundMessage, logOutboundMessage, logSystemEvent } from "@/lib/services/message-history-service";

export async function POST(req: Request) {
  try {
    const secret = process.env.EVOLUTION_WEBHOOK_SECRET;
    const token = req.headers.get("x-evolution-token");
    if (secret && token !== secret) {
      return NextResponse.json({ action: "ignored", error: "invalid token" }, { status: 200 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      instance?: string;
      data?: { key?: { remoteJid?: string; id?: string }; message?: { conversation?: string; extendedTextMessage?: { text?: string } }; messageType?: string };
    };
    const data = body.data ?? {};
    const key = data.key ?? {};
    const text = data.message?.conversation ?? data.message?.extendedTextMessage?.text ?? "";
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

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("evolution webhook error", error);
    return NextResponse.json({ action: "error" }, { status: 200 });
  }
}
