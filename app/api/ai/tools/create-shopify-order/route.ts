import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validation/schemas";
import { createCODOrder } from "@/lib/services/shopify-order-service";
import { writeAuditLog } from "@/lib/services/audit-log-service";

type StoreContext = { storeId: string; permissions: string[] };

function requireStoreContext(req: Request): StoreContext | null {
  const storeId = req.headers.get("x-store-id");
  if (!storeId) return null;
  return { storeId, permissions: ["orders:create"] };
}

function assertPermission(ctx: StoreContext, permission: string) {
  if (!ctx.permissions.includes(permission)) throw new Error("forbidden");
}

export async function POST(req: Request) {
  const ctx = requireStoreContext(req);
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = createOrderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    assertPermission(ctx, "orders:create");
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const result = await createCODOrder(parsed.data);
  writeAuditLog({
    action: "api.create_shopify_order",
    entityType: "orders",
    entityId: result.success ? result.shopify_order_id : "none",
    metadata: { store_id: ctx.storeId, success: result.success },
  });
  const status = result.success ? 200 : 400;
  return NextResponse.json(result, { status });
}
