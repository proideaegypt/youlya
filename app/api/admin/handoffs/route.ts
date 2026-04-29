import { NextResponse } from "next/server";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const auth = requireInternalAuth(req);
  if ("error" in auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const items = getMockState().humanHandoffs.filter((h) => h.resolved_at === null);
    return NextResponse.json({ handoffs: items });
  }

  try {
    const { data, error } = await supabase
      .from("human_handoffs")
      .select("id,conversation_id,reason,requested_at,resolved_at,resolved_by,notes")
      .is("resolved_at", null)
      .order("requested_at", { ascending: false });
    if (error) {
      console.error("human_handoffs read error", error);
      return NextResponse.json({ handoffs: [] });
    }
    return NextResponse.json({ handoffs: data ?? [] });
  } catch (error) {
    console.error("human_handoffs read exception", error);
    return NextResponse.json({ handoffs: [] });
  }
}
