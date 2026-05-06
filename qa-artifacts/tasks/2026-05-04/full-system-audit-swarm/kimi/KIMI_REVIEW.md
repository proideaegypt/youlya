# Kimi Review - Youlya AI Commerce OS

STATUS: FAIL
PHASE: Audit
TASK: full-system-audit-swarm
FILES CHANGED:
- qa-artifacts/tasks/2026-05-04/full-system-audit-swarm/kimi/KIMI_REVIEW.md
TESTS RUN:
- File inspection only
RESULTS:
- P0 blocker found: `testMode` requests can still produce live Evolution sends.
- `app/api/internal/messages/turn/route.ts:63-66` bypasses internal auth whenever `testMode=true`.
- `lib/services/message-turn-service.ts:236-255` always sends `result.reply` through Evolution for internal inputs, with no `testMode` gate.
- `lib/adapters/evolution/evolution-client.ts:41-80` performs real HTTP calls whenever Evolution credentials exist and `EVOLUTION_MOCK` is not set.
- Impact: an unauthenticated or test-mode request to `/api/internal/messages/turn` can emit a real WhatsApp message in production when live Evolution credentials are configured. That violates the repo contract for `testMode` and creates a live customer side-effect path.
- P0 blocker found: Shopify order creation is not gated by `testMode`.
- `app/api/ai/tools/create-shopify-order/route.ts:9-30` forwards any valid payload directly to `createCODOrder`.
- `lib/services/shopify-order-service.ts:80-166` does not inspect `testMode`; it chooses the live Shopify adapter whenever Shopify credentials exist and `MOCK_MODE` is false.
- Impact: the create-order API can create a real Shopify COD order in production even when the caller intends a test-mode execution. That is a real Shopify mutation path.
- Additional drift observed before stop, not fully triaged:
- `app/api/dashboard/settings/route.ts:11-37` only checks for any `sb-` cookie and does not enforce role or store permissions.
- `app/api/dashboard/conversations/route.ts:15-18` hardcodes `store_id = "youlya"` instead of resolving store context.
- `app/dashboard/toggle-card.tsx:13-17` hardcodes `store_id: "youlya"` in a browser mutation payload.
- Haidi prompt safety looked aligned at a high level in the inspected prompt/validator pair, but the audit stopped once the P0 blockers were confirmed.
BLOCKERS:
- `testMode` does not suppress external Evolution sends.
- `testMode` does not suppress Shopify order creation.
RISKS:
- Live WhatsApp messages can be sent from a test-mode path when production Evolution credentials are present.
- Real Shopify orders can be created from a path that callers may treat as test-safe.
- Dashboard API authorization still appears too coarse for the documented role/store model.
NEXT STEP:
- Add explicit `testMode` suppression for all external side effects.
- Pass `testMode` through the Shopify order service and short-circuit live adapter calls.
- Enforce role/store context in dashboard settings and conversation APIs.
MANUAL QA:
- Not run. Audit stopped immediately after the first P0 blocker was confirmed.
TEST Ya AHMED
