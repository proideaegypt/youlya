#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCENARIOS_PATH="${SCENARIOS_PATH:-$ROOT_DIR/tests/scenarios/pilot-day-5.jsonl}"
REPORT_DIR="${REPORT_DIR:-$ROOT_DIR/qa-artifacts/scenarios}"
APP_URL="${APP_URL:-https://admin.nex-lnk.online}"
INTERNAL_SECRET="${INTERNAL_API_SECRET:-}"

if [[ -z "$INTERNAL_SECRET" ]]; then
  for env_file in "$ROOT_DIR/.env.production" "$ROOT_DIR/.env.local" "$ROOT_DIR/.env"; do
    if [[ -f "$env_file" ]]; then
      INTERNAL_SECRET="$(
        node - "$env_file" <<'NODE'
const fs = require('node:fs');
const path = process.argv[2];
const raw = fs.readFileSync(path, 'utf8');
for (const line of raw.split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  const key = line.slice(0, idx).trim();
  if (key !== 'INTERNAL_API_SECRET') continue;
  const value = line.slice(idx + 1).trim();
  process.stdout.write(value);
  process.exit(0);
}
process.exit(1);
NODE
      )" || true
    fi
    [[ -n "$INTERNAL_SECRET" ]] && break
  done
fi

if [[ -z "$INTERNAL_SECRET" ]]; then
  printf '%s\n' 'INTERNAL_API_SECRET is missing.' >&2
  exit 1
fi

mkdir -p "$REPORT_DIR"

INTERNAL_API_SECRET="$INTERNAL_SECRET" node - "$SCENARIOS_PATH" "$REPORT_DIR" "$APP_URL" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');

const scenarioPath = process.argv[2];
const reportDir = process.argv[3];
const appUrl = process.argv[4];
const internalSecret = process.env.INTERNAL_API_SECRET;

if (!internalSecret) {
  console.error('INTERNAL_API_SECRET is missing.');
  process.exit(1);
}

if (!fs.existsSync(scenarioPath)) {
  console.error(`Scenario file not found: ${scenarioPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(scenarioPath, 'utf8').trim();
const lines = raw ? raw.split(/\r?\n/).filter(Boolean) : [];
const report = [];
let failed = 0;
const runToken = process.env.PILOT_RUN_TOKEN || new Date().toISOString().replace(/[-:.TZ]/g, '');

async function callTurn(payload) {
  const response = await fetch(`${appUrl}/api/internal/messages/turn`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-internal-secret': internalSecret,
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { status: response.status, ok: response.ok, data };
}

function pickReplyText(data) {
  return (
    data?.reply ||
    data?.final_reply ||
    data?.message ||
    data?.text ||
    ''
  );
}

function includesAny(text, list) {
  if (!Array.isArray(list) || list.length === 0) return true;
  return list.some((item) => typeof item === 'string' && text.includes(item));
}

function includesAll(actual, expected) {
  if (!Array.isArray(expected) || expected.length === 0) return true;
  return expected.every((item) => typeof item === 'string' && actual.includes(item));
}

function includesNone(actual, expected) {
  if (!Array.isArray(expected) || expected.length === 0) return true;
  return expected.every((item) => typeof item === 'string' && !actual.includes(item));
}

(async () => {
  for (const line of lines.slice(0, 20)) {
    const scenario = JSON.parse(line);
    const preconditions = scenario.preconditions || {};
    const tone =
      scenario.tone ||
      preconditions.tone ||
      (preconditions.force_duplicate ? 'neutral' : preconditions.unclear_3x ? 'confused' : /أيوه|أكدي|تمام اعملي|تمام دلوقتي|اعملي الأوردر/i.test(scenario.input) ? 'ready_to_buy' : /عايزة أكلم حد|محتاج(?:ة|ه) حد|خدمة العملاء/i.test(scenario.input) ? 'angry' : 'browsing');
    const payload = {
      store_id: scenario.store_id || 'youlya',
      conversation_id: scenario.conversation_id || scenario.thread || `pilot-${scenario.id}`,
      customer_id: scenario.customer_id || scenario.conversation_id || scenario.thread || 'pilot-customer',
      channel: scenario.channel,
      message_type: scenario.message_type,
      text: scenario.input,
      language: scenario.language || scenario.locale || 'ar-EG',
      tone,
      remote_jid: scenario.remote_jid || '201000000000@s.whatsapp.net',
      instance_name: scenario.instance_name || 'YoulyaMain',
      provider_message_id: scenario.provider_message_id || `pilot-${runToken}-${scenario.id}`,
      testMode: true,
      mock: true,
      _preconditions: preconditions,
      storeSlug: 'youlya',
    };

    const result = await callTurn(payload);
    const replyText = pickReplyText(result.data);
    const actualTools = Array.isArray(result.data?.toolsCalled) ? result.data.toolsCalled.filter((item) => typeof item === 'string') : [];
    const expected = scenario.expected || {};
    const passed =
      result.ok &&
      (!expected.reply_contains_any || includesAny(replyText, expected.reply_contains_any)) &&
      (typeof expected.handoff !== 'boolean' || result.data?.handoff === expected.handoff) &&
      (!expected.intent || result.data?.intent === expected.intent) &&
      includesAll(actualTools, expected.tools) &&
      includesNone(actualTools, expected.must_not_tools);

    if (!passed) failed += 1;

    report.push({
      id: scenario.id,
      status: passed ? 'PASS' : 'FAIL',
      httpStatus: result.status,
      intent: result.data?.intent ?? null,
      action: result.data?.action ?? null,
      handoff: result.data?.handoff ?? null,
      toolsCalled: actualTools,
      replyPreview: String(replyText).slice(0, 120),
    });
  }

  const fileName = `pilot-day-5-report-${new Date().toISOString().slice(0, 10)}.json`;
  const filePath = path.join(reportDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify({ appUrl, generatedAt: new Date().toISOString(), report }, null, 2));

  console.log(JSON.stringify({ appUrl, reportFile: filePath, total: report.length, failed }, null, 2));
  if (failed > 0) process.exit(1);
})().catch((error) => {
  console.error(error?.message || String(error));
  process.exit(1);
});
NODE
