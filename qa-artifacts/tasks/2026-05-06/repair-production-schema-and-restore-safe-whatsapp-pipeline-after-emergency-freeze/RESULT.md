STATUS: PARTIAL
PHASE: Phase 1 incident stabilization (freeze preserved)
TASK: repair-production-schema-and-restore-safe-whatsapp-pipeline-after-emergency-freeze
FILES CHANGED:
- supabase/migrations/20260506093000_repair_handoff_settings_message_history_schema.sql
- lib/services/message-history-service.ts
- app/api/dashboard/pilot-control/route.ts
- app/api/internal/messages/turn/route.ts
- lib/types/messages.ts
- RELEASES/v2.21.1-repair-production-schema-and-restore-safe-whatsapp-pipeline-after-emergency-freeze.md
- qa-artifacts/tasks/2026-05-06/repair-production-schema-and-restore-safe-whatsapp-pipeline-after-emergency-freeze/*
TESTS RUN:
- npm run check:migration:safe -- supabase/migrations/20260506093000_repair_handoff_settings_message_history_schema.sql (PASS)
- npm run validate:n8n (PASS)
- npm run typecheck (PASS)
- npm run lint (PASS with warnings)
- npm test -- tests/api/message-turn.test.ts tests/unit/handoff-service.test.ts tests/unit/handoff-center.test.ts (PASS)
- npm run verify:release (PASS)
- npm run verify:deploy (PASS)
RESULTS:
- Production schema drift repaired for handoff/settings/message-history dependencies.
- PostgREST schema cache reloaded via NOTIFY.
- Freeze reconfirmed and enforced (ai_enabled=false, global_ai_paused=true, n8n workflow inactive).
- New message logging now persists readable body and dashboard fallback uses body/text/final_reply.
- Duplicate outbound suppression foundation implemented in app response layer.
BLOCKERS:
- Evolution outbound API auth remains unresolved (401 on instance API checks).
- Full quick-button reliability + dedicated Playwright coverage for this incident scope still pending.
- Full end-to-end synthetic scenario suite requested in task was not fully executed in this run.
RISKS:
- Reactivating n8n before Evolution auth fix may re-trigger failed/duplicate outbound behavior.
- Existing historical blank rows remain blank (non-destructive policy), though new rows should be readable.
NEXT STEP:
- Fix Evolution auth path/header/runtime source-of-truth, then run full scenario + dashboard e2e matrix, then reassess GO/NO-GO.
MANUAL QA:
- Kept frozen intentionally; no live outbound/customer sends performed.
TEST Ya AHMED
