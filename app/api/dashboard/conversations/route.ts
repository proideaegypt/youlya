import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listConversations, maskCustomerIdentifier } from "@/lib/services/message-history-service";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter") ?? "all";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 100);
  const offset = Number(url.searchParams.get("offset") ?? "0");

  // TODO: resolve store_id from session context in future
  const storeId = "youlya";

  const conversations = await listConversations(storeId, {
    status: filter === "all" ? undefined : filter,
    limit,
    offset,
  });

  return NextResponse.json({
    conversations: conversations.map((c) => ({
      id: String(c.id ?? ""),
      channel: String(c.channel ?? ""),
      status: String(c.status ?? "ai_active"),
      ai_paused: Boolean(c.ai_paused),
      assigned_to: c.assigned_to ? String(c.assigned_to) : null,
      last_message_at: c.last_message_at ? String(c.last_message_at) : null,
      created_at: String(c.created_at ?? ""),
      updated_at: String(c.updated_at ?? ""),
      customer_id_masked: maskCustomerIdentifier(String(c.customer_id ?? "")),
    })),
  });
}
