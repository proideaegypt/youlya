import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const flow = getMockState().conversationFlow.get(id);
    return NextResponse.json({
      conversation: { id, stage: flow?.stage ?? "idle", customer: flow?.customerInfo ?? null, cart: flow?.cart ?? [] },
      messages: [],
    });
  }

  const { data } = await supabase
    .from("conversation_state")
    .select("conversation_id,stage,customer_name,customer_phone,customer_address,cart_json,updated_at")
    .eq("conversation_id", id)
    .maybeSingle();
  return NextResponse.json({
    conversation: data
      ? {
          id: data.conversation_id,
          stage: data.stage,
          customer: { name: data.customer_name, phone: data.customer_phone, address: data.customer_address },
          cart: Array.isArray(data.cart_json) ? data.cart_json : [],
          updated_at: data.updated_at,
        }
      : null,
    messages: [],
  });
}
