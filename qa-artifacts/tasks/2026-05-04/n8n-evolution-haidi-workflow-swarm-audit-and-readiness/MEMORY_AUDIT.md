# MEMORY AUDIT

## Haidi Session Memory Node

| Field | Value |
|---|---|
| Node Name | Haidi Session Memory |
| Type | n8n-nodes-base.code |
| Code Length | 440 chars |

## Session Key Strategy

```javascript
const normalized = $node["Normalize Message"].json || {};
const conversationId = String(normalized.conversation_id || "");
const remoteJid = String(normalized.remote_jid || "");
const sessionKey = String(conversationId || remoteJid || "").trim();
```

## Memory Contents

The memory node returns:
```json
{
  "haidi_memory": {
    "sessionKey": "<conversation_id or remote_jid>",
    "conversation_id": "...",
    "remote_jid": "..."
  }
}
```

## Memory Safety Assessment

| Check | Result |
|---|---|
| Session key uses conversation_id (primary) | PASS |
| Fallback to remote_jid if conversation_id missing | PASS |
| No phone numbers stored as primary key | PASS |
| No product index mapping in memory | PASS |
| No cart state in memory | PASS |
| No secrets in memory | PASS |
| No PII beyond conversation identifier | PASS |

## Product Mapping Rule

- **Product index-to-variant mapping remains in Youlya app only**
- `last_product_recommendations` table in Supabase is the source of truth
- Haidi receives `commerceFacts` from app, never resolves indexes from memory
- This prevents hallucinated product selections

## Risk Assessment

- **Low Risk**: Memory is minimal (only session identifier)
- **Low Risk**: No business state stored in n8n memory
- **Low Risk**: Session key is deterministic and stable per conversation

## Recommendation

Memory implementation is safe. No changes needed.
