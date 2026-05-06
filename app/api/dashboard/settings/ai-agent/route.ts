import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getAIAgentSettings, updateAIAgentSettings, testAIConnection } from "@/lib/services/ai-agent-settings-service";
import { canManageSecrets, type DashboardRole } from "@/lib/auth/roles";

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
  if (!role || !canManageSecrets(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const settings = await getAIAgentSettings("youlya");
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageSecrets(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    await updateAIAgentSettings("youlya", body);
    const settings = await getAIAgentSettings("youlya");
    return NextResponse.json({ settings });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageSecrets(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const result = await testAIConnection("youlya");
  return NextResponse.json(result);
}
