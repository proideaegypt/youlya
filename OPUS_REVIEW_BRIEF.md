# OPUS_REVIEW_BRIEF.md

Ahmed will give this repository to Claude Opus for review.

## What to judge
Judge whether this is a clean, production-focused Codex build pack for Youlya AI Commerce OS.
Do not judge it as a finished application; Codex is expected to build the app from these specs.

## Review order

1. `README.md`
2. `START_HERE_FOR_CODEX.md`
3. `COPY_TO_CODEX_GPT53.md`
4. `AGENTS.md`
5. `MEMORY.md`
6. `docs/18_NO_OVERENGINEERING_RULES.md`
7. `docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md`
8. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
9. `docs/13_API_AND_STATE_CONTRACTS.md`
10. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
11. `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md`
12. `docs/prompts/00_MASTER_CODEX_GPT53_FINAL_LIVE_PROMPT.md`
13. `tests/playwright-youlya-scenarios.spec.ts`
14. `scripts/validate-scenarios.mjs`
15. `supabase/migrations/0001_phase0_core.sql`

## Expected production-safety claims

- No order can be created without explicit confirmation.
- No product can be selected from AI memory.
- Product selection resolves from persisted `last_product_recommendations`.
- Shopify title is product name.
- Shopify variant SKU is product code.
- Missing SKU is a warning, not an invented code.
- Duplicate webhook/confirmation cannot create duplicate order.
- OOS or unknown stock blocks order creation.
- n8n contains orchestration only.
- Phase 0/1 are intentionally lean.
- Dashboard/SaaS/RAG/multi-channel are delayed.

## Known external blockers

- Real Shopify product names/codes require Shopify API credentials or a Shopify export.
- Real n8n workflow validation requires exported workflow JSON files.
- Real deployment requires VPS domains and production secrets.

These are not pack defects. They are external production inputs.

## Classification requested

Use this classification:

```text
BLOCKER before Codex starts
BLOCKER before production live
HIGH fix during Phase 0/1
MEDIUM after first live
LOW polish
```
