import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getUserProfile, upsertUserProfile } from "@/lib/services/profile-service";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const profile = await getUserProfile(user.id);
  return NextResponse.json({ profile, email: user.email });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    await upsertUserProfile({
      user_id: user.id,
      username: body.username,
      display_name: body.display_name,
      preferred_language: body.preferred_language,
      preferred_theme: body.preferred_theme,
      preferred_color_theme: body.preferred_color_theme,
      sidebar_collapsed: body.sidebar_collapsed,
    });
    const profile = await getUserProfile(user.id);
    return NextResponse.json({ profile });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
