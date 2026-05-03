import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

    const variantMap = new Map<string, { total: number; available: number; aiVisible: number; missingSku: number; oos: number }>();
    for (const v of variants ?? []) {
      const pid = v.shopify_product_id;
      if (!variantMap.has(pid)) {
        variantMap.set(pid, { total: 0, available: 0, aiVisible: 0, missingSku: 0, oos: 0 });
      }
      const entry = variantMap.get(pid)!;
      entry.total += 1;
      if (v.inventory_quantity > 0) entry.available += 1;
      if (v.available_for_ai) entry.aiVisible += 1;
      if (v.code_missing) entry.missingSku += 1;
      if (v.inventory_quantity <= 0) entry.oos += 1;
    }

    // Determine notes based on metrics
    const enriched = products.map((p) => {
      const counts = variantMap.get(p.shopify_product_id) || { total: 0, available: 0, aiVisible: 0, missingSku: 0, oos: 0 };
      const notes: string[] = [];
      if (counts.aiVisible === 0) notes.push("غير مرئي للذكاء الاصطناعي");
      else if (counts.aiVisible > 0 && counts.aiVisible < counts.total) notes.push("بعض المتغيرات غير مرئية للذكاء الاصطناعي");
      if (counts.missingSku > 0) notes.push("SKU مفقود في " + counts.missingSku + " متغير");
      if (counts.oos > 0 && counts.oos === counts.total) notes.push("كل المتغيرات نفذت من المخزون");
      else if (counts.oos > 0) notes.push("متغيرات نفذت من المخزون: " + counts.oos);
      if (counts.aiVisible > 0 && counts.oos === 0 && counts.missingSku === 0) notes.push("جاهز للبيع بالذكاء الاصطناعي");

      const badges: string[] = [];
      if (counts.aiVisible > 0 && counts.oos === 0 && counts.missingSku === 0) badges.push("ai_ready");
      if (counts.missingSku > 0) badges.push("missing_sku");
      if (counts.oos > 0) badges.push("oos");
      if (counts.available > 0 && counts.available <= 3) badges.push("low_stock");
      if (!p.ai_visible) badges.push("hidden_from_ai");

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
        aiOrdersCount: 0,
        totalOrdersCount: 0,
        topChannel: null as string | null,
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
