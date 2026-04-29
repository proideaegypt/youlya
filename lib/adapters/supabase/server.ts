import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/config/env";

export function getSupabaseServerClient() {
  const env = getServerEnv();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-youlya-app-env": env.APP_ENV } },
  });
}

