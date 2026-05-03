# RESULT — prove-shopify-sync-is-read-only-before-first-full-sync

Date: 2026-05-03
Task: prove-shopify-sync-is-read-only-before-first-full-sync
Version: v2.6.8

## STEP 0 — DISCOVERY

- Repo: /root/youlya
- Git status: clean for task-specific changes; pre-existing M/?? files from other tasks
- Version: 2.6.6 → 2.6.8
- Key files identified:
  - `lib/adapters/shopify/shopify-product-sync-adapter.ts`
  - `lib/services/shopify-product-sync-service.ts`
  - `app/api/internal/shopify/sync-products/route.ts`
  - `scripts/sync-shopify-products.ts`
  - `n8n/workflows/youlya-daily-shopify-product-sync.json`

## STEP 1 — STATIC SHOPIFY MUTATION SCAN

Grep across `lib app scripts n8n/workflows` for forbidden patterns:

- `lib/adapters/evolution/evolution-client.ts` — POST to Evolution API (not Shopify) — OK
- `lib/adapters/shopify/shopify-product-sync-adapter.ts:144` — POST to Shopify GraphQL endpoint with `query GetProducts` — OK (read-only)
- `lib/adapters/shopify/shopify-client.ts:49` — POST to `/orders.json` for `createOrder` — OK (order adapter, NOT used by product sync)
- `app/dashboard/toggle-card.tsx` — internal dashboard POST — OK
- `scripts/internal-pilot-smoke.mjs` — internal smoke test POSTs — OK

No forbidden mutations found in the product sync path.

## STEP 2 — INSPECT SHOPIFY SYNC ADAPTER

### `lib/adapters/shopify/shopify-product-sync-adapter.ts`
- Uses `PRODUCTS_QUERY` = `query GetProducts($first: Int!, $after: String)`
- No `mutation` keyword
- No REST write endpoints
- No product update/delete/create
- No inventory write
- No order creation
- Returns `ShopifyProduct[]` with variants

### `lib/services/shopify-product-sync-service.ts`
- Calls `fetchAllShopifyProducts` (read-only Shopify)
- When `dryRun = true`: returns early, NO Supabase writes
- When `dryRun = false`: upserts to Supabase cache via `ProductSyncRepository`
- Never writes to Shopify

### `app/api/internal/shopify/sync-products/route.ts`
- Receives POST with `store_id`, `mode`, `dryRun`, `source`
- Calls `syncShopifyProducts`
- No direct Shopify API calls

### `scripts/sync-shopify-products.ts`
- CLI wrapper calling `syncShopifyProducts`
- Supports `--dry-run`, `--mode`, `--store-id`
- No direct Shopify API calls

### `n8n/workflows/youlya-daily-shopify-product-sync.json`
- Calls internal app endpoint `/api/internal/shopify/sync-products`
- Body: `{"store_id":"youlya","mode":"full",...}`
- No direct Shopify API calls
- `active: false` (remains inactive per task rule)

## STEP 3 — AUTOMATED READ-ONLY GUARD

Created `scripts/assert-shopify-sync-readonly.mjs`
- Scans the 5 sync-related files
- Fails on forbidden patterns: `mutation`, `productCreate`, `productUpdate`, `productDelete`, `productVariantUpdate`, `inventoryAdjust`, `inventorySet`, `inventoryBulk`, `metafieldsSet`, `collectionUpdate`, REST PUT/PATCH/DELETE, POST to product/variant JSON
- Prints only file names and matched pattern names
- Never prints secrets

Added to `package.json`:
```json
"shopify:assert-readonly": "node scripts/assert-shopify-sync-readonly.mjs"
```

## STEP 4 — RUN READ-ONLY GUARD

```
$ npm run shopify:assert-readonly

============================================================
SHOPIFY SYNC READ-ONLY ASSERTION
============================================================

  PASS  lib/adapters/shopify/shopify-product-sync-adapter.ts
  PASS  lib/services/shopify-product-sync-service.ts
  PASS  app/api/internal/shopify/sync-products/route.ts
  PASS  scripts/sync-shopify-products.ts
  PASS  n8n/workflows/youlya-daily-shopify-product-sync.json

PASS — No forbidden Shopify mutation/write patterns found in product sync path.

============================================================
```

Result: **PASS**

## STEP 5 — SAFE DRY-RUN

```
$ npx dotenv-cli -e .env.production -- npx tsx scripts/sync-shopify-products.ts --mode full --dry-run --store-id youlya

==================================================
SHOPIFY PRODUCT SYNC
==================================================
Store: youlya
Mode: full
Dry run: true

[sync] page 1: 50 products, 246 variants
[sync] page 2: 50 products, 151 variants
[sync] page 3: 50 products, 264 variants
[sync] page 4: 50 products, 208 variants
[sync] page 5: 50 products, 193 variants
[sync] page 6: 2 products, 20 variants
==================================================
STATUS: SUCCESS
Products synced: 252
Variants synced: 1082
Missing SKUs: 461
Unavailable variants: 541
Duration: 5425ms
(Dry run — no data written)
==================================================
```

Result: **PASS** — reads from Shopify, no writes to Shopify, no writes to Supabase.

## STEP 6 — DB BEFORE COUNTS

Store: `ef77af08-688d-4354-8096-d89f6046f0c2` (slug: youlya)

```
DB BEFORE COUNTS:
  products: 252
  product_variants: 1082
  max last_synced_at: 2026-05-03T17:54:41.161+00:00
```

Note: Cache already contains data from a prior sync. The read-only proof still holds for any subsequent sync.

## STEP 7 — READY FOR APPROVAL

All gates passed:
- shopify:assert-readonly **PASS**
- dry-run **PASS**
- DB before counts **recorded**

READY_FOR_APPROVAL:
The next command only writes/upserts Supabase cache, not Shopify:
```bash
npm run shopify:sync
```
**Do not run it automatically. Awaiting explicit owner approval.**

## STEP 8 — FINAL STATUS

STATUS: **PASS**
TASK: prove-shopify-sync-is-read-only-before-first-full-sync
READONLY GUARD: PASS (no forbidden mutations in 5 sync files)
FORBIDDEN SHOPIFY MUTATIONS FOUND: None
SHOPIFY ADAPTER: GraphQL query GetProducts only, no mutations
SYNC SERVICE: Reads Shopify, writes only to Supabase cache; dryRun=true skips all writes
DRY RUN: PASS (252 products, 1082 variants read, zero writes)
DB BEFORE: 252 products, 1082 variants, last_synced_at 2026-05-03T17:54:41.161+00:00
FULL SYNC: Blocked pending explicit approval
BLOCKERS: None (awaiting explicit approval for `npm run shopify:sync`)
RISKS: Low — product sync path is read-only from Shopify; only Supabase cache is mutated.
NEXT STEP: Await explicit owner approval before running `npm run shopify:sync`.
MANUAL QA: N/A (no UI change)
