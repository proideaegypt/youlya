import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type CheckResult = {
  alreadyProcessed: boolean;
  previousAction?: string;
};

function checkMockProcessed(provider_message_id: string): CheckResult {
  const existing = getMockState().processedMessages.get(provider_message_id);
  if (existing) return { alreadyProcessed: true, previousAction: existing.resultAction };
  return { alreadyProcessed: false };
}

function markMockProcessed(provider_message_id: string, conversation_id: string) {
  getMockState().processedMessages.set(provider_message_id, {
    conversationId: conversation_id,
    processedAt: new Date().toISOString(),
  });
}

export async function checkAndMarkProcessed(provider_message_id: string, conversation_id: string): Promise<CheckResult> {
  const mockResult = checkMockProcessed(provider_message_id);
  if (mockResult.alreadyProcessed) return mockResult;

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    markMockProcessed(provider_message_id, conversation_id);
    return { alreadyProcessed: false };
  }

  try {
    const { data: existing, error: selectError } = await supabase
      .from("processed_messages")
      .select("provider_message_id,result_action")
      .eq("provider_message_id", provider_message_id)
      .maybeSingle();

    if (selectError) {
      console.error("idempotency select error", selectError);
      markMockProcessed(provider_message_id, conversation_id);
      return { alreadyProcessed: false };
    }

    if (existing?.provider_message_id) {
      return { alreadyProcessed: true, previousAction: existing.result_action ?? undefined };
    }

    const { error: insertError } = await supabase.from("processed_messages").insert({
      provider_message_id,
      conversation_id,
      processed_at: new Date().toISOString(),
    });
    if (insertError) {
      console.error("idempotency insert error", insertError);
      markMockProcessed(provider_message_id, conversation_id);
      return { alreadyProcessed: false };
    }

    markMockProcessed(provider_message_id, conversation_id);
    return { alreadyProcessed: false };
  } catch (error) {
    console.error("idempotency checkAndMarkProcessed exception", error);
    markMockProcessed(provider_message_id, conversation_id);
    return { alreadyProcessed: false };
  }
}

export async function updateProcessedAction(provider_message_id: string, result_action: string): Promise<void> {
  const entry = getMockState().processedMessages.get(provider_message_id);
  if (entry) {
    entry.resultAction = result_action;
    getMockState().processedMessages.set(provider_message_id, entry);
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from("processed_messages")
      .update({ result_action })
      .eq("provider_message_id", provider_message_id);
    if (error) console.error("idempotency update action error", error);
  } catch (error) {
    console.error("idempotency updateProcessedAction exception", error);
  }
}
