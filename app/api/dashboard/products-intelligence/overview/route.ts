import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  calculateIntelligenceScore,
  getOrderChannel,
  getOrderTotal,
  getPrimaryOrderProductKey,
  isAiCreatedOrder,
  supportedInsightChannels,
} from "@/lib/services/products-intelligence-service";

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

    const { data: orders } = await supabase
      .from("orders")
      .select("created_by, channel, source_channel, total_price, line_items_json, product_id, safety_status, created_at")
      .eq("store_id", STORE_ID)
      .order("created_at", { ascending: false })
      .limit(1000);

    const hasOrderData = (orders?.length ?? 0) > 0;

    const channelCounts = new Map<string, number>();
    let aiAssistedRevenue = 0;
    const aiProductCounts = new Map<string, number>();
    const productTitleByKey = new Map<string, string>();

    const { data: productRows } = await supabase
      .from("products")
      .select("id, shopify_product_id, shopify_title")
      .eq("store_id", STORE_ID);
    for (const row of productRows ?? []) {
      if (row.id) productTitleByKey.set(String(row.id), String(row.shopify_title ?? row.shopify_product_id ?? row.id));
      if (row.shopify_product_id) productTitleByKey.set(String(row.shopify_product_id), String(row.shopify_title ?? row.shopify_product_id));
    }

    const { data: variantRows } = await supabase
      .from("product_variants")
      .select("shopify_variant_id, shopify_product_id")
      .eq("store_id", STORE_ID);
    for (const row of variantRows ?? []) {
      if (row.shopify_variant_id && row.shopify_product_id && productTitleByKey.has(String(row.shopify_product_id))) {
        productTitleByKey.set(String(row.shopify_variant_id), productTitleByKey.get(String(row.shopify_product_id)) ?? String(row.shopify_product_id));
      }
    }

    for (const order of orders ?? []) {
      const channel = getOrderChannel(order);
      channelCounts.set(channel, (channelCounts.get(channel) ?? 0) + 1);

      if (isAiCreatedOrder(order)) {
        aiAssistedRevenue += getOrderTotal(order);
        const key = getPrimaryOrderProductKey(order);
        if (key) {
          const label = productTitleByKey.get(key) ?? key;
          aiProductCounts.set(label, (aiProductCounts.get(label) ?? 0) + 1);
        }
      }
    }

    const sortedChannels = [...channelCounts.entries()].sort((a, b) => b[1] - a[1]);
    const topOrderedChannel = sortedChannels[0]?.[0] ?? null;
    const sortedAiProducts = [...aiProductCounts.entries()].sort((a, b) => b[1] - a[1]);
    const mostOrderedByAiProduct = sortedAiProducts[0]?.[0] ?? null;
    const hasChannelData = sortedChannels.length > 0;

    const productIntelligenceScore = calculateIntelligenceScore(
      totalVariants ?? 0,
      aiVisibleVariants ?? 0,
      missingSkuVariants ?? 0,
      outOfStockVariants ?? 0
    );

    return NextResponse.json({
      totalProducts: totalProducts ?? 0,
      totalVariants: totalVariants ?? 0,
      aiVisibleProducts: aiVisibleProducts ?? 0,
      aiVisibleVariants: aiVisibleVariants ?? 0,
      mostOrderedByAiProduct,
      topOrderedChannel,
      missingSkuVariants: missingSkuVariants ?? 0,
      outOfStockVariants: outOfStockVariants ?? 0,
      aiAssistedRevenue: aiAssistedRevenue > 0 ? Math.round(aiAssistedRevenue * 100) / 100 : null,
      productIntelligenceScore,
      lastSyncTime,
      hasOrderData,
      hasChannelData,
      supportedChannels: supportedInsightChannels,
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
      supportedChannels: supportedInsightChannels,
    });
  }
}
