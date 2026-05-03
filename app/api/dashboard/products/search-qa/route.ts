import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { searchProducts } from "@/lib/services/product-search-service";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const query = typeof body.query === "string" ? body.query : "بيجامة";
  const limit = Math.min(20, Math.max(1, Number(body.limit) || 10));

  try {
    const result = await searchProducts({
      storeSlug: "youlya",
      conversationId: "dashboard-search-qa",
      customerId: "dashboard-user",
      query,
      limit,
      testMode: true,
    });

    const safeRecommendations = result.recommendations.map((r) => ({
      index: r.index,
      productId: r.productId,
      shopifyProductId: r.shopifyProductId,
      shopifyProductTitle: r.shopifyProductTitle,
      shopifyHandle: r.shopifyHandle,
      imageUrl: r.imageUrl,
      variantOptions: r.variantOptions.map((v) => ({
        shopifyVariantId: v.shopifyVariantId,
        sku: v.sku,
        codeMissing: v.codeMissing,
        title: v.title,
        size: v.size,
        color: v.color,
        price: v.price,
        currency: v.currency,
        inventoryQuantity: v.inventoryQuantity,
        available: v.available,
      })),
    }));

    return NextResponse.json({
      query,
      limit,
      recommendations: safeRecommendations,
      count: safeRecommendations.length,
      mappingPersisted: result.mappingPersisted,
    });
  } catch (err) {
    console.error("search qa error", err);
    return NextResponse.json({ query, limit, recommendations: [], count: 0, mappingPersisted: false });
  }
}
