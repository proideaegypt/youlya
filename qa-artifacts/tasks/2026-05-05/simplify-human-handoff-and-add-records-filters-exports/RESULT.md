STATUS: PARTIAL
PHASE: Implementation + Deploy
TASK: simplify-human-handoff-and-add-records-filters-exports
FILES CHANGED:
- RELEASES/v2.20.0-simplify-human-handoff-and-add-records-filters-exports.md
- app/api/dashboard/conversations/route.ts
- app/api/dashboard/haidi-settings/route.ts
- app/api/dashboard/handoff/[id]/return-to-ai/route.ts
- app/api/dashboard/handoff/route.ts
- app/api/internal/messages/turn/route.ts
- app/dashboard/conversations/page.tsx
- app/dashboard/haidi/settings/page.tsx
- app/dashboard/handoff/page.tsx
- app/dashboard/inbox/page.tsx
- app/dashboard/layout.tsx
- app/dashboard/logs/page.tsx
- app/dashboard/orders/page.tsx
- app/dashboard/pilot/page.tsx
- app/dashboard/pilot-control/page.tsx
- components/dashboard/record-date-filter.tsx
- components/dashboard/record-export-menu.tsx
- lib/adapters/supabase/mock-store.ts
- lib/dashboard/date-range.ts
- lib/services/haidi-settings-service.ts
- lib/services/handoff-notification-service.ts
- lib/services/handoff-policy-service.ts
- lib/services/handoff-service.ts
- lib/services/kill-switch-service.ts
- lib/services/message-history-service.ts
- lib/services/message-turn-service.ts
- package.json
- package-lock.json
- supabase/migrations/20260505130000_handoff_policy_notifications_and_settings.sql
- tests/api/message-turn.test.ts
- tests/integration/message-turn.test.ts
- tests/unit/haidi-settings-service.test.ts
- tests/unit/handoff-center.test.ts
- tests/unit/handoff-policy-service.test.ts
- tests/unit/handoff-service.test.ts
- worktime.md
TESTS RUN:
- `pwd`
- `git status --short`
- `git log -1 --oneline`
- `cat package.json | grep -E '"version"|youlyaVersionName' || true`
- `curl -fsS https://admin.youlya365.com/api/health`
- `curl -fsS https://admin.youlya365.com/api/build-info`
- `npm run typecheck`
- `npm test -- tests/unit/handoff-policy-service.test.ts tests/unit/handoff-service.test.ts tests/unit/handoff-center.test.ts tests/unit/haidi-settings-service.test.ts tests/api/message-turn.test.ts tests/integration/message-turn.test.ts`
- `npm run lint`
- `npm run build`
- `npm run validate:n8n`
- `npm run scan:secrets`
- `npm run release:task -- --task "simplify-human-handoff-and-add-records-filters-exports" --type minor`
- `npm run verify:release`
- `npm run deploy:production`
- `npm run verify:deploy`
- `curl -fsS https://admin.youlya365.com/api/health`
- `curl -fsS https://admin.youlya365.com/api/build-info`
RESULTS:
BLOCKERS:
- Record-page filter/export coverage is still partial on `app/dashboard/products/page.tsx`, `app/dashboard/products-intelligence/page.tsx`, `app/dashboard/haidi/lab/page.tsx`, and `app/dashboard/haidi/learning/page.tsx`.
RISKS:
- The repository still contains a large pre-existing dirty worktree, so future edits need file-scoped care.
NEXT STEP:
- Extend the date filter/export pattern to the remaining record-heavy dashboard pages and run Playwright QA.
MANUAL QA:
- Synthetic handoff scenarios verified indirectly through unit/integration tests and live deploy checks; full Playwright coverage not run in this turn.
TEST Ya AHMED
