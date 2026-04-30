# Release Note — Deploy Automation + Build Identity

Date: 2026-04-30
Phase: E
Task: phase-e-deploy-automation-and-build-identity

## Added

- Build identity generator script:
  - `scripts/write-build-info.mjs`
  - output: `public/build-info.json`
- Public build info endpoint:
  - `GET /api/build-info`
- Build identity footer in:
  - Dashboard layout
  - Login page
- Verification automation:
  - `scripts/verify-before-deploy.sh`
- Deployment automation:
  - `scripts/deploy-production.sh`
- Ops documentation:
  - `docs/DEPLOYMENT_AUTOMATION.md`

## Updated

- `package.json` version aligned to `2.0.1`
- Added `build:info`, `verify:deploy`, `deploy:production` scripts
- Build now runs `build:info` before Next build

## Safety

- No secrets are written into build info.
- Deployment script stops on verification failure.
- No forced deploy path when strategy/env is missing.
