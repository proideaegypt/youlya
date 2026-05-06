# API Audit

## Baseline
- Live health: `GET /api/health` -> 200
- Live build info: `GET /api/build-info` -> 200
- Live version: `2.15.1`
- Repo version: `2.18.0`

## Auth + Route checks
- `GET /api/dashboard/products/overview` -> 401 `{"error":"unauthorized"}`
- `POST /api/dashboard/products/search-qa` (no auth) -> 401 `{"error":"unauthorized"}`
- `GET /api/dashboard/handoff` -> 401
- `GET /api/dashboard/conversations` -> 401
- `GET /dashboard` -> 307 `/login`
- `GET /dashboard/products` -> 307 `/login`

## Internal route safety check
- `POST /api/internal/messages/turn` with `testMode:true` and no secret header returned `200` with conversational output.
- Classification: **P0 blocker** for production hardening unless explicitly intended and strictly source-limited.

## Response-shape findings
- Health + build-info shapes are stable and minimal (no secret leakage seen).
- Internal turn response includes safe structure (`intent/toolsCalled/reply/handoff/action`).

## Issues
- P0: internal turn endpoint accepted unauthenticated external call path in testMode.
- P1: live build metadata has unknown commit/branch; weak release traceability.
- P1: repo/live version drift (`2.18.0` vs `2.15.1`).
