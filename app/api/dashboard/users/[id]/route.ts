import { NextResponse } from "next/server";
import { z } from "zod";
import {
  USER_MGMT_STORE_ID,
  countActiveSuperAdmins,
  findAuthUserById,
  getCurrentDashboardActor,
  getServiceSupabaseAdmin,
} from "@/lib/auth/user-management-api";
import { cannotChangeLastSuperAdmin } from "@/lib/auth/user-management-guards";

const patchSchema = z.object({
  role: z.enum(["super_admin", "moderator", "customer_service"]).optional(),
  name: z.string().trim().max(120).optional(),
  is_active: z.boolean().optional(),
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const current = await getCurrentDashboardActor();
  if (!current || current.role !== "super_admin") {
    return NextResponse.json({ error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." }, { status: 403 });
  }

  const { id } = await context.params;
  const idParse = z.string().uuid().safeParse(id);
  if (!idParse.success) {
    return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
  }

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "الدور المحدد غير صالح." }, { status: 400 });
  }

  if (parsed.data.role === undefined && parsed.data.name === undefined && parsed.data.is_active === undefined) {
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث المستخدم. حاول مرة أخرى." }, { status: 400 });
  }

  const serviceSupabase = getServiceSupabaseAdmin();
  if (!serviceSupabase) {
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث المستخدم. حاول مرة أخرى." }, { status: 500 });
  }

  const { user, error: authUserError } = await findAuthUserById(id, serviceSupabase);
  if (authUserError) {
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث المستخدم. حاول مرة أخرى." }, { status: 500 });
  }
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
  }

  const { data: targetRoleRow } = await serviceSupabase
    .from("store_user_roles")
    .select("role")
    .eq("store_id", USER_MGMT_STORE_ID)
    .eq("user_id", id)
    .maybeSingle();

  const currentRole = targetRoleRow?.role;
  const willDemoteFromSuperAdmin = currentRole === "super_admin" && parsed.data.role && parsed.data.role !== "super_admin";
  const willDeactivateSuperAdmin = currentRole === "super_admin" && parsed.data.is_active === false;

  if (willDemoteFromSuperAdmin || willDeactivateSuperAdmin) {
    const activeSuperAdmins = await countActiveSuperAdmins(serviceSupabase);
    if (
      cannotChangeLastSuperAdmin({
        activeSuperAdminCount: activeSuperAdmins,
        targetCurrentRole: currentRole,
        nextRole: parsed.data.role,
        deactivate: parsed.data.is_active === false,
      })
    ) {
      return NextResponse.json({ error: "لا يمكن إزالة آخر مدير رئيسي في النظام." }, { status: 400 });
    }
  }

  if (id === current.userId && parsed.data.is_active === false) {
    return NextResponse.json({ error: "لا يمكن إزالة آخر مدير رئيسي في النظام." }, { status: 400 });
  }

  if (parsed.data.role) {
    const { error: roleError } = await serviceSupabase.from("store_user_roles").upsert({
      user_id: id,
      store_id: USER_MGMT_STORE_ID,
      role: parsed.data.role,
      updated_at: new Date().toISOString(),
    });
    if (roleError) {
      return NextResponse.json({ error: "حدث خطأ أثناء تحديث المستخدم. حاول مرة أخرى." }, { status: 500 });
    }
  }

  if (parsed.data.name !== undefined || parsed.data.is_active !== undefined) {
    const updateRes = await serviceSupabase.auth.admin.updateUserById(id, {
      user_metadata: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.is_active !== undefined ? { is_active: parsed.data.is_active } : {}),
      },
    });
    if (updateRes.error) {
      return NextResponse.json({ error: "حدث خطأ أثناء تحديث المستخدم. حاول مرة أخرى." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
