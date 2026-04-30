# DEPLOY_NOTES.md — Phase D Production Deploy Notes

## 1) Run Supabase migrations

Option A (CLI):
```bash
supabase db push
```

Option B (Dashboard SQL Editor):
- Open Supabase project
- Run SQL files in `supabase/migrations/` in timestamp order
- Confirm tables and RLS policies are created

## 2) Set production environment variables

Set all required values in your VPS/Portainer `.env` (do not commit):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `INTERNAL_API_SECRET`
- `EVOLUTION_API_URL`
- `EVOLUTION_API_KEY`
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_API_TOKEN`
- `SHOPIFY_API_VERSION`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `NODE_ENV=production`

## 3) Deploy via Portainer

Reference: `docs/21_PORTAINER_GIT_DEPLOY_FROM_REPO.md`

Recommended flow:
1. Pull latest `main`
2. Ensure `.env` exists with production secrets
3. Deploy stack using `docker-compose.yml`
4. Verify container health for `/api/health`

## 4) Verify Evolution webhook target

- In Evolution dashboard, ensure webhook target points to n8n or app endpoint expected by your flow.
- If using direct app webhook, verify:
  - URL: `https://<your-domain>/api/webhooks/evolution`
  - Header token matches `EVOLUTION_WEBHOOK_SECRET`

## 5) Run seed (staging / controlled environments)

```bash
node --import tsx supabase/seed/seed.ts
```

If `tsx` is not available, run through your existing TypeScript runner in CI/CD.

## 6) Emergency kill switch

- Global AI settings endpoint:
  - `GET /api/admin/settings`
  - `POST /api/admin/settings` with `{ "ai_enabled": false }`
- Include header: `x-internal-secret: <INTERNAL_API_SECRET>`

Example:
```bash
curl -X POST https://<your-domain>/api/admin/settings \
  -H 'Content-Type: application/json' \
  -H 'x-internal-secret: <INTERNAL_API_SECRET>' \
  -d '{"ai_enabled":false}'
```
