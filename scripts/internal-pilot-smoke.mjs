#!/usr/bin/env node

const appUrl = process.env.APP_URL || "http://127.0.0.1:3000";
const internalSecret = process.env.INTERNAL_API_SECRET;

async function call(path, options = {}) {
  const response = await fetch(`${appUrl}${path}`, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return { ok: response.ok, status: response.status, data };
}

async function main() {
  const headers = { "content-type": "application/json" };
  if (internalSecret) headers["x-internal-api-secret"] = internalSecret;

  const health = await call("/api/health");
  const buildInfo = await call("/api/build-info");

  const basePayload = {
    scenarioId: "INTERNAL-PILOT-SMOKE-001",
    storeSlug: "youlya",
    channel: "whatsapp_evolution",
    locale: "ar-EG",
    messageType: "text",
    text: "هاي",
    testMode: true,
    conversation_id: "pilot-smoke-conversation",
    provider_message_id: "pilot-smoke-provider-msg-001",
    _preconditions: {
      force_duplicate: false,
    },
  };

  const firstTurn = await call("/api/internal/messages/turn", {
    method: "POST",
    headers,
    body: JSON.stringify(basePayload),
  });

  const duplicateTurn = await call("/api/internal/messages/turn", {
    method: "POST",
    headers,
    body: JSON.stringify(basePayload),
  });

  const output = {
    appUrl,
    health: { ok: health.ok, status: health.status },
    buildInfo: { ok: buildInfo.ok, status: buildInfo.status, version: buildInfo.data?.version ?? null },
    firstTurn: { ok: firstTurn.ok, status: firstTurn.status, action: firstTurn.data?.action ?? null },
    duplicateTurn: { ok: duplicateTurn.ok, status: duplicateTurn.status, action: duplicateTurn.data?.action ?? null },
  };

  console.log(JSON.stringify(output, null, 2));

  const hasFailure = !health.ok || !buildInfo.ok || !firstTurn.ok || !duplicateTurn.ok;
  if (hasFailure) process.exit(1);
}

main().catch((error) => {
  console.error(error?.message || String(error));
  process.exit(1);
});
