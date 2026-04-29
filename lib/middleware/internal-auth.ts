import { getServerEnv } from "@/lib/config/env";

export type InternalAuthResult = { ok: true } | { error: "unauthorized" };

export function requireInternalAuth(req: Request): InternalAuthResult {
  const env = getServerEnv();
  const expected = env.INTERNAL_API_SECRET;
  if (!expected) return { error: "unauthorized" };

  const provided =
    req.headers.get("x-internal-secret") ??
    req.headers.get("x-internal-api-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null;

  if (!provided || provided !== expected) return { error: "unauthorized" };
  return { ok: true };
}
