# Commerce Safety Audit

## Checks run
- `npm run shopify:assert-readonly` -> PASS
- `npm run validate:scenarios` -> PASS (104 scenarios: 94 CONV, 10 DASH)

## Contract findings
- Shopify product sync read-only guard is enforced in audited paths.
- Product/variant sync data exists and is fresh.
- Product mapping table schema is correct (`last_product_recommendations` has customer + variant identity fields).
- Duplicate protection primitives exist (`processed_messages`, idempotency tables/indexes).
- Handoff tables and APIs exist.
- Kill-switch service exists in codebase.

## Gaps
- P0: internal turn endpoint accepted unauthenticated testMode call.
- P0: `last_product_recommendations` count is 0 in live DB snapshot; real selection mapping flow not yet evidenced in production data.
- P1: large missing SKU inventory can weaken product-code policy in customer-facing flows.
- P1: no fresh evidence here proving OOS filtering behavior in live user flow.
