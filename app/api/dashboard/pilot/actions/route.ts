import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { setAiEnabled } from "@/lib/services/ai-settings-service";
import { updateHaidiSettings } from "@/lib/services/haidi-settings-service";
import { updateHandoffSettings } from "@/lib/services/handoff-settings-service";

async function hasSession() {
  const cookieStore = await cookies();
  return cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
}

const actionSchema = z.object({
  action: z.enum([
    "pause_haidi",
    "resume_haidi",
    "pause_orders",
    "resume_orders",
    "enable_global_handoff",
    "disable_global_handoff",
  ]),
  updatedBy: z.string().optional(),
});

export async function POST(req: Request) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = actionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { action } = parsed.data;
  const updatedBy = parsed.data.updatedBy ?? "dashboard_user";

  try {
    if (action === "pause_haidi") {
      await setAiEnabled("youlya", false, updatedBy);
      await updateHaidiSettings("youlya", { globalAiPaused: true }, updatedBy);
      return NextResponse.json({ ok: true, action, globalAiPaused: true });
    }
    if (action === "resume_haidi") {
      await setAiEnabled("youlya", true, updatedBy);
      await updateHaidiSettings("youlya", { globalAiPaused: false }, updatedBy);
      return NextResponse.json({ ok: true, action, globalAiPaused: false });
    }
    if (action === "pause_orders") {
      await updateHaidiSettings("youlya", { ordersPaused: true }, updatedBy);
      return NextResponse.json({ ok: true, action, ordersPaused: true });
    }
    if (action === "resume_orders") {
      await updateHaidiSettings("youlya", { ordersPaused: false }, updatedBy);
      return NextResponse.json({ ok: true, action, ordersPaused: false });
    }
    if (action === "enable_global_handoff") {
      await updateHandoffSettings("youlya", { global_handoff_enabled: true }, updatedBy);
      return NextResponse.json({ ok: true, action, globalHandoffEnabled: true });
    }
    if (action === "disable_global_handoff") {
      await updateHandoffSettings("youlya", { global_handoff_enabled: false }, updatedBy);
      return NextResponse.json({ ok: true, action, globalHandoffEnabled: false });
    }
    return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  } catch (err) {
    console.error("pilot action error", err);
    return NextResponse.json({ error: "action_failed" }, { status: 500 });
  }
}
