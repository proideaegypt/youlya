# Internal WhatsApp + n8n Pilot — Manual QA Sheet

Use masked phone numbers only. Do not include raw PII.

## Recording Fields
- Test ID:
- Time:
- Tester WhatsApp number (masked):
- Youlya WhatsApp number (masked):
- n8n workflow name:
- n8n workflow ID:
- n8n execution ID:
- Evolution instance:
- provider_message_id:
- message sent:
- expected result:
- actual WhatsApp reply:
- dashboard page checked:
- order created yes/no:
- duplicate risk yes/no:
- status PASS/FAIL:
- notes:

---

## WA-001 Greeting
- Message: `هاي`
- Expected: normal reply, no order, no handoff unless intended.

## WA-002 Product search
- Message: `ابعتيلي بيجامة قطن`
- Expected: product search or helpful product response.

## WA-003 Product select Latin number
- Message: `رقم 1 مقاس L`
- Expected: product selected or clear unavailable/size response.

## WA-004 Product select Arabic digit
- Message: `رقم ١ مقاس L`
- Expected: same as WA-003.

## WA-005 Address collection
- Message: `أحمد، ١٢ شارع التحرير، مدينة نصر، القاهرة، 01000000000`
- Expected: order summary or ask for missing fields.

## WA-006 Confirmation gate
- Message: `أيوه أكدي`
- Expected: only create order if test order mode is explicitly approved; otherwise stop before this test.

## WA-007 Duplicate confirmation
- Message: repeat WA-006 confirmation.
- Expected: no duplicate order (run only if WA-006 approved).

## WA-008 Handoff
- Message: `عايزة أكلم حد`
- Expected: handoff ticket/status.

## WA-009 Unclear
- Message: `مممم مش عارفة`
- Expected: clarify or handoff according to unclear policy.

## WA-010 Kill switch
- Precondition: turn kill switch ON only via safe UI/API path.
- Message: `هاي`
- Expected: no AI order flow; handoff/support response.
