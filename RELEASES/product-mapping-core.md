# Release: v0.1.0 — product-mapping-core
## Task
Phase 0 product mapping core: TTL expiry, OOS blocking, multi-item selection, safe index parsing.
## What Was Done
- Added mapping TTL/expiry handling (expired mappings fail safe)
- Removed unsafe implicit fallback to index 1 on ambiguous selection
- Improved index parsing: رقم / number / # patterns
- Added test coverage: expired mapping, OOS blocking, multi-item selection
## Files Changed
- lib/adapters/supabase/mock-store.ts
- lib/services/product-mapping-service.ts
- lib/services/select-product-service.ts
- tests/unit/select-product.test.ts
- PROGRESS-LOG.md
- worktime.md
## Tests
- typecheck ✅
- unit tests ✅
- validate:scenarios ✅
## Phase Progress
Phase 0 — ~20% complete
## Known Risks
- Mapping persistence is mock-state based — DB-backed repo is next
## Next Step
phase-0-db-product-mapping-repository
## Status
✅ DONE YA BOSS
