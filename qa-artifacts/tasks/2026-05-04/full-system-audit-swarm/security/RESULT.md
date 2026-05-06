## Security RESULT
Status: FAIL

### CRITICAL findings
- Public AI product-search route writes tenant state with no auth guard.
- Internal turn route applies `_preconditions` before internal auth.
- Evolution webhook auth is optional if `EVOLUTION_WEBHOOK_SECRET` is unset.

### HIGH findings
- `testMode` does not block real Evolution sends in the internal message turn path.
- `testMode` does not block real Shopify order creation in the create-order path.
- `app/api/dashboard/settings/route.ts` uses session-cookie presence only, not role-based authorization.

### MEDIUM findings
- `requireInternalAuth(...)` uses direct string comparison rather than constant-time comparison.
- Dashboard routes and some client mutations hardcode `store_id: "youlya"`.
- Product-search fallback can surface the mock catalog if the cache path fails.

### LOW findings
- PII masking looks present in message history and tool logging helpers.
- Secret scan passed and did not show obvious live secrets.

### Passed checks
- `npm run scan:secrets`
- `npm run check:env:tracking`
- `npm run check:env:production`
- `npm run validate:n8n`
- `npm run shopify:assert-readonly`
