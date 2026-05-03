# Baseline — implement-shopify-product-variant-sync-and-n8n-daily-workflow

Date: 2026-05-02
Task: implement-shopify-product-variant-sync-and-n8n-daily-workflow
Previous task: quarantine-unsafe-n8n-raw-exports-and-enforce-canonical-workflow (PASS)

## Current version
- App: v2.5.7
- Git commit: 37b94b5
- Container: healthy

## Current product tables/migrations status

Migrations exist:
- `supabase/migrations/0001_phase0_core.sql`
- `supabase/migrations/001_product_recommendations.sql`
- `supabase/migrations/002_conversation_state.sql`
- `supabase/migrations/20260429180000_last_product_recommendations.sql`
- `supabase/migrations/20260501030000_schema_reconciliation_phase_e.sql`

**Missing tables:**
- `products` — does not exist
- `product_variants` — does not exist
- `stores` — referenced by existing migrations, assumed present

Existing table: `last_product_recommendations` exists with basic fields.

## Current product search implementation

`lib/services/product-search-service.ts`:
- Uses hardcoded `mockCatalog` array with 3 products
- No Supabase cache querying
- Returns max 10 recommendations (sliced from mock)
- Mock data includes variant options with Shopify GIDs

`app/api/ai/tools/product-search/route.ts`:
- Simple POST handler calling searchProducts + persistRecommendations
- No cache integration

## Current Shopify adapter/sync status

`lib/adapters/shopify/live-shopify-adapter.ts`:
- Stub implementation for order creation
- `recheckInventory` returns false
- `createCodOrder` blocked with error message

`lib/adapters/shopify/shopify-client.ts`:
- REST API order creation client
- No product/variant fetching

No Shopify product sync adapter exists.

## Current n8n workflow status

- `n8n/workflows/youlya-whatsapp-main.json` — canonical WhatsApp workflow (active in n8n)
- `n8n/workflows/Whatsapp Youlya.json` — sanitized raw export
- `n8n/workflows/Log AI Issue - SubWorkflow.json` — sanitized subworkflow
- No daily Shopify sync workflow

## Gaps and plan

1. **Schema gap**: Need `products` and `product_variants` tables
2. **Adapter gap**: Need Shopify GraphQL product fetcher with pagination
3. **Repository gap**: Need Supabase upsert for products/variants
4. **Service gap**: Need sync orchestration service
5. **Endpoint gap**: Need internal POST `/api/internal/shopify/sync-products`
6. **Script gap**: Need `scripts/sync-shopify-products.mjs`
7. **Search gap**: Need product search to query Supabase cache instead of mock
8. **n8n gap**: Need daily sync workflow JSON
9. **Test gap**: Need tests for sync, search, selection
10. **Docs gap**: Need runbook

## Env vars available (name only)

```
SHOPIFY_STORE_DOMAIN
SHOPIFY_ADMIN_API_TOKEN
SHOPIFY_API_VERSION
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
INTERNAL_API_SECRET
APP_INTERNAL_URL
```

All required env vars are present in `.env.production`.
