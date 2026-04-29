# Claude Opus Review Brief

Ahmed will ask Claude Opus to review this pack. This file explains what to judge.

## What this pack claims to be

A final live starter pack for Codex implementation of Youlya AI Commerce OS. It is a spec + prompt + test + schema + deployment pack, not a finished app.

## What to review first

1. `README.md`
2. `START_HERE_FOR_CODEX.md`
3. `COPY_TO_CODEX_GPT53.md`
4. `MEMORY.md`
5. `docs/18_NO_OVERENGINEERING_RULES.md`
6. `docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md`
7. `docs/prompts/00_MASTER_CODEX_GPT53_FINAL_LIVE_PROMPT.md`
8. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
9. `docs/12_DASHBOARD_SYSTEM_FEATURES_FINAL.md`
10. `docs/13_API_AND_STATE_CONTRACTS.md`
11. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
12. `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md`
13. `tests/playwright-youlya-scenarios.spec.ts`
14. `scripts/validate-scenarios.mjs`
15. `supabase/migrations/0001_phase0_core.sql`

## Critical reviewer questions

```text
Does the pack prevent wrong Shopify orders?
Does it prevent duplicate orders?
Does it force persisted product mapping?
Does it handle Shopify name/code/SKU without inventing data?
Does it keep n8n as orchestration only?
Does it avoid over-engineering?
Does it delay dashboard/SaaS/RAG until after commerce safety?
Are the tests and gates practical?
Can Codex follow the prompts without ambiguity?
```

## Known limitations by design

```text
No real Shopify product list is included because no Shopify export/API credentials were provided.
No n8n workflow JSON is included because the workflow exports were not provided.
No complete app code is included because the user asked for a final build pack/spec/prompt for Codex to implement.
Dashboard is specified but not built in Phase 0.
RAG/multi-channel/SaaS are intentionally delayed.
```

## Important fixed issues from previous pack

```text
Fake JSONL header row removed.
Scenario count corrected to 90 real scenarios.
Playwright defaults to CONV scenarios.
Dashboard scenarios are not run against message-turn by default.
Shopify product name/code policy added.
No-overengineering doc added.
Codex tools/plugins guidance added.
Supabase Phase 0 migration blueprint added.
```

## Review expectation

If you find issues, classify them as:

```text
BLOCKER before Codex starts
BLOCKER before production live
SHOULD FIX after Phase 0
NICE TO HAVE later
```

Do not reject the pack for not including live credentials or real Shopify products. Those are intentionally external production inputs.
