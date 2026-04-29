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
