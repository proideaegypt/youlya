import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type HandoffSettings = {
  store_id: string;
  global_handoff_enabled: boolean;
  updated_at: string;
};

export async function getHandoffSettings(storeId: string): Promise<HandoffSettings> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const state = getMockState();
    return {
      store_id: storeId,
      global_handoff_enabled: state.globalHandoffEnabled ?? true,
      updated_at: new Date().toISOString(),
    };
  }

  try {
    const { data } = await supabase
      .from("handoff_settings")
      .select("store_id, global_handoff_enabled, updated_at")
      .eq("store_id", storeId)
      .maybeSingle();

    if (data) {
      return {
        store_id: String(data.store_id),
        global_handoff_enabled: data.global_handoff_enabled !== false,
        updated_at: String(data.updated_at),
      };
    }
  } catch {
    // fallthrough
  }

  // Return safe default
  return {
    store_id: storeId,
    global_handoff_enabled: true,
    updated_at: new Date().toISOString(),
  };
}

export async function updateHandoffSettings(
  storeId: string,
  values: { global_handoff_enabled: boolean },
  actorUserId?: string
): Promise<HandoffSettings> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const state = getMockState();
    state.globalHandoffEnabled = values.global_handoff_enabled;
    return {
      store_id: storeId,
      global_handoff_enabled: values.global_handoff_enabled,
      updated_at: new Date().toISOString(),
    };
  }

  const now = new Date().toISOString();
  const update = {
    store_id: storeId,
    global_handoff_enabled: values.global_handoff_enabled,
    updated_at: now,
    updated_by: actorUserId,
  };

  try {
    const { error } = await supabase.from("handoff_settings").upsert(update);
    if (error) console.error("handoff_settings upsert error", error);
  } catch (e) {
    console.error("handoff_settings upsert exception", e);
  }

  return {
    store_id: storeId,
    global_handoff_enabled: values.global_handoff_enabled,
    updated_at: now,
  };
}

export async function isGlobalHandoffEnabled(storeId: string): Promise<boolean> {
  const settings = await getHandoffSettings(storeId);
  return settings.global_handoff_enabled;
}
