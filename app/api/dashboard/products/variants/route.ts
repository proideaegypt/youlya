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
  const pageSize = Math.min(100, Math.max(10, Number(searchParams.get("pageSize") ?? "50")));
  const filter = searchParams.get("filter") ?? "all"; // all, oos, missing_sku, ai_visible, low_stock

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ variants: [], total: 0, page, pageSize });
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("product_variants")
      .select(
        "shopify_variant_id, shopify_variant_gid, product_id, shopify_product_id, sku, variant_title, size, color, price, inventory_quantity, available_for_ai, code_missing, last_synced_at, last_inventory_checked_at",
        { count: "exact" },
      )
      .eq("store_id", STORE_ID);

    if (filter === "oos") {
      query = query.lte("inventory_quantity", 0);
    } else if (filter === "missing_sku") {
      query = query.eq("code_missing", true);
    } else if (filter === "ai_visible") {
      query = query.eq("available_for_ai", true);
    } else if (filter === "low_stock") {
      query = query.gt("inventory_quantity", 0).lte("inventory_quantity", 5);
    }

    const { data: variants, error, count } = await query
      .order("inventory_quantity", { ascending: true })
      .range(from, to);

    if (error || !variants) {
      return NextResponse.json({ variants: [], total: 0, page, pageSize });
    }

    // Fetch product titles
    const productIds = [...new Set(variants.map((v) => v.shopify_product_id).filter(Boolean))];
    const { data: products } = await supabase
      .from("products")
      .select("shopify_product_id, shopify_title")
      .eq("store_id", STORE_ID)
      .in("shopify_product_id", productIds);

    const productMap = new Map<string, string>();
    for (const p of products ?? []) {
      productMap.set(p.shopify_product_id, p.shopify_title);
    }

    const enriched = variants.map((v) => {
      let hiddenReason = "";
      if (!v.available_for_ai) {
        const reasons: string[] = [];
        if (v.inventory_quantity <= 0) reasons.push("OOS");
        if (v.code_missing) reasons.push("missing SKU");
        if (!v.price || v.price <= 0) reasons.push("missing price");
        if (!v.shopify_variant_id) reasons.push("missing variant ID");
        hiddenReason = reasons.join(", ") || "inactive";
      }

      return {
        shopifyVariantId: v.shopify_variant_id,
        shopifyVariantGid: v.shopify_variant_gid,
        productTitle: productMap.get(v.shopify_product_id) || "",
        variantTitle: v.variant_title,
        size: v.size,
        color: v.color,
        sku: v.sku,
        price: v.price,
        inventoryQuantity: v.inventory_quantity,
        availableForAi: v.available_for_ai,
        codeMissing: v.code_missing,
        hiddenReason,
        lastInventoryCheckedAt: v.last_inventory_checked_at,
        lastSyncedAt: v.last_synced_at,
      };
    });

    return NextResponse.json({ variants: enriched, total: count ?? 0, page, pageSize });
  } catch (err) {
    console.error("products variants error", err);
    return NextResponse.json({ variants: [], total: 0, page, pageSize });
  }
}
