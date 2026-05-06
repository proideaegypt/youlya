import { describe, expect, test } from "vitest";
import { canDemoteSelfLastSuperAdmin, cannotChangeLastSuperAdmin, getSafeErrorMessage } from "@/lib/auth/user-management-guards";

describe("user management guards", () => {
  test("blocks self demotion when only one super_admin remains", () => {
    expect(
      canDemoteSelfLastSuperAdmin({
        targetUserId: "u1",
        currentUserId: "u1",
        activeSuperAdminCount: 1,
        nextRole: "moderator",
      }),
    ).toBe(true);
  });

  test("allows non-self role updates even with one super_admin", () => {
    expect(
      canDemoteSelfLastSuperAdmin({
        targetUserId: "u2",
        currentUserId: "u1",
        activeSuperAdminCount: 1,
        nextRole: "moderator",
      }),
    ).toBe(false);
  });

  test("returns arabic duplicate email message", () => {
    expect(getSafeErrorMessage("User already exists")).toBe("هذا البريد الإلكتروني مستخدم بالفعل.");
  });

  test("returns arabic invalid email message", () => {
    expect(getSafeErrorMessage("Invalid email format")).toBe("يرجى إدخال بريد إلكتروني صحيح.");
  });

  test("blocks deactivating only super_admin", () => {
    expect(
      cannotChangeLastSuperAdmin({
        activeSuperAdminCount: 1,
        targetCurrentRole: "super_admin",
        deactivate: true,
      }),
    ).toBe(true);
  });
});
