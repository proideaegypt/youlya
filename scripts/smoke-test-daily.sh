#!/usr/bin/env bash
set -euo pipefail

APP_URL="${APP_URL:-https://admin.nex-lnk.online}"
N8N_WEBHOOK_URL="${N8N_WEBHOOK_URL:-https://ai.youlya365.com/webhook/youlya-whatsapp}"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

health_body="$tmp_dir/health.json"
build_body="$tmp_dir/build.json"
webhook_body="$tmp_dir/webhook.json"

fail() {
  printf '%s\n' "FAIL: $1" >&2
  exit 1
}

json_check() {
  local file="$1"
  local expr="$2"
  node - "$file" "$expr" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const expr = process.argv[3];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const ok = new Function('data', `return (${expr});`)(data);
if (!ok) process.exit(1);
NODE
}

curl -fsS "$APP_URL/api/health" -o "$health_body" || fail "GET /api/health failed"
curl -fsS "$APP_URL/api/build-info" -o "$build_body" || fail "GET /api/build-info failed"

json_check "$health_body" 'data && data.status === "ok" && data.checks && data.checks.supabase === "ok" && data.checks.evolution === "ok" && data.checks.shopify === "ok"' || fail "/api/health shape mismatch"
json_check "$build_body" 'data && typeof data.version === "string" && typeof data.versionName === "string"' || fail "/api/build-info shape mismatch"

webhook_payload='{
  "event": "messages.upsert",
  "instance": "daily-smoke",
  "data": {
    "key": {
      "remoteJid": "201000000000@s.whatsapp.net",
      "id": "daily-smoke-send-text-json-001",
      "fromMe": false
    },
    "message": {
      "conversation": "هاي"
    },
    "messageType": "conversation"
  }
}'

http_code="$(curl -sS -o "$webhook_body" -w '%{http_code}' -X POST "$N8N_WEBHOOK_URL" -H 'Content-Type: application/json' --data "$webhook_payload")"
[[ "$http_code" == "200" ]] || fail "Synthetic n8n webhook returned HTTP $http_code"

json_check "$webhook_body" 'data && typeof data.message === "string" && data.message.length > 0' || fail "Synthetic webhook response shape mismatch"

if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -qx 'supabase-db'; then
  if docker exec supabase-db sh -lc 'command -v pg_isready >/dev/null 2>&1 && pg_isready -U postgres -d postgres >/dev/null 2>&1'; then
    printf '%s\n' 'Supabase DB container check: PASS'
  else
    printf '%s\n' 'Supabase DB container check: SKIPPED or unavailable'
  fi
else
  printf '%s\n' 'Supabase DB container check: SKIPPED'
fi

printf '%s\n' 'Daily smoke test summary: PASS'
printf '%s\n' "App URL checked: $APP_URL"
printf '%s\n' "Build version: $(node -e 'const fs=require("node:fs"); const d=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); process.stdout.write(d.version);' "$build_body")"
