# Phase 0 Commerce Core Prompt

Task: implement the safe commerce engine.

Do:

1. Apply/maintain Supabase Phase 0 schema.
2. Implement `/api/internal/messages/turn` in testMode.
3. Implement product search using mock/cache data.
4. Persist `last_product_recommendations` mapping.
5. Implement select product by index + size.
6. Implement cart and Hybrid Bulk Confirm.
7. Implement shipping calculation.
8. Implement confirmation gate.
9. Implement Shopify adapter interface + mock adapter.
10. Implement idempotency.
11. Implement handoff + kill switch.
12. Implement audit/tool/message logs.
13. Add unit/API tests.
14. Run CONV scenarios.

Do not:

```text
call live Shopify
send live WhatsApp
build full dashboard
add RAG/multi-channel/SaaS
```

Acceptance:

```text
No order without explicit confirmation
No selection from AI memory
No OOS order
Duplicate confirmation safe
Shipping correct
Handoff works
testMode has no live side effects
CONV scenarios pass or manual-run blocker documented
```
