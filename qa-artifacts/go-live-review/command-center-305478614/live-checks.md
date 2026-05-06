# Live Checks for Command Center Error 305478614

Date: 2026-05-06

## Results

| URL | Status | Notes |
|-----|--------|-------|
| `https://admin.nex-lnk.online/` | HTTP 307 → /dashboard | Root redirect works |
| `https://admin.nex-lnk.online/dashboard` | HTTP 307 → /login | Unauthenticated redirect works |
| `https://admin.nex-lnk.online/dashboard/command-center` | HTTP 307 → /login | Unauthenticated redirect works |
| `https://admin.nex-lnk.online/api/health` | HTTP 200, `{"status":"ok"}` | Health OK |
| `https://admin.nex-lnk.online/api/build-info` | HTTP 200, version 2.23.2 | Build info OK |

## Key Observation

The command-center page does **NOT** crash for unauthenticated requests. It returns 307 → /login correctly.

This means the error 305478614 occurs **only when authenticated** — the server component `loadStats()` crashes during rendering for logged-in users.

Deployed version: 2.23.2
Local repo version: 2.23.3
