# Deploy Attempt Result

- Date: 2026-04-30
- Task: phase-e-production-deploy-real-secrets-validation
- Scope: validate production env keys, run deploy verification, deploy if verification passes, production health checks.

## Env Key Validation (names only)
- `.env.production` parsed successfully.
- Required keys present:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_ANON_KEY`
  - `INTERNAL_API_SECRET`
  - `EVOLUTION_API_URL`
  - `EVOLUTION_API_KEY`
  - `SHOPIFY_STORE_DOMAIN`
  - `SHOPIFY_ADMIN_API_TOKEN`
  - `OPENAI_API_KEY`
  - `NODE_ENV`

## Commands Run
- `npm run verify:deploy`
- `curl -fsS https://admin.youlya365.com/api/health`
- `curl -fsS https://admin.youlya365.com/api/build-info`

## Results
- `verify:deploy`: FAIL at `scan-secrets` because real secrets are detected in `.env.production`.
- `deploy:production`: NOT RUN (gated on verify pass).
- health curl: FAIL (`curl: (60)` SSL certificate expired).
- build-info curl: FAIL (`curl: (60)` SSL certificate expired).

## Decision
- Deployment not executed.
- systemd timer install/enable not executed (requires deploy + health pass).

## Status
PARTIAL
