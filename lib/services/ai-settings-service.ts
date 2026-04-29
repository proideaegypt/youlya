import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const TTL_MS = 30_000;
const cache = new Map<string, { value: boolean; expiresAt: number }>();

export async function isAiEnabled(storeId = "youlya"): Promise<boolean> {
  const now = Date.now();
  const hit = cache.get(storeId);
  if (hit && hit.expiresAt > now) return hit.value;

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const value = getMockState().aiEnabledByStore.get(storeId) ?? true;
    cache.set(storeId, { value, expiresAt: now + TTL_MS });
    return value;
  }

  try {
    const { data, error } = await supabase.from("ai_settings").select("ai_enabled").eq("store_id", storeId).maybeSingle();
    if (error) {
      console.error("ai_settings read error", error);
      return true;
    }
    const value = data?.ai_enabled ?? true;
    cache.set(storeId, { value, expiresAt: now + TTL_MS });
    return value;
  } catch (error) {
    console.error("ai_settings read exception", error);
    return true;
  }
}

export async function setAiEnabled(storeId: string, enabled: boolean, updatedBy: string): Promise<void> {
  cache.delete(storeId);
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    getMockState().aiEnabledByStore.set(storeId, enabled);
    return;
  }

  try {
    const { error } = await supabase.from("ai_settings").upsert({
      store_id: storeId,
      ai_enabled: enabled,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy,
    });
    if (error) console.error("ai_settings write error", error);
  } catch (error) {
    console.error("ai_settings write exception", error);
  }
}
