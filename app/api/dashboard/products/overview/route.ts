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
      aiVisibleVariants: 0,
      availableVariants: 0,
      outOfStockVariants: 0,
      missingSkuVariants: 0,
      lastSyncTime: null,
      cacheHealthScore: 0,
      aiSellableScore: 0,
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

    // AI-visible variants
    const { count: aiVisibleVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .eq("available_for_ai", true);

    // Available variants (inventory > 0)
    const { count: availableVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .gt("inventory_quantity", 0);

    // Out of stock variants
    const { count: outOfStockVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .lte("inventory_quantity", 0);

    // Missing SKU variants
    const { count: missingSkuVariants } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .eq("code_missing", true);

    // Last sync time
    const { data: lastSync } = await supabase
      .from("products")
      .select("last_synced_at")
      .eq("store_id", STORE_ID)
      .order("last_synced_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastSyncTime = lastSync?.last_synced_at ?? null;

    // Scores
    const tp = totalProducts ?? 0;
    const tv = totalVariants ?? 0;
    const av = availableVariants ?? 0;
    const aiVis = aiVisibleVariants ?? 0;
    const oos = outOfStockVariants ?? 0;
    const missSku = missingSkuVariants ?? 0;

    const cacheHealthScore = tp > 0 && tv > 0 ? Math.round(((av + aiVis) / (tv * 2)) * 100) : 0;
    const aiSellableScore = tv > 0 ? Math.round((aiVis / tv) * 100) : 0;

    return NextResponse.json({
      totalProducts: tp,
      totalVariants: tv,
      aiVisibleVariants: aiVis,
      availableVariants: av,
      outOfStockVariants: oos,
      missingSkuVariants: missSku,
      lastSyncTime,
      cacheHealthScore,
      aiSellableScore,
    });
  } catch (err) {
    console.error("products overview error", err);
    return NextResponse.json({
      totalProducts: 0,
      totalVariants: 0,
      aiVisibleVariants: 0,
      availableVariants: 0,
      outOfStockVariants: 0,
      missingSkuVariants: 0,
      lastSyncTime: null,
      cacheHealthScore: 0,
      aiSellableScore: 0,
    });
  }
}
