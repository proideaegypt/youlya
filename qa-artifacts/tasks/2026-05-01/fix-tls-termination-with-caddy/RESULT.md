# Task Result — fix-tls-termination-with-caddy

Date: 2026-05-01
Status: PASS

## Strategy Decision
- Existing reverse proxy was already active on ports 80/443: Apache.
- Per safety policy, did not add Caddy to avoid proxy/port conflict.
- Fixed TLS using existing Apache + certbot path.

## Changes Applied
- Issued dedicated LE certificate for `admin.youlya365.com`.
- Added Apache vhost: `/etc/apache2/sites-available/admin.youlya365.com.conf`.
  - `:80` redirect to HTTPS
  - `:443` cert + reverse proxy to `http://127.0.0.1:3000/`
- Enabled site and reloaded Apache after `apachectl configtest`.
- Stopped stale local `next dev` process that was blocking Docker bind on `:3000`.
- Deployment completed successfully.
- Updated `docker-compose.yml` healthcheck to probe `http://$(hostname):3000/api/health` (container runtime binding behavior), then recreated container.
- Enabled `youlya-deploy-watch.timer`.

## Verification
- `docker compose config` ✅ PASS
- `npm run verify:deploy` ✅ PASS
- `npm run deploy:production` ✅ PASS
- `npm run check:tls` ✅ PASS
- `curl -fsS https://admin.youlya365.com/api/health` ✅ PASS
- `curl -fsS https://admin.youlya365.com/api/build-info` ✅ PASS
- `docker inspect ... youlya-youlya-app-1` health status ✅ `healthy`

## Notes
- `certbot --nginx` remains unavailable on this VPS because nginx is not installed.
- Apache is the authoritative TLS termination path for `admin.youlya365.com`.
