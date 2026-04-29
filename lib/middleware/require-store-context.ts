import { getSupabaseServerClient } from "@/lib/adapters/supabase/server";
import type { StoreRole } from "@/lib/middleware/assert-permission";

type AuthUser = {
  id: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

type SupabaseAdminLike = {
  auth: {
    getUser: (token: string) => Promise<{ data: { user: AuthUser | null }; error: { message: string } | null }>;
  };
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
      };
    };
  };
};

export type StoreContext =
  | { userId: string; storeId: string; role: StoreRole }
  | { error: "unauthorized" | "forbidden" };

function parseBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function parseRole(value: unknown): StoreRole | null {
  if (value === "owner" || value === "admin" || value === "agent" || value === "viewer") return value;
  return null;
}

export async function requireStoreContext(
  req: Request,
  supabaseAdmin: SupabaseAdminLike | null = getSupabaseServerClient() as unknown as SupabaseAdminLike | null,
): Promise<StoreContext> {
  const token = parseBearerToken(req.headers.get("Authorization"));
  if (!token || !supabaseAdmin) return { error: "unauthorized" };

  const userResult = await supabaseAdmin.auth.getUser(token);
  if (userResult.error || !userResult.data.user) return { error: "unauthorized" };
  const user = userResult.data.user;

  const claimStoreId =
    (user.app_metadata?.store_id as string | undefined) ??
    (user.user_metadata?.store_id as string | undefined);
  const claimRole = parseRole(user.app_metadata?.role) ?? parseRole(user.user_metadata?.role);

  const requestedStoreId = req.headers.get("x-store-id");
  if (claimStoreId && requestedStoreId && claimStoreId !== requestedStoreId) return { error: "forbidden" };

  if (claimStoreId && claimRole) return { userId: user.id, storeId: claimStoreId, role: claimRole };

  const membership = await supabaseAdmin
    .from("store_users")
    .select("store_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membership.error || !membership.data) return { error: "unauthorized" };
  const storeId = String(membership.data.store_id ?? "");
  const role = parseRole(membership.data.role);
  if (!storeId || !role) return { error: "unauthorized" };
  if (requestedStoreId && storeId !== requestedStoreId) return { error: "forbidden" };

  return { userId: user.id, storeId, role };
}

