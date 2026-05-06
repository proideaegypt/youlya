#!/usr/bin/env node
// Evolution API readiness check — safe, no secrets printed

import { config } from "dotenv";
config({ path: ".env" });

const REQUIRED_KEYS = ["EVOLUTION_API_URL", "EVOLUTION_API_KEY"];
const OPTIONAL_KEYS = ["EVOLUTION_INSTANCE_NAME", "EVOLUTION_WEBHOOK_SECRET", "EVOLUTION_MOCK"];

let allPresent = true;

console.log("=== Evolution Readiness Check ===");
for (const key of REQUIRED_KEYS) {
  const present = Boolean(process.env[key]);
  console.log(`${key}: ${present ? "PRESENT" : "MISSING ← BLOCKER"}`);
  if (!present) allPresent = false;
}
for (const key of OPTIONAL_KEYS) {
  const val = process.env[key];
  console.log(`${key}: ${val ? "PRESENT" : "not set"}`);
}

const isMock = process.env.EVOLUTION_MOCK === "true";
if (isMock) {
  console.log("\n[WARN] EVOLUTION_MOCK=true — Evolution sends are suppressed. Set to false for production.");
}

if (!allPresent) {
  console.error("\n[FAIL] Required env keys missing. Cannot send WhatsApp messages.");
  process.exit(1);
}

const apiUrl = process.env.EVOLUTION_API_URL;
const apiKey = process.env.EVOLUTION_API_KEY;
const instanceName = process.env.EVOLUTION_INSTANCE_NAME ?? "AI";

console.log(`\nTesting Evolution API connectivity (instance: ${instanceName})...`);

try {
  const res = await fetch(`${apiUrl}/instance/fetchInstances`, {
    headers: { apikey: apiKey },
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status === 401) {
    console.error("[FAIL] EVOLUTION_API_KEY is invalid (401 Unauthorized) ← BLOCKER");
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`[FAIL] Evolution API returned HTTP ${res.status}`);
    process.exit(1);
  }
  const instances = await res.json();
  const found = Array.isArray(instances) && instances.some((i) => i.name === instanceName);
  if (!found) {
    console.warn(`[WARN] Instance "${instanceName}" not found. Available:`, (instances ?? []).map((i) => i.name).join(", "));
  } else {
    const inst = instances.find((i) => i.name === instanceName);
    console.log(`[OK] Instance "${instanceName}" found. Status: ${inst?.connectionStatus ?? "unknown"}`);
  }
  console.log("\n[PASS] Evolution API is reachable and authenticated.");
} catch (err) {
  console.error("[FAIL] Evolution API connectivity error:", err.message);
  process.exit(1);
}

// Check webhook config
try {
  const res = await fetch(`${apiUrl}/webhook/find/${instanceName}`, {
    headers: { apikey: apiKey },
    signal: AbortSignal.timeout(10_000),
  });
  if (res.ok) {
    const wh = await res.json();
    console.log(`\nWebhook URL: ${wh.url}`);
    console.log(`Webhook enabled: ${wh.enabled}`);
    const expectedPath = "/api/webhooks/evolution";
    if (!wh.url?.includes(expectedPath)) {
      console.warn(`[WARN] Webhook URL does not contain "${expectedPath}" — may be pointing to wrong endpoint`);
    } else {
      console.log(`[OK] Webhook URL contains expected path: ${expectedPath}`);
    }
  }
} catch {
  // optional check
}
