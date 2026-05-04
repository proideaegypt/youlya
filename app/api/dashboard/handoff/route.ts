import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import type { HandoffTicket } from "@/lib/services/handoff-service";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function maskConversationId(id: string): string {
  if (!id || id.length <= 10) return id;
  return id.slice(0, 6) + "···" + id.slice(-4);
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status") ?? "all";
  const priorityFilter = url.searchParams.get("priority") ?? "all";

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const tickets = getMockState().handoffs
      .map((t) => t as HandoffTicket)
      .filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
        return t.status !== "resolved";
      })
      .map((t) => ({
        id: t.id,
        conversationId: t.conversation_id,
        conversationIdDisplay: maskConversationId(t.conversation_id),
        reason: t.reason,
        priority: t.priority,
        status: t.status,
        assignedTo: t.assigned_to,
        aiSummary: t.ai_summary,
        notes: t.notes,
        createdAt: t.created_at,
      }));
    return NextResponse.json({ tickets });
  }

  try {
    let query = supabase
      .from("handoff_tickets")
      .select("id,conversation_id,reason,priority,status,assigned_user_id,ai_summary,notes,created_at")
      .neq("status", "resolved")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (priorityFilter !== "all") query = query.eq("priority", priorityFilter);

    const { data, error } = await query;
    if (error) {
      console.error("handoff list error", error);
      return NextResponse.json({ tickets: [] });
    }

    const tickets = (data ?? []).map((row) => ({
      id: String(row.id),
      conversationId: String(row.conversation_id),
      conversationIdDisplay: maskConversationId(String(row.conversation_id)),
      reason: String(row.reason),
      priority: String(row.priority),
      status: String(row.status),
      assignedTo: row.assigned_user_id ? String(row.assigned_user_id) : null,
      aiSummary: String(row.ai_summary ?? ""),
      notes: row.notes ? String(row.notes) : null,
      createdAt: String(row.created_at),
    }));

    return NextResponse.json({ tickets });
  } catch (err) {
    console.error("handoff list exception", err);
    return NextResponse.json({ tickets: [] });
  }
}
