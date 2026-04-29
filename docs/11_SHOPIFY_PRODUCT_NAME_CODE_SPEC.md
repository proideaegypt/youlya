# Shopify Product Name + Code Spec

The user requirement is: **products must be shown and managed by Shopify name and Shopify code**.

This means the system must never invent product names or product codes. It must import them from Shopify.

## Source of truth

| Field | Source | Required | Notes |
|---|---|---:|---|
| Product name | Shopify Product `title` | yes | customer-facing name |
| Product handle | Shopify Product `handle` | yes | internal fallback/display/link |
| Product ID | Shopify Product GID/id | yes | canonical product identity |
| Variant ID | Shopify ProductVariant GID/id | yes | canonical order line identity |
| Product/variant code | Shopify Variant `sku` | preferred | canonical code for dashboard/audit |
| Barcode | Shopify Variant `barcode` | optional | secondary operational code |
| Size/color | Shopify selected options | yes when available | used for variant resolver |
| Price | Shopify variant price | yes | must be synced/rechecked |
| Inventory | Shopify inventory/available quantity | yes for AI visibility/order |
| Images | Shopify product/variant media | optional | max 10 displayable images per search |

## Product code policy

1. Use `variant.sku` as the canonical code.
2. If `variant.sku` is empty:
   - set `code_missing = true`;
   - use `product.handle` only as fallback internal display;
   - do **not** invent a product code;
   - show a dashboard warning: `Missing SKU/code`;
   - if store setting `require_sku_for_ai_visibility` is true, exclude the variant from AI recommendations.
3. Never use AI to generate product codes.
4. Never create Shopify orders using product name/code alone. Orders must use exact `shopify_variant_id`.

## Supabase cache fields

### `products`

```text
id
store_id
shopify_product_id
shopify_product_gid
shopify_title
shopify_handle
vendor
product_type
status
tags
image_url
ai_visible
created_at
updated_at
last_synced_at
```

### `product_variants`

```text
id
store_id
product_id
shopify_variant_id
shopify_variant_gid
shopify_product_id
sku
barcode
variant_title
option1_name
option1_value
option2_name
option2_value
option3_name
option3_value
size
color
price
currency
inventory_quantity
inventory_policy
available_for_ai
code_missing
last_inventory_checked_at
created_at
updated_at
last_synced_at
```

## Dashboard display rule

Product and order screens must show:

```text
Product name: Shopify title
Code: SKU if present, otherwise “Missing SKU”
Variant: size/color/title
Shopify link
AI visibility status
Inventory status
Last synced time
```

Example internal display:

```text
بيجامة شتوي أسود
Code/SKU: YLY-PJ-BLK-XL
Variant: XL / Black
Stock: 4
AI visible: Yes
```

If SKU is missing:

```text
روب قطن وردي
Code/SKU: Missing SKU
Fallback handle: cotton-robe-pink
AI visible: Warning or No, depending setting
```

## Customer-facing reply rule

The customer does not need to see SKU/code by default. The customer should see simple shopping choices:

```text
1. بيجامة شتوي أسود — المقاسات المتاحة L و XL — 950 EGP
2. روب قطن وردي — المقاسات المتاحة M و L — 850 EGP
```

The internal dashboard/order audit must store the code/SKU.

## Product search result contract

Every product search result must include:

```ts
type ProductRecommendation = {
  index: number;
  productId: string;
  shopifyProductId: string;
  shopifyProductTitle: string;
  shopifyHandle: string;
  variantOptions: Array<{
    shopifyVariantId: string;
    sku: string | null;
    codeMissing: boolean;
    title: string;
    size?: string;
    color?: string;
    price: number;
    currency: 'EGP';
    inventoryQuantity: number;
    available: boolean;
  }>;
  imageUrl?: string;
};
```

## Persisted mapping contract

When AI shows indexed products, save every displayed option in `last_product_recommendations`:

```text
conversation_id
customer_id
index
shopify_product_id
shopify_product_title
shopify_handle
shopify_variant_id
sku
code_missing
size
color
price
inventory_at_show_time
image_url
expires_at
```

When customer says `رقم 2 مقاس XL`, resolve from this table, not from LLM memory.

## Shopify sync requirements

Minimum sync jobs:

```text
Full product/variant sync on demand
Scheduled sync every day
Optional inventory sync hourly
Webhook-based update later
```

Recommended webhook topics later:

```text
products/create
products/update
products/delete
inventory_levels/update
orders/create
orders/updated
```

## Import/export template

The starter CSV template is in:

```text
docs/data/shopify_product_import_template.csv
```

It is only a fallback for manual bootstrapping. Real production sync must use Shopify API or verified Shopify export.

## Quality checks

Before production:

```text
No duplicate shopify_variant_id
No duplicate SKU unless explicitly allowed by Shopify/store policy
Every AI-visible variant has price and inventory
Every orderable item has shopify_variant_id
Missing SKU variants are visible in dashboard warning report
Product cache count matches Shopify count within accepted tolerance
```
