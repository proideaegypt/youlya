import { NextResponse } from "next/server";
import { handoffSchema } from "@/lib/validation/schemas";
import { createHandoffTicket } from "@/lib/services/handoff-service";
import { writeAuditLog } from "@/lib/services/audit-log-service";
import { requireStoreContext } from "@/lib/middleware/require-store-context";
import { assertPermission, PermissionError } from "@/lib/middleware/assert-permission";
import { getStoreConfig } from "@/lib/middleware/store-context";

export async function POST(req: Request) {
  const ctx = await requireStoreContext(req);
  if ("error" in ctx) return NextResponse.json({ error: ctx.error }, { status: ctx.error === "forbidden" ? 403 : 401 });
  const parsed = handoffSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    assertPermission(ctx.role, "handoff:create");
  } catch (error) {
    if (error instanceof PermissionError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await getStoreConfig(ctx.storeId);
  const ticket = await createHandoffTicket({
    store_id: ctx.storeId,
    conversation_id: parsed.data.conversationId,
    customer_id: "unknown",
    reason: "SHIPPING_ISSUE",
    priority: "NORMAL",
    ai_summary: parsed.data.reason,
  });
  writeAuditLog({
    action: "handoff.create",
    entityType: "handoff_ticket",
    entityId: ticket.id,
    metadata: { store_id: ctx.storeId, user_id: ctx.userId },
  });
  return NextResponse.json({ status: "handoff_created", ticket });
}
