## RLS/DB RESULT
Status: FAIL

### RLS gaps
- The live schema reconcile report shows RLS-enabled tables without visible policies for `ai_tool_calls`, `audit_logs`, `cart_items`, `carts`, `conversations`, `customers`, `failed_events`, `handoff_tickets`, `idempotency_keys`, `messages`, `orders`, `product_variants`, `products`, `store_integrations`, `stores`, and `webhook_events`.

### Unsafe migration patterns
- No destructive SQL was flagged in the latest forward-only reconciliation migration, but replay alignment is incomplete.

### Schema drift from spec
- The reconcile report shows seven app-referenced tables missing from the live DB inventory:
  `conversation_events`, `haidi_lab_runs`, `haidi_lab_scenarios`, `haidi_settings`, `knowledge_base`, `knowledge_suggestions`, `knowledge_versions`.
- `last_product_recommendations` replay alignment is inconsistent between older and newer migrations.

### UnApplied migrations
- The audit could not prove that all 2026-05-04 migrations are applied cleanly in production.

### Findings
- P0: order idempotency schema/read-write mismatch can break duplicate-order prevention.
- P1: tenant-scoped tables still need explicit policy coverage.
- P1: missing app-referenced tables block the Haidi and knowledge-base features from being fully production-ready.
