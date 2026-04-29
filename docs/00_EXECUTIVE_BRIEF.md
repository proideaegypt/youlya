# Executive Brief — Youlya AI Commerce OS

## Mission

Launch a production-safe AI commerce system for Youlya that can sell through WhatsApp, create Shopify COD orders safely, and give the team full visibility and handoff control.

## First production outcome

A customer can message Youlya on WhatsApp and complete an order safely:

```text
Ask for product
See indexed Shopify products
Choose by number and size
Add one or more items to cart
Provide name/phone/address/city
Receive shipping/total summary
Explicitly confirm
Receive real Shopify order confirmation
```

## Why this is not just a chatbot

The system includes:

```text
AI conversation engine
Shopify product/variant sync
Persisted product mapping
Cart and order safety rules
Shopify COD order creation
Human handoff
Audit/tool logs
Dashboard Command Center
QA scenario runner
Production runbook
```

## Architecture

```text
Shopify = source of truth for products, variants, inventory, orders
Supabase/Postgres = operational cache and state
Next.js = business logic + API + dashboard
n8n = orchestration only
Evolution API = WhatsApp transport
VPS Docker = deployment target
```

## Product name/code requirement

Products must be managed by Shopify name and code:

```text
Name = Shopify product title
Code = Shopify variant SKU
Variant/order identity = Shopify variant id/GID
```

No AI-generated product codes.

## Launch philosophy

Build the smallest safe system that can go live:

```text
Safety first
No wrong orders
No duplicate orders
No hidden failures
Human takeover always available
Dashboard visibility before scaling
```

## Phases

```text
Phase 0: Safe commerce core
Phase 1: Live integration + VPS deploy + soft launch
Phase 2: Dashboard MVP
Phase 3: Growth intelligence
Phase 4: Approved knowledge/RAG
Phase 5: Multi-channel
Phase 6: SaaS multi-tenant
```

## Non-negotiables

```text
No order without explicit customer confirmation
No order from AI memory
No order without exact Shopify variant_id
No order if stock is unknown/OOS
No order if shipping is unknown
No duplicate order from duplicate webhook
No live side effects in testMode
Every mutation has audit log
Every AI tool call has log
Kill switch works instantly
Human handoff works instantly
```

## What is included in this pack

```text
Specs
Roadmap
Dashboard/system feature design
Shopify product name/code spec
API contracts
DB migration blueprint
n8n/Evolution contract
Testing strategy
Go-live checklist
Runbook
Codex master prompt
Phase prompts
Validation scripts
Scenario data
Opus review brief
```

## What is not included

```text
Real Shopify credentials
Real product export/API data
Real n8n workflow JSON exports
Finished app code
Production deployment credentials
```

Those are expected production inputs for Codex/human owner to provide during implementation.
