import { getMockState } from "@/lib/adapters/supabase/mock-store";

type CacheEntry = { enabled: boolean; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 30_000;

export async function isKillSwitchEnabled(store_id: string): Promise<boolean> {
  const now = Date.now();
  const cached = cache.get(store_id);
  if (cached && cached.expiresAt > now) return cached.enabled;

  const enabled = getMockState().killSwitchByStore.get(store_id) ?? false;
  cache.set(store_id, { enabled, expiresAt: now + TTL_MS });
  return enabled;
}

export function setKillSwitchForStore(store_id: string, enabled: boolean) {
  getMockState().killSwitchByStore.set(store_id, enabled);
  cache.delete(store_id);
}

