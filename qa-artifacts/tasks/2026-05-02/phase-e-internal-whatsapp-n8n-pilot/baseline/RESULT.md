# Baseline: Phase E Internal WhatsApp + n8n Pilot

**Date:** 2026-05-02
**Task:** phase-e-internal-whatsapp-n8n-pilot
**Youlya Version:** v2.4.0 (port-smart-home-theme-to-youlya-admin-dashboard)

## Production Status

- **Health:** PASS - `{"status":"ok","version":"2.4.0","checks":{"supabase":"ok","evolution":"ok","shopify":"ok"}}`
- **Build Info:** PASS - v2.4.0, builtAt 2026-05-02T00:02:10.951Z
- **Dashboard:** Live at https://admin.youlya365.com
- **Login:** Working
- **Playwright Swarm:** 24/24 passed

## Env Readiness (Key Names Only)

| Key | Status |
|---|---|
| APP_URL | SET |
| INTERNAL_API_SECRET | SET |
| EVOLUTION_API_URL | SET |
| EVOLUTION_API_KEY | SET |
| EVOLUTION_MOCK | SET |
| TEST_MODE | SET |
| MOCK_MODE | SET |
| SHOPIFY_STORE_DOMAIN | SET |
| SHOPIFY_ADMIN_API_TOKEN | SET |

## Relevant Files Found

### API Endpoints
- `app/api/internal/messages/turn/route.ts` - Internal AI message turn
- `app/api/webhooks/evolution/route.ts` - Evolution webhook receiver
- `app/api/ai/tools/*/route.ts` - AI tools (product-search, select-product, calculate-shipping, confirm-order, create-shopify-order, handoff)
- `app/api/dashboard/*/route.ts` - Dashboard APIs (conversations, logs, orders, settings, stats)
- `app/api/internal/failed-events/route.ts` - Failed events API

### Services
- `lib/services/message-turn-service.ts` - Main message turn logic
- `lib/services/evolution-sender-service.ts` - Evolution sender
- `lib/services/handoff-service.ts` - Human handoff
- `lib/services/idempotency-service.ts` - Duplicate protection
- `lib/services/dead-letter-service.ts` - Error logging
- `lib/services/shopify-order-service.ts` - Order creation
- `lib/services/product-search-service.ts` - Product search
- `lib/services/select-product-service.ts` - Product selection
- `lib/services/cart-service.ts` - Cart management
- `lib/services/cart-validation-service.ts` - Cart validation

### Adapters
- `lib/adapters/evolution/evolution-client.ts` - Evolution client
- `lib/adapters/shopify/shopify-adapter.ts` - Shopify adapter
- `lib/adapters/shopify/shopify-client.ts` - Shopify client
- `lib/adapters/shopify/live-shopify-adapter.ts` - Live Shopify
- `lib/adapters/shopify/mock-shopify-adapter.ts` - Mock Shopify

### Docs
- `docs/N8N_WHATSAPP_MANUAL_TEST_RUNBOOK.md` - Existing n8n runbook
- `docs/data/youlya_human_test_scenarios.jsonl` - Test scenarios

## Pilot Safety Constraints

1. **Internal only** - No public customer traffic
2. **TestMode aware** - TEST_MODE and MOCK_MODE env vars are SET
3. **Duplicate protection active** - idempotency-service in place
4. **Kill switch available** - AI can be disabled via dashboard
5. **No real orders unless explicitly confirmed** - confirm-order gate exists
6. **PII masking required** - WhatsApp numbers must be masked in artifacts
7. **Shopify mutation guarded** - create-shopify-order has validation

## Test Plan

1. Verify production readiness (health, build-info, dashboard login)
2. Prepare pilot runbook with exact flows and stop conditions
3. Create QA template for manual test recording
4. Define 10 manual WhatsApp test cases (WA-001 to WA-010)
5. Run dashboard observability checks during tests
6. Optional: Add internal API smoke script
7. Run all verification gates
8. Release and deploy if docs/scripts changed

## Risks

- Real Shopify order creation if test case WA-006 (confirmation) is executed
- Evolution send failures if instance is not healthy
- n8n workflow errors if workflows are not active
- Duplicate order if idempotency is bypassed
- PII leak if WhatsApp numbers are not masked in artifacts

## Next Steps

1. Create pilot runbook
2. Create QA template
3. Run safe checks
4. Update release governance
