# Performance Audit

## API timing (production)
- `/api/health`: 200, total ~0.147s
- `/api/build-info`: 200, total ~0.105s
- `/dashboard` redirect: 307, total ~0.121s
- `/dashboard/products` redirect: 307, total ~0.116s

## Container health
- App container healthy (`youlya-youlya-app-1`)
- n8n, evolution, supabase stack up

## Logs summary
- n8n: repeated `unknown webhook` events (`OrderCanceled`, legacy webhook path) -> noisy + integration drift risk.
- evolution_api: intermittent DB connectivity error (`P1001 can't reach evolution-postgres:5432`) observed in logs.
- app container logs tail returned empty in this sample window.

## Build/runtime
- `npm run build` passed.
- warning: deprecated Next middleware convention and a named-export warning in health route.

## Issues
- P1: n8n unknown-webhook noise flood.
- P1: evolution transient DB connectivity errors.
