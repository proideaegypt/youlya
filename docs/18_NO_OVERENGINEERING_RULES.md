# No Over-Engineering Rules

The goal is to launch Youlya safely, not to impress the code reviewer with complexity.

## Build only what the current phase needs

Phase 0 must produce a working, safe commerce core. It does not need a complete SaaS platform.

Build now:

```text
message turn
product search
product mapping
select product
cart
shipping
confirmation gate
Shopify COD order adapter
handoff
logging
tests
```

Delay:

```text
multi-store billing
marketplace
full analytics warehouse
RAG
campaign engine
multi-channel
white-label
enterprise permissions
advanced AI experimentation
```

## Prefer boring architecture

Use:

```text
Next.js API routes / server actions only where needed
TypeScript strict
Zod validation
Supabase/Postgres
thin service classes/functions
simple adapter interfaces
plain SQL migrations
Playwright/Vitest
Docker on VPS
```

Avoid unless a real blocker appears:

```text
microservices
event sourcing
Kafka/RabbitMQ
custom workflow engine
complex monorepo tooling
premature queues
custom auth provider
unnecessary abstraction layers
```

## Keep n8n simple

n8n may:

```text
receive webhook
normalize payload
call app endpoint
send reply
retry/fallback/log failure
```

n8n may not:

```text
choose products
resolve variants
calculate order safety
create Shopify orders directly
hold cart state
implement business rules
```

## Keep dashboard MVP small

Before live, dashboard can be tiny:

```text
Command Center
Inbox/Handoff
Orders with confirmation proof
Logs/Audit
Settings/Kill switch
```

After stable live, add:

```text
Products/Inventory
AI Studio
QA Lab
Reports
Customer 360
Lost Sales Radar
```

## Codex behavior rules

- Make small commits/patches logically.
- Write tests before or alongside logic.
- Never hide failing tests.
- Never invent product data, Shopify credentials, URLs, or product codes.
- If external credentials are missing, use mock adapters and document BLOCKED live integration.
- Do not create new frameworks when a simple service function is enough.
- Do not make generated code bigger than the business flow requires.

## Acceptance phrase

If a feature does not reduce wrong orders, duplicate orders, support load, or time-to-live, it is probably not Phase 0/1.
