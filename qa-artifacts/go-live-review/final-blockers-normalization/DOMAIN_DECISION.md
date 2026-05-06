# Domain Normalization Decision

**Date:** 2026-05-06
**Task:** normalize-production-domain-and-fix-critical-launch-blockers

## Canonical Production Domain

`https://admin.nex-lnk.online`

- Live and reachable from public internet
- TLS certificate valid (Let's Encrypt, expires 2026-07-29)
- Health endpoint responding: `{"status":"ok","version":"2.23.2",...}`
- Build-info endpoint responding: version `2.23.2`
- Ahmed is actively using this domain for the dashboard
- VPS IP: `109.199.121.20`

## Legacy Domain

`https://admin.youlya365.com`

- **NXDOMAIN** from public internet (expected — domain was changed)
- Not a current launch blocker
- If Ahmed wants to restore this domain, add A record → `109.199.121.20` and request a new TLS certificate

## Files Updated to Use Canonical Domain

| File | Change |
|---|---|
| `scripts/smoke-test-daily.sh` | Default `APP_URL` changed from `admin.youlya365.com` to `admin.nex-lnk.online` |
| `scripts/run-pilot-scenarios.sh` | Default `APP_URL` changed from `admin.youlya365.com` to `admin.nex-lnk.online` |
| `docs/PILOT_MANUAL_TEST_PLAN_TODAY.md` | Health/build-info curl examples updated to canonical domain |
| `docs/SHOPIFY_PRODUCT_SYNC_RUNBOOK.md` | Health check curl example updated to canonical domain |
| `docs/N8N_WORKFLOW_IMPORT_AND_VALIDATION.md` | `APP_INTERNAL_URL` and `EVOLUTION_API_URL` examples updated |
| `docs/PHASE_E_INTERNAL_WHATSAPP_N8N_PILOT.md` | Production app URL updated to canonical domain |

## Files Already Using Canonical Domain

- `app/dashboard/pilot/page.tsx`
- `scripts/check-tls-readiness.sh`
- `scripts/test-evolution-webhook-smoke.mjs`
- `playwright.config.ts`
- `tests/playwright/.auth/admin.json`
- `docs/DNS_AND_TLS_GO_LIVE.md`
- `docs/TLS_CERTIFICATE_RENEWAL.md`

## Remaining DNS Action

None required for launch on `admin.nex-lnk.online`.

If Ahmed wants to restore `admin.youlya365.com` as primary or alias:
1. Add A record at DNS provider: `admin.youlya365.com` → `109.199.121.20`
2. Add Apache vhost or update existing vhost to serve the new domain
3. Request TLS certificate: `certbot --apache -d admin.youlya365.com`
4. Update `NEXT_PUBLIC_APP_URL` and `APP_URL` env vars if switching primary domain

## Decision Rationale

The live deployment, active dashboard, TLS cert, and Ahmed's current usage all point to `admin.nex-lnk.online` as the operational domain. Treating `admin.youlya365.com` NXDOMAIN as a blocker was a report contradiction caused by mixed historical sections in `claudeahmed.md`. The legacy domain failure is expected and does not block launch on the canonical domain.
