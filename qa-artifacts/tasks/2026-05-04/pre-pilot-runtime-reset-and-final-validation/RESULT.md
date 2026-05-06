# RESULT — pre-pilot-runtime-reset-and-final-validation

Date: 2026-05-04
Task: pre-pilot-runtime-reset-and-final-validation

## Step 1 — Runtime Reset

- `docker compose restart youlya-app` executed successfully
- Container restarted and ready within 5 seconds
- Mock state cleared from runtime memory

## Step 2 — n8n Restart

- No restart needed (workflow and env unchanged)
- Workflow remains active

## Step 3 — Evolution Restart

- No restart needed (instance `AI` connected, state: `open`)

## Step 4 — Health Check

```json
{
  "status": "ok",
  "version": "2.15.1",
  "checks": {
    "supabase": "ok",
    "evolution": "ok",
    "shopify": "ok"
  }
}
```

- All subsystems green

## Step 5 — Build Info

```json
{
  "appName": "Youlya AI Commerce OS",
  "version": "2.15.1",
  "versionName": "integrate-pilot-sprint-playbook-safely",
  "builtAt": "2026-05-04T05:19:04.998Z"
}
```

- Deployed version: **v2.15.1**
- Repo version: v2.19.3 (known drift — accumulated changes not yet deployed)

## Step 6 — n8n Workflow Active

- Workflow ID: `joqfame4HXG775JO`
- Name: `Youlya WhatsApp Main`
- Status: `active: true`
- Webhook path: `youlya-whatsapp`

## Step 7 — Public Webhook 200

- `POST https://ai.youlya365.com/webhook/youlya-whatsapp`
- Response: `{"message":"Workflow was started"}`
- HTTP: **200**

## Step 8 — Evolution sendText

- `POST /message/sendText/AI` to owner number `201141536680`
- Response: HTTP **201** with message object (`status: PENDING`, `fromMe: true`)
- No HTTP 500, no Connection Closed

## Step 9 — n8n Pipeline End-to-End

Execution `9671` (synthetic webhook with real instance number):
- Webhook → Guard → Normalize → Call Turn → Build Haidi Prompt → Call OpenAI → Parse Haidi Response → Validate Haidi Output → Prepare Evolution Payload → Send Text
- All nodes: `executionStatus: success`
- Send Text reached Evolution API and succeeded

## Step 10 — /api/internal/messages/turn Direct Tests

All tests run with `testMode: true` and `conversationId: pilot-test-conv-001`.

### Test 1: هاي (greeting)

```json
{
  "intent": "UNCLEAR",
  "action": "ai_reply",
  "handoff": false,
  "reply": "ممكن توضحي أكثر؟"
}
```

- **No unexpected handoff** on first greeting. PASS.

### Test 2: عايزة بيجامة (product search)

```json
{
  "intent": "PRODUCT_SEARCH",
  "action": "product_results",
  "handoff": false,
  "reply": "أكيد، دي شوية اختيارات مناسبة..."
}
```

- Product search works. PASS.

### Test 3: عايزة خدمة العملاء (customer service)

```json
{
  "intent": "handoff",
  "action": "handoff",
  "handoff": true,
  "reply": "هنتابع معك فوراً، هحولك لفريق الدعم."
}
```

- Handoff triggered correctly on explicit request. PASS.

## Step 11 — Order Gate (OWNER_APPROVES_LIVE_ORDER)

- `OWNER_APPROVES_LIVE_ORDER` is **NOT SET** in `.env.production`
- App default: `"false"`
- Gate logic: `return env.OWNER_APPROVES_LIVE_ORDER === "true"`
- **Result: ORDER PATH IS BLOCKED** — real Shopify orders cannot be created unless owner explicitly sets `OWNER_APPROVES_LIVE_ORDER=true`
- Pilot-control API flags this as a safety blocker
- PASS.

## Step 12 — Dashboard Pages

| Page | HTTP Status |
|---|---|
| `/dashboard/inbox` | 200 |
| `/dashboard/pilot` | 200 |
| `/dashboard/handoff` | 200 |
| `/dashboard/products-intelligence` | 200 |

All pages accessible and loading.

## GO / NO-GO Decision

**DECISION: CONDITIONAL GO**

The 10-message controlled pilot can proceed **with explicit owner supervision** and the following conditions:

### What works
- Evolution outbound sending (HTTP 201)
- n8n webhook inbound (HTTP 200)
- Full pipeline: Webhook → n8n → App → Haidi → Evolution → WhatsApp
- Product search from Supabase cache
- Handoff on explicit request
- Order creation is **blocked** by `OWNER_APPROVES_LIVE_ORDER=false`
- No unexpected handoff on greeting
- Dashboard pages loading

### Known risks
- **Version drift**: Deployed app is v2.15.1, repo has v2.19.3. Some safety hardening (testMode suppression, auth fixes) may not be live.
- **DB schema gaps**: App logs show missing columns (`handoff_tickets.priority`, `conversations.ai_paused`) — dashboard features may fail silently but core commerce path is unaffected.
- **Evolution stability**: Instance recovered from Prisma DB connectivity crash. Monitor for recurrence.
- **No real test number configured** beyond the instance owner number `201141536680`.

### Stop conditions
1. Any HTTP 500 from Evolution sendText
2. Any unexpected handoff on normal product queries
3. Any duplicate message loop (watch for fromMe=true guard failure)
4. Any attempt to create a real Shopify order (should be blocked by gate)
5. Owner requests immediate stop
6. Evolution instance disconnects

### First message recommendation

Use the instance owner number `201141536680` as the first test recipient:

1. Owner sends "هاي" to the business WhatsApp number
2. Expect AI reply within 5–10 seconds
3. Check n8n execution logs for success
4. If reply received, proceed with remaining 9 messages

If reply NOT received within 15 seconds, check:
- `https://admin.youlya365.com/api/health`
- n8n execution logs for errors
- Evolution connection state
