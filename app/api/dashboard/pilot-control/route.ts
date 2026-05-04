import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { isAiEnabled } from "@/lib/services/ai-settings-service";
import { getHaidiSettings } from "@/lib/services/haidi-settings-service";
import fs from "node:fs";
import path from "node:path";
import packageJson from "@/package.json";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function maskId(id: string): string {
  if (!id || id.length <= 8) return id;
  return id.slice(0, 4) + "···" + id.slice(-4);
}

function getEnvStatus(key: string): "ok" | "missing" {
  return process.env[key] ? "ok" : "missing";
}

function safePreview(body: string | null): string {
  if (!body) return "—";
  return body.length > 120 ? body.slice(0, 120) + "…" : body;
}

function getBuildInfo() {
  try {
    const p = path.join(process.cwd(), "public", "build-info.json");
    if (fs.existsSync(p)) {
      const parsed = JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, unknown>;
      return {
        version: String(parsed.version ?? packageJson.version ?? "0.0.0"),
        versionName: parsed.versionName ? String(parsed.versionName) : (packageJson.config?.youlyaVersionName ?? null),
        commit: String(parsed.commit ?? "unknown"),
        builtAt: String(parsed.builtAt ?? new Date().toISOString()),
      };
    }
  } catch {
    // ignore
  }
  return {
    version: packageJson.version ?? "0.0.0",
    versionName: packageJson.config?.youlyaVersionName ?? null,
    commit: "unknown",
    builtAt: new Date().toISOString(),
  };
}

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const supabase = getSupabaseServerClient();
  const storeId = "youlya";

  // Health checks from env (safe, no external calls)
  const health = {
    supabase: supabase ? "ok" : "mock",
    evolution: getEnvStatus("EVOLUTION_API_URL") === "ok" && getEnvStatus("EVOLUTION_API_KEY") === "ok" ? "ok" : "missing",
    shopify: getEnvStatus("SHOPIFY_STORE_DOMAIN") === "ok" && getEnvStatus("SHOPIFY_ADMIN_API_TOKEN") === "ok" ? "ok" : "missing",
    n8n: getEnvStatus("N8N_API_URL") === "ok" && getEnvStatus("N8N_API_KEY") === "ok" ? "ok" : "missing",
    appUrl: process.env.APP_URL ?? "http://localhost:3000",
    testMode: process.env.TEST_MODE === "true" || process.env.MOCK_MODE === "true",
  };

  // Build info
  const buildInfo = getBuildInfo();

  // Kill switch / pause status
  const aiEnabled = await isAiEnabled(storeId);
  const haidiSettings = await getHaidiSettings(storeId);
  const killSwitchStatus = aiEnabled ? "OFF" : "ON";
  const safetyBlockers: string[] = [];

  if (health.n8n !== "ok") safetyBlockers.push("n8n env missing");
  if (health.evolution !== "ok") safetyBlockers.push("Evolution env missing");
  if (killSwitchStatus === "ON") safetyBlockers.push("Kill switch ON");
  if (haidiSettings.globalAiPaused) safetyBlockers.push("Global AI paused");
  if (haidiSettings.ordersPaused) safetyBlockers.push("Orders paused");

  // Shopify sync last time
  let lastSyncTime: string | null = null;
  if (supabase) {
    try {
      const { data: syncRow } = await supabase
        .from("products")
        .select("updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (syncRow) lastSyncTime = String(syncRow.updated_at);
    } catch {
      // ignore
    }
  }

  if (!supabase) {
    const mock = getMockState();
    const handoffCount = mock.humanHandoffs.filter((h) => h.resolved_at === null).length;
    const deadLetterCount = 0;
    const duplicateBlocked = [...mock.processedMessages.values()].filter((m) => m.resultAction === "duplicate_ignored").length;

    return NextResponse.json({
      health,
      buildInfo,
      killSwitchStatus,
      globalAiPaused: haidiSettings.globalAiPaused,
      ordersPaused: haidiSettings.ordersPaused,
      n8nWorkflowActive: false,
      evolutionConnected: false,
      inboundMessages: [],
      outboundMessages: [],
      deadLetterCount,
      handoffCount,
      duplicateBlockedCount: duplicateBlocked,
      safetyBlockers,
      lastSyncTime,
      lastUpdated: new Date().toISOString(),
    });
  }

  try {
    // Last 10 inbound messages
    const { data: inboundMessages } = await supabase
      .from("messages")
      .select("id, conversation_id, direction, body, created_at, channel")
      .eq("direction", "inbound")
      .order("created_at", { ascending: false })
      .limit(10);

    // Last 10 outbound messages
    const { data: outboundMessages } = await supabase
      .from("messages")
      .select("id, conversation_id, direction, body, created_at, channel")
      .eq("direction", "outbound")
      .order("created_at", { ascending: false })
      .limit(10);

    // Dead letter count
    const { count: deadLetterCount } = await supabase
      .from("dead_letter_log")
      .select("id", { count: "exact", head: true });

    // Handoff count (open)
    const { count: handoffCount } = await supabase
      .from("human_handoffs")
      .select("id", { count: "exact", head: true })
      .is("resolved_at", null);

    // Duplicate blocked count
    const { count: duplicateBlocked } = await supabase
      .from("processed_messages")
      .select("provider_message_id", { count: "exact", head: true })
      .eq("result_action", "duplicate_ignored");

    const n8nWorkflowActive = getEnvStatus("N8N_API_URL") === "ok" && getEnvStatus("N8N_API_KEY") === "ok";
    const evolutionConnected = getEnvStatus("EVOLUTION_API_URL") === "ok" && getEnvStatus("EVOLUTION_API_KEY") === "ok";

    return NextResponse.json({
      health,
      buildInfo,
      killSwitchStatus,
      globalAiPaused: haidiSettings.globalAiPaused,
      ordersPaused: haidiSettings.ordersPaused,
      n8nWorkflowActive,
      evolutionConnected,
      inboundMessages: (inboundMessages ?? []).map((m) => ({
        id: maskId(m.id),
        conversationId: maskId(m.conversation_id),
        body: safePreview(m.body),
        createdAt: m.created_at,
        channel: m.channel,
      })),
      outboundMessages: (outboundMessages ?? []).map((m) => ({
        id: maskId(m.id),
        conversationId: maskId(m.conversation_id),
        body: safePreview(m.body),
        createdAt: m.created_at,
        channel: m.channel,
      })),
      deadLetterCount: deadLetterCount ?? 0,
      handoffCount: handoffCount ?? 0,
      duplicateBlockedCount: duplicateBlocked ?? 0,
      safetyBlockers,
      lastSyncTime,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("pilot-control error", err);
    return NextResponse.json({
      health,
      buildInfo,
      killSwitchStatus,
      globalAiPaused: haidiSettings.globalAiPaused,
      ordersPaused: haidiSettings.ordersPaused,
      n8nWorkflowActive: false,
      evolutionConnected: false,
      inboundMessages: [],
      outboundMessages: [],
      deadLetterCount: 0,
      handoffCount: 0,
      duplicateBlockedCount: 0,
      safetyBlockers: ["query_failed"],
      lastSyncTime,
      lastUpdated: new Date().toISOString(),
      error: "query_failed",
    });
  }
}
