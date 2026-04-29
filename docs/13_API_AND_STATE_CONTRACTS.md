# API and State Contracts

This file is the implementation contract for Phase 0/1 APIs.

## Common rules

- All POST routes validate input with Zod.
- Route handlers are thin: auth, parse, service call, response.
- No route file should hold business logic.
- All internal routes require `INTERNAL_API_SECRET` unless `testMode=true` and local/mock mode is allowed.
- All tenant-scoped operations require `store_id` resolved from `storeSlug` or auth context.
- Every mutation writes audit log.
- Every AI/tool operation writes `ai_tool_calls`.

## 1. Message turn

```text
POST /api/internal/messages/turn
```

Request:

```json
{
  "scenarioId": "CONV-001",
  "storeSlug": "youlya",
  "channel": "whatsapp_evolution",
  "locale": "ar-EG",
  "messageType": "text",
  "text": "عايزة بيجامات شتوي",
  "preconditions": {},
  "testMode": true
}
```

Response:

```json
{
  "intent": "product_search",
  "toolsCalled": ["product_search"],
  "reply": "أكيد يا قمر...",
  "handoff": false
}
```

Phase 0 test response shape must remain compatible with Playwright.

## 2. Product search tool

```text
POST /api/ai/tools/product-search
```

Request:

```json
{
  "storeSlug": "youlya",
  "conversationId": "uuid-or-test-id",
  "customerId": "uuid-or-test-id",
  "query": "بيجامات شتوي",
  "limit": 10,
  "testMode": true
}
```

Response:

```json
{
  "recommendations": [
    {
      "index": 1,
      "shopifyProductTitle": "بيجامة شتوي أسود",
      "shopifyHandle": "winter-pajama-black",
      "shopifyProductId": "gid://shopify/Product/123",
      "imageUrl": "https://...",
      "variantOptions": [
        {
          "shopifyVariantId": "gid://shopify/ProductVariant/111",
          "sku": "YLY-PJ-BLK-XL",
          "codeMissing": false,
          "size": "XL",
          "color": "Black",
          "price": 950,
          "currency": "EGP",
          "inventoryQuantity": 4,
          "available": true
        }
      ]
    }
  ],
  "mappingPersisted": true
}
```

## 3. Select product

```text
POST /api/ai/tools/select-product
```

Request:

```json
{
  "storeSlug": "youlya",
  "conversationId": "uuid-or-test-id",
  "customerId": "uuid-or-test-id",
  "selectionText": "رقم 2 مقاس XL",
  "testMode": true
}
```

Response:

```json
{
  "status": "added_to_cart",
  "items": [
    {
      "index": 2,
      "shopifyProductTitle": "روب قطن وردي",
      "sku": "YLY-RB-PNK-XL",
      "shopifyVariantId": "gid://shopify/ProductVariant/222",
      "size": "XL",
      "quantity": 1,
      "price": 1100
    }
  ],
  "missing": [],
  "blocked": []
}
```

Possible statuses:

```text
added_to_cart
needs_size
needs_color
mapping_expired
oos
not_found
handoff_required
```

## 4. Calculate shipping

```text
POST /api/ai/tools/calculate-shipping
```

Request:

```json
{
  "storeSlug": "youlya",
  "cartId": "uuid-or-test-id",
  "city": "القاهرة",
  "testMode": true
}
```

Response:

```json
{
  "subtotal": 1100,
  "shippingFee": 70,
  "total": 1170,
  "freeShippingApplied": false,
  "cityNormalized": "cairo",
  "currency": "EGP"
}
```

Rules:

```text
Cairo = 70 EGP
Alexandria = 90 EGP
Free shipping at subtotal >= 1200 EGP
Unknown city = ask or handoff, never guess
```

## 5. Confirm order

```text
POST /api/ai/tools/confirm-order
```

Request:

```json
{
  "storeSlug": "youlya",
  "conversationId": "uuid-or-test-id",
  "cartId": "uuid-or-test-id",
  "customerMessage": "أيوه أكدي",
  "lastBotMessageType": "final_summary",
  "testMode": true
}
```

Response:

```json
{
  "confirmationStatus": "explicit_confirmed",
  "safeToCreateOrder": true,
  "blockers": []
}
```

Possible statuses:

```text
explicit_confirmed
ambiguous_confirm_after_summary
ambiguous_needs_clarification
negative_or_cancelled
not_confirmation
blocked_missing_data
```

## 6. Create Shopify order

```text
POST /api/ai/tools/create-shopify-order
```

Request:

```json
{
  "storeSlug": "youlya",
  "conversationId": "uuid-or-test-id",
  "cartId": "uuid-or-test-id",
  "idempotencyKey": "conversation-cart-confirmation-hash",
  "testMode": true
}
```

Response:

```json
{
  "status": "created",
  "testMode": true,
  "shopifyOrderId": "TEST-ORDER-ID-CONV-001",
  "shopifyOrderName": "TEST-ORDER-CONV-001",
  "duplicate": false
}
```

Rules:

```text
Recheck inventory immediately before mutation
Use idempotency key
Never return fake real order numbers
Persist order only after Shopify success
If Shopify fails, return failure and handoff/admin alert
```

## 7. Handoff

```text
POST /api/ai/tools/handoff
```

Request:

```json
{
  "storeSlug": "youlya",
  "conversationId": "uuid-or-test-id",
  "reason": "customer_requested_human",
  "summary": "Customer asked to speak with a human.",
  "testMode": true
}
```

Response:

```json
{
  "handoff": true,
  "ticketId": "uuid-or-test-id",
  "reply": "تمام يا قمر، هحوّلك لحد من الفريق يساعدك 💜"
}
```

## State machine

### Conversation states

```text
new
ai_active
collecting_selection
cart_open
collecting_customer_data
waiting_final_confirmation
order_creating
order_created
handoff
closed
```

### Cart states

```text
open
needs_item_data
needs_customer_data
needs_shipping
ready_for_summary
waiting_confirmation
confirmed
order_created
cancelled
handoff
```

### Order safety blockers

```text
missing_variant_id
mapping_missing_or_expired
missing_size
missing_quantity
stock_unknown
oos
missing_name
missing_phone
missing_city
missing_address
shipping_unknown
summary_not_shown
no_explicit_confirmation
duplicate_confirmation
kill_switch_active
handoff_required
```

## Required audit events

```text
message.inbound_logged
message.outbound_logged
product.search
product.mapping_persisted
cart.item_added
cart.item_removed
cart.updated
shipping.calculated
confirmation.detected
order.create_attempted
order.create_blocked
order.create_succeeded
order.create_failed
handoff.created
kill_switch.triggered
```
