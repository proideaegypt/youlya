import { NextResponse } from "next/server";
import { z } from "zod";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  storeSlug: z.string().min(1),
  source: z.string().min(1),
  provider: z.string().optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  payload: z.unknown().optional(),
  retryCount: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  const auth = requireInternalAuth(req);
  if ("error" in auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("failed_events").insert({
      store_id: parsed.data.storeSlug,
      source: parsed.data.source,
      provider: parsed.data.provider ?? null,
      error_code: parsed.data.errorCode ?? null,
      error_message: parsed.data.errorMessage ?? null,
      payload: parsed.data.payload ?? null,
      retry_count: parsed.data.retryCount ?? 0,
    });
    if (error) return NextResponse.json({ error: "persist_failed" }, { status: 500 });
  }

  return NextResponse.json({ status: "created" }, { status: 201 });
}
