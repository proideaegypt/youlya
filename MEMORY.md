# MEMORY.md — Youlya AI Commerce OS

Persistent project memory. Codex/Claude must read this before every task.

## Locked decisions

| Area | Decision | Status |
|---|---|---|
| First client | Youlya | locked |
| First channel | WhatsApp via Evolution API | locked |
| Commerce platform | Shopify | locked |
| Product source of truth | Shopify product/variant/inventory/order data | locked |
| Product name | Shopify product title | locked |
| Product code | Shopify variant SKU first; never invent | locked |
| Operational DB | Supabase/Postgres | locked |
| Frontend/backend | Next.js App Router + TypeScript strict | locked |
| Orchestration | n8n only; no business logic | locked |
| Deployment | VPS Docker via Portainer | locked |
| Order type | Shopify COD direct order | locked |
| Multi-item cart | Hybrid Bulk Confirm | locked |
| Shipping Cairo | 70 EGP | locked |
| Shipping Alexandria | 90 EGP | locked |
| Free shipping threshold | 1200 EGP configurable | locked |
| Max cart items | 5 configurable | locked |
| Dashboard | MVP only after Phase 0/1 safety gates | locked |
| RAG/multi-channel/SaaS | Later phases only | locked |

## Non-negotiable safety rules

```text
No order without explicit confirmation.
No order from AI memory.
No order without persisted product mapping.
No order without exact Shopify variant_id.
No order if stock is unknown or OOS.
No order if shipping is unknown.
No duplicate order from duplicate webhook.
No live mutation in testMode.
No secrets in git/frontend.
Kill switch and handoff must always work.
```

## Product name/code policy

- Store `shopify_product_title` as the canonical customer-facing product name.
- Store `shopify_variant_sku` as the canonical internal product/variant code.
- If SKU is missing:
  - set `code_missing=true`;
  - display product handle/internal ID only inside dashboard;
  - do not invent a code;
  - optionally exclude that variant from AI recommendations if the owner enables `SHOPIFY_REQUIRE_VARIANT_SKU_FOR_AI_VISIBILITY=true`.
- Customer replies do not need to include code unless the business chooses to show it. Dashboard/order audit must always show name + code/SKU if available.

## Hybrid Bulk Confirm flow

```text
Customer chooses one or more indexed products.
AI collects missing size/color per item.
AI checks stock per item immediately.
AI asks one upsell/check question only.
AI collects customer data.
AI calculates shipping.
AI sends one final summary.
Customer explicitly confirms.
System rechecks inventory.
System creates one Shopify COD order with multiple line_items.
```

## Current pack status

- The pack is a build starter, not a complete app.
- Scenario JSONL is cleaned to 90 real scenarios: 80 CONV + 10 DASH.
- Playwright must default to `SCENARIO_PREFIX=CONV`.
- Dashboard scenarios are Phase 2 and must not block Phase 0.
- n8n workflow JSON files are not included yet; validation script must report BLOCKED until they are added.

## Open items before real production

| Item | Owner | Notes |
|---|---|---|
| Real Shopify credentials | Ahmed/owner | Add to server env only |
| Real Supabase project | Ahmed/owner | Add URL + keys |
| Real Evolution instance | Ahmed/owner | Add URL + API key |
| Real n8n workflow JSON | Dev/Codex | Place in `workflows/` |
| Real product SKU hygiene | Store owner | Missing SKU policy must be decided |
| Internal test numbers | Store owner | Required for soft launch |
