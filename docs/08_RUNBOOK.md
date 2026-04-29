# Runbook — Youlya AI Commerce OS

## Daily pre-live commands

```bash
node scripts/validate-scenarios.mjs
node scripts/scan-secrets.mjs
node scripts/validate-n8n-workflows.mjs
npm run typecheck
npm run lint
npm test
npm run build
```

Run E2E when app is running:

```bash
APP_URL=http://localhost:3000 SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

## Incident: wrong product/variant risk

Immediate actions:

```text
Enable AI order creation kill switch
Move affected conversation to handoff
Check Product Mapping Inspector
Check last_product_recommendations
Check cart_items shopify_variant_id
Check audit_logs and ai_tool_calls
Do not create/modify live Shopify order until human review
```

## Incident: duplicate order risk

Immediate actions:

```text
Disable AI order creation if active duplicates appear
Check idempotency_keys
Check webhook_events duplicate_count
Check provider_message_id uniqueness
Check Shopify order timestamps
Refund/cancel only through human Shopify process
```

## Incident: Shopify API failure

Behavior:

```text
Do not send fake order number
Create failed_event
Create/trigger handoff
Notify admin
Ask customer to wait for team if needed
```

## Incident: Evolution send failure

Behavior:

```text
Retry with backoff
Fallback media to text
If still failing, create failed_event
Notify admin
Do not duplicate-send blindly
```

## Incident: n8n workflow down

Actions:

```text
Check workflow active status
Check credentials
Check executions
Check app /api/health
Check Evolution status
If unresolved, switch to human/static response if possible
```

## Incident: bad AI reply

Actions:

```text
Take over conversation
Add internal note
Save conversation replay
Classify as prompt/tool/data issue
Do not edit production prompt directly
Create QA scenario if recurring
```

## Kill switch modes

```text
Global AI off
AI order creation off
Product recommendations off
Conversation-specific AI off
Channel-specific AI off
```

## Rollback production app

```text
1. Disable AI order creation.
2. Enable global kill switch if needed.
3. Revert Docker image to previous tag.
4. Verify /api/health.
5. Keep existing Shopify orders unchanged.
6. Review failed_events and handoff tickets.
7. Document incident in qa-artifacts.
```

## Manual QA before limited live

```text
search product
select number + size
multi-item cart
missing size
missing address
Cairo shipping
Alexandria shipping
free shipping threshold
OOS item
ambiguous confirmation
explicit confirmation
duplicate confirmation
handoff request
kill switch
Shopify failure simulation
Evolution failure simulation
```
