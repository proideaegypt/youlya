# Phase E Internal WhatsApp + n8n Pilot Runbook

## Scope
Controlled internal pilot for WhatsApp inbound/outbound flow through Evolution + n8n + Youlya app in production, without enabling public customer traffic.

## Preconditions
- Production app reachable: `https://admin.nex-lnk.online`
- Health/build endpoints are green.
- Internal test numbers only.
- Kill switch behavior understood by operator.
- WA-006 and WA-007 (confirmation and duplicate confirmation) must not run unless real/test order mutation is explicitly approved.

## End-to-End Pilot Flow
1. Tester sends WhatsApp message to Youlya number.
2. Evolution receives inbound event.
3. n8n workflow normalizes and forwards to `POST /api/internal/messages/turn` with internal auth.
4. App resolves intent, tools, and safety gates (product mapping, confirmation, idempotency, handoff).
5. n8n sends outbound response via Evolution.
6. Dashboard reflects operational signals (KPIs, handoff, orders/logs as applicable).

## n8n Checklist
- Workflow active in production.
- Correct webhook path and credentials.
- Internal app endpoint path and method correct.
- Internal auth header/key present.
- Retry/backoff policy enabled for transient errors.
- Dead-letter/error branch enabled and monitored.
- Execution logs show 2xx responses for successful tests.

## Evolution Checklist
- Instance online and authenticated.
- Inbound webhook delivery to n8n succeeds.
- Outbound send API returns success on internal test messages.
- No repeated send failure loops.
- Provider message IDs captured for QA log.

## Dashboard Checklist
- Command Center KPI/status updates during pilot.
- Inbox reflects handoff behavior when triggered.
- Orders page reflects safe order state (or no order if not approved).
- Logs page captures relevant events/errors.
- Settings page integrations remain healthy.
- `/api/health` remains `ok`.
- `/api/build-info` remains current release.

## Manual Test Sequence
- WA-001 Greeting
- WA-002 Product search
- WA-003 Product select (Latin digit)
- WA-004 Product select (Arabic digit)
- WA-005 Address collection
- WA-006 Confirmation gate (only with explicit approval)
- WA-007 Duplicate confirmation (only if WA-006 approved)
- WA-008 Handoff
- WA-009 Unclear prompt
- WA-010 Kill switch behavior

## Stop Conditions (Immediate Abort)
- Duplicate Shopify order.
- Any order before explicit confirmation.
- Wrong product or wrong variant resolution.
- WhatsApp spam/reply loop.
- AI keeps responding while kill switch is ON.
- `/api/health` fails.
- Dashboard inaccessible.
- Repeated n8n execution failures.
- Repeated Evolution send failures.

## Manual Recording Template (per case)
- Test ID
- Time
- Masked tester number
- Masked Youlya number
- n8n workflow name/ID
- n8n execution ID
- Evolution instance
- provider_message_id
- message sent
- expected result
- actual reply
- dashboard page checked
- order created (yes/no)
- duplicate risk (yes/no)
- status (PASS/FAIL)
- notes

## Execution Notes
- Mask phone numbers in artifacts (e.g., `+2010****1234`).
- Do not capture secrets in screenshots/logs.
- If a blocking bug is found, freeze pilot and open a guarded fix task before continuing.
