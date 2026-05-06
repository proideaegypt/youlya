# Manual WhatsApp Pilot Test Plan — Today (2026-05-06)

## Goal
Run a controlled, manual pilot of the Youlya AI Commerce OS WhatsApp conversation flow before enabling any real customer traffic.

## Stop Conditions
- Repeated replies / spam from AI
- AI sends messages after kill switch is ON
- Wrong variant selected or no variant_id present
- Shipping fee guessed incorrectly (not from dashboard rules)
- Order created without explicit customer confirmation
- Duplicate order created
- n8n execution failure repeated > 2 times
- Evolution send failure repeated > 2 times

## Pre-Flight Checklist

1. [ ] App health OK: `curl https://admin.nex-lnk.online/api/health`
2. [ ] Build info fresh: `curl https://admin.nex-lnk.online/api/build-info`
3. [ ] n8n workflow active (Youlya WhatsApp Main)
4. [ ] Loop guard passes synthetic `fromMe=true` test
5. [ ] Shopify product sync last run OK
6. [ ] Shipping settings exist in dashboard (`/dashboard/settings/shipping`)
7. [ ] Evolution account connected and one active WhatsApp number selected
8. [ ] Kill switch visible on dashboard and OFF
9. [ ] No duplicate webhook path in n8n
10. [ ] Pilot mode enabled (testMode or manual approval gate)

## Conversation Test Script

### Test 1: Greeting
- **Inbound:** `هاي`
- **Expected:** One reply only, friendly greeting, no product push unless asked.

### Test 2: Product Search
- **Inbound:** `ابعتيلي بيجامة قطن`
- **Expected:** Limited product options from Supabase cache, not Shopify live API. AI should present 2–3 options with numbers.

### Test 3: Select Product
- **Inbound:** `رقم ١ مقاس M`
- **Expected:** Cart/selection response. AI confirms selection but **does NOT create order**.

### Test 4: Address & Shipping
- **Inbound:** `أحمد، ١٢ شارع عباس العقاد، مدينة نصر، القاهرة، 01000000000`
- **Expected:** Shipping fee based on dashboard rule (Cairo/Nasr City = 70 EGP). AI explicitly states fee and total.

### Test 5: Free Shipping Threshold
- **Setup:** Ensure cart subtotal >= 1400 EGP (or current threshold in dashboard).
- **Expected:** AI explicitly says "الشحن مجاني" and total equals subtotal.

### Test 6: Handoff Request
- **Inbound:** `عايزة أكلم حد`
- **Expected:** Handoff triggered. AI stops replying. Human takeover requested in dashboard.

### Test 7: Loop Guard
- **Method:** Send one message. Count AI replies.
- **Expected:** Exactly one reply per inbound message. No self-reply chains.

### Test 8: STOP BEFORE CONFIRMATION
- **Inbound:** `أيوه أكدي`
- **Action:** DO NOT confirm real order today unless owner explicitly approves in writing.
- **Expected:** If order approval gate is enabled, AI says "طلبك محتاج تأكيد نهائي من الإدارة" or similar safe message.

## Roles During Pilot
- **Pilot Operator (super_admin):** Monitors dashboard, can kill switch, reviews logs.
- **Test Customer (moderator/customer_service or external number):** Sends test messages only.
- **No real customer traffic allowed.**

## Rollback Plan
If any stop condition triggers:
1. Enable kill switch immediately from dashboard.
2. Check n8n execution logs for error node.
3. Check Evolution instance status.
4. Review `docs/HAIDI_AI_SALES_AGENT_PROMPT.md` if AI behavior is wrong.
5. Report issue and do not continue pilot until fixed.

## Post-Pilot Checklist
- [ ] All 8 tests completed or documented why skipped
- [ ] No real orders created accidentally
- [ ] No duplicate messages observed
- [ ] Shipping fees matched dashboard rules
- [ ] Kill switch tested (turn ON, verify AI stops, turn OFF)
- [ ] Logs reviewed for errors
- [ ] Decision: GO / NO-GO for expanding to more test numbers
