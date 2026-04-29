# WORKTIME — Codex Prompt/Result History

This file is the persistent work history for this repository.

## Rules

1. At the start of each Codex task, append a new prompt entry.
2. At the end of the same task, append the matching result entry.
3. Use incremental numbering shared by prompt/result pairs:
   - `PROMPT 1` <-> `RESULT 1`
   - `PROMPT 2` <-> `RESULT 2`
4. Date format must be `DD/MM/YY`.
5. Do not remove old entries.
6. Keep entries concise and factual.

## Entry template

```text
PROMPT <N> <DD/MM/YY>
<user request summary or full prompt>

RESULT <N> <DD/MM/YY>
STATUS: PASS / PARTIAL / FAIL
<what was done, key files, key validations, blockers>
```

---

PROMPT 1 29/04/26
User requested permanent project rule: for every Codex task, save the starting prompt and final result in `worktime.md` with incremental numbering and date format like "prompt 1 28/4/26" and "result 1 28/4/26" so work history is always recoverable.

RESULT 1 29/04/26
STATUS: PASS
Added `worktime.md` and integrated mandatory logging rules into root instructions so future tasks must append prompt/result pairs with incremental numbering and date.

PROMPT 2 29/04/26
User requested full Phase 0 bootstrap implementation for executable starter pack: baseline artifact first, fix scenario/deployment blockers, scaffold Next.js app, implement safe testMode commerce core (message turn, product mapping/cart/shipping/confirmation/shopify adapter boundary/idempotency/handoff/logging), run tests/validations, update QA artifacts/docs, and avoid future phases or live production mutations.

RESULT 2 29/04/26
STATUS: PASS
Implemented executable Phase 0 scaffold and mock-safe commerce core with thin APIs, env validation, adapter boundaries, logging, idempotency, handoff, tests, and QA artifacts. Validation outcomes: typecheck PASS, lint PASS (warnings only), tests PASS, build PASS, scenario validation PASS (90/80/10), secret scan PASS, Playwright CONV PASS (80/80), n8n workflow validation BLOCKED due to missing workflow JSON exports.

PROMPT 3 29/04/26
User requested task `phase-0-product-mapping-core` under Phase 0 hardening with DataAgent + ShopifyAgent + TestAgent scope.

RESULT 3 29/04/26
STATUS: PASS
Hardened product mapping core: added mapping TTL/expiry checks, removed unsafe default index fallback on ambiguous selection, improved index parsing, and added tests for expired mapping, OOS blocking, and multi-item selection.

PROMPT 4 29/04/26
User requested push of phase-0-product-mapping-core, then implementation and release of phase-0-db-product-mapping-repository with migration, repository adapter, service wiring, tests, seed data, and versioned release workflow.

RESULT 4 29/04/26
STATUS: PASS
Pushed v0.1.0 product-mapping-core release, implemented DB-backed product mapping repository contract with store-scoped queries and expiry filtering, wired services/routes with async mapping calls, added repository tests and seed data, and validated required typecheck + targeted unit tests.

PROMPT 5 29/04/26
User requested `phase-0-order-confirmation-idempotency`: implement cart validation state machine, idempotency key guard, migration for order idempotency keys with RLS, confirmation parser with threshold, and unit tests; no Shopify calls in this task.

RESULT 5 29/04/26
STATUS: PASS
Implemented cart validation service, confirmation parser, idempotency key generator/check/mark logic with 24h retry window, RLS migration for order_idempotency_keys, and unit tests covering missing fields, duplicate key behavior, explicit/ambiguous confirmations.

PROMPT 6 29/04/26
User requested `phase-0-shopify-cod-order-creation`: implement Shopify COD order creation endpoint wired to cart validation + idempotency guard, with client adapter retry behavior and unit tests.

RESULT 6 29/04/26
STATUS: PASS
Implemented `shopify-order-service` flow (validation -> idempotency -> cached inventory check -> Shopify create -> audit/idempotency mark), added `shopify-client` with 429 retry + 5xx error handling, updated create-order route/schema, added orders RLS migration, and added unit tests for happy/duplicate/OOS/missing-field/429/500/audit cases.

PROMPT 7 29/04/26
User requested `phase-0-handoff-and-logs`: implement handoff trigger system, kill switch cache check, AI tool call logging with PII-safe summaries, unclear intent counter, migrations, and unit tests.

RESULT 7 29/04/26
STATUS: PASS
Implemented new handoff/kill-switch/conversation-state/ai-tool-logger services, added RLS migrations for handoff_tickets and ai_tool_calls contracts, updated handoff route to new ticket input model, and added tests for angry/high priority, unclear 3x auto-handoff, kill switch on/off, PII-safe tool logs, and duplicate-handoff upsert.

PROMPT 8 29/04/26
User requested `phase-0-auth-middleware-and-store-context`: replace stubbed auth/permission middleware with JWT+Supabase-backed context, add store config cache, wire middleware into create-shopify-order/handoff/select-product routes, add store_users migration with RLS, and add auth middleware unit tests.

RESULT 8 29/04/26
STATUS: PASS
Implemented real middleware modules and route integration for protected tools, added `store_users` migration with RLS and indexes, and added `tests/unit/auth-middleware.test.ts` covering valid/invalid/expired/missing token cases, wrong store access, and role permission checks.

PROMPT 9 29/04/26
User requested `phase-0-n8n-message-turn-endpoint`: implement the internal AI turn endpoint for n8n with internal auth, kill switch and human-handoff short circuiting, intent detection, product search/select/confirmation/order flows, tool logging, and unit/integration tests.

RESULT 9 29/04/26
STATUS: PASS
Implemented the internal message-turn endpoint and state machine, added internal auth middleware, intent detector, updated schemas/types, added unit and integration tests, and validated with `npm run typecheck`, `npm test`, and `npm run lint` (warnings only from unrelated pre-existing files).

PROMPT 10 29/04/26
User requested: push to github.

RESULT 10 29/04/26
STATUS: PASS
Committed local repository changes, rebased `main` on top of `origin/main`, and pushed to GitHub successfully.

PROMPT 11 29/04/26
User requested `phase-0-playwright-scenario-runner-update`: migrate Playwright scenario runner to strict internal n8n contract payload and response assertions, add 5 critical scenarios, run full Playwright scenario suite, and save QA artifact.

RESULT 11 29/04/26
STATUS: PARTIAL
Updated Playwright runner payload/headers/assertions and added CONV-081..CONV-085 critical scenarios; full Playwright run executed but blocked immediately because `INTERNAL_API_SECRET` was undefined in environment, so remaining scenarios did not run.

PROMPT 12 29/04/26
User requested `fix-playwright-internal-secret-env`: blocker fix only (no app code changes) by adding/updating Playwright config and creating local `.env.test` excluded from git.

RESULT 12 29/04/26
STATUS: PASS
Added `playwright.config.ts` with `baseURL` from `APP_URL` and `globalSetup: undefined`, created local `.env.test` for Playwright secret/app URL, and added `.env.test` to `.gitignore` to prevent commit.

PROMPT 13 29/04/26
User requested Playwright env/test script setup: install dotenv-cli, set `test:e2e` to load `.env.test`, ensure `.env.test` gitignored, run E2E, and report pass/fail with per-scenario action mismatch details.

RESULT 13 29/04/26
STATUS: PARTIAL
Installed `dotenv-cli`, updated `test:e2e` script to load `.env.test`, ensured `.env.test` is ignored, created `.env.local` with matching placeholder secret, and ran `npm run test:e2e`; all scenarios failed due to `ECONNREFUSED http://localhost:3000` so no response action values were returned.

PROMPT 14 29/04/26
User requested `phase-0-gate-check-static`: run security/code-quality/static grep gates (no server/E2E), report Gate A/B/C/D/E and tagging decision for v0.9.0 pre-gate.

RESULT 14 29/04/26
STATUS: PARTIAL
Executed all requested static checks. Typecheck and unit tests passed, but lint failed due a `prefer-const` error in Playwright spec and the exact `grep -l "ROW LEVEL SECURITY"` check returned no matches (case/phrase mismatch vs existing lowercase `enable row level security` lines). No release tag pushed.

PROMPT 15 29/04/26
User requested `phase-0-gate-fix-lint-and-rls`: fix Playwright lint blocker, standardize migration RLS phrase to uppercase, audit `.env*` history at commit 6924331, rerun static checks, and release tag v0.9.0-pre-gate-static-pass if passing.

PROMPT 16 29/04/26
User requested `phase-0-e2e-fix-reply-templates-and-logic`: fix kill-switch/angry-tone/handoff behavior, adjust CONV-085 expected action handling, add static reply templates for Phase 0 intent coverage, and rerun local checks.

RESULT 16 29/04/26
STATUS: PARTIAL
Implemented Phase 0 E2E logic/reply fixes in `message-turn-service.ts` (angry-tone immediate handoff, static fallback reply templates, template-based OTHER replies) and updated CONV-085 `action_any` to include `error`. Local checks passed (`npm run typecheck`, `npm test`). VPS E2E run pending in target environment.

PROMPT 17 29/04/26
User requested `phase-0-e2e-align-scenario-expectations`: update only JSONL expected reply fragments to match current static service outputs, then run targeted VPS Playwright checks and release tag v0.9.2 on success.

RESULT 17 29/04/26
STATUS: PARTIAL
Updated only `docs/data/youlya_human_test_scenarios.jsonl` to align `reply_contains_any` with actual static service outputs, including product-results/handoff/unclear/language-fallback fragments. Targeted 4-scenario Playwright run result: 3/4 passed (CONV-001, CONV-050, CONV-082 pass; CONV-081 fails on action mismatch expected handoff vs received product_results). Full 85 not run, and v0.9.2 release tag not created.

PROMPT 18 29/04/26
User requested `phase-0-e2e-fix-kill-switch-precondition`: implement Option A to pass `_preconditions` from Playwright to API and honor `kill_switch_on` in message-turn service, then run local checks and targeted E2E subset.

RESULT 18 29/04/26
STATUS: PARTIAL
Implemented Option A precondition wiring (`_preconditions`) across Playwright payload, internal message-turn schema/type, and kill-switch evaluation in message-turn service. Local checks pass (`npm run typecheck`, `npm test`), targeted E2E subset passes 3/3 (CONV-081/082/001), but full `npm run test:e2e` is still failing broadly (61 failed, 24 passed) due to remaining scenario expectation/reply alignment gaps beyond kill-switch precondition.
