import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { HandoffTicket } from "@/lib/services/handoff-service";

export type HandoffNotification = {
  id: string;
  store_id: string;
  type: "handoff_created";
  title: string;
  summary: string;
  handoff_type: string;
  priority: "normal" | "high";
  conversation_id: string;
  handoff_ticket_id: string;
  status: "unread" | "pending" | "read";
  created_at: string;
};

function buildNotification(ticket: HandoffTicket): HandoffNotification {
  const priority = String(ticket.priority).toLowerCase() === "high" ? "high" : "normal";
  return {
    id: `handoff-notification-${ticket.id}`,
    store_id: ticket.store_id,
    type: "handoff_created",
    title: ticket.handoff_type === "manager_request" ? "طلب تواصل مع الإدارة" : "طلب تواصل مع خدمة العملاء",
    summary: String(ticket.problem_summary ?? ticket.ai_summary ?? "handoff created"),
    handoff_type: ticket.handoff_type ?? "customer_service",
    priority,
    conversation_id: ticket.conversation_id,
    handoff_ticket_id: ticket.id,
    status: "unread",
    created_at: new Date().toISOString(),
  };
}

export async function createHandoffNotification(ticket: HandoffTicket): Promise<HandoffNotification | null> {
  const notification = buildNotification(ticket);
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const state = getMockState();
    const idx = state.handoffNotifications.findIndex((item) => item.handoff_ticket_id === ticket.id);
    if (idx === -1) {
      state.handoffNotifications.unshift(notification);
    } else {
      state.handoffNotifications[idx] = { ...state.handoffNotifications[idx], ...notification };
    }
    return notification;
  }

  try {
    const { error } = await supabase.from("handoff_notifications").upsert(notification, { onConflict: "handoff_ticket_id" });
    if (error) console.error("handoff notification insert error", error);
    return notification;
  } catch (error) {
    console.error("handoff notification exception", error);
    return null;
  }
}

export async function getUnreadHandoffNotificationCount(storeId: string): Promise<number> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return getMockState().handoffNotifications.filter((item) => item.store_id === storeId && item.status === "unread").length;
  }

  try {
    const { count, error } = await supabase
      .from("handoff_notifications")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .eq("status", "unread");
    if (error) {
      console.error("handoff notification count error", error);
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    console.error("handoff notification count exception", error);
    return 0;
  }
}

export async function listRecentHandoffNotifications(storeId: string, limit = 10): Promise<HandoffNotification[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return getMockState().handoffNotifications.filter((item) => item.store_id === storeId).slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from("handoff_notifications")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map((row) => ({
      id: String(row.id),
      store_id: String(row.store_id),
      type: "handoff_created",
      title: String(row.title ?? ""),
      summary: String(row.summary ?? ""),
      handoff_type: String(row.handoff_type ?? "customer_service"),
      priority: String(row.priority ?? "normal") as "normal" | "high",
      conversation_id: String(row.conversation_id ?? ""),
      handoff_ticket_id: String(row.handoff_ticket_id ?? ""),
      status: String(row.status ?? "unread") as "unread" | "pending" | "read",
      created_at: String(row.created_at ?? new Date().toISOString()),
    }));
  } catch (error) {
    console.error("handoff notification list exception", error);
    return [];
  }
}
