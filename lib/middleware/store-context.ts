import { getSupabaseServerClient } from "@/lib/adapters/supabase/server";

type SupabaseLike = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
      };
    };
  };
};

export type StoreConfig = {
  storeId: string;
  name: string;
  killSwitchEnabled: boolean;
  freeShippingThreshold: number;
  aiEnabled: boolean;
  locale: string;
};

type CacheEntry = { data: StoreConfig; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 60_000;

export async function getStoreConfig(
  storeId: string,
  client: SupabaseLike | null = getSupabaseServerClient() as unknown as SupabaseLike | null,
): Promise<StoreConfig> {
  const now = Date.now();
  const cached = cache.get(storeId);
  if (cached && cached.expiresAt > now) return cached.data;

  if (!client) {
    const fallback: StoreConfig = {
      storeId,
      name: "Unknown Store",
      killSwitchEnabled: false,
      freeShippingThreshold: 1200,
      aiEnabled: true,
      locale: "ar-EG",
    };
    cache.set(storeId, { data: fallback, expiresAt: now + TTL_MS });
    return fallback;
  }

  const result = await client
    .from("stores")
    .select("id,name,kill_switch_enabled,free_shipping_threshold_egp,ai_enabled")
    .eq("id", storeId)
    .maybeSingle();

  const data = result.data ?? {};
  const config: StoreConfig = {
    storeId,
    name: String(data.name ?? "Store"),
    killSwitchEnabled: Boolean(data.kill_switch_enabled ?? false),
    freeShippingThreshold: Number(data.free_shipping_threshold_egp ?? 1200),
    aiEnabled: Boolean(data.ai_enabled ?? true),
    locale: "ar-EG",
  };
  cache.set(storeId, { data: config, expiresAt: now + TTL_MS });
  return config;
}

