# INCIDENT REPORT — emergency-freeze-whatsapp-ai-and-capture-failure-evidence

## Current Live Version
- App version: `2.20.2`
- Version name: `upgrade-haidi-app-prompt-to-v22-and-align-n8n-json-mode`

## Freeze Status
- `ai_enabled=false` (stores)
- `global_ai_paused=true` (haidi_settings)
- `Youlya WhatsApp Main` workflow (`joqfame4HXG775JO`) deactivated after backup
- Backup file: `BACKUPS/active-youlya-whatsapp-main.json`

## Customer Impact
- Unsafe or repeated WhatsApp replies were still possible before freeze.
- Product replies were not reliably rendered as WhatsApp media/product cards.
- Dashboard showed message rows with blank message bodies, reducing operator visibility.
- Handoff page could not reliably render tickets due schema mismatch.

## Screenshot-Linked Failures and Confirmed Causes

### 1) Bad/repeated replies on normal messages
- Confirmed duplicate outbound text group (same text, same recipient, 3 sends) in `n8n-duplicate-reply-text-last-60m.json`.
- Outbound send failures in app logs show repeated send attempts with `HTTP 401`.

### 2) Product results with raw links / formatting issues
- Workflow sends outbound via `sendText` path (`Prepare Evolution Payload` -> `Send Text`) in captured executions.
- No reliable media-send evidence in the traced bad flow; formatting remains text-first.

### 3) Duplicate repeated messages
- No duplicate `provider_message_id` in 60m sample.
- Duplicate reply behavior occurred across different provider_message_id values (suggesting repeated processing of separate inbound events and/or retry/user-loop behavior, not strict same-id webhook duplicate).

### 4) Dashboard message rows blank/dashes
- `messages-latest-200.json`: `26/26` rows have blank/null body.
- Pilot-control route explicitly renders null body as `—`.

### 5) Handoff page shows no tickets
- App logs show SQL errors: `column handoff_tickets.problem_summary does not exist`.
- Direct latest query error: `column handoff_tickets.handoff_type does not exist`.
- Result: handoff API cannot map expected fields.

### 6) Quick dashboard buttons unreliable
- App logs show `haidi_settings write error` due missing column in schema cache (`customer_service_reply_template_ar`).
- This can break pause/resume actions that update haidi settings.
- Additional server-action version mismatch errors observed (`Failed to find Server Action "x"`), indicating deployment/session mismatch risk for UI actions.

## P0 Blockers
- Schema drift between app expectations and production DB (`haidi_settings`, `handoff_tickets`).
- Evolution outbound auth failure (`HTTP 401`).
- Message persistence quality failure (blank message bodies).
- Pilot controls dependent on broken schema writes.

## Rollback Options
1. Keep workflow deactivated (current safest state).
2. Keep app-level AI paused and kill switch ON until schema + outbound auth + message persistence are verified.
3. Restore previous known-good workflow JSON from backup only after schema remediation and dry-run tests.

## Recommended Fix Plan (No Pilot Resume Yet)
1. Schema reconciliation migration for `haidi_settings` and `handoff_tickets` expected columns.
2. Refresh PostgREST schema cache.
3. Fix Evolution credentials/instance auth (`HTTP 401`) and validate with one internal test number only.
4. Fix message write path so `messages.body` is always populated for inbound/outbound.
5. Re-run focused QA: pilot-control API, handoff API, duplicate prevention, media send format.
6. Only after evidence pack passes, request owner approval for controlled restart.

## GO / NO-GO
- **NO-GO** for continuing pilot testing.
