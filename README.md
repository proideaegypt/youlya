# Youlya AI Commerce OS

Version: `v2.0.1` (`codefix`)  
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

# Build identity + deploy automation
npm run build:info
npm run verify:deploy
npm run deploy:production
npm run deploy:watch
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

Current release tag target: `v2.0.1`

### v2.0.1 (codefix)

- Docker runner now includes `docs/` in the final image
- Health endpoint version is read dynamically from `package.json`
- Removed handoff side-effects from `conversation-state-service` unclear counter
- Updated `users_roles` migration IDs to UUID columns
- Removed obsolete Compose `version` key
- Repo hygiene updates (`tsconfig.tsbuildinfo`, archive cleanup rules)

## Build Identity

- Public build info file: `public/build-info.json`
- API endpoint: `GET /api/build-info`
- UI footer visible in dashboard and login.

## Pull-Based Deploy Agent

- Portainer webhook is not required.
- VPS agent checks `origin/main`, verifies, and deploys through Docker Compose.
- See: `docs/PULL_BASED_DEPLOY_AGENT.md`

---

For operating constraints and phase governance, see:

- `AGENTS.md`
- `CLAUDE.md`
- `PROGRESS-LOG.md`
- `LEARNINGS.md`
