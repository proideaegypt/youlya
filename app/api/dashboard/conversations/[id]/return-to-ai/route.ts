import { NextResponse } from "next/server";
import { returnToAI } from "@/lib/services/handoff-service";
import { isAIPaused } from "@/lib/services/conversation-flow-service";
import { getCurrentDashboardActor } from "@/lib/auth/user-management-api";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const actorUser = await getCurrentDashboardActor();
  if (!actorUser) {
    return NextResponse.json({ error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." }, { status: 401 });
  }
  const role = actorUser.role;
  const allowedRoles = new Set(["super_admin", "owner", "admin", "customer_service", "moderator"]);
  if (!allowedRoles.has(role)) return NextResponse.json({ error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." }, { status: 403 });

  const { id: conversationId } = await params;
  if (!conversationId) {
    return NextResponse.json({ error: "المحادثة غير موجودة." }, { status: 404 });
  }

  const body = await _req.json().catch(() => ({}));
  const actor = typeof body.actor === "string" && body.actor.trim() ? body.actor : actorUser.userId;

  try {
    const success = await returnToAI(conversationId, actor);
    if (!success) {
      return NextResponse.json({ error: "تعذر إرجاع المحادثة للذكاء الاصطناعي. حاول مرة أخرى." }, { status: 500 });
    }

    const aiPaused = await isAIPaused(conversationId);

    return NextResponse.json({
      ok: true,
      conversationId,
      aiPaused,
      status: aiPaused ? "handoff" : "ai_active",
    });
  } catch {
    return NextResponse.json({ error: "تعذر إرجاع المحادثة للذكاء الاصطناعي. حاول مرة أخرى." }, { status: 500 });
  }
}
