import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type HaidiSettings = {
  storeId: string;
  defaultLanguage: "ar-EG" | "en" | "auto";
  tone: "warm" | "premium" | "playful" | "concise" | "supportive";
  emojiLevel: "none" | "light" | "normal";
  replyLength: "short" | "balanced" | "detailed";
  upsellMode: "off" | "soft" | "normal";
  maxUpsellsPerConversation: number;
  recommendAlternativesWhenOOS: boolean;
  recommendComplementaryProducts: boolean;
  useUrgencyOnlyFromRealStock: boolean;
  useSocialProofOnlyFromRealData: boolean;
  maxProductsShownPerReply: number;
  maxSearchResultsInternal: number;
  handoffOnHumanRequest: boolean;
  handoffAfterUnclearCount: number;
  handoffOnAngryTone: boolean;
  humanHandoffEnabled: boolean;
  handoffCustomerServiceEnabled: boolean;
  handoffManagerRequestEnabled: boolean;
  pauseAiAfterHandoff: boolean;
  sendHandoffAcknowledgement: boolean;
  notifyHumanTeam: boolean;
  defaultHandoffAssignee: string | null;
  customerServiceReplyTemplateAr: string;
  managerRequestReplyTemplateAr: string;
  handoffFinalAckTemplateAr: string;
  globalAiPaused: boolean;
  ordersPaused: boolean;
  promptVersion: string;
  updatedAt: string;
  updatedBy: string | null;
};

const DEFAULTS: HaidiSettings = {
  storeId: "youlya",
  defaultLanguage: "ar-EG",
  tone: "warm",
  emojiLevel: "normal",
  replyLength: "balanced",
  upsellMode: "soft",
  maxUpsellsPerConversation: 1,
  recommendAlternativesWhenOOS: true,
  recommendComplementaryProducts: true,
  useUrgencyOnlyFromRealStock: true,
  useSocialProofOnlyFromRealData: true,
  maxProductsShownPerReply: 3,
  maxSearchResultsInternal: 10,
  handoffOnHumanRequest: true,
  handoffAfterUnclearCount: 3,
  handoffOnAngryTone: true,
  humanHandoffEnabled: true,
  handoffCustomerServiceEnabled: true,
  handoffManagerRequestEnabled: true,
  pauseAiAfterHandoff: true,
  sendHandoffAcknowledgement: true,
  notifyHumanTeam: true,
  defaultHandoffAssignee: null,
  customerServiceReplyTemplateAr: "تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.",
  managerRequestReplyTemplateAr: "تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.",
  handoffFinalAckTemplateAr: "تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.",
  globalAiPaused: false,
  ordersPaused: false,
  promptVersion: "v1",
  updatedAt: new Date().toISOString(),
  updatedBy: null,
};

const TTL_MS = 30_000;
const cache = new Map<string, { value: HaidiSettings; expiresAt: number }>();

function rowToSettings(row: Record<string, unknown>): HaidiSettings {
  return {
    storeId: String(row.store_id ?? "youlya"),
    defaultLanguage: (String(row.default_language ?? "ar-EG") as HaidiSettings["defaultLanguage"]),
    tone: (String(row.tone ?? "warm") as HaidiSettings["tone"]),
    emojiLevel: (String(row.emoji_level ?? "normal") as HaidiSettings["emojiLevel"]),
    replyLength: (String(row.reply_length ?? "balanced") as HaidiSettings["replyLength"]),
    upsellMode: (String(row.upsell_mode ?? "soft") as HaidiSettings["upsellMode"]),
    maxUpsellsPerConversation: Number(row.max_upsells_per_conversation ?? 1),
    recommendAlternativesWhenOOS: Boolean(row.recommend_alternatives_when_oos ?? true),
    recommendComplementaryProducts: Boolean(row.recommend_complementary_products ?? true),
    useUrgencyOnlyFromRealStock: Boolean(row.use_urgency_only_from_real_stock ?? true),
    useSocialProofOnlyFromRealData: Boolean(row.use_social_proof_only_from_real_data ?? true),
    maxProductsShownPerReply: Number(row.max_products_shown_per_reply ?? 3),
    maxSearchResultsInternal: Number(row.max_search_results_internal ?? 10),
    handoffOnHumanRequest: Boolean(row.handoff_on_human_request ?? true),
    handoffAfterUnclearCount: Number(row.handoff_after_unclear_count ?? 3),
    handoffOnAngryTone: Boolean(row.handoff_on_angry_tone ?? true),
    humanHandoffEnabled: Boolean(row.human_handoff_enabled ?? true),
    handoffCustomerServiceEnabled: Boolean(row.handoff_customer_service_enabled ?? true),
    handoffManagerRequestEnabled: Boolean(row.handoff_manager_request_enabled ?? true),
    pauseAiAfterHandoff: Boolean(row.pause_ai_after_handoff ?? true),
    sendHandoffAcknowledgement: Boolean(row.send_handoff_acknowledgement ?? true),
    notifyHumanTeam: Boolean(row.notify_human_team ?? true),
    defaultHandoffAssignee: row.default_handoff_assignee ? String(row.default_handoff_assignee) : null,
    customerServiceReplyTemplateAr: String(
      row.customer_service_reply_template_ar ??
        "تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.",
    ),
    managerRequestReplyTemplateAr: String(
      row.manager_request_reply_template_ar ??
        "تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.",
    ),
    handoffFinalAckTemplateAr: String(
      row.handoff_final_ack_template_ar ?? "تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.",
    ),
    globalAiPaused: Boolean(row.global_ai_paused ?? false),
    ordersPaused: Boolean(row.orders_paused ?? false),
    promptVersion: String(row.prompt_version ?? "v1"),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    updatedBy: row.updated_by ? String(row.updated_by) : null,
  };
}

function settingsToRow(settings: Partial<HaidiSettings>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (settings.defaultLanguage !== undefined) row.default_language = settings.defaultLanguage;
  if (settings.tone !== undefined) row.tone = settings.tone;
  if (settings.emojiLevel !== undefined) row.emoji_level = settings.emojiLevel;
  if (settings.replyLength !== undefined) row.reply_length = settings.replyLength;
  if (settings.upsellMode !== undefined) row.upsell_mode = settings.upsellMode;
  if (settings.maxUpsellsPerConversation !== undefined) row.max_upsells_per_conversation = settings.maxUpsellsPerConversation;
  if (settings.recommendAlternativesWhenOOS !== undefined) row.recommend_alternatives_when_oos = settings.recommendAlternativesWhenOOS;
  if (settings.recommendComplementaryProducts !== undefined) row.recommend_complementary_products = settings.recommendComplementaryProducts;
  if (settings.useUrgencyOnlyFromRealStock !== undefined) row.use_urgency_only_from_real_stock = settings.useUrgencyOnlyFromRealStock;
  if (settings.useSocialProofOnlyFromRealData !== undefined) row.use_social_proof_only_from_real_data = settings.useSocialProofOnlyFromRealData;
  if (settings.maxProductsShownPerReply !== undefined) row.max_products_shown_per_reply = settings.maxProductsShownPerReply;
  if (settings.maxSearchResultsInternal !== undefined) row.max_search_results_internal = settings.maxSearchResultsInternal;
  if (settings.handoffOnHumanRequest !== undefined) row.handoff_on_human_request = settings.handoffOnHumanRequest;
  if (settings.handoffAfterUnclearCount !== undefined) row.handoff_after_unclear_count = settings.handoffAfterUnclearCount;
  if (settings.handoffOnAngryTone !== undefined) row.handoff_on_angry_tone = settings.handoffOnAngryTone;
  if (settings.humanHandoffEnabled !== undefined) row.human_handoff_enabled = settings.humanHandoffEnabled;
  if (settings.handoffCustomerServiceEnabled !== undefined) row.handoff_customer_service_enabled = settings.handoffCustomerServiceEnabled;
  if (settings.handoffManagerRequestEnabled !== undefined) row.handoff_manager_request_enabled = settings.handoffManagerRequestEnabled;
  if (settings.pauseAiAfterHandoff !== undefined) row.pause_ai_after_handoff = settings.pauseAiAfterHandoff;
  if (settings.sendHandoffAcknowledgement !== undefined) row.send_handoff_acknowledgement = settings.sendHandoffAcknowledgement;
  if (settings.notifyHumanTeam !== undefined) row.notify_human_team = settings.notifyHumanTeam;
  if (settings.defaultHandoffAssignee !== undefined) row.default_handoff_assignee = settings.defaultHandoffAssignee;
  if (settings.customerServiceReplyTemplateAr !== undefined) row.customer_service_reply_template_ar = settings.customerServiceReplyTemplateAr;
  if (settings.managerRequestReplyTemplateAr !== undefined) row.manager_request_reply_template_ar = settings.managerRequestReplyTemplateAr;
  if (settings.handoffFinalAckTemplateAr !== undefined) row.handoff_final_ack_template_ar = settings.handoffFinalAckTemplateAr;
  if (settings.globalAiPaused !== undefined) row.global_ai_paused = settings.globalAiPaused;
  if (settings.ordersPaused !== undefined) row.orders_paused = settings.ordersPaused;
  if (settings.promptVersion !== undefined) row.prompt_version = settings.promptVersion;
  row.updated_at = new Date().toISOString();
  if (settings.updatedBy !== undefined) row.updated_by = settings.updatedBy;
  return row;
}

export async function getHaidiSettings(storeId = "youlya"): Promise<HaidiSettings> {
  const now = Date.now();
  const hit = cache.get(storeId);
  if (hit && hit.expiresAt > now) return hit.value;

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const mock = getMockState().haidiSettingsByStore?.get(storeId);
    const value = mock ? { ...DEFAULTS, ...mock, storeId } : { ...DEFAULTS, storeId };
    cache.set(storeId, { value, expiresAt: now + TTL_MS });
    return value as HaidiSettings;
  }

  try {
    const { data, error } = await supabase
      .from("haidi_settings")
      .select("*")
      .eq("store_id", storeId)
      .maybeSingle();
    if (error) {
      console.error("haidi_settings read error", error);
      return { ...DEFAULTS, storeId };
    }
    const value = data ? rowToSettings(data) : { ...DEFAULTS, storeId };
    cache.set(storeId, { value, expiresAt: now + TTL_MS });
    return value;
  } catch (error) {
    console.error("haidi_settings read exception", error);
    return { ...DEFAULTS, storeId };
  }
}

export async function updateHaidiSettings(
  storeId: string,
  patch: Partial<HaidiSettings>,
  updatedBy: string
): Promise<HaidiSettings> {
  cache.delete(storeId);
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const mockState = getMockState();
    if (!mockState.haidiSettingsByStore) {
      (mockState as Record<string, unknown>).haidiSettingsByStore = new Map<string, Partial<HaidiSettings>>();
    }
    const map = mockState.haidiSettingsByStore as Map<string, Partial<HaidiSettings>>;
    const existing = map.get(storeId) ?? {};
    const next = { ...existing, ...patch, updatedAt: new Date().toISOString(), updatedBy };
    map.set(storeId, next);
    return { ...DEFAULTS, ...next, storeId } as HaidiSettings;
  }

  const row = settingsToRow({ ...patch, updatedBy });
  try {
    const { data, error } = await supabase
      .from("haidi_settings")
      .update(row)
      .eq("store_id", storeId)
      .select("*")
      .maybeSingle();
    if (error) {
      console.error("haidi_settings write error", error);
      return { ...DEFAULTS, storeId };
    }
    const value = data ? rowToSettings(data) : { ...DEFAULTS, storeId };
    cache.set(storeId, { value, expiresAt: Date.now() + TTL_MS });
    return value;
  } catch (error) {
    console.error("haidi_settings write exception", error);
    return { ...DEFAULTS, storeId };
  }
}
