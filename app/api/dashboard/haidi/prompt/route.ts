import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  getHaidiPromptSummary,
  publishHaidiPrompt,
  recordHaidiPromptTestResult,
  rollbackHaidiPrompt,
  saveHaidiPromptDraft,
} from "@/lib/services/haidi-prompt-service";

async function hasSession() {
  const cookieStore = await cookies();
  return cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
}

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("save_draft"),
    storeId: z.string().optional(),
    promptText: z.string().min(1),
    promptVersion: z.string().max(80).optional(),
    updatedBy: z.string().optional(),
  }),
  z.object({
    action: z.literal("publish"),
    storeId: z.string().optional(),
    updatedBy: z.string().optional(),
    requirePassingLabRun: z.boolean().optional(),
  }),
  z.object({
    action: z.literal("rollback"),
    storeId: z.string().optional(),
    updatedBy: z.string().optional(),
  }),
  z.object({
    action: z.literal("test"),
    storeId: z.string().optional(),
    runId: z.string().min(1),
    score: z.number(),
    updatedBy: z.string().optional(),
  }),
]);

export async function GET() {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const prompt = await getHaidiPromptSummary("youlya");
  return NextResponse.json({ prompt });
}

export async function POST(req: Request) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = actionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const storeId = parsed.data.storeId ?? "youlya";
  const updatedBy = parsed.data.updatedBy ?? "dashboard_user";

  if (parsed.data.action === "save_draft") {
    const prompt = await saveHaidiPromptDraft({
      storeId,
      promptText: parsed.data.promptText,
      promptVersion: parsed.data.promptVersion,
      updatedBy,
    });
    return NextResponse.json({ ok: true, prompt });
  }

  if (parsed.data.action === "publish") {
    const result = await publishHaidiPrompt({
      storeId,
      updatedBy,
      requirePassingLabRun: parsed.data.requirePassingLabRun ?? true,
    });
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, prompt: result.prompt });
  }

  if (parsed.data.action === "test") {
    const prompt = await recordHaidiPromptTestResult({
      storeId,
      runId: parsed.data.runId,
      score: parsed.data.score,
      updatedBy,
    });
    return NextResponse.json({ ok: true, prompt });
  }

  const result = await rollbackHaidiPrompt({ storeId, updatedBy });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, prompt: result.prompt });
}
