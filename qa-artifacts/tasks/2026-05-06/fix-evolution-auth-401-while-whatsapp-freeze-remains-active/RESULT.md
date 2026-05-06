STATUS: PARTIAL
PHASE: Phase 1 incident auth stabilization (freeze maintained)
TASK: fix-evolution-auth-401-while-whatsapp-freeze-remains-active
FILES CHANGED:
- .env
- RELEASES/v2.22.1-evolution-auth-401-while-whatsapp-freeze-remains-active.md
- qa-artifacts/tasks/2026-05-06/fix-evolution-auth-401-while-whatsapp-freeze-remains-active/*
- worktime.md
TESTS RUN:
- npm run validate:n8n (PASS)
- npm run typecheck (PASS)
- npm run lint (PASS with warnings)
- npm test (PASS)
- npm run scan:secrets (PASS)
- npm run build (FAIL in this environment: stale .next types once, then process killed)
- npm run verify:release (PASS)
- npm run verify:deploy (PARTIAL: reaches build step then fails due build instability in current host run)
RESULTS:
- Evolution auth 401 root cause isolated and fixed: app runtime key source + instance mismatch.
- Verified authenticated non-send probes PASS on local and public endpoints:
  - /instance/fetchInstances => 200
  - /instance/connectionState/AI => 200
- Confirmed working auth header: `apikey`.
- Confirmed non-working headers: `x-api-key`, `Authorization: Bearer`.
- Freeze preserved and workflow kept inactive.
BLOCKERS:
- Build/verify-deploy instability in current host run (not auth regression).
RISKS:
- None added in this scope; no outbound customer sends performed.
NEXT STEP:
- Keep freeze active and resolve host build instability before any broader release/deploy gate decision.
MANUAL QA:
- Auth verified through safe non-send Evolution probes only.
TEST Ya AHMED
