import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const filter = new URL(req.url).searchParams.get("filter") ?? "all";
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const rows = [...getMockState().conversationFlow.entries()].map(([id, flow]) => ({
      id,
      stage: flow.stage,
      last_message: "",
      filter,
    }));
    return NextResponse.json({ conversations: rows });
  }

  const { data } = await supabase.from("conversation_state").select("conversation_id,stage,updated_at").order("updated_at", { ascending: false }).limit(50);
  return NextResponse.json({
    conversations: (data ?? []).map((row) => ({ id: row.conversation_id, stage: row.stage, updated_at: row.updated_at, filter })),
  });
}
