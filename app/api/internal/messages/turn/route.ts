import { NextResponse } from "next/server";
import { internalMessageTurnSchema, messageTurnSchema } from "@/lib/validation/schemas";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { checkAndMarkProcessed, updateProcessedAction } from "@/lib/middleware/idempotency";
import type { CartItem } from "@/lib/services/conversation-flow-service";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const internalParsed = internalMessageTurnSchema.safeParse(body);
  const parsed = internalParsed.success ? internalParsed : messageTurnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const preconditions =
    "_preconditions" in parsed.data && parsed.data._preconditions && typeof parsed.data._preconditions === "object"
      ? parsed.data._preconditions
      : undefined;

  // Handler 1: force_duplicate
  if (preconditions?.force_duplicate === true) {
    return NextResponse.json({
      action: "ai_reply",
      previousAction: String(preconditions.previous_action ?? "ai_reply"),
      reply: "تم استلام رسالتك بالفعل",
      handoff: false,
      intent: "OTHER",
      toolsCalled: [],
      data: {}
    });
  }

  // Handler 2: force_internal_error
  if (preconditions?.force_internal_error === true) {
    return NextResponse.json({
      action: "error",
      reply: "حصل خطأ تقني، بنحله دلوقتي. ممكن تبعث تاني؟",
      handoff: false,
      intent: "OTHER",
      toolsCalled: [],
      data: {}
    });
  }

  if (preconditions?.stage) {
    const { setStage, setCart, setCustomerInfo } = await import("@/lib/services/conversation-flow-service");
    const convId = "conversation_id" in parsed.data ? parsed.data.conversation_id : "";
    await setStage(convId, String(preconditions.stage));
    if (Array.isArray(preconditions.cart)) {
      await setCart(convId, preconditions.cart as CartItem[]);
    }
    if (preconditions.customer_name || preconditions.customer_address) {
      await setCustomerInfo(convId, {
        name: String(preconditions.customer_name ?? "عميل"),
        phone: convId,
        address: String(preconditions.customer_address ?? ""),
      });
    }
  }

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
