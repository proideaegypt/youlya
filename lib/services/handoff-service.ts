import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/services/audit-log-service";
import { setAIPaused } from "@/lib/services/conversation-flow-service";

export type HandoffReason =
  | "UNCLEAR_3X"
  | "ANGRY_TONE"
  | "COMPLAINT_POST_DELIVERY"
  | "PAYMENT_ISSUE"
  | "SHIPPING_ISSUE"
  | "API_FAILURE"
  | "KILL_SWITCH"
  | "CUSTOMER_REQUEST";

export type HandoffPriority = "HIGH" | "NORMAL";
export type HandoffStatus = "open" | "assigned" | "resolved";

export type HandoffInput = {
  store_id: string;
  conversation_id: string;
  customer_id: string;
  reason: HandoffReason;
  priority: HandoffPriority;
  ai_summary: string;
};

export type HandoffTicket = {
  id: string;
  store_id: string;
  conversation_id: string;
  customer_id: string;
  reason: HandoffReason;
  priority: HandoffPriority;
  status: HandoffStatus;
  assigned_to?: string | null;
  ai_summary: string;
  notes?: string | null;
  created_at: string;
  resolved_at?: string | null;
};

export async function pauseAIForConversation(conversationId: string): Promise<void> {
  await setAIPaused(conversationId, true);
}

export async function createHandoffTicket(input: HandoffInput): Promise<HandoffTicket> {
  const state = getMockState();
  const now = new Date().toISOString();
  const existing = state.handoffs.find(
    (ticket) =>
      (ticket as HandoffTicket).store_id === input.store_id &&
      (ticket as HandoffTicket).conversation_id === input.conversation_id &&
      (ticket as HandoffTicket).status !== "resolved",
  ) as HandoffTicket | undefined;

  if (existing) {
    const updated: HandoffTicket = {
      ...existing,
      reason: input.reason,
      priority: input.priority,
      ai_summary: input.ai_summary,
      status: existing.status === "resolved" ? "open" : existing.status,
    };
    const idx = state.handoffs.findIndex((ticket) => (ticket as HandoffTicket).id === updated.id);
    state.handoffs[idx] = updated as Record<string, unknown>;
    state.conversationStatus.set(input.conversation_id, "human_handoff");
    state.aiPausedConversations.add(input.conversation_id);
    await setAIPaused(input.conversation_id, true);
    writeAuditLog({
      action: "handoff.upsert",
      entityType: "handoff_ticket",
      entityId: updated.id,
      metadata: { reason: input.reason, priority: input.priority },
    });
    await persistHumanHandoff({
      store_id: input.store_id,
      customer_id: input.customer_id,
      conversation_id: input.conversation_id,
      reason: input.reason,
      requested_at: now,
      notes: input.ai_summary,
    });
    return updated;
  }

  const ticket: HandoffTicket = {
    id: `handoff-${Date.now()}`,
    store_id: input.store_id,
    conversation_id: input.conversation_id,
    customer_id: input.customer_id,
    reason: input.reason,
    priority: input.priority,
    status: "open",
    assigned_to: null,
    ai_summary: input.ai_summary,
    notes: null,
    created_at: now,
    resolved_at: null,
  };

  state.handoffs.push(ticket as Record<string, unknown>);
  state.conversationStatus.set(input.conversation_id, "human_handoff");
  state.aiPausedConversations.add(input.conversation_id);
  await setAIPaused(input.conversation_id, true);
  writeAuditLog({
    action: "handoff.create",
    entityType: "handoff_ticket",
    entityId: ticket.id,
    metadata: { reason: input.reason, priority: input.priority },
  });
  await persistHumanHandoff({
    store_id: input.store_id,
    customer_id: input.customer_id,
    conversation_id: input.conversation_id,
    reason: input.reason,
    requested_at: now,
    notes: input.ai_summary,
  });
  return ticket;
}

export async function assignHandoff(
  ticketId: string,
  assignedTo: string,
): Promise<HandoffTicket | null> {
  const state = getMockState();
  const idx = state.handoffs.findIndex((t) => (t as HandoffTicket).id === ticketId);
  if (idx === -1) return null;

  const ticket = { ...(state.handoffs[idx] as HandoffTicket), status: "assigned" as HandoffStatus, assigned_to: assignedTo };
  state.handoffs[idx] = ticket as Record<string, unknown>;
  await updateHandoffInDb(ticketId, { status: "assigned", assigned_to: assignedTo });
  writeAuditLog({ action: "handoff.assign", entityType: "handoff_ticket", entityId: ticketId, metadata: { assigned_to: assignedTo } });
  return ticket;
}

export async function resolveHandoff(ticketId: string, resolvedBy: string): Promise<HandoffTicket | null> {
  const state = getMockState();
  const idx = state.handoffs.findIndex((t) => (t as HandoffTicket).id === ticketId);
  if (idx === -1) return null;

  const ticket = { ...(state.handoffs[idx] as HandoffTicket), status: "resolved" as HandoffStatus, resolved_at: new Date().toISOString() };
  state.handoffs[idx] = ticket as Record<string, unknown>;
  state.aiPausedConversations.delete(ticket.conversation_id);
  await setAIPaused(ticket.conversation_id, false);
  await updateHandoffInDb(ticketId, { status: "resolved", resolved_at: ticket.resolved_at, resolved_by: resolvedBy });
  writeAuditLog({ action: "handoff.resolve", entityType: "handoff_ticket", entityId: ticketId, metadata: { resolved_by: resolvedBy } });
  return ticket;
}

export async function returnToAI(conversationId: string, actor: string): Promise<boolean> {
  const state = getMockState();
  state.aiPausedConversations.delete(conversationId);
  await setAIPaused(conversationId, false);
  state.conversationStatus.set(conversationId, "ai_active");

  const idx = state.handoffs.findIndex(
    (t) => (t as HandoffTicket).conversation_id === conversationId && (t as HandoffTicket).status !== "resolved",
  );
  if (idx !== -1) {
    const ticket = { ...(state.handoffs[idx] as HandoffTicket), status: "resolved" as HandoffStatus, resolved_at: new Date().toISOString() };
    state.handoffs[idx] = ticket as Record<string, unknown>;
    await updateHandoffInDb(ticket.id, { status: "resolved", resolved_at: ticket.resolved_at, resolved_by: actor });
  }

  writeAuditLog({ action: "handoff.return_to_ai", entityType: "conversation", entityId: conversationId, metadata: { actor } });
  return true;
}

export async function addNoteToHandoff(ticketId: string, note: string): Promise<HandoffTicket | null> {
  const state = getMockState();
  const idx = state.handoffs.findIndex((t) => (t as HandoffTicket).id === ticketId);
  if (idx === -1) return null;

  const existingNotes = (state.handoffs[idx] as HandoffTicket).notes ?? "";
  const newNotes = existingNotes ? `${existingNotes}\n---\n${note}` : note;
  const ticket = { ...(state.handoffs[idx] as HandoffTicket), notes: newNotes };
  state.handoffs[idx] = ticket as Record<string, unknown>;
  await updateHandoffInDb(ticketId, { notes: newNotes });
  return ticket;
}

export async function isAIPausedForConversation(conversationId: string): Promise<boolean> {
  const state = getMockState();
  if (state.aiPausedConversations.has(conversationId)) return true;

  const supabase = getSupabaseServerClient();
  if (!supabase) return false;
  try {
    const { data } = await supabase.from("conversation_state").select("ai_paused").eq("conversation_id", conversationId).maybeSingle();
    return data?.ai_paused === true;
  } catch {
    return false;
  }
}

export async function getOpenHandoffs(storeId?: string): Promise<HandoffTicket[]> {
  const state = getMockState();
  const mockTickets = state.handoffs
    .map((t) => t as HandoffTicket)
    .filter((t) => t.status !== "resolved" && (!storeId || t.store_id === storeId));

  const supabase = getSupabaseServerClient();
  if (!supabase) return mockTickets;

  try {
    const { data, error } = await supabase
      .from("handoff_tickets")
      .select("id,store_id,conversation_id,customer_id,reason,priority,status,assigned_user_id,ai_summary,notes,created_at,closed_at")
      .neq("status", "resolved")
      .order("created_at", { ascending: false });

    if (error || !data) return mockTickets;
    return data.map((row) => ({
      id: String(row.id),
      store_id: String(row.store_id),
      conversation_id: String(row.conversation_id),
      customer_id: String(row.customer_id ?? ""),
      reason: String(row.reason) as HandoffReason,
      priority: String(row.priority) as HandoffPriority,
      status: String(row.status) as HandoffStatus,
      assigned_to: row.assigned_user_id ? String(row.assigned_user_id) : null,
      ai_summary: String(row.ai_summary ?? ""),
      notes: row.notes ? String(row.notes) : null,
      created_at: String(row.created_at),
      resolved_at: row.closed_at ? String(row.closed_at) : null,
    }));
  } catch {
    return mockTickets;
  }
}

async function persistHumanHandoff(input: {
  store_id?: string;
  customer_id?: string;
  conversation_id: string;
  reason: string;
  requested_at: string;
  notes: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    getMockState().humanHandoffs.push({
      id: `hh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      conversation_id: input.conversation_id,
      reason: input.reason,
      requested_at: input.requested_at,
      resolved_at: null,
      resolved_by: null,
      notes: input.notes,
    });
    return;
  }

  try {
    const { error: handoffTicketError } = await supabase.from("handoff_tickets").insert({
      store_id: input.store_id ?? "youlya",
      conversation_id: input.conversation_id,
      customer_id: input.customer_id ?? null,
      reason: input.reason,
      priority: "NORMAL",
      status: "open",
      ai_summary: input.notes,
      created_at: input.requested_at,
      updated_at: input.requested_at,
    });
    if (handoffTicketError) console.error("handoff_tickets insert error", handoffTicketError);

    const { error } = await supabase.from("human_handoffs").insert({
      conversation_id: input.conversation_id,
      reason: input.reason,
      requested_at: input.requested_at,
      notes: input.notes,
    });
    if (error) console.error("human_handoffs insert error", error);
  } catch (error) {
    console.error("human_handoffs insert exception", error);
  }
}

async function updateHandoffInDb(
  ticketId: string,
  updates: Record<string, unknown>,
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.from("handoff_tickets").update(updates).eq("id", ticketId);
    if (error) console.error("updateHandoffInDb error", error);
  } catch (error) {
    console.error("updateHandoffInDb exception", error);
  }
}
