# Rollback Guide: Revert from nex-lnk.online to youlya365.com

> Created: 2026-05-06  
> Purpose: Exact steps to revert domains back to `youlya365.com` after the 2-day `nex-lnk.online` test period.

---

## Files to Restore

All original files were backed up before any change. Restore them in this order:

```bash
# 1. Youlya app env files
cp /root/youlya/.env.backup-youlya365-20260506 /root/youlya/.env
cp /root/youlya/.env.production.backup-youlya365-20260506 /root/youlya/.env.production
cp /root/youlya/.env.local.backup-youlya365-20260506 /root/youlya/.env.local
cp /root/youlya/.env.playwright.backup-youlya365-20260506 /root/youlya/.env.playwright

# 2. Supabase auth config
cp /root/supabase/docker/.env.backup-youlya365-20260506 /root/supabase/docker/.env
```

---

## Rebuild & Redeploy App

Because `NEXT_PUBLIC_*` env vars are baked into the JS bundle at build time:

```bash
cd /root/youlya
docker compose up --build -d
```

Wait for health check:
```bash
curl -fsS https://admin.youlya365.com/api/health
curl -fsS https://admin.youlya365.com/api/build-info
```

---

## Restart Supabase Auth

```bash
docker restart supabase-auth
```

Verify auth config loaded:
```bash
docker inspect supabase-auth --format='{{range .Config.Env}}{{.}}\n{{end}}' | grep -E "GOTRUE_SITE_URL|GOTRUE_URI_ALLOW"
```
Expected:
- `GOTRUE_SITE_URL=https://admin.youlya365.com`
- `GOTRUE_URI_ALLOW_LIST=https://db.youlya365.com,https://db.nex-lnk.online`

---

## Delete Playwright Auth State

Stale session cookies will point to the wrong domain:

```bash
rm -f /root/youlya/tests/playwright/.auth/admin.json
```

---

## Verify Login with Playwright

```bash
cd /root/youlya

PLAYWRIGHT_BASE_URL=https://admin.youlya365.com \
PLAYWRIGHT_ADMIN_EMAIL=info@youlya.com \
PLAYWRIGHT_ADMIN_PASSWORD=youlya2026 \
npx playwright test tests/playwright/auth.setup.ts --reporter=list
```

Expected: `1 passed`

---

## DNS / TLS Checklist (if needed)

- Ensure `admin.youlya365.com` DNS A record points to VPS IP (`109.199.121.20`).
- Ensure Apache VirtualHost for `admin.youlya365.com` is enabled:
  ```bash
  ls -la /etc/apache2/sites-enabled/ | grep youlya365
  ```
- Ensure TLS certificate for `admin.youlya365.com` is valid:
  ```bash
  certbot certificates | grep youlya365
  ```

---

## What Was Changed (for reference)

| File | Change |
|------|--------|
| `/root/supabase/docker/.env` | `SITE_URL` and `ADDITIONAL_REDIRECT_URLS` changed from `db.*` to `admin.nex-lnk.online` |
| `/root/youlya/.env.playwright` | `PLAYWRIGHT_BASE_URL` changed to `https://admin.nex-lnk.online` |
| `/root/youlya/.env` / `.env.production` | Added `SUPABASE_ANON_KEY` (was missing) |
| `/root/youlya/.env.local` | `N8N_*` URLs changed from `ai.youlya365.com` to `ai.nex-lnk.online` |
| Supabase auth DB | Admin password reset to `youlya2026` (same as before, no rollback needed) |

---

## One-Line Rollback (if you trust the backups)

```bash
cd /root/youlya && \
cp .env.backup-youlya365-20260506 .env && \
cp .env.production.backup-youlya365-20260506 .env.production && \
cp .env.local.backup-youlya365-20260506 .env.local && \
cp .env.playwright.backup-youlya365-20260506 .env.playwright && \
cp /root/supabase/docker/.env.backup-youlya365-20260506 /root/supabase/docker/.env && \
docker compose up --build -d && \
docker restart supabase-auth && \
rm -f tests/playwright/.auth/admin.json && \
echo "Rollback complete. Run Playwright test to verify."
```
