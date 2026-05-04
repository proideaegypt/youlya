import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateAiVisibilityReasons, normalizeChannel } from "@/lib/services/products-intelligence-service";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

const STORE_ID = "ef77af08-688d-4354-8096-d89f6046f0c2";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ product: null, variants: [], orderSummary: null });
  }

  try {
    // Product
    const { data: product } = await supabase
      .from("products")
      .select("shopify_product_id, shopify_product_gid, shopify_title, shopify_handle, product_type, vendor, image_url, status, ai_visible, last_synced_at")
      .eq("store_id", STORE_ID)
      .eq("shopify_product_id", id)
      .maybeSingle();

    if (!product) {
      return NextResponse.json({ product: null, variants: [], orderSummary: null }, { status: 404 });
    }

    // Variants
    const { data: variants } = await supabase
      .from("product_variants")
      .select("shopify_variant_id, shopify_variant_gid, sku, variant_title, size, color, price, inventory_quantity, available_for_ai, code_missing, last_synced_at")
      .eq("store_id", STORE_ID)
      .eq("shopify_product_id", id)
      .order("price", { ascending: true });

    const enrichedVariants = (variants ?? []).map((v) => ({
      shopifyVariantId: v.shopify_variant_id,
      shopifyVariantGid: v.shopify_variant_gid,
      title: v.variant_title,
      size: v.size,
      color: v.color,
      sku: v.sku,
      price: v.price,
      inventoryQuantity: v.inventory_quantity,
      availableForAi: v.available_for_ai,
      codeMissing: v.code_missing,
      aiVisibilityReasons: generateAiVisibilityReasons({
        inventory_quantity: v.inventory_quantity,
        code_missing: v.code_missing,
        price: v.price,
        shopify_variant_id: v.shopify_variant_id,
        available_for_ai: v.available_for_ai,
      }),
      lastSyncedAt: v.last_synced_at,
    }));

    // Order summary if orders exist
    let orderSummary = null;
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID);

    if ((orderCount ?? 0) > 0) {
      const { data: productOrders } = await supabase
        .from("orders")
        .select("total_price, source_channel, created_at")
        .eq("store_id", STORE_ID)
        .eq("product_id", id)
        .limit(100);

      const totalRevenue = (productOrders ?? []).reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
      const channelCounts = new Map<string, number>();
      for (const o of productOrders ?? []) {
        const ch = normalizeChannel(o.source_channel);
        channelCounts.set(ch, (channelCounts.get(ch) ?? 0) + 1);
      }
      const channelSplit = Array.from(channelCounts.entries()).map(([channel, count]) => ({ channel, count }));

      orderSummary = {
        totalOrders: productOrders?.length ?? 0,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        channelSplit,
        lastOrderDate: productOrders && productOrders.length > 0
          ? productOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : null,
      };
    }

    return NextResponse.json({
      product: {
        shopifyProductId: product.shopify_product_id,
        shopifyProductGid: product.shopify_product_gid,
        title: product.shopify_title,
        handle: product.shopify_handle,
        productType: product.product_type,
        vendor: product.vendor,
        imageUrl: product.image_url,
        status: product.status,
        aiVisible: product.ai_visible,
        lastSyncedAt: product.last_synced_at,
      },
      variants: enrichedVariants,
      orderSummary,
      hasOrderData: (orderCount ?? 0) > 0,
    });
  } catch (err) {
    console.error("products intelligence product detail error", err);
    return NextResponse.json({ product: null, variants: [], orderSummary: null });
  }
}
