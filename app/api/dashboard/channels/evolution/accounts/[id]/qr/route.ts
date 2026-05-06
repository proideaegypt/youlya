import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { fetchEvolutionQR } from "@/lib/adapters/evolution/evolution-instance-client";
import { getChannelAccounts, updateChannelAccount } from "@/lib/services/channel-settings-service";
import { canManageChannels, type DashboardRole } from "@/lib/auth/roles";

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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const role = await getCurrentUserRole();
  if (!role || !canManageChannels(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const accounts = await getChannelAccounts("youlya");
    const account = accounts.find((a) => a.id === id);
    if (!account) return NextResponse.json({ error: "not_found" }, { status: 404 });
    if (!account.evolution_instance) return NextResponse.json({ error: "no_instance" }, { status: 400 });
    const qr = await fetchEvolutionQR(account.evolution_instance);
    const qrBase64 = qr.qrcode?.base64 ?? null;
    await updateChannelAccount(id, { qr_status: qrBase64 ? "ready" : "waiting" });
    return NextResponse.json({ qr: qrBase64, instance: qr.instance });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
