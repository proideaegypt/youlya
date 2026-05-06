# RESULT — fix-evolution-instance-sendtext-and-whatsapp-outbound

Date: 2026-05-04
Task: fix-evolution-instance-sendtext-and-whatsapp-outbound

## Step 0 — Backup / Discovery

- Artifact directory created: `qa-artifacts/tasks/2026-05-04/fix-evolution-instance-sendtext-and-whatsapp-outbound/`
- Docker containers status:
  - `evolution_api` — UP 59 minutes (was restarted recently)
  - `2240b22fc463_evolution_postgres` — UP 18 hours
  - `n8n-n8n-1` — UP 15 hours
  - `youlya-youlya-app-1` — UP 13 hours (healthy)
- Evolution logs dumped to `evolution-before.log`
- Secrets redacted in all outputs

## Step 1 — n8n Runtime Instance Check

- `EVOLUTION_API_URL` = SET
- `EVOLUTION_API_KEY` = SET
- `EVOLUTION_INSTANCE` = `AI`

Instance name matches the active Evolution instance. No compose change needed.

## Step 2 — Evolution Manager / API Check

- Instance name: `AI`
- Connection state: `open`
- `ownerJid`: `201141536680@s.whatsapp.net`
- `profileName`: `AI AGENT🤖`
- `integration`: `WHATSAPP-BAILEYS`
- Disconnection reason: `null`
- QR needed: No (already connected)
- WhatsApp Web connected: Yes (`open`)

## Step 3 — API Check (key not printed)

- Evolution API root (`https://evo.youlya365.com`) → HTTP 200
- Connection state for instance `AI` → `{"state":"open"}`
- fetchInstances → `AI` listed, `connectionStatus: "open"`
- Direct sendText to dummy number `201000000000` → HTTP 400 (expected, number does not exist on WhatsApp)
- Direct sendText to instance own number `201141536680` → HTTP 201 with message object

## Step 4 — Instance Config Fix

- Correct instance is `AI`
- No compose update needed (already `EVOLUTION_INSTANCE=AI`)
- No config change required

## Step 5 — Restart / Log Verification

- Evolution container had already been restarted within the last hour
- Post-restart: DB connectivity (`evolution-postgres:5432`) restored
- Current logs show no `PrismaClientKnownRequestError`
- Previous root cause found in older logs:
  ```
  PrismaClientKnownRequestError:
  Invalid `a.integrationSession.update()` invocation in /evolution/dist/main.js:174:12555
  Can't reach database server at `evolution-postgres:5432`
  ```
- The DB unreachable error caused ChannelStartupService crash → WhatsApp Web session death → "Connection Closed" on sendText

## Step 6 — Real Outbound Test (owner test number only)

- Test number used: `201141536680` (instance owner / business AI agent number)
- Direct API call:
  ```
  POST /message/sendText/AI
  {"number":"201141536680","text":"اختبار Youlya الداخلي ✅"}
  ```
- Result: HTTP 201, message accepted, status `PENDING`, `fromMe: true`
- No HTTP 500, no Connection Closed
- WhatsApp message was accepted by the platform

## Step 7 — n8n Pipeline Test

- Synthetic inbound webhook to `https://ai.youlya365.com/webhook/youlya-whatsapp`
- Payload used: `remoteJid: 201141536680@s.whatsapp.net`, `fromMe: false`, text: `هاي`
- Webhook response: HTTP 200 `{"message":"Workflow was started"}`
- n8n execution `9569`:
  - `finished: true`
  - `status: success`
  - Nodes executed: Webhook → Guard → Normalize → Call Turn → Build Haidi Prompt → Call OpenAI → Parse Haidi Response → Validate Haidi Output → Prepare Evolution Payload → Send Text
  - Send Text reached Evolution API successfully
  - No error status on Send Text node
- Full pipeline: Webhook → n8n → App turn → Haidi → Evolution sendText → WhatsApp = WORKING

## Summary

The Evolution instance outbound sending is fixed. The root cause was a transient loss of database connectivity (`evolution-postgres:5432`) that caused the Evolution API's Prisma layer to crash in `ChannelStartupService`, killing the WhatsApp Web session. After the container restarted, DB connectivity was restored, the WhatsApp Web session reconnected to `open`, and sendText now works for both direct API calls and the full n8n pipeline.

No code changes, no compose changes, no secret exposure, no customer messages sent, no Shopify orders created.

## Files

- `qa-artifacts/tasks/2026-05-04/fix-evolution-instance-sendtext-and-whatsapp-outbound/RESULT.md` (this file)
- `qa-artifacts/tasks/2026-05-04/fix-evolution-instance-sendtext-and-whatsapp-outbound/evolution-before.log`
- `qa-artifacts/tasks/2026-05-04/fix-evolution-instance-sendtext-and-whatsapp-outbound/evolution-after-sendtext.log`
