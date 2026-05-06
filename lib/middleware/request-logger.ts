import { randomUUID } from "node:crypto";

export type RequestContext = {
  requestId: string;
  startTime: number;
};

export function createRequestContext(req?: Request): RequestContext {
  const requestId =
    req?.headers.get("x-request-id") ??
    randomUUID().replace(/-/g, "").slice(0, 16);
  return { requestId, startTime: Date.now() };
}

export function logRequest(ctx: RequestContext, req: Request, extra?: Record<string, unknown>) {
  const duration = Date.now() - ctx.startTime;
  const safeExtra: Record<string, unknown> = {};
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (k !== "authorization" && k !== "cookie" && k !== "apikey") {
        safeExtra[k] = v;
      }
    }
  }
  console.log(
    JSON.stringify({
      level: "info",
      requestId: ctx.requestId,
      method: req.method,
      path: new URL(req.url).pathname,
      duration_ms: duration,
      ...safeExtra,
    }),
  );
}

export function logError(ctx: RequestContext, error: unknown, extra?: Record<string, unknown>) {
  const safeExtra: Record<string, unknown> = {};
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (k !== "authorization" && k !== "cookie" && k !== "apikey") {
        safeExtra[k] = v;
      }
    }
  }
  console.error(
    JSON.stringify({
      level: "error",
      requestId: ctx.requestId,
      message: error instanceof Error ? error.message : "unknown error",
      ...safeExtra,
    }),
  );
}
