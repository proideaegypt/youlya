# Full Step-by-Step Prompt for Codex GPT-5.3-Codex

Copy this whole file into Codex when you want the complete ordered build plan.

---

You are Codex GPT-5.3-Codex acting as senior implementation agent for Youlya AI Commerce OS.

Build the shortest safe path to production live. Do not over-engineer. Do not build the full SaaS first.

## Required read order

Read completely before editing:

1. `CLAUDE.md`
2. `START_HERE_FOR_CODEX.md`
3. `COPY_TO_CODEX_GPT53.md`
4. `AGENTS.md`
5. `MEMORY.md`
6. `PROGRESS-LOG.md`
7. `LEARNINGS.md`
8. `docs/18_NO_OVERENGINEERING_RULES.md`
9. `docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md`
10. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
11. `docs/13_API_AND_STATE_CONTRACTS.md`
12. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
13. `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md`
14. `docs/17_CODEX_TOOLS_AND_PLUGINS.md`
15. `docs/prompts/00_MASTER_CODEX_GPT53_FINAL_LIVE_PROMPT.md`

## Locked safety rules

```text
No order without explicit confirmation.
No order without exact Shopify variant ID.
No product selection from AI memory.
No invented product names or product codes.
Product name = Shopify product title.
Product code = Shopify variant SKU.
Missing SKU = warning/code_missing, not invented code.
No order if stock unknown or OOS.
No order if shipping unknown.
No duplicate order from duplicate webhook or repeated confirmation.
No live external side effects in testMode.
Every mutation has audit log.
Every tool call has ai_tool_calls log.
n8n orchestrates only.
Shopify is source of truth.
Supabase is app DB/cache.
Kill switch and handoff are non-negotiable.
```

## Step 0 — baseline audit

Before app code, run:

```bash
node scripts/validate-scenarios.mjs
node scripts/scan-secrets.mjs
node scripts/validate-shopify-products.mjs
node scripts/validate-n8n-workflows.mjs
```

Create:

```text
qa-artifacts/tasks/YYYY-MM-DD/phase-0-bootstrap/baseline/RESULT.md
```

Document files found, scenario count, missing app files, product export status, n8n workflow status, env placeholders, risks, and commands run.

## Step 1 — scaffold Phase 0 app

If app code is missing, create Next.js App Router with:

```text
TypeScript strict
ESLint
Vitest
Playwright
Zod
Supabase JS
server-only
```

Add scripts:

```text
dev
build
start
lint
typecheck
test
test:watch
test:e2e
validate:scenarios
scan:secrets
validate:products
validate:n8n
```

Add:

```text
app/api/health/route.ts
lib/config/env.ts
```

Health route must not expose secrets.

## Step 2 — database and adapters

Apply or refine:

```text
supabase/migrations/0001_phase0_core.sql
```

Core tables:

```text
stores
store_integrations
customers
conversations
messages
products
product_variants
last_product_recommendations
carts
cart_items
orders
idempotency_keys
ai_tool_calls
audit_logs
handoff_tickets
webhook_events
failed_events
```

Enable RLS and add store_id indexes.

Create repository/adapters:

```text
mock store adapter for testMode
Supabase adapter
ShopifyAdapter interface
MockShopifyAdapter
LiveShopifyAdapter boundary
```

## Step 3 — message turn and testMode

Implement:

```text
POST /api/internal/messages/turn
```

Return:

```json
{
  "intent": "string",
  "toolsCalled": ["string"],
  "reply": "string",
  "handoff": false
}
```

In `testMode=true`, no live Shopify/Evolution/WhatsApp/order side effects.

## Step 4 — Shopify product names/codes sync

Implement after app scaffold and before real live:

```text
Shopify product sync service
GraphQL live adapter when credentials available
CSV fallback using scripts/normalize-shopify-products.mjs
Validation using scripts/validate-shopify-products.mjs
```

Rules:

```text
shopify_title is customer-facing product name
sku is product/variant code
code_missing=true when SKU missing
never invent code
shopify_variant_id is required for order line item
```

If credentials/export missing, mark product sync as BLOCKED and keep mock/test products clearly marked as mock.

## Step 5 — product search and mapping

Implement:

```text
POST /api/ai/tools/product-search
product-search service
product mapping service
```

Rules:

```text
max 10 indexed recommendations
persist every index in last_product_recommendations
mapping includes title, SKU, variant ID, price, stock, size/color
selection uses mapping only
expired/missing mapping asks customer to search again
```

## Step 6 — select product, cart, shipping, confirmation

Implement:

```text
POST /api/ai/tools/select-product
POST /api/ai/tools/calculate-shipping
POST /api/ai/tools/confirm-order
```

Support:

```text
رقم 2
رقم 2 مقاس XL
التاني
رقم 1 و 3
رقم 1 L ورقم 3 XL
```

Cart mode: Hybrid Bulk Confirm.

Shipping:

```text
Cairo = 70 EGP
Alexandria = 90 EGP
Free shipping at subtotal >= 1200 EGP
Unknown city = ask/handoff, never guess
```

Confirmation gate requires:

```text
variant_id
quantity
stock checked
full name
phone
city
address
shipping quote
total
final summary shown
explicit confirmation
```

## Step 7 — Shopify COD order, idempotency, handoff, logs

Implement:

```text
POST /api/ai/tools/create-shopify-order
POST /api/ai/tools/handoff
idempotency service
audit-log service
tool-log service
handoff service
kill switch checks
```

Shopify order rules:

```text
recheck stock immediately before mutation
COD order
tags: whatsapp,cod,YoulyaAI,AI-confirmed
note: Made By AI
persist local order only after Shopify success
if Shopify fails, never send fake order number
same confirmation twice returns existing order result
```

## Step 8 — tests

Add unit/API tests for:

```text
env validation
scenario validation
product sync validation
product mapping
index + size parser
shipping
confirmation parser
ambiguous confirmation
cart multi-item
OOS blocks order
idempotency duplicate confirmation
handoff triggers
kill switch
mock Shopify order
secret exposure
```

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run validate:scenarios
npm run scan:secrets
node scripts/validate-shopify-products.mjs
node scripts/validate-n8n-workflows.mjs
APP_URL=http://localhost:3000 SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

## Step 9 — n8n/Evolution integration

Only after Phase 0 tests.

Implement/validate:

```text
Evolution webhook intake
n8n normalization
internal API secret
provider_message_id dedupe
sendText/sendMedia fallback
retry/backoff
failed_events/dead-letter
admin notifications
```

No business logic in n8n.

## Step 10 — VPS production deployment

Prepare:

```text
Dockerfile
docker compose / Portainer stack
Nginx SSL config
production env validation
health checks
rollback plan
```

Production flags initially:

```text
MOCK_MODE=false only when ready
ORDER_CREATION_ENABLED=false until internal order test
AI_ENABLED_DEFAULT=false until limited live
```

## Step 11 — internal soft launch

Enable internal test numbers only.

Prove:

```text
real WhatsApp inbound/outbound
real Shopify product sync
one real internal COD order
no duplicate order from repeated webhook
handoff works
kill switch works
Shopify failure safe
Evolution failure safe
```

## Step 12 — limited live then full live

Limited live:

```text
small traffic
human team monitors every order
daily incident review
stop on wrong product, duplicate order, or confirmation violation
```

Full live only after:

```text
0 wrong variants
0 duplicate orders
0 no-confirmation orders
logs visible
rollback tested
owner signoff artifact exists
```

## Step 13 — dashboard MVP after live safety

Only after Phase 0/1 gates:

```text
Command Center
Inbox + Handoff
Order Safety Detail
Product Mapping Inspector
Orders
Products/Inventory
Logs/Audit
Settings/Kill Switch
Basic AI Studio
Basic QA Lab
Basic Reports
```

Do not build billing, SaaS, RAG, campaign engine, or marketplace yet.

## Required end format

```text
STATUS: PASS / PARTIAL / FAIL
PHASE:
TASK:
FILES CHANGED:
TESTS RUN:
RESULTS:
BLOCKERS:
RISKS:
NEXT STEP:
MANUAL QA:
TEST Ya AHMED
```
