import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getChannelAccounts, addChannelAccount, updateChannelAccount } from "@/lib/services/channel-settings-service";
import { createEvolutionInstance, getEvolutionConnectionState } from "@/lib/adapters/evolution/evolution-instance-client";
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

export async function GET() {
  const role = await getCurrentUserRole();
  if (!role || !canManageChannels(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const accounts = await getChannelAccounts("youlya");
  return NextResponse.json({ accounts });
}

export async function POST(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageChannels(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    const accountName = String(body.account_name || body.evolution_instance || "youlya-");
    const instanceName = String(body.evolution_instance || accountName);
    // Optionally create instance in Evolution first
    if (body.create_instance !== false) {
      await createEvolutionInstance(instanceName);
    }
    await addChannelAccount("youlya", {
      channel_integration_id: body.channel_integration_id,
      provider: "evolution_whatsapp",
      account_name: accountName,
      external_account_id: body.external_account_id ?? null,
      phone_number: body.phone_number ?? null,
      phone_number_masked: body.phone_number ? "••••" + String(body.phone_number).slice(-4) : null,
      evolution_instance: instanceName,
      status: "disconnected",
      qr_status: "unknown",
      is_default: Boolean(body.is_default),
      active: true,
    });
    const accounts = await getChannelAccounts("youlya");
    return NextResponse.json({ accounts });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
