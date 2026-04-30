import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/config/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type CheckStatus = "ok" | "mock" | "error" | "skipped";

export async function GET() {
  const env = getServerEnv();
  const testMode = env.TEST_MODE === "true" || env.MOCK_MODE === "true";

  let supabase: CheckStatus = "mock";
  let evolution: CheckStatus = "mock";
  let shopify: CheckStatus = "mock";

  if (!testMode) {
    const supabaseClient = getSupabaseServerClient();
    if (!supabaseClient) {
      supabase = "error";
    } else {
      try {
        const { error } = await supabaseClient.from("failed_events").select("id").limit(1);
        supabase = error ? "error" : "ok";
      } catch {
        supabase = "error";
      }
    }

    if (env.EVOLUTION_MOCK === "true") {
      evolution = "mock";
    } else if (!env.EVOLUTION_API_URL || !env.EVOLUTION_API_KEY) {
      evolution = "skipped";
    } else {
      evolution = "ok";
    }

    if (!env.SHOPIFY_STORE_DOMAIN || !env.SHOPIFY_ADMIN_API_TOKEN) {
      shopify = "skipped";
    } else {
      shopify = "ok";
    }
  }

  return NextResponse.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    checks: {
      supabase,
      evolution,
      shopify,
    },
  });
}
