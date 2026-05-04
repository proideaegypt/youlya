import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { deleteHaidiScenario, updateHaidiScenario } from "@/lib/services/haidi-lab-service";

const updateSchema = z.object({
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  const { id } = await params;
  const scenario = await updateHaidiScenario(id, {
    storeId: parsed.data.store_id,
    title: parsed.data.title,
    inputText: parsed.data.input_text,
    expectedIntent: parsed.data.expected_intent,
    expectedTone: parsed.data.expected_tone,
    mustInclude: parsed.data.must_include,
    mustNotInclude: parsed.data.must_not_include,
  });
  if (!scenario) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ scenario });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();
  const storeId = new URL(req.url).searchParams.get("store_id") ?? "youlya";
  const { id } = await params;
  await deleteHaidiScenario(id, storeId);
  return NextResponse.json({ ok: true });
}
