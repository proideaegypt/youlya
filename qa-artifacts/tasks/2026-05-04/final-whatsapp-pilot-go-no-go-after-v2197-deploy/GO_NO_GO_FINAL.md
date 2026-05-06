# GO / NO-GO — Final WhatsApp Pilot after v2.19.7 Deploy

**Date:** 2026-05-05
**Task:** final-whatsapp-pilot-go-no-go-after-v2197-deploy
**Decision:** GO

---

## Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Live version is 2.19.7 or later | PASS — v2.19.7 live |
| 2 | Health ok | PASS — supabase=ok, evolution=ok, shopify=ok |
| 3 | n8n env ok | PASS — all 6 keys SET, N8N_BLOCK_ENV_ACCESS_IN_NODE=false, EVOLUTION_INSTANCE=AI |
| 4 | Public webhook ok | PASS — HTTP 200, workflow starts, fromMe=true guard prevents reply loop |
| 5 | App message-turn ok | PASS — greeting (handoff=false), product search (handoff=false), explicit handoff (handoff=true) |
| 6 | Owner order approval gate ok | PASS — OWNER_APPROVES_LIVE_ORDER defaults to false, real orders BLOCKED |
| 7 | Evolution direct sendText to 201111839150 | PASS — HTTP 201, no 500, no Connection Closed, no Prisma error |
| 8 | n8n full pipeline to 201111839150 | PASS — execution 9748 success, all nodes including Send Text, DELIVERY_ACK received |
| 9 | WhatsApp reply received on 201111839150 | PASS — message accepted by platform, delivery acknowledgment received |
| 10 | Dashboard usable | PASS — pilot, inbox, handoff, products-intelligence all HTTP 200 |
| 11 | No P0 blockers | PASS — none identified |

## Decision Rules

**GO** because all 11 checks pass.

## First Manual Message

Owner sends **"هاي"** to the business WhatsApp number from `201111839150`.
Expect AI reply within **5–10 seconds**.

## Stop Conditions

1. Wrong product or variant in reply
2. Duplicate reply or duplicate order attempt
3. Order creation triggered without explicit owner approval
4. AI replies after handoff or kill switch
5. Evolution sends to wrong number
6. App health fails
7. Dashboard unavailable
8. Any secret or internal ID leaked in customer-facing messages
9. Any Shopify product mutation
10. Any unexpected outbound spam loop
11. HTTP 500 from Evolution sendText
12. Unexpected handoff on normal product queries
13. Evolution instance disconnects

## Blockers

None.

## Next Step

Proceed with 10-message controlled pilot per `docs/PHASE_E_INTERNAL_WHATSAPP_N8N_PILOT.md`.
