import { NextResponse } from "next/server";

// Simple in-memory rate limiter for webhook and internal endpoints.
// Not distributed — sufficient for single-container Phase 0.
// Keys: `${method}:${path}:${identifier}`

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL_MS = 60_000;

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

setInterval(cleanup, CLEANUP_INTERVAL_MS);

export type RateLimitOptions = {
  windowMs?: number;
  maxRequests?: number;
  identifier?: (req: Request) => string;
};

export function rateLimit(options?: RateLimitOptions) {
  const windowMs = options?.windowMs ?? 60_000;
  const maxRequests = options?.maxRequests ?? 60;
  const identifier =
    options?.identifier ??
    ((req: Request) => {
      const forwarded = req.headers.get("x-forwarded-for");
      return forwarded ?? "anonymous";
    });

  return function check(req: Request): { allowed: true } | { allowed: false; retryAfter: number } {
    const id = identifier(req);
    const key = `${req.method}:${new URL(req.url).pathname}:${id}`;
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
    }

    existing.count += 1;
    return { allowed: true };
  };
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "rate_limited", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
