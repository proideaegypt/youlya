# Production Go-Live Checklist

Status values: `TODO`, `PASS`, `BLOCKED`, `N/A`.

## Phase 0 safety

| Check | Status |
|---|---|
| Scenario JSONL validates: 80 CONV + 10 DASH | TODO |
| Playwright defaults to CONV | TODO |
| `/api/internal/messages/turn` works in testMode | TODO |
| Product search uses Shopify/cache/mock, not AI memory | TODO |
| Product mapping persisted | TODO |
| Select by index + size resolves exact variant | TODO |
| Multi-item Hybrid Bulk Confirm works | TODO |
| OOS blocks order | TODO |
| Shipping Cairo/Alex/free threshold works | TODO |
| Confirmation gate blocks unsafe orders | TODO |
| Duplicate confirmation idempotent | TODO |
| Handoff works | TODO |
| Kill switch works | TODO |
| Audit/tool logs written | TODO |
| No live side effects in testMode | TODO |

## Shopify

| Check | Status |
|---|---|
| Product names imported from Shopify title | TODO |
| Product codes imported from Shopify variant SKU | TODO |
| Missing SKU report visible/available | TODO |
| Product/variant cache matches Shopify | TODO |
| Inventory recheck before order | TODO |
| COD payload verified | TODO |
| Tags include whatsapp,cod,YoulyaAI,AI-confirmed | TODO |
| Note includes Made By AI | TODO |
| Shopify failure does not produce fake real order number | TODO |

## n8n/Evolution

| Check | Status |
|---|---|
| Workflow JSON files present | TODO |
| Workflow validation passes | TODO |
| Duplicate webhook safe | TODO |
| Text inbound works | TODO |
| Text outbound works | TODO |
| Media fallback works | TODO |
| Retry/backoff configured | TODO |
| Error workflow/dead letter configured | TODO |
| Admin alerts configured | TODO |

## Deployment

| Check | Status |
|---|---|
| VPS Docker stack configured | TODO |
| SSL works | TODO |
| `/api/health` works on production domain | TODO |
| n8n protected | TODO |
| Evolution protected | TODO |
| No raw ports exposed | TODO |
| Production env on server only | TODO |
| Rollback documented and tested | TODO |

## Soft launch

| Check | Status |
|---|---|
| Internal test numbers configured | TODO |
| Team knows handoff process | TODO |
| Kill switch tested live | TODO |
| Internal test order verified | TODO |
| Duplicate webhook test passed | TODO |
| Owner approves limited live | TODO |

## Full live stop conditions

Stop immediately if any occur:

```text
wrong product/variant order
duplicate Shopify order
order without explicit confirmation
secret/data leak
webhook loop/spam
Shopify mutation failure hidden from team
Evolution send failure hidden from team
```
