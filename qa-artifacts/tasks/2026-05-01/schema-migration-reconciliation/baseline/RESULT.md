# Baseline — schema-migration-reconciliation (hardened)

Date: 2026-05-01
Host: vmi2942438.contaboserver.net

## Current app version
- verify:release: v2.0.8 (`schema-migration-reconciliation`)
- live /api/build-info: version 2.0.8

## Health status
- /api/health: ok
- checks: supabase=ok, evolution=ok, shopify=ok

## Migration files list
- see `find supabase/migrations -maxdepth 1 -type f | sort` output for full list including:
  - `20260501030000_schema_reconciliation_phase_e.sql`

## Known conflict summary
- Legacy conflict signal remains documented:
  - `20260429180000_last_product_recommendations.sql` assumes `last_product_recommendations."index"`
  - production shape uses `recommendation_index`.

## Core tables expected by app
- stores
- store_integrations
- store_users
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
- audit_logs
- handoff_tickets
- failed_events
- processed_messages / idempotency tables
