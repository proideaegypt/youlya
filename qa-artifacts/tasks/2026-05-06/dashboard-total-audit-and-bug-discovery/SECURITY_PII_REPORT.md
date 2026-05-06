# Security & PII Report

## Auth Checks
- All dashboard APIs require auth (401/403 for unauthenticated requests) — PASS
- Internal APIs (`/api/internal/*`, `/api/admin/*`) require `INTERNAL_API_SECRET` — PASS
- Webhook endpoint (`/api/webhooks/evolution`) has its own validation — PASS

## Secret Scan
- `npm run scan:secrets` — PASS (no obvious live secrets in repo)

## PII Handling
- `maskCustomerIdentifier()` masks phone numbers (e.g., `201****000`)
- Dashboard lists show `customer_id_masked` not raw `customer_id`
- Pilot-control API masks conversation IDs
- Handoff API masks conversation IDs

## Issues
- **P0**: Toggle-card (`/dashboard/toggle-card.tsx`) calls `/api/admin/settings` which requires internal secret — will 401 from browser
  - Risk: Dashboard kill switch doesn't work, operator can't pause AI
- No other PII leaks detected in code review
- No secrets exposed in API responses (auth endpoints return only safe fields)

## LocalStorage
- Not reviewed in depth, but no evidence of secrets stored in localStorage in dashboard code

## Conclusion
Security posture is good except for the toggle-card internal API issue.
