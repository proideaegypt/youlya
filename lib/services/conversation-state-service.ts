import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createHandoffTicket } from "@/lib/services/handoff-service";

type ConversationStateJson = {
  unclearCount?: number;
  [key: string]: unknown;
};

type ConversationStateRecord = {
  id: string;
  store_id: string;
  customer_id: string;
  channel: string;
  state_json: ConversationStateJson;
  ai_enabled: boolean;
  agent_handling: boolean;
  ai_killed: boolean;
  updated_at: string;
};

const DEFAULT_STORE_ID = "00000000-0000-0000-0000-000000000001";

async function readConversationState(conversationId: string): Promise<ConversationStateJson> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { unclearCount: getMockState().unclearCounts.get(conversationId) ?? 0 };
  }

  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("state_json")
      .eq("id", conversationId)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("readConversationState error", error);
      return { unclearCount: 0 };
    }

    const stateJson =
      data.state_json && typeof data.state_json === "object" ? (data.state_json as ConversationStateJson) : {};
    return stateJson;
  } catch (error) {
    console.error("readConversationState exception", error);
    return { unclearCount: 0 };
  }
}

async function writeConversationState(
  conversationId: string,
  stateJson: ConversationStateJson,
  context?: { store_id?: string; customer_id?: string; channel?: string },
): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    getMockState().unclearCounts.set(conversationId, Number(stateJson.unclearCount ?? 0));
    return;
  }

  try {
    const row = {
      id: conversationId,
      store_id: context?.store_id ?? DEFAULT_STORE_ID,
      customer_id: context?.customer_id ?? DEFAULT_STORE_ID,
      channel: context?.channel ?? "whatsapp_evolution",
      state_json: stateJson,
      ai_enabled: true,
      agent_handling: false,
      ai_killed: false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("conversations").upsert(row, { onConflict: "id" });
    if (error) console.error("writeConversationState error", error);
  } catch (error) {
    console.error("writeConversationState exception", error);
  }
}

export async function loadConversationState(conversationId: string): Promise<ConversationStateRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      id: conversationId,
      store_id: DEFAULT_STORE_ID,
      customer_id: DEFAULT_STORE_ID,
      channel: "whatsapp_evolution",
      state_json: { unclearCount: getMockState().unclearCounts.get(conversationId) ?? 0 },
      ai_enabled: true,
      agent_handling: false,
      ai_killed: false,
      updated_at: new Date().toISOString(),
    };
  }

  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("id,store_id,customer_id,channel,state_json,ai_enabled,agent_handling,ai_killed,updated_at")
      .eq("id", conversationId)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("loadConversationState error", error);
      return null;
    }

    return data as unknown as ConversationStateRecord;
  } catch (error) {
    console.error("loadConversationState exception", error);
    return null;
  }
}

export async function saveConversationState(
  conversationId: string,
  state: ConversationStateJson,
  context?: { store_id?: string; customer_id?: string; channel?: string },
): Promise<void> {
  await writeConversationState(conversationId, state, context);
}

export async function getUnclearCount(conversation_id: string): Promise<number> {
  const stateJson = await readConversationState(conversation_id);
  return Number(stateJson.unclearCount ?? 0);
}

export async function incrementUnclearCount(
  conversation_id: string,
  context?: { store_id: string; customer_id: string; ai_summary?: string },
): Promise<number> {
  const state = getMockState();
  const next = (await getUnclearCount(conversation_id)) + 1;

  if (!getSupabaseServerClient()) {
    state.unclearCounts.set(conversation_id, next);
  }

  await writeConversationState(conversation_id, { unclearCount: next }, context);

  if (next >= 3 && context) {
    await createHandoffTicket({
      store_id: context.store_id,
      conversation_id,
      customer_id: context.customer_id,
      reason: "UNCLEAR_3X",
      priority: "NORMAL",
      ai_summary: context.ai_summary ?? "Auto handoff after 3 unclear turns",
    });
  }
  return next;
}

export async function resetUnclearCount(conversation_id: string): Promise<void> {
  getMockState().unclearCounts.set(conversation_id, 0);
  await writeConversationState(conversation_id, { unclearCount: 0 });
}
