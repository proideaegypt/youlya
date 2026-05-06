import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validation/schemas";
import { createCODOrder } from "@/lib/services/shopify-order-service";
import { writeAuditLog } from "@/lib/services/audit-log-service";
import { requireStoreContext } from "@/lib/middleware/require-store-context";
import { assertPermission, PermissionError } from "@/lib/middleware/assert-permission";
import { getStoreConfig } from "@/lib/middleware/store-context";

export async function POST(req: Request) {
  const ctx = await requireStoreContext(req);
  if ("error" in ctx) return NextResponse.json({ error: ctx.error }, { status: ctx.error === "forbidden" ? 403 : 401 });
  const parsed = createOrderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    assertPermission(ctx.role, "orders:create");
  } catch (error) {
    if (error instanceof PermissionError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await getStoreConfig(ctx.storeId);

  const result = await createCODOrder({ ...parsed.data, testMode: parsed.data.testMode ?? false });
  writeAuditLog({
    action: "api.create_shopify_order",
    entityType: "orders",
    entityId: result.success ? result.shopify_order_id : "none",
    metadata: { store_id: ctx.storeId, user_id: ctx.userId, success: result.success },
  });
  const status = result.success ? 200 : 400;
  return NextResponse.json(result, { status });
}
