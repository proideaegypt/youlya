# Youlya AI Commerce OS

Version: `v2.0.0`  
Date: `2026-04-30`

Production-oriented WhatsApp commerce system for Youlya, built with Next.js App Router, Supabase, and Playwright scenario validation.

## What Is Included

- Internal turn endpoint: `POST /api/internal/messages/turn`
- n8n + Evolution wiring (webhook receiver + sender adapter)
- Idempotency + duplicate protection
- Failed events / dead-letter style capture
- Product mapping persistence + mock fallback
- Conversation flow state machine + mock order placement
- Dashboard MVP (RTL Arabic):
  - Command Center
  - Inbox / handoff
  - Orders + safety view
  - Logs
  - Settings

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Supabase (state + operational tables)
- Playwright (E2E scenario runner)
- Vitest (unit/integration)
- Tailwind + Next Themes

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

App default URL: `http://localhost:3000`

## Core Commands

```bash
# Type checks
npm run typecheck

# Lint
npm run lint

# Unit + integration
npm test

# Scenario validation
npm run validate:scenarios

# E2E (all loaded scenarios)
npm run test:e2e

# E2E by prefix (optional)
SCENARIO_PREFIX=CONV npm run test:e2e
SCENARIO_PREFIX=DASH npm run test:e2e
```

## Key Paths

- Dashboard pages: `app/dashboard/*`
- Internal APIs: `app/api/internal/*`
- Dashboard APIs: `app/api/dashboard/*`
- Evolution adapter: `lib/adapters/evolution/evolution-client.ts`
- Message turn service: `lib/services/message-turn-service.ts`
- Supabase migrations: `supabase/migrations/*`
- Scenarios JSONL: `docs/data/youlya_human_test_scenarios.jsonl`

## Safety Rules (Enforced by Design)

- No duplicate order from duplicate messages
- No unsafe side effects in test/mock mode
- Internal APIs protected by internal secret middleware
- Handoff and kill switch support included
- Audit-oriented flow with failure capture endpoints

## Release

Current release tag target: `v2.0.0`

---

For operating constraints and phase governance, see:

- `AGENTS.md`
- `CLAUDE.md`
- `PROGRESS-LOG.md`
- `LEARNINGS.md`
