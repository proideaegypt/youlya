import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

const STORE_ID = "ef77af08-688d-4354-8096-d89f6046f0c2";

function maskCustomerId(id: string): string {
  if (!id || id.length < 6) return "***";
  return id.slice(0, 3) + "***" + id.slice(-3);
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(10, Number(searchParams.get("pageSize") ?? "20")));

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ mappings: [], total: 0, page, pageSize });
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: mappings, error, count } = await supabase
      .from("last_product_recommendations")
      .select(
        "conversation_id, customer_id, index, product_id, variant_id, displayed_title, displayed_price, inventory_at_show_time, size, color, sku, expires_at, created_at",
        { count: "exact" },
      )
      .eq("store_id", STORE_ID)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !mappings) {
      return NextResponse.json({ mappings: [], total: 0, page, pageSize });
    }

    const now = new Date().toISOString();
    const enriched = mappings.map((m) => ({
      conversationId: m.conversation_id,
      customerId: maskCustomerId(m.customer_id),
      index: m.index,
      productTitle: m.displayed_title || m.product_id,
      productId: m.product_id,
      variantId: m.variant_id,
      sku: m.sku,
      size: m.size,
      color: m.color,
      price: m.displayed_price,
      inventoryAtShowTime: m.inventory_at_show_time,
      expiresAt: m.expires_at,
      isExpired: m.expires_at < now,
      createdAt: m.created_at,
    }));

    return NextResponse.json({ mappings: enriched, total: count ?? 0, page, pageSize });
  } catch (err) {
    console.error("mapping inspector error", err);
    return NextResponse.json({ mappings: [], total: 0, page, pageSize });
  }
}
