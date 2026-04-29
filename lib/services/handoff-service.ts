import { getMockState } from "@/lib/adapters/supabase/mock-store";
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
    created_at: new Date().toISOString(),
  };

  state.handoffs.push(ticket);
  state.conversationStatus.set(input.conversation_id, "human_handoff");
  writeAuditLog({
    action: "handoff.create",
    entityType: "handoff_ticket",
    entityId: ticket.id,
    metadata: { reason: input.reason, priority: input.priority },
  });
  return ticket;
}

