# Release Note — Pull-Based VPS Deploy Agent

Date: 2026-04-30
Phase: E
Task: phase-e-pull-based-vps-deploy-agent

## Added
- `scripts/watch-and-deploy.sh`
- `deploy/systemd/youlya-deploy-watch.service`
- `deploy/systemd/youlya-deploy-watch.timer`
- `docs/PULL_BASED_DEPLOY_AGENT.md`

## Updated
- `scripts/verify-before-deploy.sh`
  - compose validation/build support
  - phase-e-pull-based artifact path
- `scripts/deploy-production.sh`
  - removed Portainer webhook dependency
  - added flock lock
  - branch guard + ff-only flow
  - docker compose-only deployment path
  - compose file/env-file controls
- `package.json`
  - added `deploy:watch` script
- `README.md`
  - documented pull-based deploy command

## Safety
- No public deploy endpoint.
- Deploy blocked on verify failure.
- Fast-forward pull only.
