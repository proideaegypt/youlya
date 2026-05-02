# Phase E Internal WhatsApp + n8n Pilot Runbook

**Version:** v2.4.0
**Date:** 2026-05-02
**Status:** Internal pilot only - no public traffic

## Pre-flight Checklist

### Production Readiness
- [ ] `GET /api/health` returns `status: ok`
- [ ] `GET /api/build-info` returns version `2.4.0`
- [ ] Dashboard login works at `https://admin.youlya365.com/login`
- [ ] Dashboard command-center shows AI status and kill switch
- [ ] Dashboard settings show integration health (all green)
- [ ] Evolution instance connected (check dashboard or `/api/health`)
- [ ] n8n workflows active (check n8n dashboard)
- [ ] `INTERNAL_API_SECRET` configured in n8n request headers
- [ ] TEST_MODE and MOCK_MODE env values verified

### Safety Gates
- [ ] Kill switch is OFF (AI enabled for test)
- [ ] Duplicate protection is active
- [ ] TestMode is understood (may prevent real orders)
- [ ] Shopify order creation is guarded
- [ ] Handoff channel is ready

## Stop Conditions

**IMMEDIATE STOP if any of these occur:**

1. Duplicate Shopify order created
2. Order created before explicit customer confirmation
3. Wrong product or wrong variant ordered
4. Repeated WhatsApp spam loop (AI sending >3 messages without user reply)
5. AI replies while kill switch is ON
6. `/api/health` returns non-ok status
7. Dashboard inaccessible or auth broken
8. n8n execution errors repeated (>3 consecutive failures)
9. Evolution send failure repeated (>3 consecutive failures)
10. Real customer PII exposed in logs or artifacts

## Test Flow

### Internal Test Numbers
- **Tester WhatsApp:** Internal team number (mask in artifacts: `+20XXXXXXXXXX`)
- **Youlya WhatsApp:** Business number (mask in artifacts: `+20YYYYYYYYYY`)

### Sequence

#### Step 1: Greeting (WA-001)
- Tester sends: `هاي`
- Expected: Normal greeting reply, no order, no handoff
- Dashboard check: Command Center KPIs, Logs page

#### Step 2: Product Search (WA-002)
- Tester sends: `ابعتيلي بيجامة قطن`
- Expected: Product search results or helpful product response
- Dashboard check: Logs page for AI_TOOL entries

#### Step 3: Product Select Latin Number (WA-003)
- Tester sends: `رقم 1 مقاس L`
- Expected: Product selected or clear unavailable/size response
- Dashboard check: Logs page for select-product tool

#### Step 4: Product Select Arabic Digit (WA-004)
- Tester sends: `رقم ١ مقاس L`
- Expected: Same as WA-003
- Dashboard check: Verify handling of Arabic digits

#### Step 5: Address Collection (WA-005)
- Tester sends: `أحمد، ١٢ شارع التحرير، مدينة نصر، القاهرة، 01000000000`
- Expected: Order summary or request for missing fields
- Dashboard check: Orders page (should show pending if cart created)

#### Step 6: Confirmation Gate (WA-006)
- **⚠️ WARNING:** This test may create a real order if TEST_MODE=false.
- Only run if:
  - TEST_MODE=true OR
  - Explicit approval from owner to create test order
- Tester sends: `أيوه أكدي`
- Expected: Order created only if safe
- Dashboard check: Orders page for new order
- **If unsafe, skip to WA-007**

#### Step 7: Duplicate Protection (WA-007)
- Only if WA-006 was approved and executed
- Tester repeats same confirmation message
- Expected: No duplicate order created
- Dashboard check: Orders page (only 1 order for this test)

#### Step 8: Handoff (WA-008)
- Tester sends: `عايزة أكلم حد`
- Expected: Handoff ticket created, AI stops
- Dashboard check: Inbox page for handoff request

#### Step 9: Unclear Intent (WA-009)
- Tester sends: `مممم مش عارفة`
- Expected: Clarify question or handoff according to policy
- Dashboard check: Logs page for unclear handling

#### Step 10: Kill Switch (WA-010)
- Enable kill switch via dashboard settings
- Tester sends: `هاي`
- Expected: No AI order flow; handoff/support response
- Dashboard check: Settings page kill switch status
- **After test: Disable kill switch**

## Dashboard Observability Checklist

During each WA test, verify:

- [ ] Command Center: KPIs update (conversations, AI active)
- [ ] Inbox: Handoff requests visible if triggered
- [ ] Orders: Any order creation visible
- [ ] Logs: AI tool calls, webhook events, errors
- [ ] Settings: Integration health stays green
- [ ] `/api/health`: Remains ok throughout
- [ ] `/api/build-info`: Version remains current

## Recording Template

For each test, record:

| Field | Value |
|---|---|
| Test ID | WA-XXX |
| Time | HH:MM:SS |
| Tester Number | +20XXXXXXXXXX (masked) |
| Youlya Number | +20YYYYYYYYYY (masked) |
| n8n Workflow Name | (from n8n dashboard) |
| n8n Workflow ID | (from n8n dashboard) |
| n8n Execution ID | (from n8n dashboard) |
| Evolution Instance | (instance name) |
| provider_message_id | (from Evolution webhook) |
| Message Sent | (test message) |
| Expected Result | (from test plan) |
| Actual WhatsApp Reply | (what the tester received) |
| Dashboard Pages Checked | (list) |
| Order Created | yes / no |
| Duplicate Risk | yes / no |
| Status | PASS / FAIL |
| Notes | (any observations) |

## Post-pilot Actions

1. Review all test results
2. Check dashboard logs for errors
3. Verify no unintended Shopify mutations
4. Verify no duplicate orders
5. Verify no PII in committed artifacts
6. Update QA artifact with final results
7. Decide: proceed to broader pilot or fix blockers

## Rollback Plan

If pilot fails:
1. Enable kill switch immediately
2. Disable n8n workflow if needed
3. Check `/api/health` for system status
4. Review logs for root cause
5. Fix issues before next pilot attempt
