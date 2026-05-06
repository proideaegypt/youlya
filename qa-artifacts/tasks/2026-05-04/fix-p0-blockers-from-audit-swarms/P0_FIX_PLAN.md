# P0 Fix Plan

## Scope Locked to P0
From audit reports only:
1. Internal `/api/internal/messages/turn` auth bypass in production.
2. Evolution outbound failure (`Connection Closed`) blocking WhatsApp send.
3. Selection mapping readiness proof (`last_product_recommendations` evidence).

## Fix Sequence
1. **App Security Fix**
- Enforce internal secret on `/api/internal/messages/turn` in production even when `testMode=true`.
- Add regression test to prevent future bypass.
- Targeted test: `tests/api/message-turn.test.ts`.

2. **Evolution/N8N P0 Recovery**
- Restart `evolution_api` container (infrastructure P0 action from audit unblock path).
- Validate container state and recent logs for startup and connection status.
- Run safe synthetic webhook trigger that does not auto-send to real customers.

3. **Selection Mapping Proof**
- Run controlled internal turn request with non-customer synthetic identifiers.
- Validate `last_product_recommendations` count increased and contains recent rows (count-only + masked IDs).

## Exit Criteria
- Auth bypass closed in code + test pass.
- Evolution send path no longer blocked by immediate container crash condition.
- Mapping persistence proven by DB evidence.
