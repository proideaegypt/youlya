# Youlya AI Commerce OS — Final Live Starter Pack

Version: 3.0 final-live-planning pack  
Date: 2026-04-28  
Target: start vibe coding today with Codex GPT-5.3-Codex, then reach a safe Youlya production live launch.

This repository is a **spec-first build pack**, not a finished app. It gives Codex the contracts, prompts, scenario tests, schema, dashboard scope, deployment plan, QA gates, and production rules required to build the real application without over-engineering.

## Critical Agent Contract

Start with `CLAUDE.md` at the project root. It is the canonical operating contract for Claude Code, Codex, and reviewers. The mirrored docs copy is `docs/04_CLAUDE.md`.


## What this pack is for

Build a production-safe AI Commerce OS for Youlya:

```text
WhatsApp customer message
→ Evolution API
→ n8n normalization only
→ Next.js /api/internal/messages/turn
→ product search from Shopify/Supabase cache
→ persisted product mapping
→ cart + shipping + final summary
→ explicit customer confirmation
→ Shopify COD order
→ handoff if risky
→ logs, audit, dashboard visibility
```

## What this pack intentionally avoids

Do not start with full SaaS, marketplace, multi-channel, RAG, billing, or heavy analytics. Those are later phases. The first production win is a safe WhatsApp-to-Shopify COD order flow.

## Folder map

```text
.
├── README.md
├── CLAUDE.md
├── START_HERE_FOR_CODEX.md
├── COPY_TO_CODEX_GPT53.md
├── CODEX_GPT53_FULL_STEP_BY_STEP_PROMPT.md
├── AGENTS.md
├── OPUS_REVIEW_BRIEF.md
├── MEMORY.md
├── PROGRESS-LOG.md
├── LEARNINGS.md
├── .env.example
├── docs/
│   ├── 00_EXECUTIVE_BRIEF.md
│   ├── 01_SPEC_DRIVEN_MASTER_SPEC.md
│   ├── 02_ROADMAP_PHASES.md
│   ├── 03_UI_UX_DASHBOARD_SPEC.md
│   ├── 04_CLAUDE.md
│   ├── 05_AGENTS.md
│   ├── 06_CODEX_MASTER_PROMPT.md
│   ├── 07_TEST_STRATEGY_AND_SWARMS.md
│   ├── 08_RUNBOOK.md
│   ├── 09_PRODUCTION_GO_LIVE_CHECKLIST.md
│   ├── 10_DEPLOYMENT_ARCHITECTURE.md
│   ├── 11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md
│   ├── 12_DASHBOARD_SYSTEM_FEATURES_FINAL.md
│   ├── 13_API_AND_STATE_CONTRACTS.md
│   ├── 14_DATABASE_SCHEMA_AND_RLS_SPEC.md
│   ├── 15_N8N_EVOLUTION_CONTRACT_FINAL.md
│   ├── 16_CLEAN_ROADMAP_TO_PRODUCTION.md
│   ├── 17_CODEX_TOOLS_AND_PLUGINS.md
│   ├── 18_NO_OVERENGINEERING_RULES.md
│   ├── prompts/
│   │   ├── 00_MASTER_CODEX_GPT53_FINAL_LIVE_PROMPT.md
│   │   ├── 01_PHASE0_BOOTSTRAP_PROMPT.md
│   │   ├── 02_PHASE0_COMMERCE_CORE_PROMPT.md
│   │   ├── 03_PHASE1_INTEGRATION_DEPLOY_PROMPT.md
│   │   ├── 04_PHASE2_DASHBOARD_MVP_PROMPT.md
│   │   ├── 05_FINAL_PRODUCTION_REVIEW_PROMPT.md
│   │   └── 06_SHOPIFY_PRODUCT_SYNC_PROMPT.md
│   ├── review/
│   │   ├── CLAUDE_OPUS_REVIEW_BRIEF.md
│   │   └── FINAL_REVIEW_NOTES_AR.md
│   └── data/
│       ├── youlya_human_test_scenarios.jsonl
│       ├── youlya_human_test_scenarios.csv
│       └── shopify_product_import_template.csv
├── scripts/
│   ├── validate-scenarios.mjs
│   ├── scan-secrets.mjs
│   ├── validate-shopify-products.mjs
│   ├── normalize-shopify-products.mjs
│   └── validate-n8n-workflows.mjs
├── supabase/
│   └── migrations/
│       └── 0001_phase0_core.sql
├── tests/
│   ├── playwright-youlya-scenarios.spec.ts
│   └── n8n-workflow-contract-tests.md
├── workflows/
│   └── README.md
└── qa-artifacts/
    └── .gitkeep
```

## Start here

1. Read `START_HERE_FOR_CODEX.md`.
2. Copy `COPY_TO_CODEX_GPT53.md` into Codex as the first instruction.
3. Tell Codex: `Start Phase 0 only. Do not build full SaaS or full dashboard yet.`
4. Codex must read the required files before editing.
5. Codex must write `qa-artifacts/tasks/YYYY-MM-DD/.../RESULT.md` after each task.

## Codex setup

- Setup + skills guide: `docs/19_CODEX_INSTALL_AND_SKILLS_SETUP.md`
- Bootstrap prompt after skills install: `prompts/00_CODEX_BOOTSTRAP_AFTER_SKILLS_INSTALL.md`
- Portainer Git deployment guide: `docs/21_PORTAINER_GIT_DEPLOY_FROM_REPO.md`

## Scenario status

The cleaned JSONL contains **90 real scenarios**:

```text
80 CONV scenarios
10 DASH scenarios
0 fake header scenarios
```

Default E2E behavior must run only conversation scenarios:

```bash
APP_URL=http://localhost:3000 SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

Dashboard scenarios are kept for Phase 2 and must not hit `/api/internal/messages/turn` by default.

## Shopify product name + code rule

The system must store and show products using Shopify source data:

```text
Product name = Shopify product title
Product code = Shopify variant SKU first; fallback to product handle only for internal display; never invent a code
Variant identity = Shopify variant GID/id
```

The file `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md` defines the exact import/sync rules. Use `docs/prompts/06_SHOPIFY_PRODUCT_SYNC_PROMPT.md` once Shopify credentials/export are available. For manual exports, normalize with `node scripts/normalize-shopify-products.mjs <export.csv>` and validate with `node scripts/validate-shopify-products.mjs docs/data/shopify_products.csv`.

## Production non-negotiables

```text
No Shopify order without explicit confirmation.
No order from AI memory.
No order without variant_id.
No order if stock is unknown or out of stock.
No duplicate order from duplicate webhook.
No live mutation in testMode.
No secrets in git or frontend.
Every mutation has audit log.
Every AI tool call has tool log.
Kill switch and human handoff always work.
```

## Minimal production build path

```text
Phase 0: safe commerce core
Phase 1: n8n/Evolution/Shopify live integration + VPS deploy
Phase 2: dashboard MVP
Phase 3+: sync intelligence, customer 360, RAG, multi-channel, SaaS
```

The first live version only needs to make Youlya WhatsApp orders safely. Everything else is delayed until after stability.
