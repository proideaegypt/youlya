name: youlya-shopify-product-sync
description: Enforces Shopify-only product identity, naming, SKU/code, and variant mapping rules.
when_to_use: Use for product sync, product cache import, recommendation mapping, and order line validation.
required_reads:
- docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md
- docs/13_API_AND_STATE_CONTRACTS.md
- MEMORY.md
allowed_actions:
- Validate title/SKU/variant mapping from Shopify data.
- Validate persisted last_product_recommendations integrity.
- Report SKU/code gaps without inventing values.
forbidden_actions:
- Invent product names or SKUs.
- Use title as unique identity.
- Use AI memory for product selection.
- Run Shopify writes without explicit approval.
- Log Shopify tokens.
checklist:
- Product name from Shopify title.
- Product code from Shopify variant SKU.
- Product identity from Shopify product ID/GID.
- Variant identity from Shopify variant ID/GID.
- Order line items use variant IDs.
- Displayed index persisted in last_product_recommendations.
final_output: |
  STATUS: PASS / FAIL / PARTIAL
  PRODUCT_SOURCE:
  PRODUCT_COUNT:
  VARIANT_COUNT:
  SKU_ISSUES:
  MAPPING_STATUS:
  BLOCKERS:

