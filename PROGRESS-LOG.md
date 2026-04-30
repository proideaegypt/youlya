# PROGRESS-LOG.md — Youlya AI Commerce OS

## 2026-04-28 — Final live starter pack

Status: prepared for Codex GPT-5.3-Codex implementation.

Completed in this pack:

- Added final start files for Codex.
- Cleaned scenario JSONL from 91 lines with fake header to 90 real scenarios.
- Locked Phase 0 as safe commerce core only.
- Added Shopify product name/code sync spec.
- Added dashboard/system feature spec with MVP/later split.
- Added final roadmap from Phase 0 to production live and later SaaS.
- Added no-overengineering rules.
- Added Codex tools/plugins guidance.
- Added validation scripts.
- Added Supabase Phase 0 migration blueprint.
- Added Opus/Claude review brief.

Next action:

```text
Open this repo in Codex, paste COPY_TO_CODEX_GPT53.md, and start Phase 0 bootstrap only.
```

## Required task log format for future Codex work

Every Codex task must append:

```text
Date:
Phase:
Task:
Files changed:
Commands run:
Tests passed:
Tests failed/skipped:
Blockers:
Next step:
```

## 2026-04-28 — Package Fix: Root CLAUDE.md Added

- Added root-level `CLAUDE.md` for Claude Code compatibility.
- Kept mirrored `docs/04_CLAUDE.md` documentation copy.
- Updated `START_HERE_FOR_CODEX.md` and `MANIFEST.md` so reviewers and coding agents can find the contract immediately.

## 2026-04-29 — codex-skills-setup

Date: 2026-04-29
Phase: Phase -1 setup/readiness
Task: codex-skills-setup
Files changed:
- Added `.agents/skills/*` (10 repo-scoped skills).
- Added `.codex/config.example.toml` and `.codex/README.md`.
- Added `scripts/check-codex-tooling.mjs`.
- Added `docs/19_CODEX_INSTALL_AND_SKILLS_SETUP.md`.
- Added `docs/20_CODEX_GLOBAL_MEMORY_SNIPPET.md`.
- Added `docs/21_PORTAINER_GIT_DEPLOY_FROM_REPO.md`.
- Added `prompts/00_CODEX_BOOTSTRAP_AFTER_SKILLS_INSTALL.md`.
- Added `deploy/portainer/*` templates.
- Added baseline QA artifact for this task.
- Updated `README.md`, `AGENTS.md`, `START_HERE_FOR_CODEX.md`.
- Added `.gitignore` and sanitized `.env.example`.
Commands run:
- discovery (`pwd`, `ls`, `find`, `test -f`, `command -v`, tool `--version`)
- `node scripts/check-codex-tooling.mjs`
- `node scripts/scan-secrets.mjs`
- `node scripts/validate-scenarios.mjs`
- `node scripts/validate-n8n-workflows.mjs`
- `node scripts/validate-shopify-products.mjs`
Tests passed:
- Scenario validation pass (90 total: 80 CONV, 10 DASH).
- n8n validator returned BLOCKED (missing workflow JSON expected in starter pack).
- Shopify validator template/check completed (real export missing).
Tests failed/skipped:
- Playwright Agent CLI not available via local/global command.
- No `package.json`, so npm typecheck/lint/test skipped.
Blockers:
- `package.json` absent (repo is spec pack; app scaffold not started yet).
- `workflows/*.json` missing (expected blocker for runtime n8n contract checks).
Next step:
- Use `$youlya-phase-guardian`, then start Phase 0 bootstrap prompt from `prompts/00_CODEX_BOOTSTRAP_AFTER_SKILLS_INSTALL.md`.

## 2026-04-29 — worktime logging rule

Date: 2026-04-29
Phase: Governance / process safety
Task: enforce prompt/result history logging
Files changed:
- Added `worktime.md`
- Updated `AGENTS.md`
- Updated `START_HERE_FOR_CODEX.md`
Commands run:
- file inspection only
Tests passed:
- N/A (documentation/process change)
Tests failed/skipped:
- N/A
Blockers:
- None
Next step:
- All future Codex tasks must append incremental prompt/result entries in `worktime.md`.

## 2026-04-29 — phase-0-bootstrap executable scaffold

Date: 2026-04-29
Phase: Phase 0
Task: phase-0-bootstrap
Files changed:
- Added executable Next.js + TypeScript scaffold (`package.json`, `tsconfig.json`, app/public/config files).
- Implemented Phase 0 API routes for message turn, tools, and health endpoint.
- Added env validation (`lib/config/env.ts`) with mock/testMode support.
- Added mock adapter boundaries (Shopify + supabase mock store abstractions).
- Added core services for product search/mapping/select, cart, shipping, confirmation, idempotency, handoff, audit/tool logging, and order creation boundary.
- Added unit/API tests via Vitest and `vitest.config.ts`.
- Added QA artifacts:
  - `qa-artifacts/tasks/2026-04-29/phase-0-bootstrap/baseline/RESULT.md`
  - `qa-artifacts/tasks/2026-04-29/phase-0-bootstrap/after/RESULT.md`
- Updated `docs/01_SPEC_DRIVEN_MASTER_SPEC.md` with explicit testMode no-live-side-effect rule.
Commands run:
- `npx create-next-app@latest /tmp/youlya-phase0-app --ts --eslint --tailwind --app --use-npm --yes`
- `rsync -a --exclude ... /tmp/youlya-phase0-app/ /root/youlya/`
- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run validate:scenarios`
- `node scripts/scan-secrets.mjs`
- `node scripts/validate-n8n-workflows.mjs`
- `npm run dev`
- `APP_URL=http://localhost:3000 SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list`
Tests passed:
- typecheck/build/tests/validate-scenarios/scan-secrets all passed.
- Playwright CONV scenarios passed: 80/80.
Tests failed/skipped:
- n8n workflow static contract remained BLOCKED due to missing workflow JSON files (expected external input).
Blockers:
- Missing workflow exports:
  - `workflows/Whatsapp Youlya (4).json`
  - `workflows/Sales Assistant - SubWorkflow.json`
Next step:
- Continue Phase 0 hardening on this executable base with DB-backed persistence and guarded live adapter integration after approval.

## 2026-04-29 — phase-0-product-mapping-core

Date: 2026-04-29
Phase: Phase 0 — Youlya Production Hardening
Task: phase-0-product-mapping-core
Files changed:
- `lib/adapters/supabase/mock-store.ts`
- `lib/services/product-mapping-service.ts`
- `lib/services/select-product-service.ts`
- `tests/unit/select-product.test.ts`
- `worktime.md`
Commands run:
- `npm run typecheck`
- `npm test -- tests/unit/select-product.test.ts`
- `npm run validate:scenarios`
Tests passed:
- Typecheck pass
- Select-product unit suite pass (4/4)
- Scenario validation pass (90 total: 80 CONV + 10 DASH)
Tests failed/skipped:
- No additional failures
Blockers:
- None for this task scope
Next step:
- Move mapping persistence from mock state to DB-backed repository while preserving selection safety checks.

## 2026-04-29 — phase-0-db-product-mapping-repository

Date: 2026-04-29
Phase: Phase 0 — Youlya Production Hardening
Task: phase-0-db-product-mapping-repository
Files changed:
- `supabase/migrations/20260429180000_last_product_recommendations.sql`
- `lib/adapters/supabase/product-mapping-repository.ts`
- `lib/services/product-mapping-service.ts`
- `lib/services/select-product-service.ts`
- `app/api/ai/tools/product-search/route.ts`
- `app/api/ai/tools/select-product/route.ts`
- `tests/unit/product-mapping-repository.test.ts`
- `tests/unit/select-product.test.ts`
- `supabase/seed/product-mapping-seed.ts`
- `PROGRESS-LOG.md`
- `worktime.md`
Commands run:
- `npm run typecheck`
- `npm test -- tests/unit/product-mapping-repository.test.ts`
- `npm test -- tests/unit/select-product.test.ts`
Tests passed:
- Typecheck pass
- Product mapping repository tests pass (4/4)
- Select product tests pass (4/4)
Tests failed/skipped:
- None
Blockers:
- None in this task scope
Next step:
- Wire repository with real Supabase server client in integration environment while preserving store_id isolation and expiry checks.

## 2026-04-29 — phase-0-order-confirmation-idempotency

Date: 2026-04-29
Phase: Phase 0 — Youlya Production Hardening
Task: phase-0-order-confirmation-idempotency
Files changed:
- `lib/services/cart-validation-service.ts`
- `lib/services/idempotency-service.ts`
- `lib/services/confirmation-parser.ts`
- `lib/services/confirmation-service.ts`
- `supabase/migrations/20260429194000_order_idempotency_keys.sql`
- `tests/unit/cart-validation.test.ts`
- `PROGRESS-LOG.md`
- `worktime.md`
Commands run:
- `npm run typecheck`

## 2026-04-29 — phase-0-auth-middleware-and-store-context

Date: 2026-04-29
Phase: Phase 0 — Youlya Production Hardening
Task: phase-0-auth-middleware-and-store-context
Files changed:
- `lib/middleware/require-store-context.ts`
- `lib/middleware/assert-permission.ts`
- `lib/middleware/store-context.ts`
- `app/api/ai/tools/create-shopify-order/route.ts`
- `app/api/ai/tools/handoff/route.ts`
- `app/api/ai/tools/select-product/route.ts`
- `supabase/migrations/20260429213000_users_roles.sql`
- `tests/unit/auth-middleware.test.ts`
- `PROGRESS-LOG.md`
- `worktime.md`
Commands run:
- `npm run typecheck`
- `npm test -- tests/unit/auth-middleware.test.ts`
Tests passed:
- Typecheck pass
- Auth middleware test suite pass (7/7)
Tests failed/skipped:
- None in scoped task checks
Blockers:
- None
Next step:
- Wire the same auth middleware into remaining protected API routes as Phase 0 hardening continues.

## 2026-04-29 — phase-0-n8n-message-turn-endpoint

Date: 2026-04-29
Phase: Phase 0 — Youlya Production Hardening
Task: phase-0-n8n-message-turn-endpoint
Files changed:
- `app/api/internal/messages/turn/route.ts`
- `lib/services/message-turn-service.ts`
- `lib/services/intent-detector.ts`
- `lib/middleware/internal-auth.ts`
- `lib/validation/schemas.ts`
- `lib/config/env.ts`
- `lib/types/messages.ts`
- `vitest.config.ts`
- `tests/unit/intent-detector.test.ts`
- `tests/integration/message-turn.test.ts`
- `PROGRESS-LOG.md`
- `worktime.md`
Commands run:
- `npm run typecheck`
- `npm test -- tests/unit/intent-detector.test.ts tests/integration/message-turn.test.ts tests/api/message-turn.test.ts`
- `npm test`
- `npm run lint`
- `npm run typecheck`
Tests passed:
- Typecheck pass
- Unit/API suite pass (11 files, 48 tests)
- Lint pass with unrelated pre-existing warnings only
Tests failed/skipped:
- None
Blockers:
- None
Next step:
- Update Playwright scenario runner input/auth contract if Phase 0 browser QA is rerun against the strict internal endpoint path.
- `npm test -- tests/unit/cart-validation.test.ts`
- `npm test -- tests/unit/confirmation.test.ts`
Tests passed:
- Typecheck pass
- Cart validation/idempotency/parser tests pass (6/6)
- Confirmation tests pass (2/2)
Tests failed/skipped:
- None
Blockers:
- None
Next step:
- Wire cart validation + idempotency guard into order creation service flow in a dedicated safe integration step.

## 2026-04-29 — phase-0-shopify-cod-order-creation

Date: 2026-04-29
Phase: Phase 0 — Youlya Production Hardening
Task: phase-0-shopify-cod-order-creation
Files changed:
- `lib/adapters/shopify/shopify-client.ts`
- `lib/services/shopify-order-service.ts`
- `app/api/ai/tools/create-shopify-order/route.ts`
- `lib/validation/schemas.ts`
- `lib/config/env.ts`
- `lib/services/product-search-service.ts`
- `supabase/migrations/20260429195500_orders_rls.sql`
- `tests/unit/shopify-order-service.test.ts`
- `PROGRESS-LOG.md`
- `worktime.md`
Commands run:
- `npm run typecheck`
- `npm test -- tests/unit/shopify-order-service.test.ts`
- `npm test -- tests/unit/cart-validation.test.ts`
Tests passed:
- Typecheck pass
- Shopify order service tests pass (6/6)
- Cart validation tests pass (6/6)
Tests failed/skipped:
- None
Blockers:
- None
Next step:
- Replace route-level context/permission stubs with centralized auth middleware and wire real DB persistence path for orders + idempotency keys.

## 2026-04-29 — phase-0-handoff-and-logs

Date: 2026-04-29
Phase: Phase 0 — Youlya Production Hardening
Task: phase-0-handoff-and-logs
Files changed:
- `lib/services/handoff-service.ts`
- `lib/services/kill-switch-service.ts`
- `lib/services/ai-tool-logger.ts`
- `lib/services/conversation-state-service.ts`
- `app/api/ai/tools/handoff/route.ts`
- `lib/adapters/supabase/mock-store.ts`
- `supabase/migrations/20260429201000_handoff_tickets.sql`
- `supabase/migrations/20260429201100_ai_tool_calls.sql`
- `tests/unit/handoff-service.test.ts`
- `PROGRESS-LOG.md`
- `worktime.md`
Commands run:
- `npm run typecheck`
- `npm test -- tests/unit/handoff-service.test.ts`
Tests passed:
- Typecheck pass
- Handoff/logging unit tests pass (6/6)
Tests failed/skipped:
- None
Blockers:
- None
Next step:
- Integrate kill-switch + unclear-count logic into message-turn service execution path for automatic runtime handoff decisions.

## 2026-04-30 — Phase B + C completion

Date: 2026-04-30
Phase: B + C
Task: n8n-evolution-wiring + dashboard-mvp
Tests passed: 104 E2E (94 CONV + 10 DASH) + 55 unit
Tests failed: 0
Next: Phase D — Supabase live integration + production deploy
