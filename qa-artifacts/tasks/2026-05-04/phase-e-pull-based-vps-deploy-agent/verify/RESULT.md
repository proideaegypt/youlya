# Verify Before Deploy

- Date: 2026-05-04
- Branch: main
- Commit: 410d918

Running: check-env-tracking

> youlya-phase0-app@2.9.1 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.9.1 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.9.1 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.9.1 lint
> eslint .

#11 176.6 
#11 176.6 Route (app)
#11 176.6 ┌ ○ /
#11 176.6 ├ ○ /_not-found
#11 176.6 ├ ƒ /api/admin/handoffs
#11 176.6 ├ ƒ /api/admin/settings
#11 176.6 ├ ƒ /api/ai/tools/calculate-shipping
#11 176.6 ├ ƒ /api/ai/tools/confirm-order
#11 176.6 ├ ƒ /api/ai/tools/create-shopify-order
#11 176.6 ├ ƒ /api/ai/tools/handoff
#11 176.6 ├ ƒ /api/ai/tools/product-search
#11 176.6 ├ ƒ /api/ai/tools/select-product
#11 176.6 ├ ƒ /api/build-info
#11 176.6 ├ ƒ /api/dashboard/conversations
#11 176.6 ├ ƒ /api/dashboard/conversations/[id]
#11 176.6 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 176.6 ├ ƒ /api/dashboard/logs
#11 176.6 ├ ƒ /api/dashboard/orders
#11 176.6 ├ ƒ /api/dashboard/products-intelligence/channels
#11 176.6 ├ ƒ /api/dashboard/products-intelligence/overview
#11 176.6 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 176.6 ├ ƒ /api/dashboard/products-intelligence/products
#11 176.6 ├ ƒ /api/dashboard/products/catalog
#11 176.6 ├ ƒ /api/dashboard/products/mapping-inspector
#11 176.6 ├ ƒ /api/dashboard/products/overview
#11 176.6 ├ ƒ /api/dashboard/products/search-qa
#11 176.6 ├ ƒ /api/dashboard/products/sync-health
#11 176.6 ├ ƒ /api/dashboard/products/variants
#11 176.6 ├ ƒ /api/dashboard/settings
#11 176.6 ├ ƒ /api/dashboard/stats
#11 176.6 ├ ƒ /api/health
#11 176.6 ├ ƒ /api/internal/failed-events
#11 176.6 ├ ƒ /api/internal/messages/turn
#11 176.6 ├ ƒ /api/internal/shopify/sync-products
#11 176.6 ├ ƒ /api/webhooks/evolution
#11 176.6 ├ ƒ /dashboard
#11 176.6 ├ ƒ /dashboard/command-center
#11 176.6 ├ ƒ /dashboard/devices
#11 176.6 ├ ƒ /dashboard/inbox
#11 176.6 ├ ƒ /dashboard/logs
#11 176.6 ├ ƒ /dashboard/messages
#11 176.6 ├ ƒ /dashboard/orders
#11 176.6 ├ ƒ /dashboard/orders/[id]/safety
#11 176.6 ├ ƒ /dashboard/products
#11 176.6 ├ ƒ /dashboard/products-intelligence
#11 176.6 ├ ƒ /dashboard/profile
#11 176.6 ├ ƒ /dashboard/security
#11 176.6 ├ ƒ /dashboard/settings
#11 176.6 ├ ƒ /dashboard/statistics
#11 176.6 └ ○ /login
#11 176.6 
#11 176.6 
#11 176.6 ƒ Proxy (Middleware)
#11 176.6 
#11 176.6 ○  (Static)   prerendered as static content
#11 176.6 ƒ  (Dynamic)  server-rendered on demand
#11 176.6 
#11 DONE 177.3s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 2.3s

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

/root/youlya/lib/services/haidi-output-validator.ts
  31:10  warning  'containsSuspiciousInvention' is defined but never used  @typescript-eslint/no-unused-vars

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

✖ 21 problems (0 errors, 21 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static

> youlya-phase0-app@2.9.1 test
> vitest run

#14 DONE 0.4s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.2s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers

 RUN  v3.2.4 /root/youlya

#17 exporting layers 1.4s done
#17 writing image sha256:d2c1189166b1cf1d63245793ffca1647e08619218ed168595b45c75c2d34ac12 done
#17 naming to docker.io/library/youlya-youlya-app 0.0s done
#17 DONE 1.5s

#18 resolving provenance for metadata file
#18 DONE 0.2s
 Image youlya-youlya-app Built 
PASS: docker-compose-build

## Summary
- Verification status: PASS
 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 143ms
 ✓ tests/unit/products-intelligence-service.test.ts (33 tests) 23ms
 ✓ tests/unit/shipping.test.ts (2 tests) 39ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1056ms
   ✓ evolution client > sendText 429 retries then resolves  1009ms
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

 ✓ tests/integration/message-turn.test.ts (4 tests) 92ms
 ✓ tests/unit/root-page.test.ts (1 test) 40ms
 ✓ tests/unit/haidi-agent.test.ts (17 tests) 34ms
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 23ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 92ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 33ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 26ms
 ✓ tests/unit/select-product.test.ts (4 tests) 15ms
 ✓ tests/api/message-turn.test.ts (1 test) 41ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 75ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 21ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 13ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 16ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 20ms

 Test Files  18 passed (18)
      Tests  108 passed (108)
   Start at  05:53:38
   Duration  8.28s (transform 1.59s, setup 0ms, collect 5.97s, tests 1.80s, environment 8ms, prepare 5.29s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.9.1 validate:scenarios
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

> youlya-phase0-app@2.9.1 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.9.1 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.9.1
- versionName: integrate-pilot-sprint-playbook-safely
- releaseFile: RELEASES/v2.9.1-integrate-pilot-sprint-playbook-safely.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.9.1 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.9.1 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
⚠ Compiled with warnings in 16.5s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
✓ Compiled successfully in 28.2s
  Running TypeScript ...
  Finished TypeScript in 28.8s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/46) ...
  Generating static pages using 3 workers (11/46) 
  Generating static pages using 3 workers (22/46) 
  Generating static pages using 3 workers (34/46) 
✓ Generating static pages using 3 workers (46/46) in 1888ms
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
#2 transferring dockerfile: 539B 0.0s done
#2 DONE 0.1s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.4s

#4 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#4 DONE 0.0s

#5 [builder 2/6] WORKDIR /app
#5 CACHED

#6 [internal] load .dockerignore
#6 transferring context: 217B done
#6 DONE 0.0s

#7 [internal] load build context
#7 transferring context: 15.52kB 2.3s
#7 transferring context: 193.51kB 16.2s
#7 transferring context: 4.47MB 16.9s done
#7 DONE 20.7s

#8 [builder 3/6] COPY package*.json ./
#8 DONE 0.3s

#9 [builder 4/6] RUN npm ci
#9 84.55 
#9 84.55 added 581 packages, and audited 582 packages in 1m
#9 84.55 
#9 84.55 176 packages are looking for funding
#9 84.55   run `npm fund` for details
#9 84.65 
#9 84.65 2 moderate severity vulnerabilities
#9 84.65 
#9 84.65 To address all issues (including breaking changes), run:
#9 84.65   npm audit fix --force
#9 84.65 
#9 84.65 Run `npm audit` for details.
#9 84.65 npm notice
#9 84.65 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#9 84.65 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#9 84.65 npm notice To update run: npm install -g npm@11.13.0
#9 84.65 npm notice
#9 DONE 87.6s

#10 [builder 3/6] COPY package*.json ./
#10 CACHED

#11 [builder 4/6] RUN npm ci
#11 CACHED

#12 [builder 5/6] COPY . .
#12 DONE 2.2s

#13 [builder 6/6] RUN npm run build
#13 1.524 
#13 1.524 > youlya-phase0-app@2.9.1 build
#13 1.524 > npm run build:info && next build --webpack
#13 1.524 
#13 2.247 
#13 2.247 > youlya-phase0-app@2.9.1 build:info
#13 2.247 > node scripts/write-build-info.mjs
#13 2.247 
#13 2.374 build info written: /app/public/build-info.json
#13 5.417 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#13 5.418 This information is used to shape Next.js' roadmap and prioritize features.
#13 5.418 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#13 5.418 https://nextjs.org/telemetry
#13 5.418 
#13 5.552 ▲ Next.js 16.2.4 (webpack)
#13 5.552 - Environments: .env.local, .env.production
#13 5.552 
#13 5.931 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#13 6.092   Creating an optimized production build ...
#13 56.43 ⚠ Compiled with warnings in 47s
#13 56.43 
#13 56.44 ./app/api/health/route.ts
#13 56.44 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#13 56.44 
#13 56.44 Import trace for requested module:
#13 56.44 ./app/api/health/route.ts
#13 56.44 
#13 70.08 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#13 111.8 ✓ Compiled successfully in 95s
#13 111.8   Running TypeScript ...
#13 144.0   Finished TypeScript in 32.2s ...
#13 144.0   Collecting page data using 3 workers ...
#13 157.0   Generating static pages using 3 workers (0/46) ...
#13 157.8   Generating static pages using 3 workers (11/46) 
#13 158.8   Generating static pages using 3 workers (22/46) 
#13 159.4   Generating static pages using 3 workers (34/46) 
#13 161.3 ✓ Generating static pages using 3 workers (46/46) in 4.3s
#13 166.0   Finalizing page optimization ...
#13 166.0   Collecting build traces ...
#13 ...

#14 [runner 3/7] RUN apk add --no-cache curl
#14 CACHED

#13 [builder 6/6] RUN npm run build
