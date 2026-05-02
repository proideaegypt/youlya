# Internal WhatsApp + n8n Pilot - Manual Test Results

**Date:** 2026-05-02
**Version:** v2.4.0
**Pilot Type:** Internal only - no public traffic

---

## Test WA-001: Greeting

| Field | Value |
|---|---|
| Test ID | WA-001 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | هاي |
| Expected Result | Normal greeting reply, no order, no handoff |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-002: Product Search

| Field | Value |
|---|---|
| Test ID | WA-002 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | ابعتيلي بيجامة قطن |
| Expected Result | Product search results or helpful product response |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-003: Product Select Latin Number

| Field | Value |
|---|---|
| Test ID | WA-003 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | رقم 1 مقاس L |
| Expected Result | Product selected or clear unavailable/size response |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-004: Product Select Arabic Digit

| Field | Value |
|---|---|
| Test ID | WA-004 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | رقم ١ مقاس L |
| Expected Result | Same as WA-003 |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-005: Address Collection

| Field | Value |
|---|---|
| Test ID | WA-005 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | أحمد، ١٢ شارع التحرير، مدينة نصر، القاهرة، 01000000000 |
| Expected Result | Order summary or ask for missing fields |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-006: Confirmation Gate

**⚠️ WARNING:** Only run if TEST_MODE=true or explicit owner approval.

| Field | Value |
|---|---|
| Test ID | WA-006 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | أيوه أكدي |
| Expected Result | Order created only if safe |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-007: Duplicate Protection

**Only if WA-006 executed and approved.**

| Field | Value |
|---|---|
| Test ID | WA-007 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | (same as WA-006) |
| Expected Result | No duplicate order created |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-008: Handoff

| Field | Value |
|---|---|
| Test ID | WA-008 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | عايزة أكلم حد |
| Expected Result | Handoff ticket created, AI stops |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-009: Unclear Intent

| Field | Value |
|---|---|
| Test ID | WA-009 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | مممم مش عارفة |
| Expected Result | Clarify question or handoff according to policy |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Test WA-010: Kill Switch

| Field | Value |
|---|---|
| Test ID | WA-010 |
| Time | |
| Tester Number | +20XXXXXXXXXX |
| Youlya Number | +20YYYYYYYYYY |
| n8n Workflow Name | |
| n8n Workflow ID | |
| n8n Execution ID | |
| Evolution Instance | |
| provider_message_id | |
| Message Sent | هاي (after enabling kill switch) |
| Expected Result | No AI order flow; handoff/support response |
| Actual WhatsApp Reply | |
| Dashboard Pages Checked | |
| Order Created | |
| Duplicate Risk | |
| Status | |
| Notes | |

---

## Dashboard Observability Summary

| Check | Before Pilot | During Pilot | After Pilot |
|---|---|---|---|
| /api/health | | | |
| /api/build-info | | | |
| Command Center KPIs | | | |
| Inbox handoffs | | | |
| Orders page | | | |
| Logs page | | | |
| Settings integration health | | | |
| Kill switch status | | | |

---

## Pilot Summary

| Metric | Value |
|---|---|
| Tests Run | |
| Tests Passed | |
| Tests Failed | |
| Orders Created | |
| Duplicates Blocked | |
| Handoffs Triggered | |
| Stop Conditions Hit | |
| Blockers Found | |

## Final Status

- [ ] All tests completed
- [ ] No duplicate orders
- [ ] No unintended Shopify mutations
- [ ] No PII in artifacts
- [ ] Dashboard healthy throughout
- [ ] Kill switch functional
- [ ] Ready for next phase: yes / no (with blockers)

## Blockers / Risks

1.
2.
3.

## Next Steps

1.
2.
3.
