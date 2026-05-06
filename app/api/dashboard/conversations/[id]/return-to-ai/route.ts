import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { returnToAI } from "@/lib/services/handoff-service";
import { isAIPaused } from "@/lib/services/conversation-flow-service";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) {
    return NextResponse.json({ error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." }, { status: 401 });
  }

  const { id: conversationId } = await params;
  if (!conversationId) {
    return NextResponse.json({ error: "المحادثة غير موجودة." }, { status: 404 });
  }

  const body = await _req.json().catch(() => ({}));
  const actor = typeof body.actor === "string" ? body.actor : "staff";

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
