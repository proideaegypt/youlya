# Dashboard + System Features Final Spec

The dashboard is not a generic admin panel. It is the **AI Commerce Command Center** for Youlya.

## Product principle

The dashboard must answer:

```text
Who is talking now?
What did the AI do?
Why did it choose this product?
Is there a cart waiting?
Is an order safe to create?
Was a duplicate webhook blocked?
Is Shopify/Evolution/n8n healthy?
Which customers need humans?
Which products are requested but unavailable?
Can the owner stop AI instantly?
```

## MVP dashboard before or during first live

Build only what operators need to prevent mistakes.

### 1. Command Center

Cards:

```text
Active conversations
AI active conversations
Needs human
Pending confirmations
Orders created today
Failed order attempts
Duplicate webhooks blocked
Shopify sync health
Evolution health
Kill switch status
```

Alerts:

```text
Order failed at Shopify
Duplicate order blocked
Inventory mismatch
Message send failed
AI stopped by kill switch
High-value order waiting review
Missing SKU/code variants
```

### 2. Inbox + Handoff

Layout:

```text
Left: conversation list
Middle: chat thread
Right: customer, cart, AI state, order safety
```

Filters:

```text
All
AI Active
Needs Human
Waiting Confirmation
Cart Open
Order Created
Failed
Unread
```

Right panel:

```text
Customer name/phone/city/address
Current cart
Selected products with Shopify name/code/SKU
Shipping quote
Confirmation status
Last AI intent
Tools called
Handoff reason
Internal notes
```

Actions:

```text
Take Over
Return to AI
Send Message
Cancel Cart
Refresh Stock
Create Manual Order Link/Note
Kill AI for this conversation
```

### 3. Order Safety Detail

Every pending or created order must show:

```text
Safety score/status
Product mapping proof
Variant IDs
SKU/code
Stock recheck status
Shipping calculation
Final summary shown
Customer confirmation message
Idempotency key
Shopify order id/name if created
Audit trail
```

Statuses:

```text
SAFE_TO_CREATE
BLOCKED_MISSING_VARIANT
BLOCKED_MISSING_SIZE
BLOCKED_STOCK_UNKNOWN
BLOCKED_OOS
BLOCKED_MISSING_ADDRESS
BLOCKED_MISSING_PHONE
BLOCKED_SHIPPING_UNKNOWN
BLOCKED_NO_FINAL_SUMMARY
BLOCKED_NO_EXPLICIT_CONFIRMATION
BLOCKED_DUPLICATE
HANDOFF_REQUIRED
```

### 4. Product Mapping Inspector

For each conversation:

```text
Index
Shopify product title
Shopify product id
Shopify variant id
SKU/code
Size/color
Price
Stock at show time
Image URL
Expires at
Used/not used
```

Purpose: prove what the customer saw when they said `رقم 2`.

### 5. Orders

Columns:

```text
Order number
Customer
Channel
Items
Product names + SKU/code
Total
Payment: COD
Status
Created by: AI/Human
Confirmation proof
Shopify link
Risk flags
```

Filters:

```text
AI-created
Needs review
Failed
Duplicate prevented
Today
COD
High value
```

### 6. Logs + Audit

Tabs:

```text
Audit logs
AI tool calls
Webhook events
Shopify API calls
Evolution API calls
Errors
Security events
```

Search by:

```text
conversation
phone
order number
tool name
error code
date
```

### 7. Settings + Kill Switch

Settings:

```text
AI enabled
AI order creation enabled
Product recommendations enabled
Max cart items
Shipping rules
Free shipping threshold
Handoff rules
Require SKU for AI visibility
Internal test numbers
```

Kill switch modes:

```text
Disable all AI
Disable AI order creation only
Disable product recommendations only
Disable one conversation
Disable one channel
```

## Phase 2 dashboard additions

Add after Phase 0/1 are stable.

### Products + Inventory

```text
Shopify title
SKU/code
Variant
Stock
AI visibility
Missing code warning
Low stock threshold
OOS demand count
Last synced
Shopify link
```

### AI Studio

```text
Production prompt
Draft prompt
Test prompt against scenarios
Publish approval
Rollback
Tone settings
Safety rules
Forbidden claims
Tool policy
Version history
```

Prompt changes that affect orders require Owner/Admin permission and QA pass.

### QA Lab

```text
Run CONV scenarios
Run DASH scenarios
Run one scenario
View failure diff
Compare expected vs actual tools
Replay failed conversation
Export QA result
```

### Reports

```text
AI-assisted revenue
Conversation-to-order conversion
Handoff rate
Top requested products
Top OOS requested products
Abandoned carts
Average response time
Orders by city
Shipping collected
Failure reasons
```

Most important report:

```text
Lost Sales Radar
```

It shows:

```text
customers asked for OOS size
customers abandoned after shipping
customers abandoned after price
customers asked for unavailable product
customers requested human
```

## Later features

Only after stable production:

```text
Customer 360
Back-in-stock messages
Abandoned cart recovery
Daily owner digest
Campaign engine
Approved knowledge/RAG
Multi-channel
SaaS onboarding/billing
Advanced RBAC
```

## UI rules

```text
Arabic Egyptian first
RTL-first layout
English tech labels allowed only in admin/debug areas
Dark/light/auto mode
Mobile usable for owner/support
Never hide safety blockers behind pretty UI
Every dangerous action needs clear wording
```

## Permission roles

Minimum roles:

```text
Owner
Admin
Sales Manager
Sales Agent
Support Agent
QA
Developer
Read-only
```

Sensitive permissions:

```text
Publish prompt
Change integrations
Change shipping/order rules
Enable/disable kill switch
View full logs
Export data
Create manual order
Return conversation to AI
```

## MVP acceptance gate

Dashboard MVP is acceptable when an operator can:

```text
See live conversations
Take over any conversation
See cart/order safety
Verify confirmation proof
See Shopify name/code/SKU for products
Find failed events
Use kill switch
Review audit/tool logs
```
