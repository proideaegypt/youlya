# AGENTS.md — Youlya AI Commerce OS

This file is the root operating contract for Codex, Claude Code, and any coding agent.

## Mission
Build Youlya to a safe production live launch without over-engineering.

## Mandatory read order
Before editing code, read:

1. `START_HERE_FOR_CODEX.md`
2. `COPY_TO_CODEX_GPT53.md`
3. `MEMORY.md`
4. `PROGRESS-LOG.md`
5. `LEARNINGS.md`
6. `docs/18_NO_OVERENGINEERING_RULES.md`
7. `docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md`
8. `docs/01_SPEC_DRIVEN_MASTER_SPEC.md`
9. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
10. `docs/13_API_AND_STATE_CONTRACTS.md`
11. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
12. `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md`
13. `docs/17_CODEX_TOOLS_AND_PLUGINS.md`
14. `docs/prompts/00_MASTER_CODEX_GPT53_FINAL_LIVE_PROMPT.md`

## Non-negotiables

- Shopify is the source of truth for products, variants, inventory, and orders.
- Product name comes from Shopify title.
- Product code comes from Shopify variant SKU. Do not invent codes.
- Supabase is app state and operational cache.
- n8n orchestrates only. Business logic lives in the app.
- No order without explicit customer confirmation.
- No order without exact Shopify variant ID.
- No product selection from AI memory.
- No duplicate order from duplicate webhook or repeated confirmation.
- No live side effects in `testMode`.
- Every mutation writes audit logs.
- Every tool call writes AI tool logs.
- Every tenant query includes `store_id`.
- No secrets in git, frontend code, workflow JSON, screenshots, or logs.
- Handoff and kill switch must always work.

## Build order

1. Phase 0 bootstrap.
2. Phase 0 commerce safety core.
3. Phase 1 integrations and deployment.
4. Phase 2 dashboard MVP.
5. Phase 3 growth features.
6. SaaS only after Youlya live is stable.

## Stop conditions

Stop and report `PARTIAL` before:

- enabling all real customers;
- mutating live Shopify before explicit approval;
- deleting production data;
- changing confirmation/order policy;
- deploying production without owner approval;
- adding Phase 2+ features before Phase 0/1 gates.

## Required status format

```text
STATUS: PASS / PARTIAL / FAIL
PHASE:
TASK:
FILES CHANGED:
TESTS RUN:
RESULTS:
BLOCKERS:
RISKS:
NEXT STEP:
MANUAL QA:
TEST Ya AHMED
```

## Repo-scoped skills

- `youlya-phase-guardian`: enforce phase scope and block future-phase creep.
- `youlya-commerce-safety-reviewer`: audit order/cart safety gates.
- `youlya-scenario-qa-runner`: scenario validation + Playwright checks.
- `youlya-shopify-product-sync`: enforce Shopify title/SKU/variant identity rules.
- `youlya-supabase-rls-migration-reviewer`: schema + RLS + tenant safety checks.
- `youlya-n8n-evolution-contract-reviewer`: orchestration contract and workflow safety.
- `youlya-security-secret-auditor`: secret exposure and PII leak checks.
- `youlya-vps-docker-deployer`: VPS Docker + Portainer deployment readiness.
- `youlya-dashboard-mvp-builder`: minimal dashboard scope after Phase 0/1 gates.
- `youlya-docs-progress-updater`: progress/memory/learnings/qa artifact updates.

## Work history rule (`worktime.md`)

- For every Codex task in this repo, append a `PROMPT <N> <DD/MM/YY>` entry at task start and a matching `RESULT <N> <DD/MM/YY>` entry at task end.
- `N` must be incremental and shared by the prompt/result pair.
- Keep all previous entries; never delete history.
- File path: `worktime.md`.
