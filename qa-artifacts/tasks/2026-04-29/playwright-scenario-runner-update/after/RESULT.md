STATUS: PARTIAL
PHASE: Phase 0 — Youlya Production Hardening
TASK: phase-0-playwright-scenario-runner-update
FILES CHANGED:
- tests/playwright-youlya-scenarios.spec.ts
- docs/data/youlya_human_test_scenarios.jsonl
- worktime.md
- qa-artifacts/tasks/2026-04-29/playwright-scenario-runner-update/after/RESULT.md
TESTS RUN:
- APP_URL=http://localhost:3000 npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
RESULTS:
- Playwright runner migrated to strict internal payload contract with required fields:
  - store_id, conversation_id, customer_id, channel, message_type, text, language, tone, remote_jid, instance_name, provider_message_id
- Added `x-internal-secret` request header sourced from `process.env.INTERNAL_API_SECRET`.
- Removed `testMode` and `scenarioId` from request payloads.
- Updated assertions to response contract `{ reply, action, data }` and action enum checks.
- Added critical scenarios:
  - CONV-081 kill_switch_on -> expected action `handoff`
  - CONV-082 angry_tone -> expected action `handoff`
  - CONV-083 unclear_3x -> expected action `handoff` (implemented as 3 sequential confused turns)
  - CONV-084 arabic_product_search -> expected action `product_results`
  - CONV-085 english_confirm_order -> expected action in [`order_created`,`handoff`]
- Test run blocked at startup:
  - Failure: `INTERNAL_API_SECRET is required for internal contract tests`
  - Outcome: 1 failed, 84 did not run
BLOCKERS:
- `INTERNAL_API_SECRET` is not set in test environment shell.
RISKS:
- Cannot verify "all existing scenarios still pass" until `INTERNAL_API_SECRET` is supplied and app auth secret matches it.
NEXT STEP:
- Export a valid internal secret and rerun:
  - `INTERNAL_API_SECRET=<matching-app-secret> APP_URL=http://localhost:3000 npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list`
MANUAL QA:
- Confirm app is running at `http://localhost:3000`.
- Confirm route auth accepts the same `INTERNAL_API_SECRET` used by Playwright.
- Re-run suite and inspect action outcomes for CONV-081..CONV-085.
TEST Ya AHMED
