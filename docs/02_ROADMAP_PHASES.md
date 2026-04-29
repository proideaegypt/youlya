# Roadmap Phases

This file is the short roadmap. The detailed production roadmap is in:

```text
docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md
```

## Phase -1 — Audit and lock

Validate the pack, scenarios, secrets, deployment assumptions, and missing integrations.

## Phase 0 — Commerce safety core

Build safe app foundation:

```text
Next.js scaffold
env validation
Supabase schema
message turn endpoint
product search
product mapping
select product
cart
shipping
confirmation gate
Shopify mock/live adapter boundary
idempotency
handoff
logs
tests
```

No full dashboard yet.

## Phase 1 — Integration and production launch

```text
Shopify sync and live order adapter
Evolution WhatsApp integration
n8n workflow import/validation
VPS Docker deploy
internal soft launch
limited live
full live
```

## Phase 2 — Dashboard MVP

```text
Command Center
Inbox/Handoff
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

## Phase 3 — Growth features

```text
Lost Sales Radar
Back-in-stock
Abandoned cart recovery
Customer 360
Product demand intelligence
Daily owner digest
```

## Phase 4 — Approved RAG/knowledge

```text
Knowledge base
Store policies
Prompt versions
Approval workflow
Rollback
```

## Phase 5 — Multi-channel

```text
Official WhatsApp Cloud API
Instagram DM
Facebook Messenger
Email
```

## Phase 6 — SaaS

```text
Multi-store onboarding
Billing
Tenant isolation
Plan limits
White-label basics
```

## Rule

Do not start a phase until the previous phase has a QA artifact proving the exit gates passed.
