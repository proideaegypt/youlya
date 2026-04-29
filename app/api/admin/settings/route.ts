import { NextResponse } from "next/server";
import { z } from "zod";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";
import { isAiEnabled, setAiEnabled } from "@/lib/services/ai-settings-service";

const bodySchema = z.object({
  ai_enabled: z.boolean(),
  store_id: z.string().optional(),
  updated_by: z.string().optional(),
});

export async function GET(req: Request) {
  const auth = requireInternalAuth(req);
  if ("error" in auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const storeId = new URL(req.url).searchParams.get("store_id") ?? "youlya";
  const ai_enabled = await isAiEnabled(storeId);
  return NextResponse.json({ ai_enabled });
}

export async function POST(req: Request) {
  const auth = requireInternalAuth(req);
  if ("error" in auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const storeId = parsed.data.store_id ?? "youlya";
  const updatedBy = parsed.data.updated_by ?? "internal_admin";
  await setAiEnabled(storeId, parsed.data.ai_enabled, updatedBy);
  return NextResponse.json({ ok: true, ai_enabled: parsed.data.ai_enabled });
}
