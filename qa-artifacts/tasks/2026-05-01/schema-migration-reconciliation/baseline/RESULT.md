# Baseline — schema-migration-reconciliation

Date: 2026-05-01

## Current app version
- Release verified: v2.0.7 (`investigate-supabase-health-subcheck`)
- Live build-info reports version: `2.0.7`

## Health status
- `/api/health` status: `ok`
- checks: `supabase=ok`, `evolution=ok`, `shopify=ok`

## Migration files (repo)
- 0001_phase0_core.sql
- 001_product_recommendations.sql
- 002_conversation_state.sql
- 20260429180000_last_product_recommendations.sql
- 20260429194000_order_idempotency_keys.sql
- 20260429195500_orders_rls.sql
- 20260429201000_handoff_tickets.sql
- 20260429201100_ai_tool_calls.sql
- 20260429213000_users_roles.sql
- 20260430090000_processed_messages.sql
- 20260430093000_dead_letter_log.sql
- 20260430100000_ai_settings_and_human_handoffs.sql
- 20260430110000_product_recommendations.sql
- 20260430120000_conversation_flow.sql
- 20260430143000_conversations_live_state.sql
- 20260430143100_orders_live_fields.sql
- 20260430143200_users_roles.sql
- 20260430_failed_events.sql

## Known conflict summary
- Prior replay conflict surfaced at migration `20260429180000_last_product_recommendations.sql` with error pattern around missing column `index` in `last_product_recommendations` policy/index statement.
- Core tables were created before this conflict during bootstrap.

## Core tables expected by app
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
- idempotency_keys / order_idempotency_keys / processed_messages
