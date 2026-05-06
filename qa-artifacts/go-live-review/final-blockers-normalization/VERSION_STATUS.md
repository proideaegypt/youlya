# Version Status

**Date:** 2026-05-06
**Task:** normalize-production-domain-and-fix-critical-launch-blockers

## Local Code

- **Version:** `2.23.3`
- **Version name:** `finish-user-management-update-deactivate-invite-flow`
- **Commit:** `b5ac014`
- **Branch:** `main`
- **Dirty:** `true` (uncommitted changes from this and prior tasks)
- **Build info:** `public/build-info.json` exists

## Deployed Container

- **Container name:** `youlya-youlya-app-1`
- **Status:** `Up 12 minutes (healthy)`
- **Port mapping:** `0.0.0.0:3000->3000/tcp`
- **Version:** `2.23.2`
- **Version name:** `user-management-add-update-buttons-and-safe-rbac-api-flow`
- **Built at:** `2026-05-06T03:56:16.981Z`
- **Dirty:** `false`

## Gap

Local code (`2.23.3`) is **one patch ahead** of the deployed container (`2.23.2`).
The container was built ~12 minutes ago but from an earlier commit.

## Recommendation

Rebuild and redeploy the container after all validations pass:
```bash
docker compose up -d --build
```

Then verify:
```bash
curl -fsS https://admin.nex-lnk.online/api/build-info
```

Expected result: version `2.23.3` or later.
