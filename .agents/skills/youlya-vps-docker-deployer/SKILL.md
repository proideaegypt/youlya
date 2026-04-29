name: youlya-vps-docker-deployer
description: Prepares and reviews VPS Docker + Portainer Git deployment files and safety gates.
when_to_use: Use for deployment-readiness tasks and Portainer stack documentation.
required_reads:
- docs/10_DEPLOYMENT_ARCHITECTURE.md
- docs/21_PORTAINER_GIT_DEPLOY_FROM_REPO.md
- deploy/portainer/README.md
allowed_actions:
- Maintain Portainer compose/env template files.
- Validate healthcheck, restart policy, and env-driven config.
- Document rollback by branch/tag.
- Keep n8n/Evolution external in Mode B unless explicitly ready.
forbidden_actions:
- Run SSH deployment automation without approval.
- Run destructive Docker commands.
- Hardcode production secrets.
- Deploy directly to production in setup task.
- Enable live customer traffic.
checklist:
- Deploy from Git via Portainer.
- Compose path from repo root documented.
- stack.env.example only committed.
- /api/health healthcheck defined.
- No raw public internal ports.
- Rollback path documented.
final_output: |
  STATUS: PASS / FAIL / PARTIAL / NOT_READY
  DEPLOYMENT_FILES:
  PORTAINER_STATUS:
  HEALTH_STATUS:
  SECURITY_STATUS:
  ROLLBACK_PLAN:
  BLOCKERS:

