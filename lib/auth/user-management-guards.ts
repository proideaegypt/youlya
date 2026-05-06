export function getSafeErrorMessage(error: string): string {
  if (error.includes("already") || error.includes("exists") || error.includes("duplicate")) {
    return "هذا البريد الإلكتروني مستخدم بالفعل.";
  }
  if (error.includes("email")) {
    return "يرجى إدخال بريد إلكتروني صحيح.";
  }
  return "حدث خطأ أثناء حفظ المستخدم. حاول مرة أخرى.";
}

export function canDemoteSelfLastSuperAdmin(params: {
  targetUserId: string;
  currentUserId: string;
  activeSuperAdminCount: number;
  nextRole?: string;
}): boolean {
  if (params.nextRole === "super_admin") return false;
  return params.targetUserId === params.currentUserId && params.activeSuperAdminCount <= 1;
}

export function cannotChangeLastSuperAdmin(params: {
  activeSuperAdminCount: number;
  targetCurrentRole: string | null | undefined;
  nextRole?: string;
  deactivate?: boolean;
}): boolean {
  if (params.activeSuperAdminCount > 1) return false;
  if (params.targetCurrentRole !== "super_admin") return false;
  if (params.deactivate) return true;
  if (params.nextRole && params.nextRole !== "super_admin") return true;
  return false;
}
