#!/usr/bin/env node
// Smoke test for /api/webhooks/evolution — safe, no secrets printed

import { config } from "dotenv";
config({ path: ".env" });

const APP_URL = process.env.APP_URL ?? "https://admin.nex-lnk.online";
const secret = process.env.EVOLUTION_WEBHOOK_SECRET;

const timestamp = Date.now();
const payload = {
  instance: process.env.EVOLUTION_INSTANCE_NAME ?? "AI",
  data: {
    key: {
      remoteJid: "201000000000@s.whatsapp.net",
      id: `debug-hi-${timestamp}`,
    },
    message: {
      conversation: "hi",
    },
    messageType: "conversation",
  },
};

const headers = { "Content-Type": "application/json" };
if (secret) headers["x-evolution-token"] = secret;

console.log(`[smoke] POST ${APP_URL}/api/webhooks/evolution`);
console.log(`[smoke] token header: ${secret ? "SENT" : "NOT SENT (secret missing)"}`);
console.log(`[smoke] instance: ${payload.instance}`);
console.log(`[smoke] messageId: ${payload.data.key.id}`);

try {
  const res = await fetch(`${APP_URL}/api/webhooks/evolution`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  console.log(`[smoke] HTTP status: ${res.status}`);
  console.log(`[smoke] action: ${body.action ?? "unknown"}`);
  if (body.error) console.log(`[smoke] error: ${body.error}`);
  if (body.reply) console.log(`[smoke] reply: ${body.reply}`);
  if (res.status === 200 && body.action !== "ignored") {
    console.log("[smoke] PASS — webhook accepted and processed");
  } else if (body.action === "ignored") {
    console.log("[smoke] IGNORED — check EVOLUTION_WEBHOOK_SECRET or empty text");
  } else {
    console.log("[smoke] WARN — unexpected response");
  }
} catch (err) {
  console.error("[smoke] FAIL — fetch error:", err.message);
  process.exit(1);
}
