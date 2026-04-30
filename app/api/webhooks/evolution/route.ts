import { NextResponse } from "next/server";
import { runMessageTurn } from "@/lib/services/message-turn-service";

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

    const result = await runMessageTurn({
      store_id: "youlya",
      conversation_id: key.remoteJid ?? "unknown",
      customer_id: key.remoteJid ?? "unknown",
      channel: "whatsapp_evolution",
      message_type: "text",
      text,
      language: "ar-EG",
      tone: "neutral",
      remote_jid: key.remoteJid ?? "unknown",
      instance_name: body.instance ?? "YoulyaMain",
      provider_message_id: key.id,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("evolution webhook error", error);
    return NextResponse.json({ action: "error" }, { status: 200 });
  }
}
