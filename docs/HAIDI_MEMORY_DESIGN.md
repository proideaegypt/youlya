# Haidi Memory Design

## Document ID
`docs/HAIDI_MEMORY_DESIGN.md`

## Purpose
Define safe memory boundaries for the Haidi AI Sales Agent layer.

## Core Principle
**The app owns commerce truth. Haidi owns conversational warmth.**

## What Haidi Memory May Store

### Allowed
- Customer conversational preferences (likes short replies, prefers certain colors)
- Broad interests (likes cotton, prefers dark colors, buys for occasions)
- Tone preferences (formal vs casual)
- Seasonal/contextual hints (shopping for Eid, looking for winter wear)
- Previous conversation summaries (high-level, not product-specific)

### Forbidden
- Product index mappings ("رقم ١ = Product X")
- Price values from previous chats
- Stock levels from previous chats
- Variant IDs or SKUs
- Specific product recommendations from memory
- Cart contents from memory
- Order details from memory
- Customer PII (phone, address) from memory

## Session Key

Use `conversation_id` (remoteJid) as the primary session key.

```
Session Key: conversation_id / remoteJid
Example: 2010xxxxxxxx@s.whatsapp.net
```

## Context Window

- **Recommended**: 10–20 messages
- **Maximum**: 20 messages
- **Rationale**: Enough for conversational continuity, not enough for product truth drift

## Implementation in n8n

### Option A: Window Buffer Memory (n8n-native)
- Use `n8n-nodes-base.windowBufferMemory` node
- Context window: 10 messages
- Session key: `conversation_id`

### Option B: Supabase Conversation History
- Store last 10 message pairs in `conversation_messages` table
- Haidi node fetches history via HTTP request to app
- App filters out commerce facts, returns only message text + intent

### Recommended: Option A for MVP
- Simpler, no extra app endpoint needed
- n8n manages memory lifecycle
- App still owns all commerce state

## PII Caution

### Do Not Store in AI Memory
- Phone numbers
- Full addresses
- Customer names (unless explicitly allowed by business)
- Order IDs
- Payment details

### Safe to Store
- "Customer from Cairo" (city-level only)
- "Prefers M size" (preference, not specific variant)
- "Likes black colors" (preference)

## Memory Isolation

```
┌─────────────────────────────────────────┐
│  n8n AI Agent Memory (conversational)   │
│  - tone                                 │
│  - preferences                          │
│  - broad interests                      │
│  - 10-20 message history                │
└─────────────────────────────────────────┘
                    │
                    ▼ reads from
┌─────────────────────────────────────────┐
│  App Commerce Brain (source of truth)   │
│  - product recommendations              │
│  - variant IDs                          │
│  - prices                               │
│  - stock                                │
│  - cart                                 │
│  - orders                               │
│  - idempotency                          │
└─────────────────────────────────────────┘
```

## Data Flow

```
1. Customer sends message
2. n8n normalizes + guards
3. App decides commerce action
4. App returns reply + haidi_context (product facts, cart, etc.)
5. Haidi receives:
   - app reply (safe fallback)
   - haidi_context (commerce facts for THIS turn only)
   - memory (conversational preferences only)
6. Haidi generates beautiful reply using ONLY app facts
7. Validator checks Haidi output
8. n8n sends final reply to customer
```

## Compliance

- GDPR/CCPA: No unnecessary PII in AI memory
- Business policy: All product claims must trace to app facts
- Audit: Every turn logged in ai_tool_calls

## Version
v1.0 — 2026-05-04
