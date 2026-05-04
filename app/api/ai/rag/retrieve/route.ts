import { NextResponse } from "next/server";
import { z } from "zod";
import { buildApprovedKnowledgePrompt, retrieveApprovedKnowledge } from "@/lib/services/knowledge-base-service";

const schema = z.object({
  store_id: z.string().min(1),
  query: z.string().default(""),
  limit: z.number().int().min(1).max(10).default(5),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const snippets = await retrieveApprovedKnowledge(parsed.data.store_id, parsed.data.query, parsed.data.limit);
  const promptContext = buildApprovedKnowledgePrompt(snippets);

  return NextResponse.json({
    store_id: parsed.data.store_id,
    query: parsed.data.query,
    snippets,
    promptContext,
    sourcePolicy: "approved_only",
  });
}
