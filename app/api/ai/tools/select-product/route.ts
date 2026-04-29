import { NextResponse } from "next/server";
import { selectProductSchema } from "@/lib/validation/schemas";
import { selectProduct } from "@/lib/services/select-product-service";
import { requireStoreContext } from "@/lib/middleware/require-store-context";
import { assertPermission, PermissionError } from "@/lib/middleware/assert-permission";
import { getStoreConfig } from "@/lib/middleware/store-context";

export async function POST(req: Request) {
  const ctx = await requireStoreContext(req);
  if ("error" in ctx) return NextResponse.json({ error: ctx.error }, { status: ctx.error === "forbidden" ? 403 : 401 });
  const parsed = selectProductSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    assertPermission(ctx.role, "products:read");
  } catch (error) {
    if (error instanceof PermissionError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await getStoreConfig(ctx.storeId);
  return NextResponse.json(await selectProduct(parsed.data));
}
