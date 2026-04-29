import { NextResponse } from "next/server";
import { productSearchSchema } from "@/lib/validation/schemas";
import { searchProducts } from "@/lib/services/product-search-service";
import { persistRecommendations } from "@/lib/services/product-mapping-service";

export async function POST(req: Request) {
  const parsed = productSearchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const result = await searchProducts(parsed.data);
  await persistRecommendations(parsed.data.storeSlug, parsed.data.conversationId, parsed.data.customerId, result.recommendations);
  return NextResponse.json(result);
}
