# 01 — Spec-Driven Master Spec: Youlya AI Commerce OS

## 1. Context and Goals
النظام المطلوب هو AI commerce platform للمتاجر، يبدأ ببراند Youlya. الهدف بناء موظف AI يبيع، يخدم العملاء، يتابع، ويحوّل للبشر عند الحاجة، مع dashboard احترافي قابل للبيع لمتاجر أخرى.

## 2. Scope

### In Scope — V1 Youlya Live
- WhatsApp Evolution API channel.
- Text / voice / image inputs.
- AI sales + support agent.
- Product search from synced data.
- Product image sending.
- Product mapping by conversation.
- Order confirmation.
- Shopify direct COD order creation.
- Order update for address/phone/product/size/quantity when allowed by policy.
- Cancel request = tag `Canceled By Youlya AI` + handoff if needed.
- Order status inquiry.
- Post-sale follow-up.
- Shipping rules.
- Handoff tickets.
- Logs and dashboard.

### In Scope — SaaS Roadmap
- Meta WhatsApp official.
- Instagram DM.
- Facebook Messenger.
- Email AI agent.
- Multi-store.
- Roles/permissions.
- RAG knowledge base.
- Learning approval queue.
- Advanced KPIs.
- Reports export.
- White-label.

### Out of Scope — This Week
- Full SaaS billing.
- Marketplace templates.
- Fully automated self-learning without review.
- Full channel rollout beyond WhatsApp.
- Enterprise analytics warehouse.

## 3. Personas

### Store Owner
عايز يشوف المبيعات، الأداء، أخطاء الـ AI، المخزون، ويغير الإعدادات.

### Sales Agent
بيتابع المحادثات، يعمل takeover، يراجع الطلبات.

### Support Agent
بيتعامل مع الشكاوى، الإرجاع، مشاكل الشحن.

### System Admin
يربط Shopify/Evolution/Meta، يدير credentials، roles، webhooks.

### Customer
عميلة بتكلم البراند على واتساب أو إنستجرام وتسأل وتشتري.

## 4. Core User Stories

### US-001 — Product Discovery
كعميلة، لما أقول "عايزة بيجامات شتوي"، البوت يعرض منتجات مناسبة بالصور والأسعار والمقاسات المتاحة.

Acceptance:
- يعرض فقط منتجات in stock.
- لا يزيد عن max_product_photos.
- كل منتج له رقم واضح.
- كل منتج محفوظ في product mapping.
- الرد بعد الصور يطلب رقم المنتج + المقاس.

### US-002 — Product Selection
كعميلة، لما أقول "رقم 2 مقاس XL"، البوت يعرف المنتج الصحيح من آخر بحث.

Acceptance:
- يستخرج index=2 وsize=XL.
- يقرأ mapping الخاص بنفس conversation/customer.
- يراجع المخزون live/cache.
- لو المقاس متاح: ينتقل لجمع بيانات الأوردر.
- لو غير متاح: يعتذر ويقترح بديل ويعرض notify back-in-stock.

### US-003 — Order Confirmation
كعميلة، قبل إنشاء الأوردر، أشوف ملخص واضح وأأكد.

Acceptance:
- الملخص يحتوي المنتج، المقاس، الكمية، السعر، الشحن، الإجمالي، الاسم، الموبايل، العنوان.
- لا يتم إنشاء order إلا بعد تأكيد صريح: "أيوه أكدي"، "تمام"، "اعملي الأوردر".
- لو الرسالة ambiguous، يسأل مرة واحدة.

### US-004 — COD Order Creation
كـ Store، عايز الأوردر يتسجل في Shopify مباشرة COD.

Acceptance:
- order created with correct variant_id and quantity.
- phone from WhatsApp unless customer provided another phone.
- tags include `YoulyaAI`.
- note includes `Made By AI`.
- response contains real order name only after Shopify success.
- if Shopify fails, no fake order number is sent.

### US-005 — Human Handoff
كعميلة، لو عندي مشكلة معقدة، البوت يحولني لإنسان.

Triggers:
- "كلميني حد"
- "عايزة خدمة العملاء"
- شكوى بعد الاستلام
- مشكلة دفع/شحن
- سؤال غير مفهوم 3 مرات
- غضب شديد/شتيمة
- API failure in critical action

Acceptance:
- ticket created.
- AI stops auto-actions or switches to supervised mode.
- admin notification sent.
- customer receives short handoff message.

## 5. Functional Requirements

### Messaging
FR-001: System must accept text, voice, and image messages.
FR-002: Voice must be transcribed and processed in detected language.
FR-003: Image must be analyzed only for context; no identity recognition.
FR-004: Messages must be normalized to a common event schema.
FR-005: `testMode=true` must execute test-safe behavior with no live side effects (no live Shopify order mutation, no live Evolution sends).

### Language and Tone
FR-010: System must detect customer language.
FR-011: System must reply in same language unless brand setting overrides.
FR-012: Arabic replies should be Egyptian Arabic by default for Youlya.
FR-013: System must detect tone: angry, urgent, confused, purchase-ready, browsing.
FR-014: Angry/complaint tone must increase handoff priority.

### Product Search
FR-020: Search must use synced product cache, not raw AI memory.
FR-021: Search must support Arabic, English, Arabizi, typo tolerance, synonyms.
FR-022: Search must filter out variants with zero inventory.
FR-023: Search must score results by query match, inventory, recency, sales rank, promotion.
FR-024: Search must return structured product/variant data.
FR-025: System must store shown products per conversation.

### Product Display
FR-030: System must send up to 10 product images.
FR-031: Caption must include product number, title, price, available sizes, optional link.
FR-032: The captions must be RTL-friendly for Arabic.
FR-033: System must throttle image sending with delay to avoid channel rate issues.
FR-034: If media sending fails, system must fallback to text summary + link.

### Cart and Order
FR-040: System must maintain conversation cart.
FR-041: Cart item must reference exact variant_id.
FR-042: Before order confirmation, inventory must be rechecked.
FR-043: Shipping must be calculated by configurable store rules.
FR-044: Free shipping threshold must be configurable.
FR-045: Order must not be created without explicit confirmation.
FR-046: Idempotency key must prevent duplicate orders from repeated messages.
FR-047: Shopify order result must be persisted locally.

### Order Management
FR-050: Cancel request must add tag `Canceled By Youlya AI`, not necessarily cancel Shopify order.
FR-051: Update address/phone is allowed before shipping.
FR-052: Update product/size/quantity must follow Shopify capability + store policy.
FR-053: If update cannot be done safely, system must handoff.
FR-054: Order status inquiry must use phone/order id and protect customer privacy.

### Post-Sale
FR-060: System should send confirmation follow-up.
FR-061: System should support shipping status messages.
FR-062: System should ask for feedback after delivery when status integration is available.
FR-063: System should detect return/refund requests and apply policy.

### Dashboard
FR-070: Dashboard must support Arabic RTL and English LTR.
FR-071: Dashboard must support light/dark/auto.
FR-072: Dashboard must include role-based access.
FR-073: Dashboard must show conversations, orders, products, AI settings, reports, channels.
FR-074: Prompt updates must use draft/test/publish flow.
FR-075: Dashboard must export reports PDF/PNG/JPG/CSV.

### RAG and Learning
FR-080: Knowledge base must include policies, FAQs, product guides, old team conversations.
FR-081: Retrieval must be store-scoped.
FR-082: Self-learning must be approval-based.
FR-083: AI must not learn automatically from unreviewed support replies.
FR-084: Learning suggestions must include source conversation and expected benefit.

### Observability
FR-090: Every inbound/outbound message must be logged.
FR-091: Every AI tool call must be logged with input summary, output summary, status, latency.
FR-092: Errors must create issue records.
FR-093: Critical errors must notify admins.
FR-094: Dashboard must show health of Shopify, Evolution, Meta, Email, n8n, DB.

## 6. Non-Functional Requirements

NFR-001: p95 text response under 5 seconds for non-product queries.
NFR-002: product search under 800ms from cache.
NFR-003: media sending should be async/sequential with queue.
NFR-004: system must handle duplicate webhooks idempotently.
NFR-005: system must support tenant isolation.
NFR-006: secrets must never be committed or exposed client-side.
NFR-007: all customer PII must be protected by RLS and role access.
NFR-008: dashboards must meet WCAG 2.2 AA.
NFR-009: UI strings must be i18n-ready.
NFR-010: all critical mutations must write audit logs.
NFR-011: all integrations must have retry policy and dead-letter/error queue.

## 7. Canonical Message Event Schema

```json
{
  "event_id": "uuid",
  "store_id": "uuid",
  "channel": "whatsapp_evolution",
  "provider_message_id": "string",
  "customer": {
    "id": "uuid",
    "external_id": "2010xxxxxxx@s.whatsapp.net",
    "phone": "2010xxxxxxx",
    "name": "optional"
  },
  "message": {
    "type": "text|voice|image|document",
    "text": "normalized text",
    "language": "ar-EG",
    "tone": "neutral|angry|urgent|happy|confused|ready_to_buy",
    "attachments": []
  },
  "metadata": {
    "instance_name": "Youlya",
    "raw_payload_hash": "sha256"
  },
  "received_at": "iso"
}
```

## 8. Database Model — Required Tables

### stores
- id
- name
- slug
- default_locale
- timezone
- ai_enabled
- kill_switch_enabled
- free_shipping_threshold
- created_at

### store_integrations
- id
- store_id
- provider: shopify/evolution/meta/email/openai
- status
- credentials_ref
- last_success_at
- last_error
- created_at

### customers
- id
- store_id
- phone
- email
- name
- locale
- tags
- last_seen_at

### conversations
- id
- store_id
- customer_id
- channel
- status: ai_active/human/handoff/closed
- last_intent
- unclear_count
- sentiment
- assigned_user_id
- created_at
- updated_at

### messages
- id
- store_id
- conversation_id
- direction: inbound/outbound
- role: customer/ai/human/system
- message_type
- content
- provider_message_id
- status
- metadata_json
- created_at

### products
- id
- store_id
- shopify_product_id
- title
- title_ar
- product_type
- vendor
- status
- image_url
- description
- keywords
- tags
- updated_at

### product_variants
- id
- store_id
- product_id
- shopify_variant_id
- sku
- size
- color
- price
- compare_at_price
- inventory_quantity
- inventory_policy
- updated_at

### last_product_recommendations
- id
- store_id
- conversation_id
- customer_id
- search_id
- index
- product_id
- variant_id
- displayed_title
- displayed_size_options
- displayed_price
- inventory_at_show_time
- image_url
- expires_at
- created_at

### carts
- id
- store_id
- conversation_id
- status
- subtotal
- shipping_fee
- total
- confirmation_state
- idempotency_key
- created_at
- updated_at

### cart_items
- id
- cart_id
- product_id
- variant_id
- display_index
- quantity
- price_snapshot
- size
- color

### orders
- id
- store_id
- conversation_id
- customer_id
- shopify_order_id
- shopify_order_name
- status
- total
- tags
- source
- created_by_ai
- created_at

### ai_tool_calls
- id
- store_id
- conversation_id
- tool_name
- input_summary
- output_summary
- status
- latency_ms
- error_code
- error_message
- created_at

### handoff_tickets
- id
- store_id
- conversation_id
- reason
- priority
- status
- assigned_user_id
- ai_summary
- created_at
- closed_at

### knowledge_documents
- id
- store_id
- type: policy/faq/product_guide/conversation_learning
- title
- content
- status: draft/approved/rejected
- embedding_ref
- source_ref
- created_at

### prompt_versions
- id
- store_id
- name
- prompt
- status: draft/testing/published/archived
- created_by
- published_at
- created_at

### audit_logs
- id
- store_id
- actor_type
- actor_id
- action
- resource_type
- resource_id
- before_json
- after_json
- ip
- created_at

## 9. API Surface

### Internal n8n → App
- `POST /api/internal/messages/turn`
- `POST /api/internal/media/transcribe`
- `POST /api/internal/media/analyze-image`
- `POST /api/internal/channels/send`
- `POST /api/internal/errors/n8n`

### AI Commerce
- `POST /api/ai/turn`
- `POST /api/ai/tools/product-search`
- `POST /api/ai/tools/select-product`
- `POST /api/ai/tools/calculate-shipping`
- `POST /api/ai/tools/confirm-order`
- `POST /api/ai/tools/create-shopify-order`
- `POST /api/ai/tools/update-order`
- `POST /api/ai/tools/cancel-order-tag`
- `POST /api/ai/tools/handoff`

### Dashboard
- `GET /api/dashboard/overview`
- `GET /api/dashboard/conversations`
- `GET /api/dashboard/orders`
- `GET /api/dashboard/products`
- `POST /api/dashboard/settings/ai`
- `POST /api/dashboard/settings/channels`
- `POST /api/dashboard/reports/export`

### Integrations
- `POST /api/integrations/shopify/sync`
- `POST /api/integrations/shopify/webhooks`
- `POST /api/integrations/evolution/connect`
- `POST /api/integrations/evolution/webhook`
- `POST /api/integrations/meta/webhook`
- `POST /api/integrations/email/inbound`

## 10. State Machines

### Conversation State
```text
new
→ ai_active
→ product_browsing
→ cart_building
→ awaiting_customer_data
→ awaiting_order_confirmation
→ order_created
→ post_sale_followup
→ closed

Any state → handoff_requested → human_active → ai_active/closed
Any state → error_hold → human_active
```

### Order State
```text
draft_cart
→ awaiting_confirmation
→ confirmed_by_customer
→ creating_shopify_order
→ shopify_order_created
→ fulfillment_pending
→ shipped
→ delivered
→ issue_reported
→ closed
```

## 11. AI Tool Contracts

### product_search
Input:
```json
{
  "store_id": "uuid",
  "conversation_id": "uuid",
  "query": "بيجامات شتوي XL",
  "limit": 10,
  "locale": "ar-EG"
}
```

Output:
```json
{
  "search_id": "uuid",
  "products": [
    {
      "index": 1,
      "product_id": "uuid",
      "title": "بيجامة شتوي",
      "image_url": "https://...",
      "price": 950,
      "sizes": [
        {"size": "L", "variant_id": "gid://shopify/ProductVariant/...", "inventory": 5}
      ]
    }
  ],
  "message_to_customer": "شوفي الموديلات وقوليلي رقم الموديل + المقاس 💜"
}
```

### select_product
Input:
```json
{
  "conversation_id": "uuid",
  "customer_text": "رقم 2 مقاس XL"
}
```
Output:
```json
{
  "found": true,
  "product_id": "uuid",
  "variant_id": "gid://shopify/ProductVariant/...",
  "quantity": 1,
  "stock_status": "available",
  "next_required_fields": ["full_name", "city", "address"]
}
```

### create_order
Must require:
- confirmed product/variant.
- quantity.
- customer full name.
- phone.
- address.
- shipping fee.
- total.
- explicit confirmation.
- idempotency key.

## 12. Acceptance Gates

### Gate A — Product Flow
- 20 search scenarios pass.
- 10 product images max.
- every product has index.
- mapping persisted.
- selection by index+size works.
- out-of-stock handled.

### Gate B — Order Flow
- no order without confirmation.
- duplicate confirmation does not duplicate order.
- Shopify failure does not send fake order id.
- created order has correct tags/note.

### Gate C — Support Flow
- cancel tag applied.
- update address works before shipping.
- human handoff works.
- unclear count handoff after 3.

### Gate D — Dashboard
- login works.
- overview loads.
- inbox loads.
- order timeline loads.
- AI settings draft/test/publish works.
- dark/light/auto works.
- AR/EN switch works.

### Gate E — Production
- all secrets in env/credentials.
- webhook signatures/secret validation.
- RLS enabled.
- audit logs on mutations.
- Playwright tests pass.
- human QA checklist signed.
