# RESULT — validate-and-test-shopify-product-sync-workflow-safely

Date: 2026-05-03
Task: validate-and-test-shopify-product-sync-workflow-safely

---

## STEP 0 — DISCOVERY

- **Repo version**: 2.6.5
- **Live version**: 2.6.5
- **Commit**: 782e85c fix: sync script import path, add tsx, type fixes for shopify sync (v2.6.5)
- **Files present**: All expected files found.
  - `supabase/migrations/20260502180000_shopify_product_variant_sync.sql` ✅
  - `lib/adapters/shopify/shopify-product-sync-adapter.ts` ✅
  - `lib/adapters/supabase/product-sync-repository.ts` ✅
  - `lib/services/shopify-product-sync-service.ts` ✅
  - `app/api/internal/shopify/sync-products/route.ts` ✅
  - `scripts/sync-shopify-products.mjs` ✅
  - `n8n/workflows/youlya-daily-shopify-product-sync.json` ✅
  - `docs/SHOPIFY_PRODUCT_SYNC_RUNBOOK.md` ✅

## STEP 1 — ENV CHECK (NAME ONLY)

| Key | Status |
|---|---|
| SHOPIFY_STORE_DOMAIN | SET |
| SHOPIFY_ADMIN_API_TOKEN | SET |
| SHOPIFY_API_VERSION | **MISSING** (code defaults to `2024-01`) |
| SUPABASE_URL | SET |
| SUPABASE_SERVICE_ROLE_KEY | SET |
| INTERNAL_API_SECRET | SET |
| APP_INTERNAL_URL | SET |

> No values printed. Secret scan passed.

## STEP 2 — N8N VALIDATION

`npm run validate:n8n` → **PASS**

- WhatsApp canonical workflow: PASS ✅
- Shopify daily sync workflow: PASS ✅
- No hardcoded secrets ✅
- No raw workflow exports in repo ✅

## STEP 3 — MIGRATION SAFETY CHECK

`npm run check:migration:safe -- supabase/migrations/20260502180000_shopify_product_variant_sync.sql` → **FAIL**

- Forbidden keyword flagged: `cascade` at line 75
- Context: `product_id uuid references public.products(id) on delete cascade`
- Impact: This is a standard FK `ON DELETE CASCADE` inside `create table if not exists`. It is **forward-only** and does not drop/truncate/delete existing data.
- Status: Migration appears to already be applied (tables exist in production with 0 rows).

## STEP 4 — PRODUCTION DB TABLES

| Table | Exists | Count |
|---|---|---|
| products | yes | 0 |
| product_variants | yes | 0 |
| missing SKU count | — | 0 |
| last synced max | — | none |
| last_product_recommendations columns | — | all required columns present |

## STEP 5 — DRY RUN

Local script `npm run shopify:sync:dry-run` **failed** due to `tsx`/`bundler` module resolution when a `.mjs` entry point imports `.ts` files using `@/` path aliases. This is a local CLI issue, not a pipeline bug.

**Endpoint dry-run (Step 7) succeeded** and served as the authoritative dry-run test.

## STEP 6 — DEPLOY

Not required. Live app version (2.6.5) matches repo version. Endpoint `/api/internal/shopify/sync-products` returns 200.

## STEP 7 — ENDPOINT TEST (DRY RUN)

`POST https://admin.youlya365.com/api/internal/shopify/sync-products` with `dryRun: true`

Response:
```json
{
  "ok": true,
  "mode": "full",
  "storeId": "youlya",
  "syncedProducts": 252,
  "syncedVariants": 1082,
  "missingSkuCount": 461,
  "unavailableCount": 541,
  "durationMs": 6084,
  "dryRun": true
}
```

- 200 OK ✅
- Safe summary only ✅
- `dryRun: true` confirmed — no writes to Supabase ✅

## STEP 8 — FULL SYNC

**NOT RUN.** Waiting for explicit user approval.

Command ready:
```bash
npm run shopify:sync
```

## STEP 9 — N8N DAILY WORKFLOW

- Workflow **already imported** into n8n: `Youlya Daily Shopify Product Sync` (ID: H7l8PiCss9ZeqGug)
- Status: **Inactive** (as required)
- Nodes: 4 (Schedule Trigger → Sync Products → Check Success → Dead Letter)
- Uses `{{$env.APP_INTERNAL_URL}}` and `{{$env.INTERNAL_API_SECRET}}` ✅
- No hardcoded secrets ✅

**Do not activate until full sync is approved and verified.**

## STEP 10 — PRODUCT SEARCH CACHE

Skipped. Will run after full sync approval.

---

## SUMMARY

STATUS: PARTIAL
TASK: validate-and-test-shopify-product-sync-workflow-safely
REPO VERSION: 2.6.5
LIVE VERSION: 2.6.5
FILES: All present ✅
ENV CHECK: SHOPIFY_API_VERSION missing (has default) ⚠️
N8N VALIDATION: PASS ✅
MIGRATION: Flagged for `on delete cascade` (already applied, forward-only) ⚠️
DB TABLES: Exist, empty, columns ok ✅
DRY RUN: Local script broken, endpoint dry-run PASS ⚠️/✅
ENDPOINT TEST: 200 OK, 252 products, 1082 variants ✅
N8N DAILY WORKFLOW: Imported, inactive, env-driven ✅
PRODUCT SEARCH CACHE: Pending full sync ⏳
TESTS RUN: validate:n8n, check:migration:safe, scan:secrets, DB check, endpoint dry-run
DEPLOY RESULT: Not needed (already at 2.6.5)
BLOCKERS:
1. Migration file contains `on delete cascade` (already applied; consider updating checker rules or migration for future audits).
2. Local `npm run shopify:sync:dry-run` script fails due to `.mjs` → `.ts` `@/` resolution under tsx.
3. SHOPIFY_API_VERSION not explicitly set in `.env.production` (relies on code default).
RISKS:
- 461 / 1082 variants (~42.6%) have missing SKUs. May affect AI visibility if `require_sku_for_ai_visibility` is enabled.
- 541 variants (~50%) are unavailable (inventory ≤ 0). AI must filter these at query time.
- Do not activate n8n daily schedule until full sync writes are confirmed.
NEXT STEP:
1. Add `SHOPIFY_API_VERSION=2024-01` (or current stable version) to `.env.production`.
2. Fix `scripts/sync-shopify-products.mjs` → convert to `.ts`/`.mts` so `npm run shopify:sync:dry-run` works locally.
3. Obtain explicit user approval to run full sync (`npm run shopify:sync`).
4. After full sync, run product search cache test (Step 10).
5. Activate n8n daily workflow only after Steps 3–4 pass.
MANUAL QA: TEST Ya AHMED
