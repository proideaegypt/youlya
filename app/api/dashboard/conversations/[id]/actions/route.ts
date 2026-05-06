import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { sendWhatsAppReply } from "@/lib/services/evolution-sender-service";
import { createHandoffTicket } from "@/lib/services/handoff-service";

const schema = z.object({
  action: z.enum(["take_over", "return_ai", "kill_ai", "cancel_cart", "send_message", "handoff"]),
  text: z.string().optional(),
  remoteJid: z.string().optional(),
  instanceName: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { id } = await ctx.params;
  if (parsed.data.action === "send_message" && parsed.data.text && parsed.data.remoteJid && parsed.data.instanceName) {
    await sendWhatsAppReply(parsed.data.remoteJid, parsed.data.text, parsed.data.instanceName);
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const flow = getMockState().conversationFlow.get(id);
    if (flow && parsed.data.action === "cancel_cart") flow.cart = [];
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.action === "cancel_cart") {
    await supabase.from("conversation_state").update({ cart_json: [] }).eq("conversation_id", id);
  }
  if (parsed.data.action === "handoff") {
    await createHandoffTicket({
      store_id: "youlya",
      conversation_id: id,
      customer_id: id,
      reason: "CUSTOMER_REQUEST",
      priority: "NORMAL",
      ai_summary: parsed.data.reason ?? "Manual handoff from dashboard",
      pause_ai_after_handoff: true,
      notify_human_team: true,
    });
    await supabase.from("conversation_state").update({ ai_paused: true, status: "handoff" }).eq("conversation_id", id);
  }
  return NextResponse.json({ ok: true });
}
