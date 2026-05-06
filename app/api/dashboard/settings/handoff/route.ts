import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getHandoffSettings, updateHandoffSettings } from "@/lib/services/handoff-settings-service";
import { canManageSettings, type DashboardRole } from "@/lib/auth/roles";

async function getCurrentUserRole() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: membership } = await supabase.from("store_user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (membership?.role) return membership.role as DashboardRole;
  const { data: legacy } = await supabase.from("users_roles").select("role").eq("user_id", user.id).maybeSingle();
  return legacy?.role as DashboardRole | null;
}

export async function GET() {
  const role = await getCurrentUserRole();
  if (!role || !canManageSettings(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const settings = await getHandoffSettings("youlya");
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageSettings(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const global_handoff_enabled = Boolean(body.globalHandoffEnabled ?? body.global_handoff_enabled);
  const settings = await updateHandoffSettings("youlya", { global_handoff_enabled });
  return NextResponse.json({ settings });
}
