import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  if (process.env.TEST_MODE === "true" || process.env.SUPABASE_URL === "mock") {
    return null;
  }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
