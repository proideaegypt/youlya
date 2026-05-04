# RESULT — activate-n8n-daily-shopify-product-sync

Date: 2026-05-03
Task: activate-n8n-daily-shopify-product-sync

## Step 0 — Precheck

- `curl https://admin.youlya365.com/api/health` → ok, version 2.6.10
- `curl https://admin.youlya365.com/api/build-info` → version 2.6.10
- `npm run shopify:assert-readonly` → PASS
- `npm run validate:n8n` → PASS
- n8n container env: APP_INTERNAL_URL=SET, INTERNAL_API_SECRET=SET

## Step 1 — Confirm Target Workflow

- Workflow ID: H7l8PiCss9ZeqGug
- Name: Youlya Daily Shopify Product Sync
- Active before: false
- Calls: `{{$env.APP_INTERNAL_URL}}/api/internal/shopify/sync-products`
- Uses header: `x-internal-secret: {{$env.INTERNAL_API_SECRET}}`
- Contains Shopify secrets: NO
- Calls Shopify directly: NO
- Calls order creation endpoints: NO

## Step 2 — Backup Workflow

- Backup saved to: `qa-artifacts/tasks/2026-05-03/activate-n8n-daily-shopify-product-sync/backup-youlya-daily-shopify-product-sync.json`
- Backup sanitized: credential values redacted

## Step 3 — Activate Workflow

- Activation: POST /api/v1/workflows/H7l8PiCss9ZeqGug/activate
- Active after: true
- Re-confirmed via GET /api/v1/workflows/H7l8PiCss9ZeqGug: active=true

## Step 4 — Connection Fix

**Issue discovered:** The workflow's "Check Success" IF node had backwards connections:
- TRUE (success) branch → Dead Letter (wrong)
- FALSE (failure) branch → empty (wrong)

**Fix applied:**
- TRUE (success) branch → empty (no action)
- FALSE (failure) branch → Dead Letter

This fix was applied via n8n API PUT and canonical JSON in repo updated.

**Manual execution:** Not supported via n8n API (POST /execute returns 405). Internal sync endpoint tested directly and confirmed working (200 OK, 252 products, 1082 variants synced in 6165ms).

## Step 5 — Post-Activation DB Check

Store UUID: ef77af08-688d-4354-8096-d89f6046f0c2

| Metric | Count |
|---|---|
| products | 252 |
| product_variants | 1082 |
| missing_skus | 461 |
| unavailable_variants | 508 |
| available_variants | 574 |
| available_for_ai | 240 |
| max_last_synced_at | 2026-05-03T19:31:15.538+00:00 |

## Step 6 — Documentation

- Workflow ID: H7l8PiCss9ZeqGug
- Active status before: false
- Active status after: true
- Backup path: `qa-artifacts/tasks/2026-05-03/activate-n8n-daily-shopify-product-sync/backup-youlya-daily-shopify-product-sync.json`
- Manual execution: Not run via n8n API (405). Direct internal endpoint test confirmed sync works.
- Next scheduled run: Daily at 04:00 (triggerAtHour: 4)
- Risks: Previous execution (ID 9281) showed "error" status due to backwards IF connections. This has been fixed.

## Step 7 — Verification & Release

- npm run typecheck: PASS
- npm run lint: PASS (0 errors)
- npm test: PASS (58/58)
- npm run validate:scenarios: PASS (104 total)
- npm run scan:secrets: PASS
- npm run verify:release: PASS (v2.7.1)
- npm run verify:deploy: TIMEOUT at docker-compose-build (known infrastructure issue with script I/O redirection)
- Docker compose build: ATTEMPTED but timed out due to network/socket issues during build
- Live app remains at v2.6.10, healthy and functional

## Step 8 — Final Summary

- n8n daily Shopify product sync workflow is now active.
- Workflow calls internal `/api/internal/shopify/sync-products` endpoint only.
- No Shopify mutation, no order creation.
- Schedule: daily at 4:00 AM.
- Dead Letter routing fixed so only failures are reported.
- Deployment of v2.7.1 not completed due to Docker build timeout; app code changes are saved and ready for next deploy window.
