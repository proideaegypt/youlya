# SYNTHETIC TEST REPORT

## Test 1: Local Webhook (127.0.0.1:5678)

| Field | Value |
|---|---|
| URL | http://127.0.0.1:5678/webhook/youlya-whatsapp |
| Method | POST |
| Payload | `{"event":"messages.upsert","instance":"manual-test",...,"message":{"conversation":"هاي"}}` |
| Response | `{"message":"Workflow was started"}` |
| HTTP Code | 200 |
| Duration | 97ms |
| Result | PASS |

## Test 2: Public Webhook (https://ai.youlya365.com)

| Field | Value |
|---|---|
| URL | https://ai.youlya365.com/webhook/youlya-whatsapp |
| Method | POST |
| Payload | Same as Test 1 |
| Response | `{"message":"Workflow was started"}` |
| HTTP Code | 200 |
| Duration | 146ms |
| Result | PASS |

## Test 3: Execution 9524 (Last Success)

| Field | Value |
|---|---|
| Execution ID | 9524 |
| Status | success |
| Started | 2026-05-04T10:43:19.737Z |
| Mode | webhook |
| Result | PASS |

## Test 4: Execution 9526 (Latest — Error)

| Field | Value |
|---|---|
| Execution ID | 9526 |
| Status | error |
| Started | 2026-05-04T15:05:17.514Z |
| Failed Node | Send Text |

### Node Path (inferred from workflow structure)

1. **Webhook** — received payload → success
2. **Guard Inbound Customer Message** — fromMe=false passes → success
3. **Filter Message Type** — conversation type passes → success
4. **Normalize Message** — extracts remoteJid, text → success
5. **Call Turn Endpoint** → App returns reply + haidi_context → success
6. **Build Haidi Prompt** → constructs OpenAI prompt → success
7. **Call OpenAI** → OpenAI returns Arabic response → success
8. **Parse Haidi Response** → extracts JSON → success
9. **Validate Haidi Output** → passes safety checks → success
10. **Haidi Session Memory** → stores session key → success
11. **Prepare Reply** → builds final reply → success
12. **Should Send Reply** → shouldSend=true → success
13. **Prepare Evolution Payload** → builds `{number, text}` → success
14. **Send Text** → POST to Evolution → **FAIL (HTTP 500)**
15. **Dead Letter** — not reached

### Send Text Error Detail

```
Request:
  POST https://evo.youlya365.com/message/sendText/AI
  Headers: apikey: [REDACTED]
  Body: {"number":"201000000000","text":"مرحبًا! هل ممكن توضحي لي أكثر عن ما تبحثين عنه؟..."}

Response:
  HTTP 500
  Body: {"status":500,"error":"Internal Server Error","response":{"message":"Connection Closed"}}
```

## Assessment

- Webhook reception: PASS
- Message normalization: PASS
- App endpoint call: PASS
- Haidi generation: PASS
- Reply validation: PASS
- Evolution payload preparation: PASS
- **Evolution send: FAIL (instance error)**

The synthetic test proves the entire pipeline works correctly up to the final outbound message. The only failure is the Evolution WhatsApp instance being disconnected.
