import { getSupabaseServerClient as getClient } from "@/lib/adapters/supabase/client";

export function getSupabaseServerClient() {
  return getClient();
}
