# Day 2 - Data Integrity

## Goal

Make sure product, variant, inventory, and order truth stays anchored in Shopify and the app cache, not in the AI layer.

## Current alignment

- Shopify is the source of truth.
- Supabase is the cache/state layer.
- The product sync path already exists.
- Read-only sync proof has passed.
- Daily product sync exists in the repo.
- Current DB state should be treated as authoritative for whether products/variants are synced or only sync-ready.

## Required rules

- Product name comes from Shopify `title`.
- Product code comes from Shopify variant `sku`.
- Variant ID is the only order-line identity that matters.
- Do not invent product names, codes, prices, or stock.
- If SKU is missing, mark it missing and do not fabricate one.
- Do not let AI memory resolve product numbers like `رقم 1`; use persisted mapping and the app cache.

## Safe current-state language

- Products and variants are sync-ready or synced according to the current cache state.
- The pilot must not assume clean data unless the sync proof says so.
- Any missing SKU or inventory uncertainty must block order creation.

## Data checks to preserve

- Persist last recommendations.
- Resolve product selection from persisted mapping, not memory.
- Recheck stock before final confirmation.
- Keep idempotency keys for confirmation and order creation.
