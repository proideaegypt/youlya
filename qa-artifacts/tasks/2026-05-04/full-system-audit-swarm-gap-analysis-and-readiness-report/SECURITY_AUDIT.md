# Security Audit

## Automated scan
- `npm run scan:secrets` -> PASS

## .gitignore hygiene
- `.env`, `.env.*`, `.mcp.json`, `tests/playwright/.auth/` are ignored.

## Secret exposure findings
- No plaintext runtime secrets printed in this audit.
- n8n workflow JSON uses env references (`$env.INTERNAL_API_SECRET`, `$env.EVOLUTION_API_KEY`) instead of hardcoded values.

## PII leakage checks
- Public health/build-info endpoints do not expose sensitive config.
- Dashboard APIs reject unauthenticated access (401).

## Critical findings
- **P0 auth bypass risk**: `/api/internal/messages/turn` responded 200 without internal secret when `testMode:true` in production.

## Additional concerns
- n8n logs show repeated unknown webhook hits; attack/noise surface not clean.
- Evolution logs include operational internals and transient DB connectivity errors.

## Verdict
- secret exposure: NO
- pii exposure: NO direct leak observed
- auth bypass: YES (internal turn testMode path)
- internal endpoint protection: PARTIAL
