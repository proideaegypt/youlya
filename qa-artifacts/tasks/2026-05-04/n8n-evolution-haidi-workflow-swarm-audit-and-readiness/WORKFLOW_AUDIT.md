# WORKFLOW AUDIT — Youlya WhatsApp Main

## Active Workflow

| Field | Value |
|---|---|
| ID | joqfame4HXG775JO |
| Name | Youlya WhatsApp Main |
| Active | true |
| Node Count | 15 |
| Connection Count | 13 |
| Created | 2026-05-03 |
| Updated | 2026-05-04 |

## Node Inventory

1. **Webhook** — `n8n-nodes-base.webhook`
2. **Guard Inbound Customer Message** — `n8n-nodes-base.code`
3. **Filter Message Type** — `n8n-nodes-base.if`
4. **Normalize Message** — `n8n-nodes-base.code`
5. **Call Turn Endpoint** — `n8n-nodes-base.httpRequest`
6. **Prepare Evolution Payload** — `n8n-nodes-base.code`
7. **Send Text** — `n8n-nodes-base.httpRequest`
8. **Dead Letter** — `n8n-nodes-base.httpRequest`
9. **Build Haidi Prompt** — `n8n-nodes-base.code`
10. **Call OpenAI** — `n8n-nodes-base.httpRequest`
11. **Parse Haidi Response** — `n8n-nodes-base.code`
12. **Validate Haidi Output** — `n8n-nodes-base.code`
13. **Haidi Session Memory** — `n8n-nodes-base.code`
14. **Prepare Reply** — `n8n-nodes-base.code`
15. **Should Send Reply** — `n8n-nodes-base.if`

## Webhook Configuration

| Field | Value |
|---|---|
| Path | youlya-whatsapp |
| Method | POST |
| Response Mode | onReceived |
| Type Version | 2.1 |

## Architecture Assessment

- **Inbound Guard**: Present (filters `fromMe=true` to prevent loops) ✓
- **Message Normalization**: Present (extracts remoteJid, text, messageType) ✓
- **App Safety Gate**: Present (Call Turn Endpoint → Youlya app) ✓
- **Haidi Conversation Layer**: Present (Build Prompt → Call OpenAI → Parse → Validate) ✓
- **Reply Preparation**: Present (Prepare Reply + Should Send Reply IF gate) ✓
- **Evolution Send**: Present (Prepare Evolution Payload → Send Text) ✓
- **Dead Letter**: Present (logs failed turns) ✓
- **No Direct Shopify**: Confirmed (0 Shopify nodes) ✓
- **No Hardcoded Secrets**: Confirmed in backup ✓

## Risk Assessment

- **Low Risk**: Workflow structure is safe and follows the documented architecture
- **Low Risk**: Env variables used throughout (no hardcoded credentials)
- **Medium Risk**: 15 nodes is moderately complex; any single node failure breaks the chain

## Recommendation

Workflow architecture is approved. No structural changes needed.
