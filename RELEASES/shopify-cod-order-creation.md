# Release: v0.3.0 — shopify-cod-order-creation

## Task
Phase 0 Shopify COD order creation endpoint wired with cart validation and idempotency guard.

## What Was Done
- Added `lib/services/shopify-order-service.ts` with required flow order:
  1) cart validation
  2) idempotency check
  3) cached inventory recheck
  4) Shopify order create
  5) idempotency mark + audit/persist path
  6) failure path with no fake order number
- Added `lib/adapters/shopify/shopify-client.ts`:
  - POST `/admin/api/2024-01/orders.json`
  - 429 retry backoff (1s, 2s)
  - 5xx throws `ShopifyAPIError`
- Updated route `app/api/ai/tools/create-shopify-order/route.ts` to use new service and permission/context guard pattern.
- Updated create-order schema to typed fields required for COD creation.
- Added orders RLS policy migration.
- Added unit tests covering happy path, duplicate idempotency, OOS, missing fields, 429 retry, 500 failure, and audit log write.

## Files Changed
- lib/adapters/shopify/shopify-client.ts
- lib/services/shopify-order-service.ts
- app/api/ai/tools/create-shopify-order/route.ts
- lib/validation/schemas.ts
- lib/config/env.ts
- lib/services/product-search-service.ts
- supabase/migrations/20260429195500_orders_rls.sql
- tests/unit/shopify-order-service.test.ts
- PROGRESS-LOG.md
- worktime.md

## Tests Run
- `npm run typecheck` ✅
- `npm test -- tests/unit/shopify-order-service.test.ts` ✅
- `npm test -- tests/unit/cart-validation.test.ts` ✅

## Phase Progress
Phase 0 — ~40% complete

## Known Risks
- Route-level context/permission checks are local stubs and should be replaced by centralized auth middleware.
- Full DB persistence for idempotency key lifecycle is partially mocked in service layer.

## Next Step
phase-0-cart-confirmation-gate-hardening

## Status
✅ DONE YA BOSS
