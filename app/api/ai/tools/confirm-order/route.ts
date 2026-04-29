import { NextResponse } from "next/server";
import { confirmOrderSchema } from "@/lib/validation/schemas";
import { evaluateConfirmation } from "@/lib/services/confirmation-service";

export async function POST(req: Request) {
  const parsed = confirmOrderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const result = evaluateConfirmation({
    cartId: parsed.data.cartId,
    customerMessage: parsed.data.customerMessage,
    lastBotMessageType: parsed.data.lastBotMessageType,
    customerDataReady: true,
    shippingReady: true,
  });
  return NextResponse.json(result);
}

