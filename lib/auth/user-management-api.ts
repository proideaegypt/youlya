import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { DashboardRole } from "@/lib/auth/roles";

export const USER_MGMT_STORE_ID = "youlya";

export function getServiceSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
}

export async function getCurrentDashboardActor() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("store_user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("store_id", USER_MGMT_STORE_ID)
    .maybeSingle();

  if (membership?.role) {
    return { userId: user.id, role: membership.role as DashboardRole };
  }

  const { data: legacy } = await supabase.from("users_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (!legacy?.role) return null;
  return { userId: user.id, role: legacy.role as DashboardRole };
}

export async function findAuthUserById(userId: string, serviceSupabase: NonNullable<ReturnType<typeof getServiceSupabaseAdmin>>) {
  const { data, error } = await serviceSupabase.auth.admin.listUsers();
  if (error) return { user: null, error };
  const user = data.users.find((u) => u.id === userId) ?? null;
  return { user, error: null };
}

export async function countActiveSuperAdmins(serviceSupabase: NonNullable<ReturnType<typeof getServiceSupabaseAdmin>>) {
  const { data: roles } = await serviceSupabase
    .from("store_user_roles")
    .select("user_id")
    .eq("store_id", USER_MGMT_STORE_ID)
    .eq("role", "super_admin");

  const superAdminIds = [...new Set((roles ?? []).map((r) => r.user_id))];
  if (superAdminIds.length === 0) return 0;

  const { data: authUsersData, error } = await serviceSupabase.auth.admin.listUsers();
  if (error) return 0;
  return authUsersData.users.filter((u) => superAdminIds.includes(u.id) && u.user_metadata?.is_active !== false).length;
}
