# Haidi Agent Workflow Patch Plan

## Document ID
`n8n/workflows/HAIDI_AGENT_WORKFLOW_PATCH_PLAN.md`

## Purpose
Exact specification for adding the Haidi AI Sales Agent layer to the Youlya WhatsApp Main workflow.

## Current Flow
```
Webhook → Guard → Filter → Normalize → Call Turn Endpoint → Prepare Reply → Should Send Reply → Send Text
```

## Target Flow
```
Webhook → Guard → Filter → Normalize → Call Turn Endpoint → Haidi AI Sales Agent → Validate Haidi Output → Prepare Reply → Should Send Reply → Send Text
```

## New Nodes

### Node: Haidi AI Sales Agent
- **Type**: `n8n-nodes-base.openAi` (Chat Model) or `n8n-nodes-base.agent` (AI Agent)
- **Position**: After Call Turn Endpoint, before Prepare Reply
- **Input**: `$json` from Call Turn Endpoint (contains reply, action, intent, haidi_context)
- **System Prompt**: Loaded from `haidi_context.prompt.currentPrompt` sent by the app; repo fallback is `docs/HAIDI_AI_SALES_AGENT_PROMPT.md`
- **User Prompt**: JSON.stringify of app response + haidi_context
- **Model**: gpt-4o-mini or gpt-4o (configurable via env `HAIDI_MODEL`)
- **Temperature**: 0.7
- **Max Tokens**: 800
- **Credential**: OpenAI API key via env `OPENAI_API_KEY` (never hardcoded)
- **Options**: JSON mode enabled (response_format: { type: "json_object" })

### Node: Validate Haidi Output
- **Type**: `n8n-nodes-base.code`
- **Position**: After Haidi AI Sales Agent, before Prepare Reply
- **Purpose**: Parse Haidi JSON, validate structure, fallback to app reply on failure
- **JS Code**:
```javascript
const appReply = $node["Call Turn Endpoint"].json.reply;
const appAction = $node["Call Turn Endpoint"].json.action;
const haidiRaw = $json.final_reply ? $json : $json.choices?.[0]?.message?.content;

let haidiOutput;
try {
  haidiOutput = typeof haidiRaw === "string" ? JSON.parse(haidiRaw) : haidiRaw;
} catch {
  return [{ json: { reply: appReply, action: appAction, haidi_valid: false, haidi_fallback: true } }];
}

if (!haidiOutput || typeof haidiOutput.final_reply !== "string" || !haidiOutput.final_reply.trim()) {
  return [{ json: { reply: appReply, action: appAction, haidi_valid: false, haidi_fallback: true } }];
}

// Block unsafe order claims
const unsafePhrases = ["تم تأكيد الأوردر", "الأوردر اتعمل", "الأوردر اتأكد", "تم إنشاء الأوردر"];
const hasUnsafeOrderClaim = unsafePhrases.some(p => haidiOutput.final_reply.includes(p));
if (hasUnsafeOrderClaim && appAction !== "order_created") {
  return [{ json: { reply: appReply, action: appAction, haidi_valid: false, haidi_fallback: true, haidi_blocked_reason: "unsafe_order_claim" } }];
}

return [{ json: { reply: haidiOutput.final_reply, action: appAction, haidi_valid: true, haidi_output: haidiOutput } }];
```

## Connection Changes

### Current Connections to Modify

**Call Turn Endpoint** main output:
- OLD: → Prepare Reply
- NEW: → Haidi AI Sales Agent

**Haidi AI Sales Agent** main output:
- NEW: → Validate Haidi Output

**Validate Haidi Output** main output:
- NEW: → Prepare Reply

### Dead Letter Path
If Call Turn Endpoint fails (error branch):
- Keep existing connection to Dead Letter node
- Dead Letter should NOT route through Haidi

## Node Positions (suggested)
- Call Turn Endpoint: [1120, 120]
- Haidi AI Sales Agent: [1360, 120]
- Validate Haidi Output: [1580, 120]
- Prepare Reply: [1800, 120]
- Should Send Reply: [2020, 120]
- Send Text: [2240, 260]

## Safety Requirements
1. Haidi node must NOT have Shopify direct mutation nodes
2. Haidi node must NOT have Supabase direct mutation nodes
3. Haidi node must NOT create orders
4. Haidi must receive only app-approved facts via haidi_context
5. Draft workflow must have `active: false`
6. All credentials must use env refs only

## Activation Checklist (for later task)
- [ ] OpenAI API key configured in n8n credentials
- [ ] Haidi model env set
- [ ] Draft workflow imported into n8n
- [ ] Draft workflow connections verified
- [ ] Synthetic webhook test passes
- [ ] App haidi_context visible in response
- [ ] Haidi validator fallback tested
- [ ] Active workflow backed up
- [ ] Codex Send Text fix confirmed complete
- [ ] Smooth switchover plan ready

## Version
v1.0 — 2026-05-04
