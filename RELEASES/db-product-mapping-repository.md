# Release: v0.2.0 — db-product-mapping-repository

## Task
Phase 0 DB-backed product mapping repository with Supabase schema + adapter + service wiring + tests.

## What Was Done
- Added migration for canonical `last_product_recommendations` schema, indexes, and RLS policy.
- Added `ProductMappingRepository` with:
  - `saveMapping(storeId, conversationId, customerId, items)`
  - `getMapping(storeId, conversationId, index)`
  - `expireMapping(storeId, conversationId)`
- Enforced store-scoped filtering and expiry checks.
- Wired mapping service/routes to async persistence calls.
- Preserved existing TTL/OOS/index safety behavior in selection flow.
- Added repository unit tests (happy path, expiry, cross-store isolation, missing store_id).
- Added seed data file for Youlya test mappings including one expired row.

## Files Changed
- supabase/migrations/20260429180000_last_product_recommendations.sql
- lib/adapters/supabase/product-mapping-repository.ts
- lib/services/product-mapping-service.ts
- lib/services/select-product-service.ts
- app/api/ai/tools/product-search/route.ts
- app/api/ai/tools/select-product/route.ts
- tests/unit/product-mapping-repository.test.ts
- tests/unit/select-product.test.ts
- supabase/seed/product-mapping-seed.ts
- PROGRESS-LOG.md
- worktime.md

## Tests Run
- `npm run typecheck` ✅
- `npm test -- tests/unit/product-mapping-repository.test.ts` ✅
- `npm test -- tests/unit/select-product.test.ts` ✅

## Phase Progress
Phase 0 — ~30% complete

## Known Risks
- Repository currently uses injected client for unit testing; integration wiring with live server client should be enabled only in secure server context.

## Next Step
phase-0-cart-confirmation-gate-hardening

## Status
✅ DONE YA BOSS
