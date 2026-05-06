# P0 Stop Report — Full System Audit
# Youlya AI Commerce OS — 2026-05-04

STATUS: FAIL
PHASE: Audit
TASK: full-system-audit-swarm

## P0 blockers

1. `testMode` does not suppress live Evolution sends.
   - Evidence: [`app/api/internal/messages/turn/route.ts:63-67`](/root/youlya/app/api/internal/messages/turn/route.ts:63)
   - Evidence: [`lib/services/message-turn-service.ts:236-255`](/root/youlya/lib/services/message-turn-service.ts:236)
   - Internal WhatsApp turns still flow through `evolutionClient.sendText(...)` and `sendMedia(...)` whenever `result.reply` exists.
   - Impact: a request treated as test-safe can still emit a real WhatsApp message.

2. `testMode` does not suppress live Shopify order creation.
   - Evidence: [`app/api/ai/tools/create-shopify-order/route.ts:9-30`](/root/youlya/app/api/ai/tools/create-shopify-order/route.ts:9)
   - Evidence: [`lib/services/shopify-order-service.ts:80-166`](/root/youlya/lib/services/shopify-order-service.ts:80)
   - The API route forwards directly to `createCODOrder(...)`, which selects the live Shopify adapter whenever credentials exist and mock mode is off.
   - Impact: a request treated as test-safe can still create a real Shopify COD order.

3. Internal turn state mutation happens before auth.
   - Evidence: [`app/api/internal/messages/turn/route.ts:47-60`](/root/youlya/app/api/internal/messages/turn/route.ts:47)
   - `stage`, `cart`, and customer-info preconditions are applied before `requireInternalAuth(...)`.
   - Impact: an unauthenticated request can mutate conversation state before it is rejected.

4. Public AI product-search route writes tenant state with no auth.
   - Evidence: [`app/api/ai/tools/product-search/route.ts:6-11`](/root/youlya/app/api/ai/tools/product-search/route.ts:6)
   - The route accepts caller-supplied `storeSlug` and persists recommendations.
   - Impact: unauthenticated callers can write tenant-scoped product recommendation state.

5. Evolution webhook auth is optional instead of mandatory.
   - Evidence: [`app/api/webhooks/evolution/route.ts:7-10`](/root/youlya/app/api/webhooks/evolution/route.ts:7)
   - Evidence: [`lib/config/env.ts:53-72`](/root/youlya/lib/config/env.ts:53)
   - If `EVOLUTION_WEBHOOK_SECRET` is unset, the route accepts the post.
   - Impact: a misconfigured deploy can accept arbitrary webhook posts and process them.

6. Order idempotency is schema-broken in the production path.
   - Evidence: [`lib/services/idempotency-service.ts:50-105`](/root/youlya/lib/services/idempotency-service.ts:50)
   - Evidence: [`supabase/migrations/20260429194000_order_idempotency_keys.sql:1-21`](/root/youlya/supabase/migrations/20260429194000_order_idempotency_keys.sql:1)
   - Evidence: [`supabase/migrations/20260501030000_schema_reconciliation_phase_e.sql:21-49`](/root/youlya/supabase/migrations/20260501030000_schema_reconciliation_phase_e.sql:21)
   - The service expects `idempotency_key` plus Shopify order fields, while the live schema inventory/reconciliation path shows a different shape and missing replay alignment.
   - Impact: duplicate-confirmation protection is not trustworthy in production.

## Secondary drift observed before stop

- `app/api/dashboard/settings/route.ts` uses session-cookie presence only, not role/store authorization.
- `app/api/dashboard/conversations/route.ts` and `app/api/dashboard/handoff/route.ts` hardcode `store_id = "youlya"`.
- `lib/services/product-search-service.ts` falls back to a mock catalog and mock inventory lookup.
- `n8n/workflows/youlya-whatsapp-main.json` contains business-logic code nodes, not orchestration only.
- The DB reconcile report still shows seven app-referenced tables missing from the live inventory.

## Decision

No-Go for live pilot launch.

The audit stopped immediately after the P0s were confirmed. No lower-priority remediation was attempted.

## Next step

Add explicit `testMode` suppression for all external side effects, enforce auth before any internal state mutation, and reconcile the live schema before re-running the full audit.
