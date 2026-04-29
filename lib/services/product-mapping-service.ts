import { getMockState, mappingKey } from "@/lib/adapters/supabase/mock-store";
import type { ProductRecommendation } from "@/lib/types/commerce";

export function persistRecommendations(storeSlug: string, conversationId: string, customerId: string, recs: ProductRecommendation[]) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  getMockState().mappings.set(mappingKey(storeSlug, conversationId, customerId), {
    recommendations: recs,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });
}

export function getRecommendations(storeSlug: string, conversationId: string, customerId: string) {
  const entry = getMockState().mappings.get(mappingKey(storeSlug, conversationId, customerId));
  if (!entry) return [];
  if (new Date(entry.expiresAt).getTime() < Date.now()) return [];
  return entry.recommendations;
}

export function expireRecommendations(storeSlug: string, conversationId: string, customerId: string) {
  const entry = getMockState().mappings.get(mappingKey(storeSlug, conversationId, customerId));
  if (!entry) return;
  entry.expiresAt = new Date(Date.now() - 1000).toISOString();
  getMockState().mappings.set(mappingKey(storeSlug, conversationId, customerId), entry);
}
