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
- `qa-artifacts/tasks/YYYY-MM-DD/phase-e-pull-based-vps-deploy-agent/verify/RESULT.md`

## 2) Deploy production

```bash
./scripts/deploy-production.sh
```

Deploy strategy:
1. Pull latest code (`git pull --ff-only`)
2. Docker Compose local deploy (`docker compose build && up -d`)
3. Health checks (`/api/health`, `/api/build-info`) when `APP_URL` is set

A report is written to:
- `qa-artifacts/tasks/YYYY-MM-DD/phase-e-pull-based-vps-deploy-agent/deploy/RESULT.md`

## Required env keys (names only)

- `APP_URL`
- `DEPLOY_BRANCH` (optional, defaults to `main`)
- `COMPOSE_FILE` (optional custom compose path)
- `COMPOSE_ENV_FILE` (optional custom env file path)
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
