#!/usr/bin/env tsx
import { createClient } from "@supabase/supabase-js";
import { returnToAI } from "../lib/services/handoff-service";

const args = process.argv.slice(2);
const conversationIdArg = getArg("--conversation-id");
const customerIdArg = getArg("--customer-id");
const confirmed = args.includes("--confirm");

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function maskId(id: string): string {
  if (!id) return "";
  if (id.length <= 8) return `${id.slice(0, 2)}****`;
  return `${id.slice(0, 3)}****${id.slice(-3)}`;
}

async function main() {
  if (!conversationIdArg && !customerIdArg) {
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

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  let conversationId = conversationIdArg ?? "";
  if (!conversationId && customerIdArg) {
    const { data, error } = await supabase
      .from("conversation_state")
      .select("conversation_id")
      .eq("customer_id", customerIdArg)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.conversation_id) {
      console.error(`Conversation not found for customer: ${maskId(customerIdArg)}`);
      process.exit(1);
    }
    conversationId = String(data.conversation_id);
  }

  if (!conversationId) {
    console.error("Could not resolve conversation id");
    process.exit(1);
  }

  const beforeStateRes = await supabase
    .from("conversation_state")
    .select("ai_paused,status")
    .eq("conversation_id", conversationId)
    .maybeSingle();

  const beforeTicketsRes = await supabase
    .from("handoff_tickets")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .not("status", "in", "(resolved,returned_to_ai)");

  console.log("Target:");
  console.log(`  conversation_id: ${maskId(conversationId)}`);
  if (customerIdArg) console.log(`  customer_id: ${maskId(customerIdArg)}`);
  console.log("Before:");
  console.log(`  ai_paused: ${String(beforeStateRes.data?.ai_paused ?? "unknown")}`);
  console.log(`  status: ${String(beforeStateRes.data?.status ?? "unknown")}`);
  console.log(`  open_handoff_count: ${beforeTicketsRes.count ?? 0}`);

  if (!confirmed) {
    console.log("\nDRY RUN — no changes made. Add --confirm to mutate.");
    return;
  }

  const ok = await returnToAI(conversationId, "admin_script");
  if (!ok) {
    console.error("FAIL — returnToAI returned false");
    process.exit(1);
  }

  const afterStateRes = await supabase
    .from("conversation_state")
    .select("ai_paused,status")
    .eq("conversation_id", conversationId)
    .maybeSingle();

  const afterTicketsRes = await supabase
    .from("handoff_tickets")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .not("status", "in", "(resolved,returned_to_ai)");

  console.log("After:");
  console.log(`  ai_paused: ${String(afterStateRes.data?.ai_paused ?? "unknown")}`);
  console.log(`  status: ${String(afterStateRes.data?.status ?? "unknown")}`);
  console.log(`  open_handoff_count: ${afterTicketsRes.count ?? 0}`);

  if (afterStateRes.data?.ai_paused !== false) {
    console.error("FAIL — verification failed: ai_paused is not false");
    process.exit(1);
  }

  console.log("PASS — conversation returned to AI.");
}

main().catch((error) => {
  console.error("Script failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
