# Verify Before Deploy

- Date: 2026-05-04
- Branch: main
- Commit: 7344fd4

Running: check-env-tracking

> youlya-phase0-app@2.8.3 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.8.3 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.8.3 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.8.3 lint
> eslint .


/root/youlya/app/dashboard/command-center/page.tsx
   3:3  warning  'LayoutDashboard' is defined but never used  @typescript-eslint/no-unused-vars
  11:3  warning  'Sunrise' is defined but never used          @typescript-eslint/no-unused-vars
  12:3  warning  'Moon' is defined but never used             @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/inbox/page.tsx
  3:10  warning  'MessageCircle' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/layout.tsx
  3:8  warning  'fs' is defined but never used    @typescript-eslint/no-unused-vars
  4:8  warning  'path' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/logs/page.tsx
  57:18  warning  '_setFilter' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/products-intelligence/page.tsx
  214:15  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
  410:21  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

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

✖ 20 problems (0 errors, 20 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.8.3 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 71ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 60ms
 ✓ tests/unit/products-intelligence-service.test.ts (33 tests) 22ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1029ms
   ✓ evolution client > sendText 429 retries then resolves  1005ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 19ms
stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"أكيد، دي شوية اختيارات مناسبة: 1) بيجامة شتوي أسود • 2) روب قطن وردي • 3) بوركيني أسود\n\nاختار المنتج اللي عايزه وابعتلي رقمه والمقاس."}

stdout | tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام، الأوردر اتأكد بنجاح."}

stdout | tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

 ✓ tests/integration/message-turn.test.ts (4 tests) 50ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 16ms
 ✓ tests/unit/root-page.test.ts (1 test) 51ms
 ✓ tests/unit/select-product.test.ts (4 tests) 24ms
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 26ms
 ✓ tests/api/message-turn.test.ts (1 test) 28ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 16ms
 ✓ tests/unit/shipping.test.ts (2 tests) 17ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 17ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 23ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 10ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 8ms

 Test Files  17 passed (17)
      Tests  91 passed (91)
   Start at  03:57:28
   Duration  5.38s (transform 1.35s, setup 0ms, collect 4.25s, tests 1.49s, environment 9ms, prepare 3.31s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.8.3 validate:scenarios
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

> youlya-phase0-app@2.8.3 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.8.3 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.8.3
- versionName: n8n-send-text-json-body
- releaseFile: RELEASES/v2.8.3-n8n-send-text-json-body.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.8.3 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.8.3 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
⚠ Compiled with warnings in 10.8s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

✓ Compiled successfully in 18.0s
  Running TypeScript ...
  Finished TypeScript in 17.1s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/46) ...
  Generating static pages using 3 workers (11/46) 
  Generating static pages using 3 workers (22/46) 
  Generating static pages using 3 workers (34/46) 
✓ Generating static pages using 3 workers (46/46) in 1026ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/admin/handoffs
├ ƒ /api/admin/settings
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
├ ƒ /api/dashboard/logs
├ ƒ /api/dashboard/orders
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
├ ƒ /dashboard/devices
├ ƒ /dashboard/inbox
├ ƒ /dashboard/logs
├ ƒ /dashboard/messages
├ ƒ /dashboard/orders
├ ƒ /dashboard/orders/[id]/safety
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
#2 transferring dockerfile: 539B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.7s

#4 [internal] load .dockerignore
#4 transferring context: 217B 0.0s done
#4 DONE 0.0s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 331.98kB 3.8s done
#6 DONE 3.8s

#7 [builder 2/6] WORKDIR /app
#7 CACHED

#8 [builder 3/6] COPY package*.json ./
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 0.5s

#11 [builder 6/6] RUN npm run build
#11 0.947 
#11 0.947 > youlya-phase0-app@2.8.3 build
#11 0.947 > npm run build:info && next build --webpack
#11 0.947 
#11 1.322 
#11 1.322 > youlya-phase0-app@2.8.3 build:info
#11 1.322 > node scripts/write-build-info.mjs
#11 1.322 
#11 1.480 build info written: /app/public/build-info.json
#11 3.045 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 3.047 This information is used to shape Next.js' roadmap and prioritize features.
#11 3.047 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 3.047 https://nextjs.org/telemetry
#11 3.047 
#11 3.082 ▲ Next.js 16.2.4 (webpack)
#11 3.083 - Environments: .env.local, .env.production
#11 3.084 
#11 3.214 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 3.322   Creating an optimized production build ...
#11 40.71 ⚠ Compiled with warnings in 34.5s
#11 40.71 
#11 40.71 ./app/api/health/route.ts
#11 40.71 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 40.71 
#11 40.71 Import trace for requested module:
#11 40.71 ./app/api/health/route.ts
#11 40.71 
#11 53.90 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 82.23 ✓ Compiled successfully in 71s
#11 82.26   Running TypeScript ...
#11 111.3   Finished TypeScript in 29.0s ...
#11 111.3   Collecting page data using 3 workers ...
#11 120.1   Generating static pages using 3 workers (0/46) ...
#11 120.6   Generating static pages using 3 workers (11/46) 
#11 121.4   Generating static pages using 3 workers (22/46) 
#11 121.5   Generating static pages using 3 workers (34/46) 
#11 122.6 ✓ Generating static pages using 3 workers (46/46) in 2.5s
#11 125.0   Finalizing page optimization ...
#11 125.0   Collecting build traces ...

