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

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const current = await getCurrentDashboardActor();
  if (!current || current.role !== "super_admin") {
    return NextResponse.json({ error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." }, { status: 403 });
  }

  const { id } = await context.params;
  const idParse = z.string().uuid().safeParse(id);
  if (!idParse.success) {
    return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
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

  if (id === current.userId) {
    return NextResponse.json({ error: "لا يمكن إزالة آخر مدير رئيسي في النظام." }, { status: 400 });
  }

  if (targetRoleRow?.role === "super_admin") {
    const activeSuperAdmins = await countActiveSuperAdmins(serviceSupabase);
    if (
      cannotChangeLastSuperAdmin({
        activeSuperAdminCount: activeSuperAdmins,
        targetCurrentRole: targetRoleRow.role,
        deactivate: true,
      })
    ) {
      return NextResponse.json({ error: "لا يمكن إزالة آخر مدير رئيسي في النظام." }, { status: 400 });
    }
  }

  const hardDeactivateResult = await serviceSupabase.auth.admin.updateUserById(id, {
    user_metadata: {
      ...(user.user_metadata ?? {}),
      is_active: false,
    },
    ban_duration: "876000h",
  });

  if (hardDeactivateResult.error) {
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث المستخدم. حاول مرة أخرى." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, deactivated: true });
}
