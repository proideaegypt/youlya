# Verify Before Deploy

- Date: 2026-05-04
- Branch: main
- Commit: 98ce7d1

Running: check-env-tracking

> youlya-phase0-app@2.9.1 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.9.1 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.9.1 typecheck
> tsc --noEmit

lib/services/haidi-context-builder.ts(143,68): error TS2345: Argument of type 'string | null | undefined' is not assignable to parameter of type 'string | null'.
  Type 'undefined' is not assignable to type 'string | null'.
tests/unit/haidi-agent.test.ts(246,7): error TS2304: Cannot find name 'appReply'.
tests/unit/haidi-agent.test.ts(256,7): error TS2304: Cannot find name 'appReply'.
tests/unit/haidi-agent.test.ts(265,7): error TS2304: Cannot find name 'appReply'.
