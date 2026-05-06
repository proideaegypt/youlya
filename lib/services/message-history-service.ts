import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type MessageDirection = "inbound" | "outbound" | "system";
export type MessageStatus = "pending" | "delivered" | "failed" | "blocked";
export type MessageType = "text" | "audio" | "image" | "system" | "voice";

export type InboundMessageInput = {
  store_id: string;
  conversation_id: string;
  customer_id?: string;
  provider_message_id?: string;
  channel: string;
  message_type: MessageType;
  text?: string;
  transcript?: string;
  image_caption?: string;
  raw_payload?: Record<string, unknown>;
  n8n_execution_id?: string;
  evolution_message_id?: string;
};

export type OutboundMessageInput = {
  store_id: string;
  conversation_id: string;
  customer_id?: string;
  channel: string;
  message_type: MessageType;
  text: string;
  ai_agent_draft?: string;
  final_reply?: string;
  status?: MessageStatus;
  n8n_execution_id?: string;
  evolution_message_id?: string;
  error_code?: string;
};

export type ConversationEventInput = {
  store_id: string;
  conversation_id: string;
  event_type: "tool_call" | "handoff" | "error" | "ai_reply" | "human_reply" | "system" | "status_change" | "cart_update";
  summary: string;
  metadata?: Record<string, unknown>;
};

export type TimelineItem = {
  id: string;
  type: "message" | "event";
  direction?: MessageDirection;
  event_type?: string;
  text?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

const SECRET_PATTERNS = [
  /sk-[^\s"'`]+/g,
  /Bearer\s+[^\s"'`]+/gi,
  /apikey\s*[:=]\s*[^\s"'`]+/gi,
  /password\s*[:=]\s*[^\s"'`]+/gi,
];

export function maskCustomerIdentifier(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 8) {
    return digits.slice(0, 3) + "****" + digits.slice(-3);
  }
  return raw.length > 4 ? raw.slice(0, 2) + "****" : "****";
}

function stripSecrets(text: string): string {
  let cleaned = text;
  for (const pattern of SECRET_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[REDACTED]");
  }
  return cleaned;
}

function safeJson(value: unknown): Record<string, unknown> {
  try {
    return JSON.parse(JSON.stringify(value ?? {}));
  } catch {
    return {};
  }
}

export async function ensureConversation(
  conversationId: string,
  storeId: string,
  channel: string,
  customerId?: string,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const mock = getMockState();
    if (!mock.conversationHistory.has(conversationId)) {
      mock.conversationHistory.set(conversationId, {
        store_id: storeId,
        channel,
        customer_id: customerId ?? conversationId,
        status: "ai_active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
      });
    }
    return;
  }

  const now = new Date().toISOString();
  const row = {
    id: conversationId,
    store_id: storeId,
    customer_id: customerId ?? conversationId,
    channel,
    status: "ai_active",
    created_at: now,
    updated_at: now,
    last_message_at: now,
  };

  try {
    const { error } = await supabase.from("conversations").upsert(row, { onConflict: "id" });
    if (error) console.error("ensureConversation error", error);
  } catch (e) {
    console.error("ensureConversation exception", e);
  }
}

export async function logInboundMessage(input: InboundMessageInput): Promise<void> {
  await ensureConversation(input.conversation_id, input.store_id, input.channel, input.customer_id);

  const supabase = getSupabaseServerClient();
  const safeText = stripSecrets(input.text ?? "");

  if (!supabase) {
    const mock = getMockState();
    mock.messageHistory.push({
      ...input,
      direction: "inbound" as MessageDirection,
      body: safeText,
      text: safeText,
      status: "delivered" as MessageStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return;
  }

  try {
    const { error } = await supabase.from("messages").insert({
      store_id: input.store_id,
      conversation_id: input.conversation_id,
      customer_id: input.customer_id,
      provider_message_id: input.provider_message_id,
      channel: input.channel,
      direction: "inbound",
      message_type: input.message_type,
      body: safeText,
      text: safeText,
      transcript: input.transcript,
      image_caption: input.image_caption,
      raw_payload: safeJson(input.raw_payload),
      n8n_execution_id: input.n8n_execution_id,
      evolution_message_id: input.evolution_message_id,
      status: "delivered",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("logInboundMessage error", error);

    // Update last_message_at on conversation
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", input.conversation_id);
  } catch (e) {
    console.error("logInboundMessage exception", e);
  }
}

export async function logOutboundMessage(input: OutboundMessageInput): Promise<void> {
  await ensureConversation(input.conversation_id, input.store_id, input.channel, input.customer_id);

  const supabase = getSupabaseServerClient();
  const safeText = stripSecrets(input.text);
  const safeDraft = input.ai_agent_draft ? stripSecrets(input.ai_agent_draft) : undefined;
  const safeFinalReply = input.final_reply ? stripSecrets(input.final_reply) : safeText;

  if (!supabase) {
    const mock = getMockState();
    mock.messageHistory.push({
      ...input,
      direction: "outbound" as MessageDirection,
      body: safeFinalReply,
      text: safeText,
      ai_agent_draft: safeDraft,
      final_reply: safeFinalReply,
      status: input.status ?? "delivered",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return;
  }

  try {
    const { error } = await supabase.from("messages").insert({
      store_id: input.store_id,
      conversation_id: input.conversation_id,
      customer_id: input.customer_id,
      channel: input.channel,
      direction: "outbound",
      message_type: input.message_type,
      body: safeFinalReply,
      text: safeText,
      ai_agent_draft: safeDraft,
      final_reply: safeFinalReply,
      status: input.status ?? "delivered",
      n8n_execution_id: input.n8n_execution_id,
      evolution_message_id: input.evolution_message_id,
      error_code: input.error_code,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("logOutboundMessage error", error);

    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", input.conversation_id);
  } catch (e) {
    console.error("logOutboundMessage exception", e);
  }
}

export async function logSystemEvent(input: ConversationEventInput): Promise<void> {
  await ensureConversation(input.conversation_id, input.store_id, "whatsapp_evolution");

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const mock = getMockState();
    mock.conversationEvents.push({
      ...input,
      metadata: safeJson(input.metadata),
      created_at: new Date().toISOString(),
    });
    return;
  }

  try {
    const { error } = await supabase.from("conversation_events").insert({
      store_id: input.store_id,
      conversation_id: input.conversation_id,
      event_type: input.event_type,
      summary: stripSecrets(input.summary),
      metadata: safeJson(input.metadata),
      created_at: new Date().toISOString(),
    });
    if (error) console.error("logSystemEvent error", error);
  } catch (e) {
    console.error("logSystemEvent exception", e);
  }
}

export async function getConversationTimeline(
  conversationId: string,
  storeId: string,
  options?: { limit?: number; offset?: number },
): Promise<TimelineItem[]> {
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const mock = getMockState();
    const messages = mock.messageHistory
      .filter((m: Record<string, unknown>) => m.conversation_id === conversationId)
      .map((m: Record<string, unknown>) => ({
        id: String(m.id ?? Math.random()),
        type: "message" as const,
        direction: String(m.direction) as MessageDirection,
        text: String(m.text ?? ""),
        metadata: safeJson(m.metadata),
        created_at: String(m.created_at),
      }));
    const events = mock.conversationEvents
      .filter((e: Record<string, unknown>) => e.conversation_id === conversationId)
      .map((e: Record<string, unknown>) => ({
        id: String(e.id ?? Math.random()),
        type: "event" as const,
        event_type: String(e.event_type),
        summary: String(e.summary ?? ""),
        metadata: safeJson(e.metadata),
        created_at: String(e.created_at),
      }));
    return [...messages, ...events]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);
  }

  try {
    const [msgRes, evtRes] = await Promise.all([
      supabase
        .from("messages")
        .select("id,direction,body,text,ai_agent_draft,final_reply,status,error_code,metadata,created_at")
        .eq("conversation_id", conversationId)
        .eq("store_id", storeId)
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("conversation_events")
        .select("id,event_type,summary,metadata,created_at")
        .eq("conversation_id", conversationId)
        .eq("store_id", storeId)
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    const messages = (msgRes.data ?? []).map((m) => ({
      id: m.id,
      type: "message" as const,
      direction: String(m.direction) as MessageDirection,
      text: String(m.body ?? m.text ?? m.final_reply ?? m.ai_agent_draft ?? ""),
      metadata: safeJson(m.metadata),
      created_at: m.created_at,
    }));

    const events = (evtRes.data ?? []).map((e) => ({
      id: e.id,
      type: "event" as const,
      event_type: String(e.event_type),
      summary: String(e.summary ?? ""),
      metadata: safeJson(e.metadata),
      created_at: e.created_at,
    }));

    return [...messages, ...events]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  } catch (e) {
    console.error("getConversationTimeline exception", e);
    return [];
  }
}

export async function listConversations(
  storeId: string,
  options?: {
    status?: string;
    channel?: string;
    assignee?: string;
    search?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  },
): Promise<Array<Record<string, unknown>>> {
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const mock = getMockState();
    const rows = Array.from(mock.conversationHistory.entries()).map(([id, data]) => ({ id, ...(data as Record<string, unknown>) }));
    return rows.filter((row: Record<string, unknown>) => {
        if (options?.status && String(row.status ?? "") !== options.status) return false;
        if (options?.channel && String(row.channel ?? "") !== options.channel) return false;
        if (options?.assignee && String(row.assigned_to ?? "") !== options.assignee) return false;
        if (options?.search) {
          const haystack = [
            String(row.id ?? ""),
            String(row.customer_id ?? ""),
            String(row.channel ?? ""),
            String(row.status ?? ""),
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(options.search.toLowerCase())) return false;
        }
        if (options?.from && new Date(String(row.last_message_at ?? row.created_at)).getTime() < new Date(options.from).getTime()) return false;
        if (options?.to && new Date(String(row.last_message_at ?? row.created_at)).getTime() >= new Date(options.to).getTime()) return false;
        return true;
      });
  }

  try {
    let query = supabase
      .from("conversations")
      .select("id,store_id,channel,customer_id,status,ai_paused,assigned_to,last_message_at,created_at,updated_at")
      .eq("store_id", storeId)
      .order("last_message_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (options?.status) {
      query = query.eq("status", options.status);
    }
    if (options?.channel) {
      query = query.eq("channel", options.channel);
    }
    if (options?.assignee) {
      query = query.eq("assigned_to", options.assignee);
    }
    if (options?.from) {
      query = query.gte("last_message_at", options.from);
    }
    if (options?.to) {
      query = query.lt("last_message_at", options.to);
    }
    if (options?.search) {
      const term = options.search.trim();
      if (term) {
        query = query.or(`id.ilike.%${term}%,customer_id.ilike.%${term}%,channel.ilike.%${term}%`);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("listConversations error", error);
      return [];
    }

    return (data ?? []).map((row) => ({
      ...row,
      customer_id_masked: maskCustomerIdentifier(String(row.customer_id ?? "")),
    }));
  } catch (e) {
    console.error("listConversations exception", e);
    return [];
  }
}
