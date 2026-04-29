import { NextResponse } from "next/server";
import { shippingSchema } from "@/lib/validation/schemas";
import { calculateShipping } from "@/lib/services/shipping-service";

export async function POST(req: Request) {
  const parsed = shippingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    return NextResponse.json(calculateShipping(parsed.data.cartId, parsed.data.city));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

