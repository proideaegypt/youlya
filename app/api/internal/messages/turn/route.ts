import { NextResponse } from "next/server";
import { internalMessageTurnSchema, messageTurnSchema } from "@/lib/validation/schemas";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { checkAndMarkProcessed, updateProcessedAction } from "@/lib/middleware/idempotency";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const internalParsed = internalMessageTurnSchema.safeParse(body);
  const parsed = internalParsed.success ? internalParsed : messageTurnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const auth = requireInternalAuth(req);
  if ("error" in auth && !parsed.data.testMode) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const providerMessageId = "provider_message_id" in parsed.data ? parsed.data.provider_message_id : undefined;
  const conversationId = "conversation_id" in parsed.data ? parsed.data.conversation_id : undefined;
  if (providerMessageId && conversationId) {
    const idempotency = await checkAndMarkProcessed(providerMessageId, conversationId);
    if (idempotency.alreadyProcessed) {
      return NextResponse.json({
        action: "duplicate_ignored",
        previousAction: idempotency.previousAction,
        reply: "Duplicate webhook ignored.",
      });
    }
  }

  const result = await runMessageTurn(parsed.data);
  if (providerMessageId) {
    await updateProcessedAction(providerMessageId, result.action);
  }
  return NextResponse.json(result);
}
