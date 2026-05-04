import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createHaidiScenario, listHaidiScenarios } from "@/lib/services/haidi-lab-service";

const createSchema = z.object({
  store_id: z.string().min(1),
  title: z.string().min(1),
  input_text: z.string().min(1),
  expected_intent: z.string().optional(),
  expected_tone: z.string().optional(),
  must_include: z.array(z.string()).optional(),
  must_not_include: z.array(z.string()).optional(),
});

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();
  const storeId = new URL(req.url).searchParams.get("store_id") ?? "youlya";
  const scenarios = await listHaidiScenarios(storeId);
  return NextResponse.json({ scenarios });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  const scenario = await createHaidiScenario({
    storeId: parsed.data.store_id,
    title: parsed.data.title,
    inputText: parsed.data.input_text,
    expectedIntent: parsed.data.expected_intent,
    expectedTone: parsed.data.expected_tone,
    mustInclude: parsed.data.must_include,
    mustNotInclude: parsed.data.must_not_include,
  });
  return NextResponse.json({ scenario });
}
