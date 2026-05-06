# RESULT — fix-real-whatsapp-inbound-dashboard-navigation-and-haidi-model-settings

## Baseline

- Date: 2026-05-05
- Repo version: 2.19.10
- Live version: 2.19.10
- Commit: b5ac014
- Status: IN PROGRESS

## Containers

| Name | Status | Ports |
|------|--------|-------|
| youlya-youlya-app-1 | Up 3 hours (healthy) | 0.0.0.0:3000->3000/tcp |
| n8n-n8n-1 | Up 37 hours | 0.0.0.0:5678->5678/tcp |
| n8n-db-1 | Up 40 hours | 5432/tcp |
| evolution_api | Up 23 hours | 0.0.0.0:8080->8080/tcp |
| evolution_redis | Up 40 hours | 6379/tcp |
| evolution_postgres | Up 40 hours | 5432/tcp |

## Live Health

- /api/health: ok (supabase=ok, evolution=ok, shopify=ok)
- /api/build-info: v2.19.10, versionName=locate-and-make-haidi-system-prompt-editable

## Blockers

- TBD
