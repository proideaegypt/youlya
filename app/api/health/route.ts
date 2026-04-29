import { NextResponse } from "next/server";
import { getServerEnv, isMockMode } from "@/lib/config/env";

export async function GET() {
  const env = getServerEnv();
  return NextResponse.json({
    ok: true,
    mode: isMockMode() ? "mock" : "live_candidate",
    env: {
      nodeEnv: env.NODE_ENV,
      appEnv: env.APP_ENV,
      allowTestMode: env.ALLOW_TEST_MODE === "true",
      hasInternalSecret: Boolean(env.INTERNAL_API_SECRET),
    },
    adapters: {
      database: "mock_or_supabase",
      shopify: isMockMode() ? "mock" : "live_blocked_without_approval",
      evolution: "mock",
    },
    timestamp: new Date().toISOString(),
  });
}

