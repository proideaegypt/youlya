import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getChannelIntegrations, getChannelAccounts, updateChannelIntegration, addChannelAccount, updateChannelAccount, setDefaultChannelAccount } from "@/lib/services/channel-settings-service";
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
  const integrations = await getChannelIntegrations("youlya");
  const accounts = await getChannelAccounts("youlya");
  return NextResponse.json({ integrations, accounts });
}

export async function POST(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageChannels(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    if (body.integration) {
      await updateChannelIntegration("youlya", body.integration.id ?? null, body.integration.values);
    }
    if (body.addAccount) {
      await addChannelAccount("youlya", body.addAccount);
    }
    if (body.updateAccount) {
      await updateChannelAccount(body.updateAccount.id, body.updateAccount.values);
    }
    if (body.setDefault) {
      await setDefaultChannelAccount("youlya", body.setDefault.id);
    }
    const integrations = await getChannelIntegrations("youlya");
    const accounts = await getChannelAccounts("youlya");
    return NextResponse.json({ integrations, accounts });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageChannels(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  // Test connection placeholder — actual provider test would go here
  if (body.test) {
    // Simulate test based on provider type
    const type = body.type as string;
    if (type === "evolution_whatsapp") {
      return NextResponse.json({ ok: true, message: "Evolution connection test not implemented in this task" });
    }
    return NextResponse.json({ ok: true, message: "Connection test not implemented" });
  }
  return NextResponse.json({ error: "unknown_operation" }, { status: 400 });
}
