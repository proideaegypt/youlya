import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { createHandoffTicket } from "@/lib/services/handoff-service";

export async function getUnclearCount(conversation_id: string): Promise<number> {
  return getMockState().unclearCounts.get(conversation_id) ?? 0;
}

export async function incrementUnclearCount(
  conversation_id: string,
  context?: { store_id: string; customer_id: string; ai_summary?: string },
): Promise<number> {
  const state = getMockState();
  const next = (state.unclearCounts.get(conversation_id) ?? 0) + 1;
  state.unclearCounts.set(conversation_id, next);
  if (next >= 3 && context) {
    await createHandoffTicket({
      store_id: context.store_id,
      conversation_id,
      customer_id: context.customer_id,
      reason: "UNCLEAR_3X",
      priority: "NORMAL",
      ai_summary: context.ai_summary ?? "Auto handoff after 3 unclear turns",
    });
  }
  return next;
}

export async function resetUnclearCount(conversation_id: string): Promise<void> {
  getMockState().unclearCounts.set(conversation_id, 0);
}

