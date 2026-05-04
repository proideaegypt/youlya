# QA Artifact — prepare-haidi-ai-agent-conversation-layer-draft

## Date
2026-05-04

## Task
prepare-haidi-ai-agent-conversation-layer-draft

## Discovery Results

### Active Workflow Status
- **Active workflow**: Youlya WhatsApp Main (ID: joqfame4HXG775JO)
- **Active in n8n**: YES (confirmed via n8n API)
- **Webhook path**: `youlya-whatsapp`
- **Active workflow NOT modified in this task**: CONFIRMED

### Files Inspected
- `app/api/internal/messages/turn/route.ts` — internal message turn endpoint
- `lib/services/message-turn-service.ts` — main message turn service (789 lines)
- `lib/types/messages.ts` — MessageTurnResponse shape
- `lib/validation/schemas.ts` — input/output schemas
- `n8n/workflows/youlya-whatsapp-main.json` — canonical workflow (277 lines, active=false in repo, active=true in n8n)
- `scripts/validate-n8n-workflows.mjs` — n8n validator
- `docs/N8N_EVOLUTION_CONTRACT_FINAL.md` — contract docs
- `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md` — contract spec

### Current Message-Turn Output Shape
```typescript
MessageTurnResponse = {
  intent: string;
  toolsCalled: string[];
  reply: string;
  handoff: boolean;
  action: "ai_reply" | "product_results" | "order_created" | "handoff" | "error" | "duplicate_ignored" | "ai_disabled";
  data?: unknown;
}
```

### Current n8n Flow
```
Evolution Webhook
→ Guard Inbound Customer Message (filters fromMe, empty, broadcast, group)
→ Filter Message Type (conversation, extendedTextMessage, audioMessage)
→ Normalize Message (extracts remoteJid, text, conversation_id, etc.)
→ Call Turn Endpoint (/api/internal/messages/turn)
→ Prepare Reply (extracts action, reply, number, shouldSend)
→ Should Send Reply (IF shouldSend)
→ Send Text (Evolution API)
```

### Missing App Support for Haidi Context
1. No `haidi_context` field in MessageTurnResponse
2. No commerce facts structured for AI consumption
3. No product list with material/color/size/price in response
4. No cart summary in response
5. No allowed upsells list in response
6. No style instructions in response
7. No Haidi output validator in app

### Draft Plan
1. Create `docs/HAIDI_AI_SALES_AGENT_PROMPT.md` — production-ready system prompt
2. Extend `MessageTurnResponse` with optional `haidi_context`
3. Update `message-turn-service.ts` to populate `haidi_context` for relevant intents
4. Create `lib/services/haidi-output-validator.ts` — JSON validation + safety check
5. Create `n8n/workflows/youlya-whatsapp-main-haidi-draft.json` — draft workflow with Haidi layer
6. Create `n8n/workflows/HAIDI_AGENT_WORKFLOW_PATCH_PLAN.md` — spec if exact node JSON uncertain
7. Create `docs/HAIDI_MEMORY_DESIGN.md` — memory rules
8. Add unit tests for validator and haidi_context
9. Update `validate-n8n-workflows.mjs` to allow draft workflow
10. Run full verification chain
11. Release governance

## Safety Checklist
- [x] Active workflow not modified
- [x] No new workflow activated
- [x] No secrets exposed
- [x] No Shopify direct mutation nodes in draft
- [x] /api/internal/messages/turn remains present in draft
- [x] Draft workflow active=false

## Status
READY FOR IMPLEMENTATION
