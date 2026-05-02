STATUS: PASS
PHASE: Phase 2 QA hardening (dashboard swarm signal quality)
TASK: fix-playwright-ux-swarm-signal-quality
FILES CHANGED:
- tests/playwright/helpers.ts
- tests/playwright/dashboard-ux-swarm.spec.ts
- scripts/collect-playwright-swarm-report.mjs
- package.json
- RELEASES/v2.1.1-playwright-ux-swarm-signal-quality.md
- PROGRESS-LOG.md
- worktime.md
- qa-artifacts/tasks/2026-05-01/fix-playwright-ux-swarm-signal-quality/*
TESTS RUN:
- npm run test:e2e:dashboard:swarm
- npm run qa:collect
- npm run typecheck
- npm run lint
- npm test
- npm run validate:scenarios
- npm run scan:secrets
- npm run verify:release
- npm run build
- npm run verify:deploy
RESULTS:
- Dashboard swarm now passes with accurate failure filtering (24 passed, 0 failed).
- Next.js `_rsc` aborted prefetch requests are tracked as ignored framework/network noise.
- Missing `h1` no longer times out tests and is captured as UX issue per route.
- Final collector report now includes: failed tests count, ignored noise count, real network failures, missing h1 list, screenshot index, and UX issue priority.
BLOCKERS:
- None
RISKS:
- Ignorable filter is scoped to aborted `_rsc` requests and favicon 404; future framework patterns may require updates.
NEXT STEP:
- Execute targeted UX redesign on routes flagged with missing `h1` and weak empty states, using new clean swarm reports.
MANUAL QA:
- Open generated route markdown/screenshots under qa-artifacts/tasks/2026-05-01/fix-playwright-ux-swarm-signal-quality/ux.
TEST Ya AHMED
