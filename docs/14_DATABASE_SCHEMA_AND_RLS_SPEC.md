# Database Schema and RLS Spec

Supabase/Postgres stores operational state. Shopify remains source of truth for products, variants, inventory, and orders.

## Tenant rule

Every tenant-scoped table must include `store_id`. Every query must filter by `store_id` unless it is a platform-admin operation.

## Core tables

```text
stores
store_integrations
customers
conversations
messages
products
product_variants
last_product_recommendations
carts
cart_items
orders
idempotency_keys
ai_tool_calls
audit_logs
handoff_tickets
webhook_events
failed_events
```

## Security rules

- Enable RLS on tenant-scoped tables.
- Service-role server code may bypass RLS only inside server-only modules.
- Client dashboard must use authenticated user context and policies.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser/client components.
- Mask PII in logs where possible.

## Phase 0 migration

The implementation starter SQL is here:

```text
supabase/migrations/0001_phase0_core.sql
```

Codex may refine it during implementation, but must preserve:

```text
UUID primary keys
store_id on tenant-scoped tables
created_at and updated_at fields
indexes for conversation/customer/store lookups
unique idempotency keys
last_product_recommendations index by conversation + index
orders linked to cart/conversation/customer
RLS enabled
```

## RLS policy guidance

Phase 0 can keep policy TODOs if dashboard auth is not built yet, but tables must have RLS enabled and comments explaining the future policy. Phase 2 dashboard must add real policies for roles.

## Product mapping integrity

`last_product_recommendations` is a safety table, not optional.

It must answer:

```text
What did the AI show?
Which index did customer select?
Which Shopify variant did that index resolve to?
What was stock at show time?
Was mapping expired?
Was mapping used for an order?
```

## Idempotency integrity

Use `idempotency_keys` to prevent duplicate orders.

Recommended key shape:

```text
store_id + conversation_id + cart_id + final_confirmation_message_id/hash
```

If duplicate confirmation arrives, return the existing result, not a second Shopify order.
