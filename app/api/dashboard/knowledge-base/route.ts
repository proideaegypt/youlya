import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { listKnowledgeModeration, reviewSuggestion } from "@/lib/services/knowledge-base-service";

const reviewSchema = z.object({
  store_id: z.string().min(1),
  suggestion_id: z.string().min(1),
  action: z.enum(["approve", "reject", "publish"]),
  actor: z.string().default("dashboard_user"),
  reviewer_note: z.string().optional(),
});

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const storeId = new URL(req.url).searchParams.get("store_id") ?? "youlya";
  const data = await listKnowledgeModeration(storeId);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await reviewSuggestion({
    storeId: parsed.data.store_id,
    suggestionId: parsed.data.suggestion_id,
    action: parsed.data.action,
    actor: parsed.data.actor,
    reviewerNote: parsed.data.reviewer_note,
  });

  if (!result.ok) return NextResponse.json(result, { status: 404 });
  return NextResponse.json({ ok: true });
}
