# n8n Workflow Contract Tests

These checks validate n8n workflow exports before production.

Expected files:

```text
workflows/Whatsapp Youlya (4).json
workflows/Sales Assistant - SubWorkflow.json
```

Run static validation:

```bash
node scripts/validate-n8n-workflows.mjs
```

## Static checks

- Workflow JSON parses.
- Nodes have `id`, `name`, and `type`.
- No obvious hardcoded OpenAI, Shopify, Supabase, or Bearer secrets.
- Webhook node exists in the main workflow.
- HTTP request to `/api/internal/messages/turn` exists.
- Error handling path exists or is documented.
- Credentials are referenced through n8n credential store, not literal secrets.

## Post-import runtime checks

These must be done after importing to n8n because workflow IDs can change.

- Main workflow is active.
- Subworkflow reference points to the correct imported workflow ID.
- Webhook URL is reachable.
- Credentials connect successfully.
- Test inbound WhatsApp event reaches the app.
- Test outbound reply sends through Evolution.
- Error workflow receives a simulated failure.

## Idempotency checks

- Same `provider_message_id` sent twice → one message record.
- Same `provider_message_id` sent twice → one AI turn maximum.
- Same confirmation sent twice → one Shopify order maximum.
- Duplicate webhook is logged with `duplicate_count`.

## Timeout checks

| Operation | Required timeout |
|---|---:|
| Evolution getBase64/media download | 10s |
| Evolution send text/media | 15s |
| OpenAI transcription | 30s |
| AI turn app endpoint | 45s |
| Shopify mutation | 15s |

## Mock strategy

Before live credentials:

- Use `testMode=true` for app endpoint.
- Use mock Shopify adapter.
- Use internal test phone numbers.
- Do not call live Shopify mutation.
- If Evolution is unavailable, validate payload transformation and mark outbound send as MANUAL-RUN.

## Error cases to test

```text
Evolution 429
Evolution send timeout
Evolution media download timeout
AI app endpoint 500
Shopify adapter failure
Supabase insert failure
Duplicate webhook
Customer asks for human
Kill switch active
```

Every failed event must be visible in one of:

```text
n8n execution log
failed_events table
handoff ticket
admin notification
```
