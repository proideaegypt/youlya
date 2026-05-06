# GO / NO-GO FOR WHATSAPP PILOT

## Checklist

| # | Check | Required | Result | Evidence |
|---|---|---|---|---|
| 1 | Active webhook registered | YES | PASS | Path: youlya-whatsapp, Method: POST |
| 2 | Public webhook reachable | YES | PASS | HTTP 200 from ai.youlya365.com |
| 3 | Local webhook reachable | YES | PASS | HTTP 200 from 127.0.0.1:5678 |
| 4 | App call succeeds | YES | PASS | Call Turn Endpoint returns reply |
| 5 | Send Text body valid JSON | YES | PASS | JSON.stringify with number + text |
| 6 | Evolution instance exists | YES | PASS | Instance name "AI" configured |
| 7 | Evolution instance connected | YES | **FAIL** | HTTP 500 "Connection Closed" |
| 8 | Send Text endpoint accepted | YES | **FAIL** | Evolution returns 500 |
| 9 | Haidi layer active | NO | PASS | 4 Haidi nodes in workflow |
| 10 | Haidi output validated | NO | PASS | Validate Haidi Output node present |
| 11 | Memory safe | YES | PASS | Session key only, no PII |
| 12 | No direct Shopify mutation | YES | PASS | 0 Shopify nodes |
| 13 | No secrets in workflow | YES | PASS | All env-driven |
| 14 | n8n validation passes | YES | PASS | Repo validate:n8n = PASS |
| 15 | Backup saved | YES | PASS | active-youlya-whatsapp-main.json |
| 16 | Kill switch tested | YES | PASS | App kill switch functional |
| 17 | Handoff functional | YES | PASS | Handoff center + AI pause working |
| 18 | Duplicate protection | YES | PASS | Idempotency + processed messages |

## Decision

```text
N8N_READY_FOR_CONTROLLED_10_MESSAGE_PILOT: NO
```

## Reason

The n8n workflow, Haidi AI layer, app safety gates, and message pipeline are **fully ready**. However, the **Evolution WhatsApp instance "AI" is in ERROR state** and cannot send outbound messages. Running a pilot now would result in:
- Customer messages received successfully
- AI generating replies successfully
- Replies failing to reach the customer
- Dead letter logging the failures

This would create a poor customer experience and waste pilot messages.

## Unblock Path

1. **Restart Evolution container**: `docker restart evolution_api`
2. **Check instance state** via Evolution Manager: `https://evo.youlya365.com/manager/`
3. **If disconnected**: Re-scan QR code for instance "AI"
4. **Verify**: Send synthetic test again, confirm Send Text returns 200 with success response
5. **Re-audit**: Run this checklist again
6. **Approve pilot**: Only after all P0 checks pass

## Conditional GO

If the Evolution instance is restored and verified within the same day:
- **GO** for controlled 10-message pilot
- **Monitor** every message in dashboard
- **Kill switch** ready
- **Handoff** ready
- **Team** on standby

## Risk if GO without fix

- Customer sends message → receives no reply → confusion
- AI generates good reply → never delivered → wasted computation
- Dead letter queue fills → operational noise
- Pilot data invalid → cannot measure true performance
