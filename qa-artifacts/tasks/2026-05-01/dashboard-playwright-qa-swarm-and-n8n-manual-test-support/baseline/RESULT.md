# Baseline — dashboard-playwright-qa-swarm-and-n8n-manual-test-support (2026-05-01)

## Current version
- Runtime health/build reports: `v2.0.11` (`dashboard-login-submit-and-session`).

## Dashboard routes found
- `/dashboard`
- `/dashboard/command-center`
- `/dashboard/inbox`
- `/dashboard/orders`
- `/dashboard/orders/[id]/safety`
- `/dashboard/logs`
- `/dashboard/settings`

## Existing Playwright tests found
- `tests/playwright-youlya-scenarios.spec.ts` (scenario flow coverage)
- No dedicated dashboard UX/functional/a11y/API swarm specs yet.

## Dashboard API routes found
- `/api/dashboard/conversations`
- `/api/dashboard/conversations/[id]`
- `/api/dashboard/conversations/[id]/actions`
- `/api/dashboard/orders`
- `/api/dashboard/logs`
- `/api/dashboard/settings`
- `/api/dashboard/stats`

## Health/build-info status
- `/api/health`: `status=ok`, `checks.supabase=ok`, `checks.evolution=ok`, `checks.shopify=ok`
- `/api/build-info`: returns app/version/versionName and build metadata (commit/branch unknown on server build metadata).

## Recommended QA swarm plan
1. Add Playwright auth setup with env-only credentials and persisted auth state under ignored path.
2. Expand Playwright config into dedicated projects:
   - auth-setup
   - dashboard-ux-swarm
   - dashboard-functional-swarm
   - dashboard-a11y-rtl-swarm
   - dashboard-api-health-swarm
3. Implement swarm specs with screenshot + console/network capture and artifact report output per route.
4. Add manual n8n+WhatsApp runbook + pilot record template so human tests can run parallel to dashboard swarms.
5. Add report collector script to aggregate JSON/Markdown artifacts into a final prioritized QA report.
