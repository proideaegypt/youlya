import { NextResponse } from "next/server";
import { z } from "zod";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { syncShopifyProducts } from "@/lib/services/shopify-product-sync-service";

const syncBodySchema = z.object({
  store_id: z.string().min(1),
  mode: z.enum(["full", "inventory"]).default("full"),
  includeInventory: z.boolean().optional().default(true),
  dryRun: z.boolean().optional().default(false),
  source: z.string().optional().default("api"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = syncBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const auth = requireInternalAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { store_id, mode, dryRun, source } = parsed.data;

  const result = await syncShopifyProducts({
    storeId: store_id,
    mode,
    source: source as "manual" | "n8n_daily" | "api",
    dryRun,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: result.errorCode,
        message: result.safeMessage,
        mode,
        storeId: store_id,
        durationMs: result.durationMs,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: result.mode,
    storeId: result.storeId,
    syncedProducts: result.syncedProducts,
    syncedVariants: result.syncedVariants,
    missingSkuCount: result.missingSkuCount,
    unavailableCount: result.unavailableCount,
    durationMs: result.durationMs,
    startedAt: result.startedAt,
    finishedAt: result.finishedAt,
    dryRun: result.dryRun,
  });
}
