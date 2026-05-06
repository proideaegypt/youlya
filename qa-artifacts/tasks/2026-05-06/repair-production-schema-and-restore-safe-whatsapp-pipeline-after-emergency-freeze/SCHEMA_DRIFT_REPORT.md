# Schema Drift Report

## Scope
Production schema inventory compared against current code usage in handoff/settings/message-history/dashboard paths.

## Confirmed drift (fixed by migration)
- `haidi_settings` missing in production before apply:
  - `human_handoff_enabled`
  - `handoff_customer_service_enabled`
  - `handoff_manager_request_enabled`
  - `pause_ai_after_handoff`
  - `send_handoff_acknowledgement`
  - `notify_human_team`
  - `default_handoff_assignee`
  - `customer_service_reply_template_ar`
  - `manager_request_reply_template_ar`
  - `handoff_final_ack_template_ar`
- `handoff_tickets` missing in production before apply:
  - `handoff_type`
  - `problem_summary`
  - `last_customer_message`
  - `ai_paused`
  - `returned_to_ai_at`
  - `contacted_at`
  - `resolved_at`
- Missing table before apply:
  - `handoff_notifications`

## Code locations relying on drifted fields
- `lib/services/haidi-settings-service.ts`
- `lib/services/handoff-service.ts`
- `app/api/dashboard/handoff/route.ts`
- `app/api/dashboard/handoff/[id]/return-to-ai/route.ts`
- `lib/services/handoff-notification-service.ts`

## Severity
- P0: handoff visibility and return-to-AI correctness blocked by missing ticket/settings columns.
- P0: dashboard history readability degraded by message body gaps.

## Evidence
- `schema-inventory-before.json`
- `schema-inventory-after.json`
- `table-counts-before.json`
- `table-counts-after.json`
