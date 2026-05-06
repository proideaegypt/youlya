# Domain Decision (2026-05-06)

## Evidence
- `https://admin.nex-lnk.online/api/health` responded successfully.
- `https://admin.nex-lnk.online/api/build-info` responded successfully.
- `https://admin.youlya365.com/api/health` failed DNS resolution (NXDOMAIN from runtime: `Could not resolve host`).
- `https://admin.youlya365.com/api/build-info` failed DNS resolution.

## Decision
- Canonical production domain is: `admin.nex-lnk.online`.
- `admin.youlya365.com` is treated as legacy/non-active for current launch operations.

## Actions taken
- Kept runtime/test defaults aligned to `admin.nex-lnk.online`.
- Updated legacy pilot docs that still referenced `admin.youlya365.com`.

## Remaining action
- If Ahmed wants to relaunch on `admin.youlya365.com`, DNS + TLS + app routing must be explicitly re-provisioned and verified first.
