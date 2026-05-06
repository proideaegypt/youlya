# Database Audit

## Scope
Supabase Postgres inspected by metadata + counts only. No row-level PII dumped.

## Table existence (required set)
Present:
- stores, products, product_variants, last_product_recommendations, conversations, messages
- handoff_tickets, human_handoffs, processed_messages, dead_letter_log
- ai_tool_calls, orders

Missing from asked optional set:
- conversation_events (not present)
- order_items (not present)
- haidi_settings / haidi_scenarios / learning_suggestions not found under those exact names

## Counts
- stores: 1
- products: 252
- product_variants: 1082
- available_for_ai: 240
- missing_sku: 461
- oos_variants: 542
- last_product_recommendations: 0
- conversations: 0
- messages: 0
- handoff_tickets: 0
- human_handoffs: 4
- processed_messages: 7
- dead_letter_log: 0
- ai_tool_calls: 0
- orders: 0

## Sync freshness
- max product/variant sync timestamp indicates 2026-05-04 UTC (fresh same day)

## Duplicate protection indicators
- `processed_messages.provider_message_id` duplicates: 0
- null provider_message_id in processed_messages: 0

## Index integrity (target dimensions)
Observed indexes include store_id / conversation_id / customer_id / provider_message_id patterns on:
- conversations, customers, messages, processed_messages, dead_letter_log, last_product_recommendations, carts, orders, webhook_events.

## Mapping + timeline schema fitness
- `last_product_recommendations` includes `customer_id`, `variant_id`, `shopify_variant_id`, `sku`, inventory snapshot and expiry/use fields.
- `messages` supports timeline via `direction`, `channel`, `provider_message_id`, `body`, `created_at`.

## Issues
- P0: `last_product_recommendations` currently empty in production snapshot (selection mapping in real traffic cannot be proven yet).
- P1: very high missing SKU ratio (461/1082) reduces safe searchable catalog quality.
