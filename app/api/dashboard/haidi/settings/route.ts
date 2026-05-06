import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getHaidiSettings, updateHaidiSettings } from "@/lib/services/haidi-settings-service";

async function hasSession() {
  const cookieStore = await cookies();
  return cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
}

export async function GET() {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const settings = await getHaidiSettings("youlya");
  return NextResponse.json({ settings });
}

const patchSchema = z.object({
  defaultLanguage: z.enum(["ar-EG", "en", "auto"]).optional(),
  tone: z.enum(["warm", "premium", "playful", "concise", "supportive"]).optional(),
  emojiLevel: z.enum(["none", "light", "normal"]).optional(),
  replyLength: z.enum(["short", "balanced", "detailed"]).optional(),
  upsellMode: z.enum(["off", "soft", "normal"]).optional(),
  maxUpsellsPerConversation: z.number().int().min(0).max(2).optional(),
  recommendAlternativesWhenOOS: z.boolean().optional(),
  recommendComplementaryProducts: z.boolean().optional(),
  useUrgencyOnlyFromRealStock: z.boolean().optional(),
  useSocialProofOnlyFromRealData: z.boolean().optional(),
  maxProductsShownPerReply: z.number().int().min(1).max(10).optional(),
  maxSearchResultsInternal: z.number().int().min(1).max(50).optional(),
  handoffOnHumanRequest: z.boolean().optional(),
  handoffAfterUnclearCount: z.number().int().min(2).max(3).optional(),
  handoffOnAngryTone: z.boolean().optional(),
  humanHandoffEnabled: z.boolean().optional(),
  handoffCustomerServiceEnabled: z.boolean().optional(),
  handoffManagerRequestEnabled: z.boolean().optional(),
  pauseAiAfterHandoff: z.boolean().optional(),
  sendHandoffAcknowledgement: z.boolean().optional(),
  notifyHumanTeam: z.boolean().optional(),
  defaultHandoffAssignee: z.string().nullable().optional(),
  customerServiceReplyTemplateAr: z.string().min(1).optional(),
  managerRequestReplyTemplateAr: z.string().min(1).optional(),
  handoffFinalAckTemplateAr: z.string().min(1).optional(),
  globalAiPaused: z.boolean().optional(),
  ordersPaused: z.boolean().optional(),
  promptVersion: z.string().max(50).optional(),
  updatedBy: z.string().optional(),
});

export async function POST(req: Request) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updatedBy = parsed.data.updatedBy ?? "dashboard_user";
  const patch = { ...parsed.data };
  delete (patch as Record<string, unknown>).updatedBy;

  const settings = await updateHaidiSettings("youlya", patch, updatedBy);
  return NextResponse.json({ ok: true, settings });
}
