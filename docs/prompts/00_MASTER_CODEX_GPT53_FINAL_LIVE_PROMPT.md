# MASTER CODEX GPT-5.3-CODEX FINAL LIVE PROMPT

Copy this prompt into Codex GPT-5.3-Codex when starting the build.

---

You are Codex GPT-5.3-Codex acting as the senior full-stack implementation agent for Youlya AI Commerce OS.

Your goal is to move this repository from final specs to a safe production live version. Do not build the full SaaS in one run. Do not over-engineer. Build the safest path to live.

## Prime directive

Youlya must go live only when the system can safely handle this flow:

```text
Customer WhatsApp message
→ product search by Shopify products
→ indexed product recommendations
→ persisted product mapping
→ customer selects by number/size
→ cart
→ shipping
→ final summary
→ explicit confirmation
→ one Shopify COD order
→ audit/logs
→ handoff if risky
```

## Required read order before editing

Read completely:

1. `START_HERE_FOR_CODEX.md`
2. `MEMORY.md`
3. `PROGRESS-LOG.md`
4. `LEARNINGS.md`
5. `docs/18_NO_OVERENGINEERING_RULES.md`
6. `docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md`
7. `docs/01_SPEC_DRIVEN_MASTER_SPEC.md`
8. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
9. `docs/12_DASHBOARD_SYSTEM_FEATURES_FINAL.md`
10. `docs/13_API_AND_STATE_CONTRACTS.md`
11. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
12. `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md`
13. `docs/07_TEST_STRATEGY_AND_SWARMS.md`
14. `docs/08_RUNBOOK.md`
15. `docs/10_DEPLOYMENT_ARCHITECTURE.md`

Then write a short plan before editing.

## Locked business rules

```text
Shopify is source of truth for product, variant, inventory, and order data.
Product name = Shopify product title.
Product code = Shopify variant SKU first; never invent codes.
Supabase/Postgres is operational cache and app state.
n8n orchestrates only.
All business logic lives in Next.js app services/routes.
No order without explicit confirmation.
No order from AI memory.
Product index selection must resolve from last_product_recommendations.
No order without exact shopify_variant_id.
No order if stock is unknown or OOS.
No order if shipping is unknown.
No duplicate order from duplicate webhook or duplicate confirmation.
No live mutation in testMode.
Every mutation writes audit log.
Every AI/tool call writes ai_tool_calls log.
Every store-scoped query includes store_id.
No secrets in git or frontend.
Kill switch and handoff are required.
```

## Stop conditions

Stop and return `PARTIAL` before:

```text
mutating live Shopify with real credentials
turning AI on for all customers
deploying to production
deleting production data
changing locked order/confirmation policy
```

If credentials are missing, implement mock adapters and mark live integration as BLOCKED.

## Phase -1: baseline audit

Before app code:

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

Include:

```text
files found
scenario count
missing app files
Shopify product template/export status
n8n workflow status
secrets scan result
env placeholder status
risks
commands run
```

Acceptance:

```text
JSONL = 90 real scenarios
CONV = 80
DASH = 10
No id == "id"
Playwright defaults to CONV
Shopify product template/export status
n8n workflow status PASS or BLOCKED with reason
```

## Phase 0A: scaffold app if missing

If app code is missing, scaffold inside current repo without deleting docs/tests.

Use:

```text
Next.js App Router
TypeScript strict
ESLint
Tailwind only if needed
Vitest
Playwright
Zod
Supabase JS
server-only
```

Required scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint or eslint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "validate:scenarios": "node scripts/validate-scenarios.mjs",
  "scan:secrets": "node scripts/scan-secrets.mjs"
}
```

Suggested structure:

```text
app/api/internal/messages/turn/route.ts
app/api/ai/tools/product-search/route.ts
app/api/ai/tools/select-product/route.ts
app/api/ai/tools/calculate-shipping/route.ts
app/api/ai/tools/confirm-order/route.ts
app/api/ai/tools/create-shopify-order/route.ts
app/api/ai/tools/handoff/route.ts
app/api/health/route.ts
lib/config/env.ts
lib/types/
lib/validation/
lib/services/
lib/adapters/shopify/
lib/adapters/supabase/
supabase/migrations/
tests/unit/
tests/api/
```

Rules:

```text
No any
No @ts-ignore
No server-only secrets in client code
Thin route files
Services own business logic
```

## Phase 0B: env validation and health

Implement `lib/config/env.ts`:

```text
getServerEnv()
getPublicEnv()
isMockMode()
assertInternalSecret(req)
```

Validate env with Zod. Allow missing live credentials only in local/test/mock mode.

Implement:

```text
GET /api/health
```

Return safe status without secrets:

```json
{
  "ok": true,
  "mode": "mock",
  "database": "mock-or-configured",
  "shopify": "mock-or-live-configured",
  "evolution": "mock-or-live-configured",
  "timestamp": "..."
}
```

## Phase 0C: database migration

Use/extend:

```text
supabase/migrations/0001_phase0_core.sql
```

Implement/keep:

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

Add indexes and enable RLS.

## Phase 0D: message turn endpoint in testMode

Implement:

```text
POST /api/internal/messages/turn
```

Must return:

```json
{
  "intent": "string",
  "toolsCalled": ["string"],
  "reply": "string",
  "handoff": false
}
```

In `testMode=true`:

```text
no live Shopify
no live Evolution
no real WhatsApp send
no real order
use deterministic mock services
write test-safe logs/mocks
```

Goal: pass CONV scenarios safely.

## Phase 0E: product search and product mapping

Implement:

```text
product-search service
product mapping service
mock product catalog
Shopify sync interface boundary
```

Mock catalog may include realistic Youlya-like categories, clearly marked as mock.

Do not invent live products. Live product names/codes come from Shopify only.

Rules:

```text
Search returns max 10 indexed recommendations
Every displayed item persists mapping
Mapping includes Shopify title + SKU/code + variant_id
Selection uses mapping only
Mapping expires safely
Missing mapping asks customer to search again
```

## Phase 0F: select product + cart

Implement:

```text
select-product parser
index + size resolver
cart service
multi-item Hybrid Bulk Confirm
OOS handling
```

Support:

```text
رقم 2
رقم 2 مقاس XL
التاني
رقم 1 و 3
رقم 1 L ورقم 3 XL
```

Cart rules:

```text
max 5 items configurable
immediate stock check per item
one upsell moment only
one final summary
one Shopify order with multiple line_items
no cart confirmation if any item is OOS
```

## Phase 0G: shipping

Implement shipping service/tool:

```text
Cairo = 70 EGP
Alexandria = 90 EGP
Free shipping at subtotal >= 1200 EGP
Unknown city = ask/handoff, never guess
```

## Phase 0H: confirmation gate

Before order creation, require:

```text
variant_id for every item
quantity
stock checked
customer full name
phone
city
address
shipping quote
total
final summary shown
explicit confirmation
```

Explicit examples:

```text
أيوه أكدي
تمام أكدي
اعملي الأوردر
أكد الأوردر
yes confirm
```

Ambiguous:

```text
تمام
ماشي
اوكي
```

Ambiguous only counts immediately after final summary. Otherwise ask clarification.

## Phase 0I: Shopify order adapter

Implement:

```text
ShopifyAdapter interface
MockShopifyAdapter
LiveShopifyAdapter boundary
create-shopify-order service/tool
```

Rules:

```text
Recheck inventory immediately before order creation
Use idempotency key
COD order only
financial_status pending or configured value
tags include whatsapp,cod,YoulyaAI,AI-confirmed
note includes Made By AI
Persist local order only after Shopify success
If Shopify fails, do not send fake order number
Duplicate confirmation returns existing result
```

## Phase 0J: handoff and kill switch

Implement handoff for:

```text
customer asks for human
angry complaint
after-delivery issue
payment/shipping complex issue
3 unclear turns
critical API failure
international shipping if unsupported
bulk order above threshold
kill switch active
```

Kill switch checks:

```text
store.ai_enabled
store.kill_switch_enabled
store.ai_order_creation_enabled
conversation-level AI disabled
```

## Phase 0K: logs/audit

Log:

```text
inbound message
outbound message
each tool call
cart mutation
order attempt/success/failure
handoff
kill switch event
failed event
```

Never log API keys. Mask PII where possible.

## Phase 0 tests

Add tests for:

```text
scenario validation
shipping
confirmation parser
ambiguous confirmation
product index parser
size parser
mapping expired
cart multi-item
OOS blocks order
idempotency duplicate confirmation
handoff triggers
env secret exposure
message-turn testMode
product-search API
select-product API
shipping API
confirm-order API
create-shopify-order mock API
handoff API
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
APP_URL=http://localhost:3000 SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

If E2E needs a dev server, start it if your environment supports it. Otherwise mark MANUAL-RUN with exact command.

## Phase 1: integration and production deploy

Only after Phase 0 acceptance.

Build/connect:

```text
real Shopify product/variant sync
real Shopify order adapter
Evolution inbound/outbound
n8n workflow import/validation
duplicate webhook protection
failed events/dead letter
admin alerts
VPS Docker deployment
Nginx SSL
production env validation
```

Do not enable all customers yet.

## Phase 1 soft launch/live gates

Internal soft launch:

```text
internal numbers only
team monitors every order
kill switch tested
handoff tested
duplicate webhook tested
Shopify failure tested
```

Limited live:

```text
small real traffic
review every AI-created order
daily incident review
stop on wrong/duplicate/no-confirmation order
```

Full live only when:

```text
0 wrong variants
0 duplicate orders
0 orders without confirmation
logs visible
rollback known
owner approves
```

## Phase 2 dashboard MVP

After Phase 0/1 stable:

```text
Command Center
Inbox/Handoff
Order Safety Detail
Product Mapping Inspector
Orders
Products/Inventory
Logs/Audit
Settings/Kill Switch
AI Studio basic
QA Lab basic
Reports basic
```

Do not build SaaS dashboard before Youlya live.

## Required artifacts after every phase/task

Create:

```text
qa-artifacts/tasks/YYYY-MM-DD/<task-name>/RESULT.md
```

Include:

```text
summary
files changed
tests run
results
failed/skipped tests
blockers
risks
manual QA
next step
```

Update:

```text
PROGRESS-LOG.md
LEARNINGS.md only if a real lesson/mistake happened
```

## Final response format

At the end of every Codex task, respond exactly:

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

Start now with Phase -1 baseline audit, then Phase 0 only.
