import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  computeVariantAggregates,
  getOrderChannel,
  getPrimaryOrderProductKey,
  isAiCreatedOrder,
  generateProductNotes,
  generateProductBadges,
} from "@/lib/services/products-intelligence-service";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

const STORE_ID = "ef77af08-688d-4354-8096-d89f6046f0c2";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(24, Math.max(12, Number(searchParams.get("pageSize") ?? "16")));

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ products: [], total: 0, page, pageSize });
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: products, error, count } = await supabase
      .from("products")
      .select(
        "shopify_product_id, shopify_title, shopify_handle, product_type, vendor, image_url, status, ai_visible, last_synced_at",
        { count: "exact" },
      )
      .eq("store_id", STORE_ID)
      .order("shopify_title", { ascending: true })
      .range(from, to);

    if (error || !products) {
      return NextResponse.json({ products: [], total: 0, page, pageSize });
    }

    // Fetch variant aggregates per product
    const productIds = products.map((p) => p.shopify_product_id);
    const { data: variants } = await supabase
      .from("product_variants")
      .select("shopify_product_id, inventory_quantity, available_for_ai, code_missing")
      .eq("store_id", STORE_ID)
      .in("shopify_product_id", productIds);

    const variantMap = new Map<string, ReturnType<typeof computeVariantAggregates>>();
    for (const v of variants ?? []) {
      const pid = v.shopify_product_id;
      if (!variantMap.has(pid)) {
        variantMap.set(pid, { total: 0, available: 0, aiVisible: 0, missingSku: 0, oos: 0 });
      }
      const entry = variantMap.get(pid)!;
      entry.total += 1;
      if ((v.inventory_quantity ?? 0) > 0) entry.available += 1;
      if (v.available_for_ai) entry.aiVisible += 1;
      if (v.code_missing) entry.missingSku += 1;
      if ((v.inventory_quantity ?? 0) <= 0) entry.oos += 1;
    }

    const { data: orderRows } = await supabase
      .from("orders")
      .select("created_by, channel, source_channel, total_price, line_items_json, product_id, created_at")
      .eq("store_id", STORE_ID)
      .order("created_at", { ascending: false })
      .limit(1000);

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

    const productOrderCounts = new Map<string, number>();
    const aiProductOrderCounts = new Map<string, number>();
    const productChannelCounts = new Map<string, Map<string, number>>();

    for (const order of orderRows ?? []) {
      const channel = getOrderChannel(order);
      const key = getPrimaryOrderProductKey(order);
      if (!key) continue;
      const label = productTitleByKey.get(key) ?? key;
      productOrderCounts.set(label, (productOrderCounts.get(label) ?? 0) + 1);
      if (!productChannelCounts.has(label)) productChannelCounts.set(label, new Map<string, number>());
      const channelMap = productChannelCounts.get(label)!;
      channelMap.set(channel, (channelMap.get(channel) ?? 0) + 1);
      if (isAiCreatedOrder(order)) {
        aiProductOrderCounts.set(label, (aiProductOrderCounts.get(label) ?? 0) + 1);
      }
    }

    const enriched = products.map((p) => {
      const counts = variantMap.get(p.shopify_product_id) ?? { total: 0, available: 0, aiVisible: 0, missingSku: 0, oos: 0 };
      const notes = generateProductNotes(counts);
      const badges = generateProductBadges(p.ai_visible ?? true, counts);
      const aiOrdersCount = aiProductOrderCounts.get(p.shopify_title) ?? aiProductOrderCounts.get(p.shopify_product_id) ?? 0;
      const totalOrdersCount = productOrderCounts.get(p.shopify_title) ?? productOrderCounts.get(p.shopify_product_id) ?? 0;
      const channelMap = productChannelCounts.get(p.shopify_title) ?? productChannelCounts.get(p.shopify_product_id);
      const topChannel = channelMap ? [...channelMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null : null;

      return {
        shopifyProductId: p.shopify_product_id,
        title: p.shopify_title,
        handle: p.shopify_handle,
        productType: p.product_type,
        vendor: p.vendor,
        imageUrl: p.image_url,
        status: p.status,
        aiVisible: p.ai_visible,
        totalVariants: counts.total,
        availableVariants: counts.available,
        aiVisibleVariants: counts.aiVisible,
        missingSkuVariants: counts.missingSku,
        outOfStockVariants: counts.oos,
        aiOrdersCount,
        totalOrdersCount,
        topChannel,
        lastSyncedAt: p.last_synced_at,
        notes,
        badges,
      };
    });

    return NextResponse.json({ products: enriched, total: count ?? 0, page, pageSize });
  } catch (err) {
    console.error("products intelligence products error", err);
    return NextResponse.json({ products: [], total: 0, page, pageSize });
  }
}
