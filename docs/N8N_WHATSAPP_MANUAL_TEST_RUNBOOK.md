# N8N + WhatsApp Manual Test Runbook

## A) Pre-flight
- Verify `GET /api/health` returns `status: ok`.
- Verify `GET /api/build-info` returns version metadata.
- Verify dashboard login works at `/login`.
- Verify AI enabled status is visible in dashboard.
- Verify kill switch status is visible in dashboard.
- Verify Evolution instance is connected.
- Verify required n8n workflows are active.
- Verify `INTERNAL_API_SECRET` is configured in n8n request headers.

## B) Manual WhatsApp tests
1. Send greeting.
2. Ask product search in Egyptian Arabic.
3. Select product by number.
4. Select product with Arabic digit (example: `رقم ٢`).
5. Ask for size.
6. Provide address.
7. Confirm order.
8. Send duplicate message.
9. Trigger unclear message.
10. Trigger handoff.

## C) Record for every manual test
- timestamp
- WhatsApp number
- n8n execution id
- provider_message_id
- dashboard page checked
- expected result
- actual result
- screenshot/log link
- status PASS/FAIL

## D) Stop conditions
- Duplicate order created.
- Wrong product or wrong variant order.
- AI replies after kill switch is enabled.
- `/api/health` fails.
- Dashboard inaccessible.
- Repeated Evolution send failures.
- Unexpected Shopify mutation.
