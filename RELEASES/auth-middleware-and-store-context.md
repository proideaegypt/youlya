# Release: v0.4.0 — auth-middleware-and-store-context

## Task
Phase 0 auth middleware and store context hardening: real JWT store context, role guard, and `store_users` RLS.

## What Was Done
- Added `lib/middleware/require-store-context.ts` to read Bearer JWTs, verify via Supabase auth, and resolve `userId`, `storeId`, and `role`.
- Added `lib/middleware/assert-permission.ts` with the Phase 0 permission matrix for `owner`, `admin`, `agent`, and `viewer`.
- Added `lib/middleware/store-context.ts` with a 60s per-store cache for store config lookup.
- Updated protected API routes to use the real middleware path:
  - `app/api/ai/tools/create-shopify-order/route.ts`
  - `app/api/ai/tools/handoff/route.ts`
  - `app/api/ai/tools/select-product/route.ts`
- Added `supabase/migrations/20260429213000_users_roles.sql` for `store_users` with RLS and own-row select policy.
- Added `tests/unit/auth-middleware.test.ts` covering valid, invalid, expired, missing, wrong-store, and permission-denied flows.

## Files Changed
- lib/middleware/require-store-context.ts
- lib/middleware/assert-permission.ts
- lib/middleware/store-context.ts
- app/api/ai/tools/create-shopify-order/route.ts
- app/api/ai/tools/handoff/route.ts
- app/api/ai/tools/select-product/route.ts
- supabase/migrations/20260429213000_users_roles.sql
- tests/unit/auth-middleware.test.ts
- PROGRESS-LOG.md
- worktime.md

## Tests Run
- `npm run typecheck` ✅
- `npm test -- tests/unit/auth-middleware.test.ts` ✅

## Phase Progress
Phase 0 — ~50% complete

## Known Risks
- Store membership resolution still assumes a single effective store when JWT claims are absent; dashboard/user context may require a later explicit store picker.

## Next Step
phase-0-role-aware-route-hardening

## Status
✅ DONE YA BOSS
