# WhatsApp "Hi" Flow Status

**Date:** 2026-05-06
**Task:** normalize-production-domain-and-fix-critical-launch-blockers

## Current Flow Architecture

1. **Inbound:** Evolution receives WhatsApp message → forwards to `POST /api/webhooks/evolution`
2. **Webhook handling:** `app/api/webhooks/evolution/route.ts`
   - Validates `x-evolution-token` against `EVOLUTION_WEBHOOK_SECRET`
   - Filters out `fromMe=true` (outbound) and non-message events
   - Logs inbound message via `logInboundMessage`
   - Calls `runMessageTurn()` to generate AI reply
   - Logs outbound reply via `logOutboundMessage`
   - Returns result as JSON
3. **Dashboard inbox:** Reads from same `messages` table where `logInboundMessage` / `logOutboundMessage` write

## Webhook Domain Check

- Webhook URL configured in Evolution: **unknown** — verify in Evolution UI that webhook URL uses canonical domain `https://admin.nex-lnk.online/api/webhooks/evolution`
- If webhook URL still points to old domain, inbound messages will fail

## Token Configuration Check

- `EVOLUTION_WEBHOOK_SECRET` must be set in `.env.production` on the VPS
- Webhook returns `200` with `action: "ignored", error: "invalid token"` if token mismatch
- If secret is **unset**, webhook processes ALL requests without validation (security risk)

## Inbound Message Persistence

- `logInboundMessage` is called **before** AI processing (line 37 in `route.ts`)
- Fire-and-forget with `.catch(() => {})` — failures are silent
- Dashboard inbox reads from same `messages` table

## Outbound Reply Delivery

**CRITICAL GAP:** The webhook route (`app/api/webhooks/evolution/route.ts`) generates a reply via `runMessageTurn()` but does **not** send it back through the Evolution API. It only:
- Returns the reply as JSON in the HTTP response
- Logs it to the database

For the reply to actually reach the user's WhatsApp, one of the following must be true:
1. Evolution reads the response body and sends it automatically (unlikely for this integration)
2. n8n workflow handles outbound sending by polling or receiving the response
3. A separate outbound service sends the message via Evolution API

**Most likely:** n8n workflow is supposed to call Evolution `sendText` after receiving the JSON response from the app. If n8n is paused or Evolution auth fails, the user never receives a reply.

## Why "Hi" Was Not Replying

Possible causes:
1. **Evolution API 401** — n8n or outbound service cannot authenticate with Evolution to send replies
2. **Webhook URL points to old domain** — `admin.youlya365.com` is NXDOMAIN, so Evolution cannot reach the app
3. **n8n workflow paused/stopped** — outbound send node not executing
4. **EVOLUTION_WEBHOOK_SECRET mismatch** — webhook rejected as invalid token
5. **Kill switch or AI disabled** — `runMessageTurn` returns `ai_disabled` action with no reply

## Why "Hi" Was Not Showing in Dashboard

Possible causes:
1. `logInboundMessage` failed silently (Supabase error, missing table, RLS issue)
2. Dashboard inbox query filters exclude the message (wrong `store_id`, date filter, channel filter)
3. Webhook never reached the app (wrong URL, NXDOMAIN)

## Required Manual Validation Steps

1. [ ] In Evolution UI, verify webhook URL is `https://admin.nex-lnk.online/api/webhooks/evolution`
2. [ ] In Evolution UI, verify `x-evolution-token` header value matches `EVOLUTION_WEBHOOK_SECRET`
3. [ ] On VPS, confirm `EVOLUTION_WEBHOOK_SECRET` is set: `grep EVOLUTION_WEBHOOK_SECRET .env.production`
4. [ ] Send synthetic test via curl:
   ```bash
   curl -X POST https://admin.nex-lnk.online/api/webhooks/evolution \
     -H "Content-Type: application/json" \
     -H "x-evolution-token: <secret>" \
     -d '{"event":"messages.upsert","instance":"YoulyaMain","data":{"key":{"remoteJid":"201000000000@s.whatsapp.net","id":"test-hi-001","fromMe":false},"message":{"conversation":"هاي"},"messageType":"conversation"}}'
   ```
5. [ ] Check dashboard inbox for the test message
6. [ ] Check n8n execution log for the workflow run
7. [ ] Check if Evolution `sendText` call in n8n returned 401

## Decision

**WhatsApp AI pilot remains FROZEN.**
Do not enable for real customers until:
- Manual synthetic webhook test passes (message appears in dashboard)
- n8n outbound reply delivery works (test number receives AI reply)
- End-to-end "hi" → greeting reply passes with Ahmed's actual WhatsApp number

## Files Relevant to This Flow

- `app/api/webhooks/evolution/route.ts` — webhook receiver
- `lib/services/message-history-service.ts` — inbound/outbound logging
- `lib/services/message-turn-service.ts` — AI reply generation
- `n8n/workflows/youlya-whatsapp-main.json` — n8n orchestration
- `lib/adapters/evolution/evolution-instance-client.ts` — Evolution API client
