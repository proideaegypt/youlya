import { beforeAll, describe, expect, test, vi } from "vitest";
import { assertPermission, PermissionError } from "@/lib/middleware/assert-permission";

type AuthUser = {
  id: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

type SupabaseAdminMock = {
  auth: {
    getUser: (token: string) => Promise<{ data: { user: AuthUser | null }; error: { message: string } | null }>;
  };
  from: (table: string) => {
    select: (_columns: string) => {
      eq: (_column: string, _value: string) => {
        maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
      };
    };
  };
};

function reqWithAuth(token?: string, storeIdHeader?: string): Request {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (storeIdHeader) headers.set("x-store-id", storeIdHeader);
  return new Request("http://localhost/api/test", { headers });
}

function buildSupabaseMock(input: {
  user: AuthUser | null;
  userError?: string | null;
  membership?: Record<string, unknown> | null;
  membershipError?: string | null;
}): SupabaseAdminMock {
  return {
    auth: {
      getUser: async () => ({
        data: { user: input.user },
        error: input.userError ? { message: input.userError } : null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: input.membership ?? null,
            error: input.membershipError ? { message: input.membershipError } : null,
          }),
        }),
      }),
    }),
  };
}

describe("auth middleware", () => {
  beforeAll(() => {
    vi.mock("@/lib/adapters/supabase/server", () => ({
      getSupabaseServerClient: () => null,
    }));
  });

  test("valid token + correct role -> context returned", async () => {
    const { requireStoreContext } = await import("@/lib/middleware/require-store-context");
    const supabase = buildSupabaseMock({
      user: { id: "user-1", app_metadata: { store_id: "store-1", role: "admin" } },
    });
    const ctx = await requireStoreContext(reqWithAuth("valid-token", "store-1"), supabase);
    expect("error" in ctx).toBe(false);
    if (!("error" in ctx)) {
      expect(ctx.userId).toBe("user-1");
      expect(ctx.storeId).toBe("store-1");
      expect(ctx.role).toBe("admin");
    }
  });

  test("invalid token -> 401 unauthorized", async () => {
    const { requireStoreContext } = await import("@/lib/middleware/require-store-context");
    const supabase = buildSupabaseMock({
      user: null,
      userError: "invalid jwt",
    });
    const ctx = await requireStoreContext(reqWithAuth("bad-token"), supabase);
    expect(ctx).toEqual({ error: "unauthorized" });
  });

  test("valid token wrong store -> 403 forbidden", async () => {
    const { requireStoreContext } = await import("@/lib/middleware/require-store-context");
    const supabase = buildSupabaseMock({
      user: { id: "user-1", app_metadata: { store_id: "store-1", role: "admin" } },
    });
    const ctx = await requireStoreContext(reqWithAuth("valid-token", "store-2"), supabase);
    expect(ctx).toEqual({ error: "forbidden" });
  });

  test("owner -> all permissions pass", () => {
    expect(() => assertPermission("owner", "orders:create")).not.toThrow();
    expect(() => assertPermission("owner", "settings:read")).not.toThrow();
    expect(() => assertPermission("owner", "anything:custom")).not.toThrow();
  });

  test("viewer tries orders:create -> PermissionError", () => {
    expect(() => assertPermission("viewer", "orders:create")).toThrow(PermissionError);
  });

  test("expired token -> 401 unauthorized", async () => {
    const { requireStoreContext } = await import("@/lib/middleware/require-store-context");
    const supabase = buildSupabaseMock({
      user: null,
      userError: "jwt expired",
    });
    const ctx = await requireStoreContext(reqWithAuth("expired-token"), supabase);
    expect(ctx).toEqual({ error: "unauthorized" });
  });

  test("missing Authorization header -> 401 unauthorized", async () => {
    const { requireStoreContext } = await import("@/lib/middleware/require-store-context");
    const supabase = buildSupabaseMock({
      user: { id: "user-1", app_metadata: { store_id: "store-1", role: "agent" } },
    });
    const ctx = await requireStoreContext(reqWithAuth(undefined, "store-1"), supabase);
    expect(ctx).toEqual({ error: "unauthorized" });
  });
});
