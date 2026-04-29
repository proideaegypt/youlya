import { NextResponse } from "next/server";
import { selectProductSchema } from "@/lib/validation/schemas";
import { selectProduct } from "@/lib/services/select-product-service";

export async function POST(req: Request) {
  const parsed = selectProductSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(await selectProduct(parsed.data));
}
