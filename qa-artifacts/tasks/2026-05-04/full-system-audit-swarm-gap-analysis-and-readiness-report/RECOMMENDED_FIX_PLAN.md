# Recommended Fix Plan

## Immediate (P0)
1. Lock internal turn route in production
- Require valid internal secret regardless of `testMode` when `NODE_ENV=production`.
- Add explicit deny if request origin is public and no signed internal auth.
- Add regression tests for unauthenticated production requests.

2. Eliminate release drift
- Deploy audited target version only after `verify:deploy` pass.
- Ensure build-info includes commit/branch/tag.

3. Prove mapping path
- Run safe synthetic message flow that triggers product search and verify non-zero `last_product_recommendations` writes.
- Validate select-product uses persisted mapping only.

## Before pilot expansion (P1)
1. Fix lint errors causing verify:deploy failure.
2. Stabilize Playwright execution environment or run suite from approved CI runner.
3. Clean n8n unknown webhooks and remove stale integrations.
4. Investigate evolution-postgres connectivity errors and add alerting.
5. Reduce missing SKU exposure or enforce `require_sku_for_ai_visibility=true` for pilot.
