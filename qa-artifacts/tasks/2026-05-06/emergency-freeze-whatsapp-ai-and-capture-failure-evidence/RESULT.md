# Emergency Freeze + Failure Evidence Result

## Freeze Actions
- `stores.ai_enabled` set to `false` for `youlya` at `2026-05-06T01:04:28.754Z`.
- `haidi_settings.global_ai_paused` set to `true` (`store_id='youlya'`) at `2026-05-06T01:04:44.109Z`.
- Active n8n workflow exported then deactivated:
  - Workflow: `Youlya WhatsApp Main`
  - ID: `joqfame4HXG775JO`
  - Deactivated via n8n API `/api/v1/workflows/joqfame4HXG775JO/deactivate` (HTTP 200).

## Backup
- `BACKUPS/active-youlya-whatsapp-main.json`

## Evidence Collected (last 60 minutes unless noted)
- `EVIDENCE/n8n-executions-last-60m.json`
- `EVIDENCE/evolution-logs-last-60m.log`
- `EVIDENCE/app-logs-last-60m.log`
- `EVIDENCE/supabase-last-60m.json`
- `EVIDENCE/dashboard-api-responses.json`
- `EVIDENCE/n8n-duplicate-provider-message-id-last-60m.json`
- `EVIDENCE/n8n-duplicate-reply-text-last-60m.json`
- `EVIDENCE/messages-latest-200.json` (latest rows for dashboard blank-body issue)
- `EVIDENCE/conversations-latest-50.json`
- `EVIDENCE/handoff-tickets-latest-50.json`

## One Bad Message Trace
- Execution: `9927` (`2026-05-06T00:29:10.840Z`)
- Inbound text: `عايز اشتري بيجامه`
- provider_message_id: `3A9BA218F87C99318872`
- conversation_id: `20******50@s.whatsapp.net` (masked)
- Call Turn Endpoint action: `handoff`
- App reply: `طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.`
- Prepare Evolution Payload sent as **text** via `sendText`.
- Final sent text: `طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.`
- Product media: not sent as media in this trace.
- Duplicate prevention: no duplicate provider_message_id detected, but duplicate outbound text group detected (3 sends with different provider_message_id).
- DB message body existence: latest messages show bodies as blank/null (`26/26` blank in latest 200).
- Dashboard body response path: pilot/handoff API require session; without session returned unauthorized. Route logic maps missing body to `—`.

## Root-Cause Signals Captured
- App log schema errors:
  - `haidi_settings` missing `customer_service_reply_template_ar` in schema cache.
  - `handoff_tickets.problem_summary` column missing.
  - `handoff_tickets.handoff_type` missing on latest direct query.
- App outbound send failures:
  - Repeated `evolution send failed` with `instanceName='AI'`, `HTTP 401`.
- Duplicate behavior evidence:
  - Same outbound text to same number sent 3 times across executions `9903`, `9915`, `9927`.
- Dashboard message blank evidence:
  - `messages-latest-200.json`: `count=26`, `blankCount=26`.

## Mandatory Status
- Pilot continuation: **STOPPED**.
- GO/NO-GO for pilot: **NO-GO**.
