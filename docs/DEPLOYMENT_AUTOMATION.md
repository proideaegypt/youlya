# Deployment Automation — Youlya

This guide documents the minimal safe flow to verify and deploy on VPS.

## 1) Verify before deploy

```bash
./scripts/verify-before-deploy.sh
```

This script runs:
- typecheck
- lint
- unit tests
- scenario validation
- secret scan (if available)
- production build
- optional Docker build (if Dockerfile exists and Docker is available)

A report is written to:
- `qa-artifacts/tasks/YYYY-MM-DD/phase-e-deploy-automation-and-build-identity/verify/RESULT.md`

## 2) Deploy production

```bash
./scripts/deploy-production.sh
```

Deploy strategy is auto-detected in this order:
1. Portainer webhook (`PORTAINER_WEBHOOK_URL`)
2. Local Docker Compose (`docker-compose.yml`)
3. PM2 fallback (only if PM2 exists)

A report is written to:
- `qa-artifacts/tasks/YYYY-MM-DD/phase-e-deploy-automation-and-build-identity/deploy/RESULT.md`

## Required env keys (names only)

- `APP_URL`
- `PORTAINER_WEBHOOK_URL` (optional)
- `DEPLOY_BRANCH` (optional, defaults to `main`)
- `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EVOLUTION_API_URL`
- `EVOLUTION_API_KEY`
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_API_TOKEN`

## NPM shortcuts

```bash
npm run verify:deploy
npm run deploy:production
```

## Safety notes

- Do not commit real `.env` files.
- Do not print secrets in logs.
- Do not deploy if verify fails.
- Do not change production data manually during deploy unless explicitly planned.
