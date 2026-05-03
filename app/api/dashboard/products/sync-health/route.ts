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
      lastSyncStatus: "unknown",
      lastSyncTime: null,
      productsSynced: 0,
      variantsSynced: 0,
      missingSkuCount: 0,
      unavailableCount: 0,
      durationMs: 0,
      source: "unknown",
      n8nDailyWorkflowActive: false,
    });
  }

  try {
    const { count: productsSynced } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID);

    const { count: variantsSynced } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID);

    const { count: missingSkuCount } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .eq("code_missing", true);

    const { count: unavailableCount } = await supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID)
      .lte("inventory_quantity", 0);

    const { data: lastSync } = await supabase
      .from("products")
      .select("last_synced_at")
      .eq("store_id", STORE_ID)
      .order("last_synced_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastSyncTime = lastSync?.last_synced_at ?? null;
    const hasData = (productsSynced ?? 0) > 0;

    return NextResponse.json({
      lastSyncStatus: hasData ? "success" : "never_run",
      lastSyncTime,
      productsSynced: productsSynced ?? 0,
      variantsSynced: variantsSynced ?? 0,
      missingSkuCount: missingSkuCount ?? 0,
      unavailableCount: unavailableCount ?? 0,
      durationMs: 0,
      source: "manual",
      n8nDailyWorkflowActive: false,
    });
  } catch (err) {
    console.error("sync health error", err);
    return NextResponse.json({
      lastSyncStatus: "error",
      lastSyncTime: null,
      productsSynced: 0,
      variantsSynced: 0,
      missingSkuCount: 0,
      unavailableCount: 0,
      durationMs: 0,
      source: "unknown",
      n8nDailyWorkflowActive: false,
    });
  }
}
