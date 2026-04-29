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
    conversationStatus: new Map(),
    unclearCounts: new Map(),
    killSwitchByStore: new Map(),
    aiEnabledByStore: new Map(),
    processedMessages: new Map(),
    humanHandoffs: [],
  };
}

export function getMockState(): StoreState {
  if (!globalStore.__youlyaMockState__) globalStore.__youlyaMockState__ = buildState();
  return globalStore.__youlyaMockState__;
}

export function mappingKey(storeSlug: string, conversationId: string, customerId: string): MappingKey {
  return `${storeSlug}:${conversationId}:${customerId}`;
}
