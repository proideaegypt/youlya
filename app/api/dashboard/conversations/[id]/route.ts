import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getConversationTimeline, maskCustomerIdentifier } from "@/lib/services/message-history-service";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = getSupabaseServerClient();
  const storeId = "youlya";

  if (!supabase) {
    const flow = getMockState().conversationFlow.get(id);
    return NextResponse.json({
      conversation: {
        id,
        stage: flow?.stage ?? "idle",
        customer: flow?.customerInfo ?? null,
        cart: Array.isArray(flow?.cart) ? flow.cart : [],
      },
      messages: [],
    });
  }

  const { data } = await supabase
    .from("conversation_state")
    .select("conversation_id,stage,customer_name,customer_phone,customer_address,cart_json,updated_at")
    .eq("conversation_id", id)
    .maybeSingle();

  const timeline = await getConversationTimeline(id, storeId, { limit: 100 });

  return NextResponse.json({
    conversation: data
      ? {
          id: data.conversation_id,
          stage: data.stage,
          customer: {
            name: data.customer_name,
            phone: maskCustomerIdentifier(String(data.customer_phone ?? "")),
            address: data.customer_address,
          },
          cart: Array.isArray(data.cart_json) ? data.cart_json : [],
          updated_at: data.updated_at,
        }
      : null,
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
