# WhatsApp HI Status (2026-05-06)

## Findings
- Evolution webhook endpoint exists at `POST /api/webhooks/evolution`.
- Webhook token validation uses `x-evolution-token` vs `EVOLUTION_WEBHOOK_SECRET`.
- If token is invalid, route returns `200` with `{ action: "ignored", error: "invalid token" }`.
- Route logs inbound/outbound/system events through message-history services.
- Route calls `runMessageTurn`.
- Route does **not** directly call Evolution send API; actual customer outbound delivery depends on external orchestrator path (typically n8n).

## Handoff trap analysis
- Conversation AI pause (`conversation_state.ai_paused`) is respected by message-turn logic.
- `returnToAI` flow now clears `ai_paused` and resolves open handoff tickets for the conversation.
- If Ahmed number remains stuck after return-to-AI, likely causes are:
  1. webhook token mismatch (events ignored),
  2. n8n transport path failure,
  3. stale handoff state in production DB not yet repaired.

## Canonical URL check
- Canonical app domain is `admin.nex-lnk.online`.
- Legacy `admin.youlya365.com` is currently non-resolving and should not be used for webhook/app checks.

## Status
- End-to-end "hi -> AI reply on WhatsApp" not fully verified in this run.
- Current status: `NOT VERIFIED` pending live n8n + Evolution path test with valid token and active workflow.
