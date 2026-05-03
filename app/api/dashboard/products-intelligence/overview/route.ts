import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

const STORE_ID = "ef77af08-688d-4354-8096-d89f6046f0c2";

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      totalProducts: 0,
      totalVariants: 0,
      aiVisibleProducts: 0,
      aiVisibleVariants: 0,
      mostOrderedByAiProduct: null,
      topOrderedChannel: null,
      missingSkuVariants: 0,
      outOfStockVariants: 0,
      aiAssistedRevenue: null,
      productIntelligenceScore: 0,
      lastSyncTime: null,
      hasOrderData: false,
      hasChannelData: false,
    });
  }

  try {
    // Total products
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID);

    // Total variants
    const { count: totalVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID);

    // AI-visible products
    const { count: aiVisibleProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .eq("ai_visible", true);

    // AI-visible variants
    const { count: aiVisibleVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .eq("available_for_ai", true);

    // Missing SKU
    const { count: missingSkuVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .eq("code_missing", true);

    // Out of stock
    const { count: outOfStockVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .lte("inventory_quantity", 0);

    // Last sync time
    const { data: lastSync } = await supabase
      .from("products")
      .select("last_synced_at")
      .eq("store_id", STORE_ID)
      .order("last_synced_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastSyncTime = lastSync?.last_synced_at ?? null;

    // Check if order data exists
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID);

    const hasOrderData = (orderCount ?? 0) > 0;

    // Intelligence score: weighted average of AI visibility, SKU completeness, stock availability
    const tv = totalVariants ?? 0;
    const aiVis = aiVisibleVariants ?? 0;
    const missSku = missingSkuVariants ?? 0;
    const oos = outOfStockVariants ?? 0;

    let productIntelligenceScore = 0;
    if (tv > 0) {
      const aiScore = (aiVis / tv) * 40;
      const skuScore = ((tv - missSku) / tv) * 30;
      const stockScore = ((tv - oos) / tv) * 30;
      productIntelligenceScore = Math.round(aiScore + skuScore + stockScore);
    }

    return NextResponse.json({
      totalProducts: totalProducts ?? 0,
      totalVariants: totalVariants ?? 0,
      aiVisibleProducts: aiVisibleProducts ?? 0,
      aiVisibleVariants: aiVisibleVariants ?? 0,
      mostOrderedByAiProduct: null,
      topOrderedChannel: null,
      missingSkuVariants: missingSkuVariants ?? 0,
      outOfStockVariants: outOfStockVariants ?? 0,
      aiAssistedRevenue: null,
      productIntelligenceScore,
      lastSyncTime,
      hasOrderData,
      hasChannelData: false,
    });
  } catch (err) {
    console.error("products intelligence overview error", err);
    return NextResponse.json({
      totalProducts: 0,
      totalVariants: 0,
      aiVisibleProducts: 0,
      aiVisibleVariants: 0,
      mostOrderedByAiProduct: null,
      topOrderedChannel: null,
      missingSkuVariants: 0,
      outOfStockVariants: 0,
      aiAssistedRevenue: null,
      productIntelligenceScore: 0,
      lastSyncTime: null,
      hasOrderData: false,
      hasChannelData: false,
    });
  }
}
