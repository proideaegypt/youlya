# n8n + Evolution Contract Final

n8n is orchestration only. The Next.js app owns business logic.

## Allowed n8n responsibilities

```text
Receive Evolution webhook
Verify/authenticate webhook where possible
Normalize inbound payload
Download/prepare media when needed
Call /api/internal/messages/turn
Send AI/handoff reply through Evolution
Retry transient failures
Write/forward failed event to dead letter endpoint
Notify admin on critical failures
```

## Forbidden n8n responsibilities

```text
Product search logic
Product mapping
Variant resolution
Cart state
Shipping rules
Confirmation decision
Shopify order creation logic
Inventory safety decisions
Prompt/version management
```

## Required workflow files

Expected files, when available:

```text
workflows/Whatsapp Youlya (4).json
workflows/Sales Assistant - SubWorkflow.json
```

If they are missing, `node scripts/validate-n8n-workflows.mjs` returns `BLOCKED`, not a fatal failure for the starter pack.

## Inbound normalized event

n8n must call:

```text
POST /api/internal/messages/turn
```

Payload:

```json
{
  "storeSlug": "youlya",
  "channel": "whatsapp_evolution",
  "locale": "ar-EG",
  "messageType": "text",
  "text": "عايزة بيجامة",
  "providerMessageId": "evolution-message-id",
  "customer": {
    "phone": "201000000000",
    "name": "optional"
  },
  "raw": {},
  "testMode": false
}
```

n8n must send `x-internal-api-secret` or equivalent configured secret.

## Expected app response

```json
{
  "intent": "product_search",
  "toolsCalled": ["product_search"],
  "reply": "أكيد يا قمر...",
  "handoff": false,
  "sendMedia": [],
  "metadata": {
    "conversationId": "uuid",
    "customerId": "uuid"
  }
}
```

## Duplicate webhook handling

Both n8n and app must support idempotency.

Required behavior:

```text
Same provider_message_id twice → one message record
Same provider_message_id twice → one AI turn max
Same confirmation twice → one Shopify order max
Duplicate event → log duplicate_count and return safe prior result
```

## Timeout values

| Operation | Timeout |
|---|---:|
| Evolution getBase64/media download | 10s |
| Evolution send text/media | 15s |
| OpenAI transcription | 30s |
| AI turn app endpoint | 45s |
| Shopify mutation | 15s |
| Supabase request | 10s |

## Retry/backoff policy

Transient failures:

```text
HTTP 408, 429, 500, 502, 503, 504
network timeout
connection reset
```

Retry:

```text
max retries: 3
backoff: 1s, 3s, 10s
jitter: allowed
```

Do not retry blindly on:

```text
401/403 auth errors
400 validation errors
confirmed business safety blockers
```

## Dead letter / failed event

If n8n cannot complete a message:

```text
POST /api/internal/failed-events
```

Minimum payload:

```json
{
  "storeSlug": "youlya",
  "source": "n8n_evolution_workflow",
  "provider": "evolution",
  "errorCode": "EVOLUTION_SEND_TIMEOUT",
  "errorMessage": "Send message timed out",
  "payload": {},
  "retryCount": 3
}
```

If `/api/internal/failed-events` is not built yet, n8n must at least notify admin and preserve execution payload in n8n logs.

## Media handling

For customer media:

```text
image → send to app as metadata or OCR/vision later; Phase 0 can handoff or ask for text
voice → transcription if configured; otherwise ask customer to type or handoff
document → handoff unless explicitly supported
```

For product images:

```text
Max 10 images per search
If media send fails, fallback to text choices
Do not block conversation because image send failed
```

## Evolution 429/rate limit

If Evolution returns rate limit:

```text
retry with backoff
if still failing, create failed_event
send admin alert
avoid duplicate customer spam
```

## Static validation checks

`validate-n8n-workflows.mjs` checks:

```text
expected workflow files exist
workflow JSON parses
nodes have id/name/type
no obvious hardcoded secrets
```

Runtime checks after import:

```text
webhook URL reachable
workflow active
credentials connected
subworkflow IDs resolved after import
test inbound message reaches app
test outbound reply sends through Evolution
error workflow receives a simulated failure
```
