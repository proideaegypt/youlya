# Prompt 06 — Shopify Product Name + Code Sync

Run this after Phase 0 scaffold exists and before production live. Do not invent product names or codes.

## Goal
Import/sync real Youlya products from Shopify so the app can search by Shopify title and audit by Shopify SKU/code.

## Read first

1. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
2. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
3. `docs/13_API_AND_STATE_CONTRACTS.md`
4. `.env.example`

## Source of truth

```text
Product name = Shopify product title
Product code = Shopify variant SKU
Variant identity = Shopify variant ID/GID
Order line item = Shopify variant ID, never product name alone
```

## Implement

1. Add Shopify product sync service.
2. Add `ShopifyProductSyncAdapter` interface.
3. Add mock adapter for tests.
4. Add live adapter using Shopify Admin GraphQL only when env and flags allow.
5. Persist products and variants to Supabase cache.
6. Track missing SKU with `code_missing=true`.
7. Add dashboard/report query for missing SKU variants.
8. Ensure AI product search excludes missing-SKU variants when `require_sku_for_ai_visibility=true`.
9. Add a script/route to run manual sync safely.
10. Add validation using `scripts/validate-shopify-products.mjs` for CSV/export fallback.

## Shopify GraphQL fields to fetch

```graphql
products(first: $first, after: $after) {
  pageInfo { hasNextPage endCursor }
  nodes {
    id
    title
    handle
    vendor
    productType
    status
    tags
    featuredMedia {
      ... on MediaImage { image { url altText } }
    }
    variants(first: 100) {
      nodes {
        id
        title
        sku
        barcode
        price
        compareAtPrice
        inventoryQuantity
        inventoryPolicy
        selectedOptions { name value }
      }
    }
  }
}
```

If Shopify schema differs, check current Shopify docs/MCP before coding.

## Tests

Add tests for:

```text
product with SKU becomes AI visible
product without SKU gets code_missing=true
duplicate variant ID fails validation
variant ID required for orderable items
Shopify sync does not expose access token
product search returns Shopify title + SKU metadata internally
```

## Acceptance

```text
Real Shopify product names/codes are imported from Shopify API or verified export
No invented product codes
Every orderable item has Shopify variant ID
Missing SKU is visible as warning
Product cache can power product search
```
