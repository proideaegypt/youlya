import { createClient } from "@supabase/supabase-js";

export async function resolveStoreUuid(storeSlug: string): Promise<string | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "mock") return null;

  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  // If it already looks like a UUID, return as-is
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(storeSlug)) {
    return storeSlug;
  }

  const { data, error } = await client
    .from("stores")
    .select("id")
    .eq("slug", storeSlug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return String(data.id);
}
