# Baseline — fix-production-build-runtime-and-dns-readiness

- Date: 2026-05-01
- Host: vmi2942438.contaboserver.net
- User: root
- Node: v22.22.2
- npm: 10.9.7
- Branch: main
- Commit: f19455a
- Build command: `npm run build` -> `npm run build:info && next build`
- Next build runtime mode: no explicit Turbopack flag in package scripts or `next.config.ts`
- DNS status (`getent hosts admin.youlya365.com`): no resolution returned

## Current Blockers
1. Production build previously failed with Next/Turbopack process/bind EPERM.
2. TLS readiness check fails because `admin.youlya365.com` does not resolve in this environment.
