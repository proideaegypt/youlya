# Schema Reconcile Report

- Date: 2026-05-01
- Inventory file: qa-artifacts/tasks/2026-05-01/schema-migration-reconciliation/schema-inventory.json
- Tables in public schema: 25

## OK Tables
- stores
- store_integrations
- customers
- conversations
- messages
- products
- product_variants
- last_product_recommendations
- carts
- cart_items
- orders
- ai_tool_calls
- handoff_tickets
- audit_logs
- failed_events
- idempotency_keys
- processed_messages
- order_idempotency_keys
- dead_letter_log
- ai_settings
- human_handoffs
- store_users
- users_roles

## Missing Tables
- none

## Missing Columns
- none

## App Table References Missing In DB
- none

## Migration Conflict Signals
- `last_product_recommendations` uses `recommendation_index` (not `index`). Older migration `20260429180000_last_product_recommendations.sql` assumes `index`, which explains replay conflict.

## RLS/Policy Gaps
- ai_tool_calls has RLS enabled but no policies visible
- audit_logs has RLS enabled but no policies visible
- cart_items has RLS enabled but no policies visible
- carts has RLS enabled but no policies visible
- conversations has RLS enabled but no policies visible
- customers has RLS enabled but no policies visible
- failed_events has RLS enabled but no policies visible
- handoff_tickets has RLS enabled but no policies visible
- idempotency_keys has RLS enabled but no policies visible
- messages has RLS enabled but no policies visible
- orders has RLS enabled but no policies visible
- product_variants has RLS enabled but no policies visible
- products has RLS enabled but no policies visible
- store_integrations has RLS enabled but no policies visible
- stores has RLS enabled but no policies visible
- webhook_events has RLS enabled but no policies visible

## Recommended Forward-Only Fixes
- No schema drift requiring migration.

## Pilot Readiness
- Safe for internal pilot from schema presence perspective.
