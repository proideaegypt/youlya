import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import type { HandoffTicket } from "@/lib/services/handoff-service";
import { parseDateRangeFromSearchParams, toDateFilterWindow } from "@/lib/dashboard/date-range";

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
  const typeFilter = url.searchParams.get("type") ?? "all";
  const assigneeFilter = url.searchParams.get("assignee") ?? "all";
  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const range = parseDateRangeFromSearchParams(url.searchParams);
  const window = toDateFilterWindow(range);

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const tickets = getMockState().handoffs
      .map((t) => t as HandoffTicket)
      .filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
        if (typeFilter !== "all" && String(t.handoff_type ?? "customer_service") !== typeFilter) return false;
        if (assigneeFilter !== "all" && String(t.assigned_to ?? "") !== assigneeFilter) return false;
        if (search) {
          const haystack = [
            t.id,
            t.conversation_id,
            t.customer_id,
            t.reason,
            t.priority,
            t.status,
            t.ai_summary,
            t.problem_summary ?? "",
            t.notes ?? "",
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(search)) return false;
        }
        const createdAt = new Date(t.created_at).getTime();
        const fromTime = new Date(window.from).getTime();
        const toTime = new Date(window.to).getTime();
        if (createdAt < fromTime || createdAt >= toTime) return false;
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
        handoffType: t.handoff_type ?? "customer_service",
        problemSummary: t.problem_summary ?? t.ai_summary,
        aiSummary: t.ai_summary,
        aiPaused: Boolean(t.ai_paused),
        notes: t.notes,
        createdAt: t.created_at,
      }));
    return NextResponse.json({ tickets });
  }

  try {
    let query = supabase
      .from("handoff_tickets")
      .select("id,conversation_id,reason,priority,status,assigned_to,ai_summary,problem_summary,handoff_type,ai_paused,notes,created_at,returned_to_ai_at")
      .neq("status", "resolved")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (priorityFilter !== "all") query = query.eq("priority", priorityFilter);
    if (typeFilter !== "all") query = query.eq("handoff_type", typeFilter);
    if (assigneeFilter !== "all") query = query.eq("assigned_user_id", assigneeFilter);
    query = query.gte("created_at", window.from).lt("created_at", window.to);

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
      status: row.returned_to_ai_at ? "returned_to_ai" : String(row.status),
      assignedTo: row.assigned_to ? String(row.assigned_to) : null,
      handoffType: String(row.handoff_type ?? "customer_service"),
      problemSummary: String(row.problem_summary ?? row.ai_summary ?? ""),
      aiSummary: String(row.ai_summary ?? ""),
      aiPaused: row.ai_paused === true,
      notes: row.notes ? String(row.notes) : null,
      createdAt: String(row.created_at),
    }));

    return NextResponse.json({ tickets });
  } catch (err) {
    console.error("handoff list exception", err);
    return NextResponse.json({ tickets: [] });
  }
}
