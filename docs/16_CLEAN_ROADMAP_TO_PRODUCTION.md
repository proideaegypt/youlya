# Clean Roadmap to Production Live

This roadmap is intentionally practical. The first goal is safe Youlya live launch, not a complete SaaS product.

## Phase -1 — Pack audit and decision lock

Goal: make the repo trustworthy before implementation.

Deliverables:

```text
Scenario JSONL validates
Fake header scenario removed
CONV default E2E filtering works
Deployment decision locked: VPS Docker
Product name/code policy locked
Memory/progress/learnings files present
n8n workflow files status known
QA baseline artifact created
```

Exit gate:

```text
node scripts/validate-scenarios.mjs passes
node scripts/scan-secrets.mjs passes
n8n validation is PASS or BLOCKED with reason
```

## Phase 0 — Commerce safety core

Goal: app can safely handle a WhatsApp customer shopping flow in testMode/mock mode and later live mode.

Build:

```text
Next.js scaffold
TypeScript strict
Env validation
Supabase migration
/api/health
/api/internal/messages/turn
Product search
Product mapping
Select product by index + size
Cart state
Shipping quote
Confirmation gate
Shopify adapter interface
MockShopifyAdapter
LiveShopifyAdapter boundary
Idempotency
Handoff
Audit logs
Tool logs
Unit/API/E2E tests
```

Exit gate:

```text
No order without explicit confirmation
No duplicate order from duplicate confirmation
No order without Shopify variant_id
No order if OOS or stock unknown
Product selection resolves only from persisted mapping
Shipping Cairo/Alex/free threshold works
Handoff and kill switch work
testMode causes no live side effects
CONV scenarios pass or manual-run blocker is documented
```

## Phase 1A — Live integrations

Goal: connect real systems without changing core business logic.

Build/connect:

```text
Shopify product/variant sync
Shopify order creation live adapter
Shopify webhooks for product/order updates
Evolution inbound/outbound WhatsApp
n8n workflows for normalization/send/retry only
Dead letter storage
Admin failure notifications
```

Exit gate:

```text
Real product cache matches Shopify
Real WhatsApp inbound works
Real outbound works
Duplicate webhook safe
Shopify order payload verified on test/internal orders
No hardcoded secrets in workflows
```

## Phase 1B — VPS deployment

Goal: production-like hosting on VPS Docker.

Deploy:

```text
Next.js app container
n8n container
Evolution container
Nginx reverse proxy
SSL certificates
.env.production on server only
health checks
rollback notes
logs access
```

Exit gate:

```text
https://app.youlya.ai/api/health works
n8n is protected
Evolution is protected
No raw service ports exposed publicly
Restart policy works
Rollback path documented
```

## Phase 1C — Internal soft launch

Goal: test with internal team numbers only.

Test:

```text
Product search
Number + size selection
Multi-item cart
Missing address
Shipping Cairo/Alex
OOS block
Ambiguous confirmation
Duplicate webhook
Handoff
Kill switch
Shopify failure
Evolution failure
```

Exit gate:

```text
0 wrong products
0 wrong variants
0 duplicate Shopify orders
0 orders without confirmation
Team can take over manually
Owner approves limited live
```

## Phase 1D — Limited production live

Goal: enable real traffic gradually.

Operate:

```text
Enable AI for a subset or limited period
Human team monitors every order
Review daily incidents
Keep kill switch ready
Fix only critical blockers
```

Stop immediately if:

```text
Wrong product/variant order
Duplicate order
Order without confirmation
Sensitive data leak
Webhook loop/spam
Unrecoverable Shopify/Evolution failure
```

Exit gate:

```text
Real customers served safely
Orders created safely
No critical incident
Owner signs off full live
```

## Phase 1E — Full production live

Goal: Youlya WhatsApp AI sales flow runs for all eligible conversations.

Checklist:

```text
Kill switch tested
Handoff tested
COD order tags/note verified
Product mapping proof visible
Confirmation proof visible
Logs visible
Admin alerts working
Rollback known
Team trained
```

## Phase 2 — Dashboard MVP

Build only the operating dashboard needed for real work:

```text
Command Center
Inbox + Handoff
Order safety detail
Products/Inventory operational view
AI Studio basic prompt draft/test/publish
QA Lab for scenarios
Logs/Audit
Settings/Kill switch
```

## Phase 3 — Growth and intelligence

Add after live stability:

```text
Lost Sales Radar
Back-in-stock list
Abandoned cart recovery
Customer 360
Product demand intelligence
Daily owner digest
Better reports
```

## Phase 4 — Approved knowledge/RAG

Add only with approval workflow:

```text
Store policy knowledge base
Product FAQs
Prompt versions
Retrieval by store_id
Suggested learnings
Human approval before production
Rollback
```

## Phase 5 — Multi-channel

Add channels only after the single WhatsApp engine is stable:

```text
Official WhatsApp Cloud API
Instagram DM
Facebook Messenger
Email
```

All channels must normalize to the same message schema.

## Phase 6 — SaaS multi-tenant

Add after Youlya is stable and at least one more pilot store is ready:

```text
Onboarding
Billing
Store isolation
Plan limits
Team roles
Integration setup wizard
White-label basics
```

## Phase 7+ — Advanced/enterprise

Later only:

```text
Agency portal
Advanced RBAC
AI QA scoring
A/B prompt tests
Marketplace
SLA dashboard
Enterprise audit controls
```
