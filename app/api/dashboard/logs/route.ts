import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const tab = new URL(req.url).searchParams.get("tab") ?? "errors";
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ tab, rows: [] });

  if (tab === "errors") {
    const { data } = await supabase.from("failed_events").select("*").order("created_at", { ascending: false }).limit(100);
    return NextResponse.json({ tab, rows: data ?? [] });
  }
  if (tab === "ai_tool_calls") {
    const { data } = await supabase.from("ai_tool_calls").select("*").order("created_at", { ascending: false }).limit(100);
    return NextResponse.json({ tab, rows: data ?? [] });
  }
  return NextResponse.json({ tab, rows: [] });
}
