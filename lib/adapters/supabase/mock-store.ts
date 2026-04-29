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
  orderByIdempotency: Map<string, { id: string; name: string }>;
  toolLogs: Array<Record<string, unknown>>;
  auditLogs: Array<Record<string, unknown>>;
  handoffs: Array<Record<string, unknown>>;
  conversationStatus: Map<string, string>;
  unclearCounts: Map<string, number>;
  killSwitchByStore: Map<string, boolean>;
};

const globalStore = globalThis as typeof globalThis & { __youlyaMockState__?: StoreState };

function buildState(): StoreState {
  return {
    mappings: new Map(),
    carts: new Map(),
    orderByIdempotency: new Map(),
    toolLogs: [],
    auditLogs: [],
    handoffs: [],
    conversationStatus: new Map(),
    unclearCounts: new Map(),
    killSwitchByStore: new Map(),
  };
}

export function getMockState(): StoreState {
  if (!globalStore.__youlyaMockState__) globalStore.__youlyaMockState__ = buildState();
  return globalStore.__youlyaMockState__;
}

export function mappingKey(storeSlug: string, conversationId: string, customerId: string): MappingKey {
  return `${storeSlug}:${conversationId}:${customerId}`;
}
