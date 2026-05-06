import { getSupabaseServerClient } from "@/lib/adapters/supabase/server";

export type UserProfile = {
  id?: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  preferred_language: string;
  preferred_theme: string;
  preferred_color_theme: string;
  sidebar_collapsed: boolean;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("user_profiles")
    .select("id, user_id, username, display_name, preferred_language, preferred_theme, preferred_color_theme, sidebar_collapsed")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return null;
  return data as UserProfile;
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { user_id: string }) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  const { error } = await supabase
    .from("user_profiles")
    .upsert({
      ...profile,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}
