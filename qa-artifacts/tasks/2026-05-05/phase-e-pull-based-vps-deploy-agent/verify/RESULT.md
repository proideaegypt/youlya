# Verify Before Deploy

- Date: 2026-05-05
- Branch: main
- Commit: b5ac014

Running: check-env-tracking

> youlya-phase0-app@2.20.0 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.20.0 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.20.0 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.20.0 lint
> eslint .


/root/youlya/app/dashboard/products-intelligence/page.tsx
  231:15  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
  454:21  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/root/youlya/app/dashboard/products/page.tsx
  306:25  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/root/youlya/lib/adapters/shopify/live-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used    @typescript-eslint/no-unused-vars
  9:24  warning  '_payload' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/shopify/mock-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/supabase/product-mapping-repository.ts
  1:15  warning  'ProductRecommendation' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/_tmp-check-tables.ts
  18:14  warning  'e' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/auto-release.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/scripts/test-product-search-and-selection.ts
  32:9  warning  'missingSkuHidden' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/update-readme.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/tests/unit/supabase-browser-client.test.ts
  3:40  warning  '_url' is defined but never used  @typescript-eslint/no-unused-vars
  3:54  warning  '_key' is defined but never used  @typescript-eslint/no-unused-vars

✖ 13 problems (0 errors, 13 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.20.0 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/auth-middleware.test.ts (7 tests) 35ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1014ms
   ✓ evolution client > sendText 429 retries then resolves  1003ms
stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"أكيد، دي شوية اختيارات مناسبة: 1) بيجامة شتوي أسود • 2) روب قطن وردي • 3) بوركيني أسود\n\nاختار المنتج اللي عايزه وابعتلي رقمه والمقاس."}

stdout | tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام، الأوردر اتأكد بنجاح."}

stdout | tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"الخدمة متوقفة مؤقتاً، بنرجع قريب."}

 ✓ tests/api/message-turn.test.ts (6 tests) 49ms
stdout | tests/integration/message-turn.test.ts > message turn integration > explicit customer service request -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.\nتم تسجيل الطلب، وسيتواصل معاكي حد من الفريق."}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit manager request -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.\nتم تسجيل الطلب، وسيتواصل معاكي حد من الفريق."}

stdout | tests/integration/message-turn.test.ts > message turn integration > greeting and unclear messages do not handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"ممكن توضحي أكثر؟"}

 ✓ tests/integration/message-turn.test.ts (6 tests) 69ms
 ✓ tests/unit/shipping.test.ts (2 tests) 16ms
 ✓ tests/unit/root-page.test.ts (1 test) 35ms
 ✓ tests/integration/message-turn-evolution.test.ts (3 tests) 25ms
 ✓ tests/unit/message-history-service.test.ts (11 tests) 69ms
 ✓ tests/unit/handoff-center.test.ts (12 tests) 29ms
 ✓ tests/unit/shopify-order-service.test.ts (10 tests) 27ms
 ✓ tests/unit/haidi-agent.test.ts (21 tests) 29ms
 ✓ tests/unit/products-intelligence-service.test.ts (33 tests) 43ms
 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 35ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 23ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 46ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 11ms
 ✓ tests/unit/select-product.test.ts (13 tests) 13ms
 ✓ tests/unit/haidi-prompt-service.test.ts (4 tests) 21ms
 ✓ tests/unit/haidi-settings-service.test.ts (6 tests) 20ms
 ✓ tests/unit/handoff-policy-service.test.ts (13 tests) 19ms
 ✓ tests/unit/knowledge-base-service.test.ts (3 tests) 19ms
 ✓ tests/unit/haidi-lab-service.test.ts (3 tests) 23ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 5ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 15ms
 ✓ tests/unit/handoff-service.test.ts (5 tests) 8ms

 Test Files  25 passed (25)
      Tests  184 passed (184)
   Start at  19:41:50
   Duration  7.00s (transform 1.44s, setup 0ms, collect 5.59s, tests 1.70s, environment 10ms, prepare 4.25s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.20.0 validate:scenarios
> node scripts/validate-scenarios.mjs

Scenario validation passed.
{
  "total": 104,
  "counts": {
    "CONV": 94,
    "DASH": 10
  }
}
PASS: validate-scenarios
Running: scan-secrets

> youlya-phase0-app@2.20.0 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.20.0 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.20.0
- versionName: simplify-human-handoff-and-add-records-filters-exports
- releaseFile: RELEASES/v2.20.0-simplify-human-handoff-and-add-records-filters-exports.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.20.0 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.20.0 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
⚠ Compiled with warnings in 10.6s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

✓ Compiled successfully in 16.4s
  Running TypeScript ...
  Finished TypeScript in 19.3s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/66) ...
  Generating static pages using 3 workers (16/66) 
  Generating static pages using 3 workers (32/66) 
  Generating static pages using 3 workers (49/66) 
✓ Generating static pages using 3 workers (66/66) in 899ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/admin/handoffs
├ ƒ /api/admin/settings
├ ƒ /api/ai/rag/retrieve
├ ƒ /api/ai/tools/calculate-shipping
├ ƒ /api/ai/tools/confirm-order
├ ƒ /api/ai/tools/create-shopify-order
├ ƒ /api/ai/tools/handoff
├ ƒ /api/ai/tools/product-search
├ ƒ /api/ai/tools/select-product
├ ƒ /api/build-info
├ ƒ /api/dashboard/conversations
├ ƒ /api/dashboard/conversations/[id]
├ ƒ /api/dashboard/conversations/[id]/actions
├ ƒ /api/dashboard/conversations/[id]/timeline
├ ƒ /api/dashboard/haidi-settings
├ ƒ /api/dashboard/haidi/lab
├ ƒ /api/dashboard/haidi/lab/[id]
├ ƒ /api/dashboard/haidi/lab/run
├ ƒ /api/dashboard/haidi/learning
├ ƒ /api/dashboard/haidi/prompt
├ ƒ /api/dashboard/haidi/settings
├ ƒ /api/dashboard/handoff
├ ƒ /api/dashboard/handoff/[id]/assign
├ ƒ /api/dashboard/handoff/[id]/note
├ ƒ /api/dashboard/handoff/[id]/resolve
├ ƒ /api/dashboard/handoff/[id]/return-to-ai
├ ƒ /api/dashboard/knowledge-base
├ ƒ /api/dashboard/logs
├ ƒ /api/dashboard/notifications
├ ƒ /api/dashboard/orders
├ ƒ /api/dashboard/pilot-control
├ ƒ /api/dashboard/pilot/actions
├ ƒ /api/dashboard/products-intelligence/channels
├ ƒ /api/dashboard/products-intelligence/overview
├ ƒ /api/dashboard/products-intelligence/product/[id]
├ ƒ /api/dashboard/products-intelligence/products
├ ƒ /api/dashboard/products/catalog
├ ƒ /api/dashboard/products/mapping-inspector
├ ƒ /api/dashboard/products/overview
├ ƒ /api/dashboard/products/search-qa
├ ƒ /api/dashboard/products/sync-health
├ ƒ /api/dashboard/products/variants
├ ƒ /api/dashboard/settings
├ ƒ /api/dashboard/stats
├ ƒ /api/health
├ ƒ /api/internal/failed-events
├ ƒ /api/internal/messages/turn
├ ƒ /api/internal/shopify/sync-products
├ ƒ /api/webhooks/evolution
├ ƒ /dashboard
├ ƒ /dashboard/command-center
├ ƒ /dashboard/conversations
├ ƒ /dashboard/devices
├ ƒ /dashboard/haidi/lab
├ ƒ /dashboard/haidi/learning
├ ƒ /dashboard/haidi/settings
├ ƒ /dashboard/handoff
├ ƒ /dashboard/inbox
├ ƒ /dashboard/knowledge-base
├ ƒ /dashboard/logs
├ ƒ /dashboard/messages
├ ƒ /dashboard/orders
├ ƒ /dashboard/orders/[id]/safety
├ ƒ /dashboard/pilot
├ ƒ /dashboard/pilot-control
├ ƒ /dashboard/products
├ ƒ /dashboard/products-intelligence
├ ƒ /dashboard/profile
├ ƒ /dashboard/security
├ ƒ /dashboard/settings
├ ƒ /dashboard/statistics
└ ○ /login


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

PASS: build
Running: docker-compose-config
PASS: docker-compose-config
Running: docker-compose-build
 Image youlya-youlya-app Building 
#1 [internal] load local bake definitions
#1 reading from stdin 490B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 539B 0.0s done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.6s

#4 [internal] load .dockerignore
#4 transferring context: 217B done
#4 DONE 0.0s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 161.82kB 2.1s done
#6 DONE 2.1s

#7 [builder 3/6] COPY package*.json ./
#7 CACHED

#8 [builder 2/6] WORKDIR /app
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 0.7s

#11 [builder 6/6] RUN npm run build
#11 0.773 
#11 0.773 > youlya-phase0-app@2.20.0 build
#11 0.773 > npm run build:info && next build --webpack
#11 0.773 
#11 1.033 
#11 1.033 > youlya-phase0-app@2.20.0 build:info
#11 1.033 > node scripts/write-build-info.mjs
#11 1.033 
#11 1.143 build info written: /app/public/build-info.json
#11 2.261 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 2.261 This information is used to shape Next.js' roadmap and prioritize features.
#11 2.261 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 2.261 https://nextjs.org/telemetry
#11 2.261 
#11 2.302 ▲ Next.js 16.2.4 (webpack)
#11 2.302 - Environments: .env.local, .env.production
#11 2.302 
#11 2.419 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 2.530   Creating an optimized production build ...
#11 43.00 ⚠ Compiled with warnings in 38.6s
#11 43.00 
#11 43.00 ./app/api/health/route.ts
#11 43.00 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 43.00 
#11 43.00 Import trace for requested module:
#11 43.00 ./app/api/health/route.ts
#11 43.00 
#11 50.10 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 76.48 ✓ Compiled successfully in 68s
#11 76.50   Running TypeScript ...
#11 108.4   Finished TypeScript in 31.9s ...
#11 108.5   Collecting page data using 3 workers ...
#11 120.4   Generating static pages using 3 workers (0/66) ...
#11 122.1   Generating static pages using 3 workers (16/66) 
#11 122.5   Generating static pages using 3 workers (32/66) 
#11 122.7   Generating static pages using 3 workers (49/66) 
#11 124.2 ✓ Generating static pages using 3 workers (66/66) in 3.7s
#11 126.6   Finalizing page optimization ...
#11 126.6   Collecting build traces ...
#11 165.8 
#11 165.8 Route (app)
#11 165.8 ┌ ○ /
#11 165.8 ├ ○ /_not-found
#11 165.8 ├ ƒ /api/admin/handoffs
#11 165.8 ├ ƒ /api/admin/settings
#11 165.8 ├ ƒ /api/ai/rag/retrieve
#11 165.8 ├ ƒ /api/ai/tools/calculate-shipping
#11 165.8 ├ ƒ /api/ai/tools/confirm-order
#11 165.8 ├ ƒ /api/ai/tools/create-shopify-order
#11 165.8 ├ ƒ /api/ai/tools/handoff
#11 165.8 ├ ƒ /api/ai/tools/product-search
#11 165.8 ├ ƒ /api/ai/tools/select-product
#11 165.8 ├ ƒ /api/build-info
#11 165.8 ├ ƒ /api/dashboard/conversations
#11 165.8 ├ ƒ /api/dashboard/conversations/[id]
#11 165.8 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 165.8 ├ ƒ /api/dashboard/conversations/[id]/timeline
#11 165.8 ├ ƒ /api/dashboard/haidi-settings
#11 165.8 ├ ƒ /api/dashboard/haidi/lab
#11 165.8 ├ ƒ /api/dashboard/haidi/lab/[id]
#11 165.8 ├ ƒ /api/dashboard/haidi/lab/run
#11 165.8 ├ ƒ /api/dashboard/haidi/learning
#11 165.8 ├ ƒ /api/dashboard/haidi/prompt
#11 165.8 ├ ƒ /api/dashboard/haidi/settings
#11 165.8 ├ ƒ /api/dashboard/handoff
#11 165.8 ├ ƒ /api/dashboard/handoff/[id]/assign
#11 165.8 ├ ƒ /api/dashboard/handoff/[id]/note
#11 165.8 ├ ƒ /api/dashboard/handoff/[id]/resolve
#11 165.8 ├ ƒ /api/dashboard/handoff/[id]/return-to-ai
#11 165.8 ├ ƒ /api/dashboard/knowledge-base
#11 165.8 ├ ƒ /api/dashboard/logs
#11 165.8 ├ ƒ /api/dashboard/notifications
#11 165.8 ├ ƒ /api/dashboard/orders
#11 165.8 ├ ƒ /api/dashboard/pilot-control
#11 165.8 ├ ƒ /api/dashboard/pilot/actions
#11 165.8 ├ ƒ /api/dashboard/products-intelligence/channels
#11 165.8 ├ ƒ /api/dashboard/products-intelligence/overview
#11 165.8 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 165.8 ├ ƒ /api/dashboard/products-intelligence/products
#11 165.8 ├ ƒ /api/dashboard/products/catalog
#11 165.8 ├ ƒ /api/dashboard/products/mapping-inspector
#11 165.8 ├ ƒ /api/dashboard/products/overview
#11 165.8 ├ ƒ /api/dashboard/products/search-qa
#11 165.8 ├ ƒ /api/dashboard/products/sync-health
#11 165.8 ├ ƒ /api/dashboard/products/variants
#11 165.8 ├ ƒ /api/dashboard/settings
#11 165.8 ├ ƒ /api/dashboard/stats
#11 165.8 ├ ƒ /api/health
#11 165.8 ├ ƒ /api/internal/failed-events
#11 165.8 ├ ƒ /api/internal/messages/turn
#11 165.8 ├ ƒ /api/internal/shopify/sync-products
#11 165.8 ├ ƒ /api/webhooks/evolution
#11 165.8 ├ ƒ /dashboard
#11 165.8 ├ ƒ /dashboard/command-center
#11 165.8 ├ ƒ /dashboard/conversations
#11 165.8 ├ ƒ /dashboard/devices
#11 165.8 ├ ƒ /dashboard/haidi/lab
#11 165.8 ├ ƒ /dashboard/haidi/learning
#11 165.8 ├ ƒ /dashboard/haidi/settings
#11 165.8 ├ ƒ /dashboard/handoff
#11 165.8 ├ ƒ /dashboard/inbox
#11 165.8 ├ ƒ /dashboard/knowledge-base
#11 165.8 ├ ƒ /dashboard/logs
#11 165.8 ├ ƒ /dashboard/messages
#11 165.8 ├ ƒ /dashboard/orders
#11 165.8 ├ ƒ /dashboard/orders/[id]/safety
#11 165.8 ├ ƒ /dashboard/pilot
#11 165.8 ├ ƒ /dashboard/pilot-control
#11 165.8 ├ ƒ /dashboard/products
#11 165.8 ├ ƒ /dashboard/products-intelligence
#11 165.8 ├ ƒ /dashboard/profile
#11 165.8 ├ ƒ /dashboard/security
#11 165.8 ├ ƒ /dashboard/settings
#11 165.8 ├ ƒ /dashboard/statistics
#11 165.8 └ ○ /login
#11 165.8 
#11 165.8 
#11 165.8 ƒ Proxy (Middleware)
#11 165.8 
#11 165.8 ○  (Static)   prerendered as static content
#11 165.8 ƒ  (Dynamic)  server-rendered on demand
#11 165.8 
#11 DONE 166.2s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 1.3s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.2s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.1s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers
#17 exporting layers 1.4s done
#17 writing image sha256:bb241c570cd1a83162973c3c508ae431877a3352af0231c680120cb2ec57820b
#17 writing image sha256:bb241c570cd1a83162973c3c508ae431877a3352af0231c680120cb2ec57820b done
#17 naming to docker.io/library/youlya-youlya-app 0.0s done
#17 DONE 1.5s

#18 resolving provenance for metadata file
#18 DONE 0.1s
 Image youlya-youlya-app Built 
PASS: docker-compose-build

## Summary
- Verification status: PASS
