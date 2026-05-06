#!/usr/bin/env node
/**
 * Safe diagnostic script to unpause a stuck conversation.
 * Requires explicit --conversation-id or --customer-id.
 * Never runs without --confirm.
 */

import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const conversationId = getArg("--conversation-id");
const customerId = getArg("--customer-id");
const confirmed = args.includes("--confirm");

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function maskId(id: string): string {
  if (id.length <= 8) return id;
  return id.slice(0, 4) + "****" + id.slice(-4);
}

async function main() {
  if (!conversationId && !customerId) {
    console.error("Usage: node scripts/fix-stuck-handoff.mjs --conversation-id <id> [--confirm]");
    console.error("   or: node scripts/fix-stuck-handoff.mjs --customer-id <id> [--confirm]");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL env vars");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  let targetConversationId = conversationId;

  if (!targetConversationId && customerId) {
    const { data, error } = await supabase
      .from("conversation_state")
      .select("conversation_id")
      .eq("customer_id", customerId)
      .maybeSingle();
    if (error || !data) {
      console.error("Conversation not found for customer:", maskId(customerId));
      process.exit(1);
    }
    targetConversationId = data.conversation_id;
  }

  if (!targetConversationId) {
    console.error("Could not resolve conversation id");
    process.exit(1);
  }

  // Read current state
  const { data: state } = await supabase
    .from("conversation_state")
    .select("ai_paused, status, conversation_id")
    .eq("conversation_id", targetConversationId)
    .maybeSingle();

  const { count: openTicketCount } = await supabase
    .from("handoff_tickets")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", targetConversationId)
    .neq("status", "resolved");

  console.log("Current state:");
  console.log("  conversation_id:", maskId(targetConversationId));
  console.log("  ai_paused:", state?.ai_paused ?? "unknown");
  console.log("  status:", state?.status ?? "unknown");
  console.log("  open handoff tickets:", openTicketCount ?? 0);

  if (!confirmed) {
    console.log("\nDRY RUN — no changes made.");
    console.log("Add --confirm to mutate.");
    process.exit(0);
  }

  // Apply fix
  const { error: updateError } = await supabase
    .from("conversation_state")
    .update({ ai_paused: false, status: "ai_active", updated_at: new Date().toISOString() })
    .eq("conversation_id", targetConversationId);

  if (updateError) {
    console.error("FAIL — could not update conversation_state:", updateError.message);
    process.exit(1);
  }

  // Resolve open handoff tickets
  const { error: ticketError } = await supabase
    .from("handoff_tickets")
    .update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: "admin_script" })
    .eq("conversation_id", targetConversationId)
    .neq("status", "resolved");

  if (ticketError) {
    console.error("WARN — could not resolve handoff tickets:", ticketError.message);
  }

  // Verify
  const { data: verify } = await supabase
    .from("conversation_state")
    .select("ai_paused, status")
    .eq("conversation_id", targetConversationId)
    .maybeSingle();

  if (verify?.ai_paused === false) {
    console.log("\nPASS — conversation returned to AI successfully.");
    console.log("  new status:", verify.status);
  } else {
    console.error("\nFAIL — ai_paused is still true after update.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Script failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
