import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getConversationTimeline } from "@/lib/services/message-history-service";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const storeId = "youlya";

  const timeline = await getConversationTimeline(id, storeId, { limit: 200 });

  return NextResponse.json({
    timeline: timeline.map((item) => ({
      id: item.id,
      type: item.type,
      direction: item.direction,
      event_type: item.event_type,
      text: item.text,
      summary: item.summary,
      metadata: item.metadata,
      created_at: item.created_at,
    })),
  });
}
