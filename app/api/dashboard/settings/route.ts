import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { isAiEnabled, setAiEnabled } from "@/lib/services/ai-settings-service";

const patchSchema = z.object({
  ai_enabled: z.boolean().optional(),
  role: z.string().optional(),
});

async function hasSession() {
  const cookieStore = await cookies();
  return cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
}

export async function GET() {
  if (!(await hasSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    ai_enabled: await isAiEnabled("youlya"),
    ai_order_creation_enabled: true,
    product_recommendations_enabled: true,
    free_shipping_threshold: 1200,
    max_cart_items: 5,
  });
}

export async function PATCH(req: Request) {
  if (!(await hasSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.role && !["owner", "admin"].includes(parsed.data.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (typeof parsed.data.ai_enabled === "boolean") {
    await setAiEnabled("youlya", parsed.data.ai_enabled, "dashboard_settings");
  }
  return NextResponse.json({ ok: true });
}
