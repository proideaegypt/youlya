# Pull-Based VPS Deploy Agent (No Portainer Webhook)

Portainer free does not provide webhook automation. This project uses a pull-based deploy agent on the VPS instead.

## Why this replaces Portainer webhook

- No public deploy endpoint is exposed.
- Server periodically checks GitHub for new commits.
- Deploy only happens after verification passes.
- Deploy remains visible/manageable in Portainer because containers are started via Docker Compose.

## How it works

1. `scripts/watch-and-deploy.sh`
- acquires a lock (`flock`)
- fetches `origin/main`
- compares local vs remote HEAD
- if changed: fast-forward pull + run deploy script

2. `scripts/deploy-production.sh`
- acquires deploy lock
- enforces branch (`main` by default)
- runs `scripts/verify-before-deploy.sh` unless `SKIP_VERIFY=true`
- deploys with Docker Compose (`docker compose build && up -d`)
- checks health endpoints when `APP_URL` is set

3. `scripts/verify-before-deploy.sh`
- typecheck, lint, tests, scenario validation, secret scan, build
- compose config/build when compose file exists

## Required env keys (names only)

- `APP_URL`
- `DEPLOY_BRANCH=main` (optional override)
- `COMPOSE_FILE` (optional custom compose path)
- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `EVOLUTION_API_URL`
- `EVOLUTION_API_KEY`
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_API_TOKEN`

## Systemd timer install

Default templates are in:
- `deploy/systemd/youlya-deploy-watch.service`
- `deploy/systemd/youlya-deploy-watch.timer`

Current production working dir is `/root/youlya`.
Service template uses:
- `WorkingDirectory=/root/youlya`
- `EnvironmentFile=-/root/youlya/.env.production`
- `ExecStart=/bin/bash /root/youlya/scripts/watch-and-deploy.sh`

Install commands:

```bash
sudo cp deploy/systemd/youlya-deploy-watch.service /etc/systemd/system/
sudo cp deploy/systemd/youlya-deploy-watch.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now youlya-deploy-watch.timer
systemctl status youlya-deploy-watch.timer --no-pager
```

## Logs and status

```bash
journalctl -u youlya-deploy-watch.service -n 100 --no-pager
systemctl list-timers | grep youlya
```

## Force deploy manually

```bash
./scripts/deploy-production.sh
```

## Stop automation

```bash
sudo systemctl disable --now youlya-deploy-watch.timer
```
