STATUS: PARTIAL
PHASE: Phase E internal pilot readiness
TASK: phase-e-internal-whatsapp-n8n-pilot
FILES CHANGED:
- docs/PHASE_E_INTERNAL_WHATSAPP_N8N_PILOT.md
- qa-artifacts/manual-tests/2026-05-02/internal-whatsapp-n8n-pilot.md
- qa-artifacts/tasks/2026-05-02/phase-e-internal-whatsapp-n8n-pilot/baseline/RESULT.md
- qa-artifacts/tasks/2026-05-02/phase-e-internal-whatsapp-n8n-pilot/RESULT.md
- scripts/internal-pilot-smoke.mjs
- RELEASES/v2.4.2-internal-whatsapp-n8n-pilot.md
- PROGRESS-LOG.md
- worktime.md
TESTS RUN:
- npm run typecheck
- npm run lint
- npm test
- npm run validate:scenarios
- npm run scan:secrets
- npm run verify:release
- npm run build
- npm run verify:deploy
- npm run test:e2e:dashboard:swarm
- npm run qa:collect
- APP_URL=https://admin.youlya365.com node scripts/internal-pilot-smoke.mjs
RESULTS:
- Health/build discovery passed for live v2.4.0.
- Internal pilot runbook and masked manual QA template created with WA-001..WA-010 cases.
- Env readiness check from current shell context returned all required keys as MISSING (SET/MISSING only, no values shown).
- Optional smoke script added and returns 200 for health/build/internal endpoint calls in testMode.
- Core verification suite passed (typecheck/lint/tests/scenarios/secrets/verify-release/build/verify-deploy).
- Dashboard swarm failed with 29 failures (new Smart Home routes `/dashboard/statistics`, `/dashboard/security`, `/dashboard/devices`, `/dashboard/profile` not aligned with swarm expectations and sidebar/nav visibility checks).
BLOCKERS:
- Dashboard Playwright swarm regression (29 failing tests) must be fixed before PASS/deploy for this task.
RISKS:
- Pilot observability automation signal is noisy until swarm/spec alignment is restored for new route set.
NEXT STEP:
- Run manual internal WhatsApp pilot using the new runbook/template, and open a dedicated dashboard-swarm alignment fix task for v2.4 route set.
MANUAL QA:
- Use `qa-artifacts/manual-tests/2026-05-02/internal-whatsapp-n8n-pilot.md` with masked numbers only.
TEST Ya AHMED
