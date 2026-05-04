import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createLearningSuggestionFromRun, runHaidiScenario } from "@/lib/services/haidi-lab-service";

const runSchema = z.object({
  store_id: z.string().min(1),
  scenario_id: z.string().min(1),
});

const suggestSchema = z.object({
  store_id: z.string().min(1),
  run_id: z.string().min(1),
  title: z.string().min(1),
  suggestion_text: z.string().min(1),
});

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();
  const parsed = runSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  const result = await runHaidiScenario({
    storeId: parsed.data.store_id,
    scenarioId: parsed.data.scenario_id,
  });
  if (!result.ok) return NextResponse.json(result, { status: 404 });
  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();
  const parsed = suggestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  const suggestion = await createLearningSuggestionFromRun({
    storeId: parsed.data.store_id,
    runId: parsed.data.run_id,
    title: parsed.data.title,
    suggestionText: parsed.data.suggestion_text,
  });
  return NextResponse.json({ suggestion });
}
