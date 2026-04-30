# Baseline — Phase E Deploy Automation + Build Identity

- Current branch: `main`
- Latest commit: `6903a00 chore: log worktime result for v2.0.1 release`
- Current package version: `0.1.0`
- README release version: `v2.0.1 (codefix)`

## Deploy files found
- `Dockerfile`
- `docker-compose.yml`
- `deploy/portainer/docker-compose.portainer.yml`
- `docs/21_PORTAINER_GIT_DEPLOY_FROM_REPO.md`

## Portainer-related files/env keys found
- Files found: `deploy/portainer/*`
- `.env.local` keys detected (names only): `APP_URL`, `INTERNAL_API_SECRET`
- Portainer webhook key present in `.env.local`: `No`

## Docker/compose files found
- `Dockerfile`
- `docker-compose.yml`

## Current blockers
- Version mismatch: `package.json` is `0.1.0` while README release is `v2.0.1`.
- No visible build identity endpoint/footer yet.
- No verify/deploy automation scripts yet.

## Exact commands run
- `pwd`
- `git status --short`
- `git branch --show-current`
- `git log -1 --oneline`
- `git tag --points-at HEAD || true`
- `ls`
- `find . -maxdepth 3 -type f | sort | head -200`
- `cat package.json`
- `cat README.md`
- `find . -maxdepth 3 -iname "*compose*" -o -iname "Dockerfile" -o -iname ".env*" -o -iname "*portainer*" 2>/dev/null`
- `ls -la /opt /srv /root /home ..`
- `awk -F= '/^[A-Za-z_][A-Za-z0-9_]*=/{print $1}' .env.local`
