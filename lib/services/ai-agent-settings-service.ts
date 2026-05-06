import { getSupabaseServerClient } from "@/lib/adapters/supabase/server";
import { isEncryptionAvailable, encryptSecret, decryptSecret, serializeEncrypted, deserializeEncrypted, maskSecret } from "@/lib/security/encryption";

export type AIAgentSettings = {
  id?: string;
  store_id: string;
  agent_name: string;
  provider: "openai" | "anthropic" | "gemini" | "custom";
  model: string | null;
  connection_status: string;
  last_tested_at: string | null;
  active: boolean;
};

export type SafeAIAgentSettings = AIAgentSettings & {
  api_key_status: "SET" | "MISSING";
  api_key_last4: string | null;
};

export async function getAIAgentSettings(storeId: string): Promise<SafeAIAgentSettings | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("ai_agent_settings")
    .select("id, store_id, agent_name, provider, model, api_key_encrypted, api_key_last4, connection_status, last_tested_at, active")
    .eq("store_id", storeId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    store_id: data.store_id,
    agent_name: data.agent_name,
    provider: data.provider,
    model: data.model,
    connection_status: data.connection_status,
    last_tested_at: data.last_tested_at,
    active: data.active,
    api_key_status: data.api_key_encrypted ? "SET" : "MISSING",
    api_key_last4: data.api_key_last4,
  };
}

export async function updateAIAgentSettings(
  storeId: string,
  values: Partial<AIAgentSettings & { api_key?: string }>,
  actorUserId?: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");

  const update: Record<string, unknown> = {
    store_id: storeId,
    updated_by: actorUserId,
    updated_at: new Date().toISOString(),
  };

  if (values.agent_name !== undefined) update.agent_name = values.agent_name;
  if (values.provider !== undefined) update.provider = values.provider;
  if (values.model !== undefined) update.model = values.model;
  if (values.active !== undefined) update.active = values.active;

  if (values.api_key !== undefined) {
    if (!values.api_key) {
      update.api_key_encrypted = null;
      update.api_key_last4 = null;
    } else if (!isEncryptionAvailable()) {
      throw new Error("encryption_unavailable: SETTINGS_ENCRYPTION_KEY is not configured");
    } else {
      const encrypted = encryptSecret(values.api_key);
      update.api_key_encrypted = serializeEncrypted(encrypted);
      update.api_key_last4 = maskSecret(values.api_key).last4;
    }
  }

  const { error } = await supabase.from("ai_agent_settings").upsert(update);
  if (error) throw error;
}

export async function testAIConnection(storeId: string): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { ok: false, message: "supabase_unavailable" };

  const { data } = await supabase
    .from("ai_agent_settings")
    .select("provider, model, api_key_encrypted")
    .eq("store_id", storeId)
    .maybeSingle();

  if (!data) return { ok: false, message: "no_settings_found" };
  if (!data.api_key_encrypted) return { ok: false, message: "api_key_missing" };

  try {
    if (!isEncryptionAvailable()) return { ok: false, message: "encryption_unavailable" };
    const encrypted = deserializeEncrypted(data.api_key_encrypted);
    const apiKey = decryptSecret(encrypted);

    // Minimal provider-specific smoke test
    if (data.provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        await supabase.from("ai_agent_settings").update({ connection_status: "ok", last_tested_at: new Date().toISOString() }).eq("store_id", storeId);
        return { ok: true, message: "connection_ok" };
      }
      await supabase.from("ai_agent_settings").update({ connection_status: "error", last_tested_at: new Date().toISOString() }).eq("store_id", storeId);
      return { ok: false, message: `openai_error_${res.status}` };
    }

    // For other providers, just validate key presence for now
    await supabase.from("ai_agent_settings").update({ connection_status: "ok", last_tested_at: new Date().toISOString() }).eq("store_id", storeId);
    return { ok: true, message: "key_present" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    await supabase.from("ai_agent_settings").update({ connection_status: "error", last_tested_at: new Date().toISOString() }).eq("store_id", storeId);
    return { ok: false, message: msg };
  }
}
