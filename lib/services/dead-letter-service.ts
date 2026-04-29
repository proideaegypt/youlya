import { getSupabaseServerClient } from "@/lib/supabase/server";

const ERROR_STACK_LIMIT = 2000;

export async function logFailedTurn(input: unknown, error: Error): Promise<void> {
  const stack = error.stack?.slice(0, ERROR_STACK_LIMIT) ?? null;
  const message = error.message || "Unknown turn processing error";

  console.error("dead_letter_turn_error", {
    error_message: message,
    error_stack: stack,
    raw_input: input,
  });

  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  try {
    const payload = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
    const conversationId = typeof payload.conversation_id === "string" ? payload.conversation_id : null;
    const providerMessageId = typeof payload.provider_message_id === "string" ? payload.provider_message_id : null;

    const { error: insertError } = await supabase.from("dead_letter_log").insert({
      conversation_id: conversationId,
      provider_message_id: providerMessageId,
      raw_input: payload,
      error_message: message,
      error_stack: stack,
    });
    if (insertError) console.error("dead_letter_insert_error", insertError);
  } catch (insertException) {
    console.error("dead_letter_insert_exception", insertException);
  }
}
