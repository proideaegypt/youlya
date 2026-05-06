import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getStoreShippingSettings, getShippingZones, updateStoreShippingSettings, addShippingZone, updateShippingZone, deactivateShippingZone, calculateShippingFromSettings, matchShippingZone } from "@/lib/services/shipping-settings-service";
import { canManageShipping, type DashboardRole } from "@/lib/auth/roles";

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
  if (!role || !canManageShipping(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const settings = await getStoreShippingSettings("youlya");
  const zones = await getShippingZones("youlya");
  return NextResponse.json({ settings, zones });
}

export async function POST(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageShipping(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    if (body.settings) {
      await updateStoreShippingSettings("youlya", body.settings);
    }
    if (body.addZone) {
      await addShippingZone("youlya", body.addZone);
    }
    if (body.updateZone) {
      await updateShippingZone(body.updateZone.id, body.updateZone.values);
    }
    if (body.deactivateZone) {
      await deactivateShippingZone(body.deactivateZone.id);
    }
    const settings = await getStoreShippingSettings("youlya");
    const zones = await getShippingZones("youlya");
    return NextResponse.json({ settings, zones });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageShipping(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const settings = await getStoreShippingSettings("youlya");
  const zones = await getShippingZones("youlya");
  if (!settings) {
    return NextResponse.json({ error: "no_settings" }, { status: 500 });
  }
  const result = calculateShippingFromSettings(settings, zones, body.subtotal ?? 0, body.address ?? "");
  return NextResponse.json({ result });
}
