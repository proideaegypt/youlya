import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/services/audit-log-service";

export type HandoffReason =
  | "UNCLEAR_3X"
  | "ANGRY_TONE"
  | "COMPLAINT_POST_DELIVERY"
  | "PAYMENT_ISSUE"
  | "SHIPPING_ISSUE"
  | "API_FAILURE"
  | "KILL_SWITCH";

export type HandoffPriority = "HIGH" | "NORMAL";

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
  status: "open";
  ai_summary: string;
  created_at: string;
};

export async function createHandoffTicket(input: HandoffInput): Promise<HandoffTicket> {
  const state = getMockState();
  const now = new Date().toISOString();
  const existing = state.handoffs.find(
    (ticket) =>
      ticket.store_id === input.store_id &&
      ticket.conversation_id === input.conversation_id &&
      ticket.status === "open",
  ) as HandoffTicket | undefined;

  if (existing) {
    const updated: HandoffTicket = {
      ...existing,
      reason: input.reason,
      priority: input.priority,
      ai_summary: input.ai_summary,
    };
    const idx = state.handoffs.findIndex((ticket) => ticket.id === updated.id);
    state.handoffs[idx] = updated;
    state.conversationStatus.set(input.conversation_id, "human_handoff");
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
    ai_summary: input.ai_summary,
    created_at: now,
  };

  state.handoffs.push(ticket);
  state.conversationStatus.set(input.conversation_id, "human_handoff");
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
