# HAIDI AUDIT

## Haidi Nodes in Active Workflow

The active Youlya WhatsApp Main workflow contains **4 Haidi-related nodes**:

1. **Build Haidi Prompt** (Code node)
2. **Call OpenAI** (HTTP Request node)
3. **Parse Haidi Response** (Code node)
4. **Validate Haidi Output** (Code node)

Plus 1 memory node:
5. **Haidi Session Memory** (Code node)

## Build Haidi Prompt

- Receives app response from Call Turn Endpoint
- Extracts: `app.reply`, `app.action`, `app.intent`, `app.haidi_context`
- Builds commerce facts from `haidi_context.commerceFacts`
- Uses language and style instructions from context
- Code length: 5,604 chars
- **Contains product mapping warning**: yes
- **Does NOT resolve product indexes from memory**: confirmed

## Call OpenAI

- HTTP POST to OpenAI Chat Completions API
- Uses env-backed API key
- Sends system prompt + user message built by Build Haidi Prompt
- Temperature and model configured via env

## Parse Haidi Response

- Handles OpenAI response wrapper (`choices[0].message.content`)
- Attempts JSON parse of content
- Falls back gracefully on parse failure

## Validate Haidi Output

- Code length: 5,650 chars
- **Has unsafe check**: yes
- **Has order block**: yes
- Validates that Haidi does not claim to create orders directly
- Validates that Haidi does not invent Shopify variant IDs
- Falls back to app reply if validation fails
- **App safety gate remains primary authority**

## Haidi Safety Rules Verified

| Rule | Status |
|---|---|
| Haidi is conversation/sales layer only | PASS |
| Youlya app remains commerce safety core | PASS |
| No direct Shopify order creation | PASS |
| No direct Shopify product mutation | PASS |
| No product index resolution from memory | PASS |
| Output validated before sending | PASS |
| Falls back to app reply on failure | PASS |

## Haidi Draft Workflow

- File: `n8n/workflows/youlya-whatsapp-main-haidi-draft.json`
- Status: inactive (active=false)
- Validation: PASS (0 errors)
- Contains same safety architecture

## Assessment

Haidi AI layer is properly implemented as a **safe conversation enhancer** that:
1. Receives commerce facts from the app
2. Generates warm, Egyptian Arabic sales language
3. Has its output validated before reaching the customer
4. Cannot override app safety decisions

**No changes needed to Haidi architecture.**
