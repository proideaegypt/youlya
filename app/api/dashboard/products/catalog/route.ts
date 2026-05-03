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
  const pageSize = Math.min(50, Math.max(10, Number(searchParams.get("pageSize") ?? "20")));

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
        "shopify_product_id, shopify_product_gid, shopify_title, shopify_handle, status, product_type, vendor, image_url, ai_visible, last_synced_at",
        { count: "exact" },
      )
      .eq("store_id", STORE_ID)
      .order("shopify_title", { ascending: true })
      .range(from, to);

    if (error || !products) {
      return NextResponse.json({ products: [], total: 0, page, pageSize });
    }

    // Fetch variant counts per product
    const productIds = products.map((p) => p.shopify_product_id);
    const { data: variants } = await supabase
      .from("product_variants")
      .select("shopify_product_id, inventory_quantity, available_for_ai, code_missing")
      .eq("store_id", STORE_ID)
      .in("shopify_product_id", productIds);

    const variantMap = new Map<string, { total: number; available: number; aiVisible: number; missingSku: number }>();
    for (const v of variants ?? []) {
      const pid = v.shopify_product_id;
      if (!variantMap.has(pid)) {
        variantMap.set(pid, { total: 0, available: 0, aiVisible: 0, missingSku: 0 });
      }
      const entry = variantMap.get(pid)!;
      entry.total += 1;
      if (v.inventory_quantity > 0) entry.available += 1;
      if (v.available_for_ai) entry.aiVisible += 1;
      if (v.code_missing) entry.missingSku += 1;
    }

    const enriched = products.map((p) => {
      const counts = variantMap.get(p.shopify_product_id) || { total: 0, available: 0, aiVisible: 0, missingSku: 0 };
      return {
        shopifyProductId: p.shopify_product_id,
        shopifyProductGid: p.shopify_product_gid,
        title: p.shopify_title,
        handle: p.shopify_handle,
        status: p.status,
        productType: p.product_type,
        vendor: p.vendor,
        imageUrl: p.image_url,
        aiVisible: p.ai_visible,
        totalVariants: counts.total,
        availableVariants: counts.available,
        aiVisibleVariants: counts.aiVisible,
        missingSkuCount: counts.missingSku,
        lastSyncedAt: p.last_synced_at,
      };
    });

    return NextResponse.json({ products: enriched, total: count ?? 0, page, pageSize });
  } catch (err) {
    console.error("products catalog error", err);
    return NextResponse.json({ products: [], total: 0, page, pageSize });
  }
}
