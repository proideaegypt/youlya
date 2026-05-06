# Evolution Auth Report

## Safe checks run
- Presence check only: `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE`, `EVOLUTION_API_KEY` => all set.
- Direct non-send probes (no customer message send):
  - `/instance/fetchInstances` with `apikey` => HTTP 401
  - `/instance/fetchInstances` with `x-api-key` => HTTP 401
  - `/instance/connectionState/<instance>` => 404 instance not found
  - `/manager/fetchInstances` => HTML manager UI response (200), indicates mixed gateway path behavior.

## Findings
- Outbound auth remains unresolved (401 persists).
- Current base URL/path likely points through a manager/proxy layer not aligned with API path expectations.
- Possible root causes:
  - stale/rotated API key in runtime,
  - wrong API base URL for the instance endpoint,
  - proxy path/header forwarding mismatch.

## Status
- P0 blocker remains open.
- No outbound customer send executed.
