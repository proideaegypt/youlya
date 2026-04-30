import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { isAiEnabled } from "@/lib/services/ai-settings-service";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const supabase = getSupabaseServerClient();
  const aiEnabled = await isAiEnabled("youlya");

  if (!supabase) {
    const flow = [...getMockState().conversationFlow.values()];
    const handoffs = getMockState().humanHandoffs.filter((h) => h.resolved_at === null).length;
    return NextResponse.json({
      activeConversations: flow.length,
      aiActiveConversations: aiEnabled ? flow.length : 0,
      needsHuman: handoffs,
      pendingConfirmations: flow.filter((f) => f.stage === "awaiting_confirmation").length,
      ordersCreatedToday: flow.filter((f) => f.stage === "ordered").length,
      failedOrderAttempts: 0,
      duplicateWebhooksBlocked: 0,
      killSwitchStatus: aiEnabled ? "OFF" : "ON",
    });
  }

  const { data: conv } = await supabase.from("conversation_state").select("stage");
  const { count: failedCount } = await supabase.from("failed_events").select("id", { head: true, count: "exact" });
  const { count: handoffCount } = await supabase.from("human_handoffs").select("id", { head: true, count: "exact" }).is("resolved_at", null);
  const stages = conv ?? [];
  return NextResponse.json({
    activeConversations: stages.length,
    aiActiveConversations: aiEnabled ? stages.length : 0,
    needsHuman: handoffCount ?? 0,
    pendingConfirmations: stages.filter((s) => s.stage === "awaiting_confirmation").length,
    ordersCreatedToday: stages.filter((s) => s.stage === "ordered").length,
    failedOrderAttempts: failedCount ?? 0,
    duplicateWebhooksBlocked: 0,
    killSwitchStatus: aiEnabled ? "OFF" : "ON",
  });
}
