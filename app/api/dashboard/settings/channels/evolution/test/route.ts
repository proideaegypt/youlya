import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
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

async function testEvolutionConnection(baseUrl: string, apiKey: string, instanceName: string) {
  const url = `${baseUrl.replace(/\/$/, "")}/instance/connectionState/${encodeURIComponent(instanceName)}`;
  const res = await fetch(url, {
    headers: { apikey: apiKey, "content-type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("فشل الاتصال: تحقق من API Key واسم الـ Instance.");
    }
    const text = await res.text().catch(() => "");
    throw new Error(`فشل الاتصال: ${text || res.status}`);
  }
  return await res.json();
}

export async function POST(req: Request) {
  const role = await getCurrentUserRole();
  if (!role || !canManageChannels(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const form = body.form ?? {};
  const baseUrl = String(form.base_url ?? "").trim();
  const apiKey = String(form.api_key ?? "").trim();
  const instanceName = String(form.instance_name ?? "").trim();

  if (!baseUrl || !apiKey || !instanceName) {
    return NextResponse.json({ error: "أكمل بيانات الربط أولاً" }, { status: 400 });
  }

  try {
    const result = await testEvolutionConnection(baseUrl, apiKey, instanceName);
    return NextResponse.json({ ok: true, state: result.instance?.state ?? "unknown" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ ok: false, error: msg }, { status: 200 });
  }
}
