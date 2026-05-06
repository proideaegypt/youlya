import type { CartItem, ProductRecommendation } from "@/lib/types/commerce";

type MappingKey = `${string}:${string}:${string}`;

type MappingEntry = {
  recommendations: ProductRecommendation[];
  createdAt: string;
  expiresAt: string;
};

type StoreState = {
  mappings: Map<MappingKey, MappingEntry>;
  carts: Map<string, CartItem[]>;
  conversationFlow: Map<string, { stage: string; cart: CartItem[]; customerInfo: Record<string, unknown> | null }>;
  orderByIdempotency: Map<string, { id: string; name: string }>;
  toolLogs: Array<Record<string, unknown>>;
  auditLogs: Array<Record<string, unknown>>;
  handoffs: Array<Record<string, unknown>>;
  handoffNotifications: Array<{
    id: string;
    store_id: string;
    type: "handoff_created";
    title: string;
    summary: string;
    handoff_type: string;
    priority: "normal" | "high";
    conversation_id: string;
    handoff_ticket_id: string;
    status: "unread" | "pending" | "read";
    created_at: string;
  }>;
  conversationStatus: Map<string, string>;
  unclearCounts: Map<string, number>;
  killSwitchByStore: Map<string, boolean>;
  aiEnabledByStore: Map<string, boolean>;
  processedMessages: Map<string, { conversationId: string; processedAt: string; resultAction?: string }>;
  humanHandoffs: Array<{
    id: string;
    conversation_id: string;
    reason: string;
    requested_at: string;
    resolved_at: string | null;
    resolved_by: string | null;
    notes: string | null;
  }>;
  aiPausedConversations: Set<string>;
  conversationHistory: Map<string, Record<string, unknown>>;
  messageHistory: Array<Record<string, unknown>>;
  conversationEvents: Array<Record<string, unknown>>;
  knowledgeBase: Array<Record<string, unknown>>;
  knowledgeVersions: Array<Record<string, unknown>>;
  knowledgeSuggestions: Array<Record<string, unknown>>;
  haidiLabScenarios: Array<Record<string, unknown>>;
  haidiLabRuns: Array<Record<string, unknown>>;
  haidiSettingsByStore: Map<string, Record<string, unknown>>;
  haidiPromptByStore: Map<string, Record<string, unknown>>;
};

const globalStore = globalThis as typeof globalThis & { __youlyaMockState__?: StoreState };

function buildState(): StoreState {
  return {
    mappings: new Map(),
    carts: new Map(),
    conversationFlow: new Map(),
    orderByIdempotency: new Map(),
    toolLogs: [],
    auditLogs: [],
    handoffs: [],
    handoffNotifications: [],
    conversationStatus: new Map(),
    unclearCounts: new Map(),
    killSwitchByStore: new Map(),
    aiEnabledByStore: new Map(),
    processedMessages: new Map(),
    humanHandoffs: [],
    aiPausedConversations: new Set(),
    conversationHistory: new Map(),
    messageHistory: [],
    conversationEvents: [],
    knowledgeBase: [],
    knowledgeVersions: [],
    knowledgeSuggestions: [],
    haidiLabScenarios: [],
    haidiLabRuns: [],
    haidiSettingsByStore: new Map(),
    haidiPromptByStore: new Map(),
  };
}

export function getMockState(): StoreState {
  if (!globalStore.__youlyaMockState__) globalStore.__youlyaMockState__ = buildState();
  return globalStore.__youlyaMockState__;
}

export function mappingKey(storeSlug: string, conversationId: string, customerId: string): MappingKey {
  return `${storeSlug}:${conversationId}:${customerId}`;
}
