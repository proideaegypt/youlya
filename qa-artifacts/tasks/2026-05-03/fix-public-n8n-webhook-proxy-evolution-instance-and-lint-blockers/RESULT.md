# fix-public-n8n-webhook-proxy-evolution-instance-and-lint-blockers

## Status
PASS

## Summary
- Updated the live n8n compose env so `EVOLUTION_INSTANCE` now points to the actual open Evolution instance `AI`.
- Aligned the n8n Evolution auth key with the live Evolution API auth.
- Confirmed the public webhook now returns HTTP 200 and starts workflow execution.
- Fixed the repo TypeScript/lint blockers in:
  - `lib/adapters/supabase/product-sync-repository.ts`
  - `lib/services/product-search-service.ts`
  - `lib/services/shopify-product-sync-service.ts`
- Replaced the canonical workflow UUID-style `webhookId` with a non-UUID identifier so `validate:n8n` passes.

## Verification
- `npm run typecheck` PASS
- `npm run lint` PASS with warnings only
- `npm test` PASS
- `npm run validate:scenarios` PASS
- `npm run scan:secrets` PASS
- `npm run validate:n8n` PASS
- `npm run build` PASS
- `npm run verify:release` PASS
- `npm run verify:deploy` PASS

## Webhook Test
- Public webhook URL returned HTTP 200.
- Execution was created for `Youlya WhatsApp Main`.
- `Send Text` was attempted through Evolution.
- Synthetic payload ended in a 400 because the dummy destination number was blank.

## Remaining Notes
- Admin app health/build-info endpoints still report an older deployed version (`2.5.7`), which is outside this n8n hardening task.
