# Youlya AI Commerce OS

## Current Release

| Field | Value |
|---|---|
| Version | v2.4.1 |
| Version Name | internal-whatsapp-n8n-pilot |
| Task | phase-e-internal-whatsapp-n8n-pilot |
| Release File | RELEASES/v2.4.1-internal-whatsapp-n8n-pilot.md |

| Field | Value |
|---|---|
| Version | v2.4.0 |
| Version Name | port-smart-home-theme-to-youlya-admin-dashboard |
| Task | port-smart-home-theme-to-youlya-admin-dashboard |
| Release File | RELEASES/v2.4.0-port-smart-home-theme-to-youlya-admin-dashboard.md |

| Field | Value |
|---|---|
| Version | v2.3.0 |
| Version Name | port-next-link-dashboard-system-to-youlya-commerce |
| Task | port-next-link-dashboard-system-to-youlya-commerce |
| Release File | RELEASES/v2.3.0-port-next-link-dashboard-system-to-youlya-commerce.md |

| Field | Value |
|---|---|
| Version | v2.2.1 |
| Version Name | add-official-youlya-brand-logo-assets |
| Task | add-official-youlya-brand-logo-assets |
| Release File | RELEASES/v2.2.1-add-official-youlya-brand-logo-assets.md |

| Field | Value |
|---|---|
| Version | v2.2.0 |
| Version Name | dashboard-v3-youlya-home-wear-redesign |
| Task | dashboard-v3-youlya-home-wear-redesign |
| Release File | RELEASES/v2.2.0-dashboard-v3-youlya-home-wear-redesign.md |

| Field | Value |
|---|---|
| Version | v2.1.1 |
| Version Name | playwright-ux-swarm-signal-quality |
| Task | fix-playwright-ux-swarm-signal-quality |
| Release File | RELEASES/v2.1.1-playwright-ux-swarm-signal-quality.md |

| Field | Value |
|---|---|
| Version | v2.1.0 |
| Version Name | dashboard-playwright-qa-swarm-and-n8n-manual-test-support |
| Task | dashboard-playwright-qa-swarm-and-n8n-manual-test-support |
| Release File | RELEASES/v2.1.0-dashboard-playwright-qa-swarm-and-n8n-manual-test-support.md |

| Field | Value |
|---|---|
| Version | v2.0.11 |
| Version Name | dashboard-login-submit-and-session |
| Task | fix-dashboard-login-submit-and-session |
| Release File | RELEASES/v2.0.11-dashboard-login-submit-and-session.md |

| Field | Value |
|---|---|
| Version | v2.0.10 |
| Version Name | add-dashboard-login-route |
| Task | add-dashboard-login-route |
| Release File | RELEASES/v2.0.10-add-dashboard-login-route.md |

| Field | Value |
|---|---|
| Version | v2.0.9 |
| Version Name | schema-migration-reconciliation |
| Task | schema-migration-reconciliation |
| Release File | RELEASES/v2.0.9-schema-migration-reconciliation.md |

| Field | Value |
|---|---|
| Version | v2.0.8 |
| Version Name | schema-migration-reconciliation |
| Task | schema-migration-reconciliation |
| Release File | RELEASES/v2.0.8-schema-migration-reconciliation.md |

| Field | Value |
|---|---|
| Version | v2.0.7 |
| Version Name | investigate-supabase-health-subcheck |
| Task | investigate-supabase-health-subcheck |
| Release File | RELEASES/v2.0.7-investigate-supabase-health-subcheck.md |

| Field | Value |
|---|---|
| Version | v2.0.6 |
| Version Name | tls-termination-with-caddy |
| Task | fix-tls-termination-with-caddy |
| Release File | RELEASES/v2.0.6-tls-termination-with-caddy.md |

| Field | Value |
|---|---|
| Version | v2.0.5 |
| Version Name | production-build-runtime-and-dns-readiness |
| Task | fix-production-build-runtime-and-dns-readiness |
| Release File | RELEASES/v2.0.5-production-build-runtime-and-dns-readiness.md |

| Field | Value |
|---|---|
| Version | v2.0.4 |
| Version Name | secret-scan-policy-and-tls-readiness |
| Task | fix-secret-scan-policy-and-tls-readiness |
| Release File | RELEASES/v2.0.4-secret-scan-policy-and-tls-readiness.md |

| Field | Value |
|---|---|
| Version | v2.0.3 |
| Version Name | production-deploy-real-secrets-validation |
| Task | phase-e-production-deploy-real-secrets-validation |
| Release File | RELEASES/v2.0.3-production-deploy-real-secrets-validation.md |

| Field | Value |
|---|---|
| Version | v2.0.2 |
| Version Name | add-release-governance-versioning-rule |
| Task | add-release-governance-versioning-rule |
| Release File | RELEASES/v2.0.2-add-release-governance-versioning-rule.md |


Version: `v2.0.9` (`schema-migration-reconciliation`)  
Date: `2026-05-01`

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
- Dashboard v3 redesign:
  - YOULYA HOME WEAR brand palette and responsive shell
  - Arabic/English toggle with RTL/LTR direction switching
  - Theme toggle (light/dark) and componentized KPI/chart/empty states
  - Design system doc: `docs/DASHBOARD_DESIGN_SYSTEM.md`

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

# Dashboard QA swarms (requires .env.playwright local file)
npm run test:e2e:dashboard:ux
npm run test:e2e:dashboard:functional
npm run test:e2e:dashboard:a11y
npm run test:e2e:dashboard:api
npm run test:e2e:dashboard:swarm
npm run qa:collect

# Build identity + deploy automation
npm run build:info
npm run check:env:tracking
npm run check:env:production
npm run scan:secrets
npm run verify:deploy
npm run check:tls
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

Current release tag target: `v2.0.2`

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
