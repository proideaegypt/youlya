import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { returnToAI } from "@/lib/services/handoff-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await _req.json().catch(() => ({}));
  const actor = typeof body.actor === "string" ? body.actor : "staff";

  let conversationId: string | null = null;

  // Find conversation_id from ticket
  const mockTicket = getMockState().handoffs.find((t) => (t as { id: string }).id === id);
  if (mockTicket) {
    conversationId = (mockTicket as { conversation_id: string }).conversation_id;
  } else {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase.from("handoff_tickets").select("conversation_id").eq("id", id).maybeSingle();
      if (data) conversationId = String(data.conversation_id);
    }
  }

  if (!conversationId) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const success = await returnToAI(conversationId, actor);
  if (!success) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
