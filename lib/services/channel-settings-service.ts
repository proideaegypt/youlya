import { getSupabaseServerClient } from "@/lib/adapters/supabase/server";
import { isEncryptionAvailable, encryptSecret, decryptSecret, serializeEncrypted, deserializeEncrypted, maskSecret } from "@/lib/security/encryption";

export type ChannelIntegration = {
  id: string;
  store_id: string;
  provider: "evolution_whatsapp" | "meta_whatsapp" | "instagram" | "facebook";
  display_name: string;
  active: boolean;
  connection_status: string;
  last_checked_at: string | null;
};

export type SafeChannelIntegration = ChannelIntegration & {
  credentials_status: "SET" | "MISSING";
  credential_last4: string | null;
};

export type ChannelAccount = {
  id: string;
  store_id: string;
  channel_integration_id: string;
  provider: string;
  account_name: string;
  external_account_id: string | null;
  phone_number: string | null;
  phone_number_masked: string | null;
  evolution_instance: string | null;
  status: string;
  qr_status: string;
  is_default: boolean;
  active: boolean;
};

export async function getChannelIntegrations(storeId: string): Promise<SafeChannelIntegration[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("channel_integrations")
    .select("id, store_id, provider, display_name, active, credentials_encrypted, credential_last4, connection_status, last_checked_at")
    .eq("store_id", storeId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((row) => ({
    id: row.id,
    store_id: row.store_id,
    provider: row.provider,
    display_name: row.display_name,
    active: row.active,
    connection_status: row.connection_status,
    last_checked_at: row.last_checked_at,
    credentials_status: row.credentials_encrypted ? "SET" : "MISSING",
    credential_last4: row.credential_last4,
  }));
}

export async function getChannelAccounts(storeId: string): Promise<ChannelAccount[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("channel_accounts")
    .select("id, store_id, channel_integration_id, provider, account_name, external_account_id, phone_number, phone_number_masked, evolution_instance, status, qr_status, is_default, active")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("created_at", { ascending: true });
  return (data ?? []) as ChannelAccount[];
}

export async function updateChannelIntegration(
  storeId: string,
  integrationId: string | null,
  values: Partial<ChannelIntegration & { credentials?: string; webhook_secret?: string }>,
  actorUserId?: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");

  const update: Record<string, unknown> = {
    store_id: storeId,
    updated_by: actorUserId,
    updated_at: new Date().toISOString(),
  };

  if (values.display_name !== undefined) update.display_name = values.display_name;
  if (values.active !== undefined) update.active = values.active;

  if (values.credentials !== undefined) {
    if (!values.credentials) {
      update.credentials_encrypted = null;
      update.credential_last4 = null;
    } else if (!isEncryptionAvailable()) {
      throw new Error("encryption_unavailable");
    } else {
      const encrypted = encryptSecret(values.credentials);
      update.credentials_encrypted = serializeEncrypted(encrypted);
      update.credential_last4 = maskSecret(values.credentials).last4;
    }
  }

  if (values.webhook_secret !== undefined) {
    if (!values.webhook_secret) {
      update.webhook_secret_encrypted = null;
    } else if (!isEncryptionAvailable()) {
      throw new Error("encryption_unavailable");
    } else {
      const encrypted = encryptSecret(values.webhook_secret);
      update.webhook_secret_encrypted = serializeEncrypted(encrypted);
    }
  }

  if (integrationId) {
    const { error } = await supabase.from("channel_integrations").update(update).eq("id", integrationId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("channel_integrations").insert({ ...update, provider: values.provider });
    if (error) throw error;
  }
}

export async function addChannelAccount(
  storeId: string,
  account: Omit<ChannelAccount, "id" | "store_id">,
  actorUserId?: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  const { error } = await supabase.from("channel_accounts").insert({ ...account, store_id: storeId });
  if (error) throw error;
}

export async function updateChannelAccount(
  accountId: string,
  values: Partial<ChannelAccount>,
  actorUserId?: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  const { error } = await supabase
    .from("channel_accounts")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", accountId);
  if (error) throw error;
}

export async function setDefaultChannelAccount(storeId: string, accountId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  // Unset all defaults first
  await supabase.from("channel_accounts").update({ is_default: false }).eq("store_id", storeId);
  // Set new default
  const { error } = await supabase.from("channel_accounts").update({ is_default: true }).eq("id", accountId);
  if (error) throw error;
}
