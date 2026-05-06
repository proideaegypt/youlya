import { NextResponse } from "next/server";
import { z } from "zod";
import {
  findAuthUserById,
  getCurrentDashboardActor,
  getServiceSupabaseAdmin,
} from "@/lib/auth/user-management-api";

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const current = await getCurrentDashboardActor();
  if (!current || current.role !== "super_admin") {
    return NextResponse.json({ error: "ليس لديك صلاحية لإرسال الدعوات." }, { status: 403 });
  }

  const { id } = await context.params;
  const idParse = z.string().uuid().safeParse(id);
  if (!idParse.success) {
    return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
  }

  const serviceSupabase = getServiceSupabaseAdmin();
  if (!serviceSupabase) {
    return NextResponse.json({ error: "تعذر إرسال الدعوة. تحقق من إعدادات البريد." }, { status: 500 });
  }

  const { user, error: authUserError } = await findAuthUserById(id, serviceSupabase);
  if (authUserError) {
    return NextResponse.json({ error: "تعذر إرسال الدعوة. تحقق من إعدادات البريد." }, { status: 500 });
  }
  if (!user?.email) {
    return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
  }

  const inviteResult = await serviceSupabase.auth.admin.inviteUserByEmail(user.email);
  if (inviteResult.error) {
    return NextResponse.json({ error: "تعذر إرسال الدعوة. تحقق من إعدادات البريد." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "تم إرسال الدعوة بنجاح." });
}
