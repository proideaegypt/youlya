# START HERE FOR CODEX

You are inside the Youlya AI Commerce OS final live starter pack.

## Mission

Build the project from spec pack to safe production live version in controlled phases. Do not build everything at once. Do not over-engineer. Your first job is Phase 0 only.

Before implementation, verify `.agents/skills` exists and load the relevant repo-scoped skills.
Before deployment tasks, verify `deploy/portainer/docker-compose.portainer.yml` exists.
Use Playwright Agent CLI only for safe local/staging browser QA.
At task start/end, append prompt/result entries in `worktime.md` using incremental numbering and `DD/MM/YY` date format.

## Required read order before any code edit

Read these files completely and in this order:

1. `CLAUDE.md`
2. `MEMORY.md`
3. `PROGRESS-LOG.md`
4. `LEARNINGS.md`
5. `docs/18_NO_OVERENGINEERING_RULES.md`
6. `docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md`
7. `docs/01_SPEC_DRIVEN_MASTER_SPEC.md`
8. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
9. `docs/12_DASHBOARD_SYSTEM_FEATURES_FINAL.md`
10. `docs/13_API_AND_STATE_CONTRACTS.md`
11. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
12. `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md`
13. `docs/07_TEST_STRATEGY_AND_SWARMS.md`
14. `docs/08_RUNBOOK.md`
15. `docs/10_DEPLOYMENT_ARCHITECTURE.md`
16. `docs/prompts/00_MASTER_CODEX_GPT53_FINAL_LIVE_PROMPT.md`

If a file conflicts with another file, follow this priority:

```text
CLAUDE.md
→ MEMORY.md
→ docs/18_NO_OVERENGINEERING_RULES.md
→ docs/prompts/00_MASTER_CODEX_GPT53_FINAL_LIVE_PROMPT.md
→ docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md
→ docs/01_SPEC_DRIVEN_MASTER_SPEC.md
→ older docs
```

## First command sequence

```bash
node scripts/validate-scenarios.mjs
node scripts/scan-secrets.mjs
node scripts/validate-shopify-products.mjs
node scripts/validate-n8n-workflows.mjs
```

Then create:

```text
qa-artifacts/tasks/YYYY-MM-DD/phase-0-bootstrap/baseline/RESULT.md
```

Include:

```text
Files found
Missing app files
Scenario validation result
Env placeholder status
Shopify product template/export status
n8n workflow JSON status
Risks
Commands run
```

## Phase 0 scope only

Build only:

```text
Next.js scaffold
Env validation
Supabase migration
/api/health
/api/internal/messages/turn
Product search
Product mapping
Select product by index + size
Cart
Shipping
Confirmation gate
Shopify mock/live adapter boundary
Idempotency
Handoff
Audit/tool logs
Scenario validation
Unit/API/E2E tests
```

Do not build yet:

```text
Full dashboard
Multi-channel
RAG
SaaS billing
Agency portal
Advanced analytics
Campaign engine
White label
Marketplace
```

## Definition of done for Phase 0

```text
npm run typecheck passes
npm run lint passes
npm test passes
npm run build passes
node scripts/validate-scenarios.mjs passes
APP_URL=http://localhost:3000 SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list passes or has a documented manual-run blocker
No live side effects in testMode
No fake real Shopify order numbers
No secret exposure
qa artifact written
PROGRESS-LOG.md updated
```
