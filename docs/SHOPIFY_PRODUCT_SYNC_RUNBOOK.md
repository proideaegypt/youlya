# Shopify Product Sync Runbook

> **Security**: Never print `SHOPIFY_ADMIN_API_TOKEN` or `SUPABASE_SERVICE_ROLE_KEY`.

---

## Why Shopify is Source of Truth

Youlya sells via WhatsApp AI. Shopify owns:
- Product catalog
- Variant inventory
- Pricing
- SKU/codes
- Orders

Supabase is the **operational cache**:
- AI queries Supabase cache (not Shopify directly)
- This reduces LLM token usage
- Ensures every product selection uses exact Shopify `product_id` and `variant_id`
- Product search returns max 10 indexed recommendations from cache

---

## Daily Sync Workflow

### n8n Workflow

File: `n8n/workflows/youlya-daily-shopify-product-sync.json`

- Trigger: Daily at 04:00 Africa/Cairo
- Action: POST `/api/internal/shopify/sync-products`
- Body: `{ store_id: "youlya", mode: "full", includeInventory: true, source: "n8n_daily_shopify_product_sync" }`
- On failure: Writes to dead-letter endpoint

### Import into n8n

1. Open n8n Editor
2. Import `n8n/workflows/youlya-daily-shopify-product-sync.json`
3. Activate workflow
4. Verify `APP_INTERNAL_URL` and `INTERNAL_API_SECRET` env vars in n8n

---

## Manual Sync Commands

### Dry run (safe, no data written)

```bash
npm run shopify:sync:dry-run
```

### Full sync (writes to Supabase)

```bash
npm run shopify:sync
```

### Inventory-only sync

```bash
npm run shopify:sync:inventory
```

### With custom store

```bash
node scripts/sync-shopify-products.mjs --mode full --store-id youlya
```

---

## Required Environment Variables

```text
SHOPIFY_STORE_DOMAIN
SHOPIFY_ADMIN_API_TOKEN
SHOPIFY_API_VERSION
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
INTERNAL_API_SECRET
APP_INTERNAL_URL
```

> Values configured in `.env.production`. Names only shown here.

---

## Quality Checks

After sync, verify:

```bash
npm run validate:n8n
```

Check Supabase cache counts (via dashboard or direct query):
- Products count
- Variants count
- Missing SKU count
- Last sync time

---

## Missing SKU Policy

- `code_missing = true` when SKU is blank/missing
- Variants with missing SKU are still synced but may not be `available_for_ai`
- Store setting `require_sku_for_ai_visibility` controls this
- Dashboard should warn about missing SKUs

---

## Product Search Contract

`POST /api/ai/tools/product-search`

Input:
```json
{
  "storeSlug": "youlya",
  "conversationId": "conv-123",
  "customerId": "cust-456",
  "query": "بيجامة",
  "limit": 10,
  "testMode": false
}
```

Output:
```json
{
  "recommendations": [
    {
      "index": 1,
      "productId": "uuid",
      "shopifyProductId": "gid://shopify/Product/123",
      "shopifyProductTitle": "بيجامة شتوي",
      "shopifyHandle": "winter-pajama",
      "imageUrl": "https://cdn.shopify.com/...",
      "variantOptions": [
        {
          "shopifyVariantId": "gid://shopify/ProductVariant/456",
          "sku": "YLY-PJ-BLK-M",
          "codeMissing": false,
          "title": "M / Black",
          "size": "M",
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

**Rules**:
- Max 10 recommendations
- Each includes exact Shopify variant ID
- SKU is present internally but hidden from customer-facing reply
- Selection uses `last_product_recommendations` mapping, not LLM memory

---

## Token Reduction

Before this sync:
- AI received full mock catalog (3 hardcoded products)
- No real Shopify data

After this sync:
- AI queries Supabase cache
- Returns only matching products (max 10)
- No full catalog in prompts
- Exact variant IDs prevent hallucination

---

## Debugging Sync Failures

1. Check env vars: `npm run check:n8n:env`
2. Run dry run: `npm run shopify:sync:dry-run`
3. Check Shopify API health: `curl -fsS https://admin.nex-lnk.online/api/health`
4. Check n8n execution logs for daily workflow
5. Check Supabase `products` and `product_variants` table counts
6. Check `dead_letter_log` for failure records

---

## Architecture

```
Shopify GraphQL API
    ↓
lib/adapters/shopify/shopify-product-sync-adapter.ts
    ↓
lib/services/shopify-product-sync-service.ts
    ↓
lib/adapters/supabase/product-sync-repository.ts
    ↓
Supabase (products + product_variants tables)
    ↓
lib/services/product-search-service.ts
    ↓
AI (max 10 recommendations with exact variant IDs)
```

---

## Safety Rules

- Never hardcode Shopify token in source or workflow JSON
- Never put product catalog in LLM prompts
- Never let AI invent product codes
- Never create Shopify orders using product name/SKU alone
- Always use exact Shopify variant ID for orders
- Do not delete Supabase production products unless explicitly approved
- Dry-run before every full sync
- Every mutation writes audit logs
