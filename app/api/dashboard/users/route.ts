import { NextResponse } from "next/server";
import { z } from "zod";
import { getSafeErrorMessage } from "@/lib/auth/user-management-guards";
import {
  USER_MGMT_STORE_ID,
  getCurrentDashboardActor,
  getServiceSupabaseAdmin,
} from "@/lib/auth/user-management-api";

const roleSchema = z.enum(["super_admin", "moderator", "customer_service"]);

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().max(120).optional(),
  role: roleSchema,
  is_active: z.boolean().optional(),
});

export async function GET() {
  const current = await getCurrentDashboardActor();
  if (!current || current.role !== "super_admin") {
    return NextResponse.json({ error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." }, { status: 403 });
  }

  const serviceSupabase = getServiceSupabaseAdmin();
  if (!serviceSupabase) {
    return NextResponse.json({ error: "supabase_unavailable" }, { status: 500 });
  }

  const { data: rolesRows, error: rolesError } = await serviceSupabase
    .from("store_user_roles")
    .select("user_id, role, created_at")
    .eq("store_id", USER_MGMT_STORE_ID);

  if (rolesError) {
    return NextResponse.json({ error: "حدث خطأ أثناء تحميل المستخدمين." }, { status: 500 });
  }

  const userIds = [...new Set((rolesRows ?? []).map((u) => u.user_id).filter(Boolean))];
  if (userIds.length === 0) return NextResponse.json({ users: [] });

  const { data: authUsersData, error: usersError } = await serviceSupabase.auth.admin.listUsers();
  if (usersError) {
    return NextResponse.json({ error: "حدث خطأ أثناء تحميل المستخدمين." }, { status: 500 });
  }

  const users = authUsersData.users
    .filter((u) => userIds.includes(u.id))
    .map((u) => {
      const roleRow = (rolesRows ?? []).find((x) => x.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        name: (u.user_metadata?.name as string | undefined) ?? "",
        role: roleRow?.role ?? "customer_service",
        is_active: u.user_metadata?.is_active !== false,
        created_at: roleRow?.created_at,
      };
    });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const current = await getCurrentDashboardActor();
  if (!current || current.role !== "super_admin") {
    return NextResponse.json({ error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." }, { status: 403 });
  }

  const parsed = createUserSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    const hasEmailError = parsed.error.issues.some((i) => i.path.includes("email"));
    if (hasEmailError) {
      return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صحيح." }, { status: 400 });
    }
    return NextResponse.json({ error: "الدور المحدد غير صالح." }, { status: 400 });
  }

  const serviceSupabase = getServiceSupabaseAdmin();
  if (!serviceSupabase) {
    return NextResponse.json({ error: "supabase_unavailable" }, { status: 500 });
  }

  const createResult = await serviceSupabase.auth.admin.createUser({
    email: parsed.data.email.toLowerCase(),
    email_confirm: false,
    user_metadata: {
      name: parsed.data.name?.trim() ?? "",
      is_active: parsed.data.is_active ?? true,
    },
  });

  if (createResult.error || !createResult.data.user) {
    return NextResponse.json({ error: getSafeErrorMessage(createResult.error?.message ?? "create_failed") }, { status: 400 });
  }

  const { error: upsertError } = await serviceSupabase.from("store_user_roles").upsert({
    user_id: createResult.data.user.id,
    store_id: USER_MGMT_STORE_ID,
    role: parsed.data.role,
    updated_at: new Date().toISOString(),
  });

  if (upsertError) {
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ المستخدم. حاول مرة أخرى." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, user_id: createResult.data.user.id });
}
