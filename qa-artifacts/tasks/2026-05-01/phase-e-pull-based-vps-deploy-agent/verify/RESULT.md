# Verify Before Deploy

- Date: 2026-05-01
- Branch: main
- Commit: b7637ac

Running: check-env-tracking

> youlya-phase0-app@2.2.0 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.2.0 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.2.0 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.2.0 lint
> eslint .


/root/youlya/lib/adapters/shopify/live-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used    @typescript-eslint/no-unused-vars
  9:24  warning  '_payload' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/shopify/mock-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/supabase/product-mapping-repository.ts
  1:15  warning  'ProductRecommendation' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/auto-release.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/scripts/update-readme.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/tests/unit/supabase-browser-client.test.ts
  3:40  warning  '_url' is defined but never used  @typescript-eslint/no-unused-vars
  3:54  warning  '_key' is defined but never used  @typescript-eslint/no-unused-vars

✖ 8 problems (0 errors, 8 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.2.0 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/auth-middleware.test.ts (7 tests) 80ms
 ✓ tests/unit/root-page.test.ts (1 test) 60ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1034ms
   ✓ evolution client > sendText 429 retries then resolves  1007ms

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
├ ƒ /api/dashboard/settings
├ ƒ /api/dashboard/stats
├ ƒ /api/health
├ ƒ /api/internal/failed-events
├ ƒ /api/internal/messages/turn
├ ƒ /api/webhooks/evolution
├ ƒ /dashboard
├ ƒ /dashboard/command-center
├ ƒ /dashboard/inbox
├ ƒ /dashboard/logs
├ ƒ /dashboard/orders
├ ƒ /dashboard/orders/[id]/safety
├ ƒ /dashboard/settings
└ ○ /login


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

PASS: build
Running: docker-compose-config
 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 56ms
stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"أكيد، دي شوية اختيارات مناسبة: 1) بيجامة شتوي أسود • 2) روب قطن وردي • 3) بوركيني أسود\n\nاختار المنتج اللي عايزه وابعتلي رقمه والمقاس."}

 ✓ tests/api/message-turn.test.ts (1 test) 26ms
stdout | tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام، الأوردر اتأكد بنجاح."}

stdout | tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

PASS: docker-compose-config
stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

Running: docker-compose-build
 ✓ tests/integration/message-turn.test.ts (4 tests) 77ms
 Image youlya-youlya-app Building 
 ✓ tests/unit/shipping.test.ts (2 tests) 12ms
#1 [internal] load local bake definitions
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 23ms
#1 reading from stdin 490B done
#1 DONE 0.0s
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 19ms

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 556B 0.0s done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:20-alpine
 ✓ tests/unit/handoff-service.test.ts (6 tests) 18ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 23ms
#3 DONE 1.0s
 ✓ tests/unit/select-product.test.ts (4 tests) 21ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 19ms

#4 [internal] load .dockerignore
#4 transferring context: 45B done
#4 DONE 0.0s

#5 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
 ✓ tests/unit/cart-validation.test.ts (6 tests) 28ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 16ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 14ms

 Test Files  16 passed (16)
      Tests  58 passed (58)
   Start at  22:18:34
   Duration  6.74s (transform 1.80s, setup 0ms, collect 5.94s, tests 1.53s, environment 6ms, prepare 4.31s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.2.0 validate:scenarios
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

> youlya-phase0-app@2.2.0 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.2.0 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.2.0
- versionName: dashboard-v3-youlya-home-wear-redesign
- releaseFile: RELEASES/v2.2.0-dashboard-v3-youlya-home-wear-redesign.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.2.0 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.2.0 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
#6 transferring context: 77.00MB 5.1s
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
#6 transferring context: 78.35MB 8.8s done
#6 DONE 9.2s

#7 [deps 3/4] COPY package*.json ./
#7 CACHED

#8 [deps 4/4] RUN npm ci --omit=dev
#8 CACHED

#9 [deps 2/4] WORKDIR /app
#9 CACHED

#10 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#10 CACHED

#11 [builder 4/5] COPY . .
⚠ Compiled with warnings in 5.9s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

✓ Compiled successfully in 10.2s
  Running TypeScript ...
  Finished TypeScript in 13.2s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/29) ...
  Generating static pages using 3 workers (7/29) 
  Generating static pages using 3 workers (14/29) 
  Generating static pages using 3 workers (21/29) 
✓ Generating static pages using 3 workers (29/29) in 1074ms
  Finalizing page optimization ...
  Collecting build traces ...
#11 DONE 55.8s

#12 [builder 5/5] RUN npm run build
#12 2.813 
#12 2.813 > youlya-phase0-app@2.2.0 build
#12 2.813 > npm run build:info && next build --webpack
#12 2.813 
#12 3.216 
#12 3.216 > youlya-phase0-app@2.2.0 build:info
#12 3.216 > node scripts/write-build-info.mjs
#12 3.216 
#12 3.400 build info written: /app/public/build-info.json
#12 4.832 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#12 4.833 This information is used to shape Next.js' roadmap and prioritize features.
#12 4.833 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#12 4.833 https://nextjs.org/telemetry
#12 4.833 
#12 8.039 ▲ Next.js 16.2.4 (webpack)
#12 8.040 - Environments: .env.local, .env.production
#12 8.041 
#12 8.257 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#12 8.411   Creating an optimized production build ...

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
├ ƒ /api/dashboard/settings
├ ƒ /api/dashboard/stats
├ ƒ /api/health
├ ƒ /api/internal/failed-events
├ ƒ /api/internal/messages/turn
├ ƒ /api/webhooks/evolution
├ ƒ /dashboard
├ ƒ /dashboard/command-center
├ ƒ /dashboard/inbox
├ ƒ /dashboard/logs
├ ƒ /dashboard/orders
├ ƒ /dashboard/orders/[id]/safety
├ ƒ /dashboard/settings
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
#2 transferring dockerfile: 556B 0.0s done
#2 DONE 0.1s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.5s

#4 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#4 DONE 0.0s

#5 [internal] load .dockerignore
#5 transferring context: 45B done
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 87.60MB 3.3s
#12 44.18 ⚠ Compiled with warnings in 32.4s
#12 44.18 
#12 44.18 ./app/api/health/route.ts
#12 44.18 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#12 44.18 
#12 44.18 Import trace for requested module:
#12 44.18 ./app/api/health/route.ts
#12 44.18 
#6 transferring context: 252.88MB 8.4s
#6 transferring context: 254.17MB 13.5s
#6 transferring context: 257.76MB 16.2s done
#6 DONE 18.3s

#7 [deps 2/4] WORKDIR /app
#7 CACHED

#8 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#8 CACHED

#9 [deps 3/4] COPY package*.json ./
#9 CACHED

#10 [deps 4/4] RUN npm ci --omit=dev
#10 CACHED

#11 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#11 CACHED

#12 [builder 4/5] COPY . .
#12 55.13 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#12 72.68 ✓ Compiled successfully in 55s
#12 72.71   Running TypeScript ...
#12 97.17   Finished TypeScript in 24.5s ...
#12 97.21   Collecting page data using 3 workers ...
#12 104.1   Generating static pages using 3 workers (0/29) ...
#12 104.6   Generating static pages using 3 workers (7/29) 
#12 105.1   Generating static pages using 3 workers (14/29) 
#12 105.1   Generating static pages using 3 workers (21/29) 
#12 105.9 ✓ Generating static pages using 3 workers (29/29) in 1769ms
#12 107.8   Finalizing page optimization ...
#12 107.8   Collecting build traces ...
#12 DONE 55.0s

#13 [builder 5/5] RUN npm run build
#13 1.281 
#13 1.281 > youlya-phase0-app@2.2.0 build
#13 1.281 > npm run build:info && next build --webpack
#13 1.281 
#13 1.651 
#13 1.651 > youlya-phase0-app@2.2.0 build:info
#13 1.651 > node scripts/write-build-info.mjs
#13 1.651 
#13 1.809 build info written: /app/public/build-info.json
#13 3.226 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#13 3.227 This information is used to shape Next.js' roadmap and prioritize features.
#13 3.227 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#13 3.227 https://nextjs.org/telemetry
#13 3.227 
#13 5.450 ▲ Next.js 16.2.4 (webpack)
#13 5.450 - Environments: .env.local, .env.production
#13 5.451 
#13 5.600 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#13 5.724   Creating an optimized production build ...
#13 32.11 ⚠ Compiled with warnings in 23.4s
#13 32.11 
#13 32.11 ./app/api/health/route.ts
#13 32.11 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#13 32.11 
#13 32.11 Import trace for requested module:
#13 32.11 ./app/api/health/route.ts
#13 32.11 
#12 150.1 
#12 150.1 Route (app)
#12 150.1 ┌ ○ /
#12 150.1 ├ ○ /_not-found
#12 150.1 ├ ƒ /api/admin/handoffs
#12 150.1 ├ ƒ /api/admin/settings
#12 150.1 ├ ƒ /api/ai/tools/calculate-shipping
#12 150.1 ├ ƒ /api/ai/tools/confirm-order
#12 150.1 ├ ƒ /api/ai/tools/create-shopify-order
#12 150.1 ├ ƒ /api/ai/tools/handoff
#12 150.1 ├ ƒ /api/ai/tools/product-search
#12 150.1 ├ ƒ /api/ai/tools/select-product
#12 150.1 ├ ƒ /api/build-info
#12 150.1 ├ ƒ /api/dashboard/conversations
#12 150.1 ├ ƒ /api/dashboard/conversations/[id]
#12 150.1 ├ ƒ /api/dashboard/conversations/[id]/actions
#12 150.1 ├ ƒ /api/dashboard/logs
#12 150.1 ├ ƒ /api/dashboard/orders
#12 150.1 ├ ƒ /api/dashboard/settings
#12 150.1 ├ ƒ /api/dashboard/stats
#12 150.1 ├ ƒ /api/health
#12 150.1 ├ ƒ /api/internal/failed-events
#12 150.1 ├ ƒ /api/internal/messages/turn
#12 150.1 ├ ƒ /api/webhooks/evolution
#12 150.1 ├ ƒ /dashboard
#12 150.1 ├ ƒ /dashboard/command-center
#12 150.1 ├ ƒ /dashboard/inbox
#12 150.1 ├ ƒ /dashboard/logs
#12 150.1 ├ ƒ /dashboard/orders
#12 150.1 ├ ƒ /dashboard/orders/[id]/safety
#12 150.1 ├ ƒ /dashboard/settings
#12 150.1 └ ○ /login
#12 150.1 
#12 150.1 
#12 150.1 ƒ Proxy (Middleware)
#12 150.1 
#12 150.1 ○  (Static)   prerendered as static content
#12 150.1 ƒ  (Dynamic)  server-rendered on demand
#12 150.1 
#12 150.2 npm notice
#12 150.2 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#12 150.2 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#12 150.2 npm notice To update run: npm install -g npm@11.13.0
#12 150.2 npm notice
#12 DONE 150.7s

#13 [runner 3/7] RUN apk add --no-cache curl
#13 ...

#14 [runner 3/7] RUN apk add --no-cache curl
#14 CACHED

#13 [builder 5/5] RUN npm run build
#13 CACHED

#14 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 42.87 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#14 DONE 1.5s

#15 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#15 DONE 0.3s

#16 [runner 6/7] COPY --from=builder /app/public ./public
#16 DONE 0.2s

#17 [runner 7/7] COPY --from=builder /app/docs ./docs
#17 DONE 0.2s

#18 exporting to image
#18 exporting layers
#18 exporting layers 1.1s done
#18 writing image sha256:f73de6a3ed1e3d0e1bd4699f80378da1f8f176305fc412eb4a393662d3015109 0.0s done
#18 naming to docker.io/library/youlya-youlya-app 0.0s done
#18 DONE 1.2s

#19 resolving provenance for metadata file
#19 DONE 0.0s
 Image youlya-youlya-app Built 
PASS: docker-compose-build

## Summary
- Verification status: PASS
#13 58.70 ✓ Compiled successfully in 44s
#13 58.73   Running TypeScript ...
#13 77.25   Finished TypeScript in 18.5s ...
#13 77.29   Collecting page data using 3 workers ...
#13 84.48   Generating static pages using 3 workers (0/29) ...
#13 84.96   Generating static pages using 3 workers (7/29) 
#13 85.50   Generating static pages using 3 workers (14/29) 
#13 85.55   Generating static pages using 3 workers (21/29) 
#13 86.40 ✓ Generating static pages using 3 workers (29/29) in 1914ms
#13 89.40   Finalizing page optimization ...
#13 89.41   Collecting build traces ...
#13 131.0 
#13 131.0 Route (app)
#13 131.0 ┌ ○ /
#13 131.0 ├ ○ /_not-found
#13 131.0 ├ ƒ /api/admin/handoffs
#13 131.0 ├ ƒ /api/admin/settings
#13 131.0 ├ ƒ /api/ai/tools/calculate-shipping
#13 131.0 ├ ƒ /api/ai/tools/confirm-order
#13 131.0 ├ ƒ /api/ai/tools/create-shopify-order
#13 131.0 ├ ƒ /api/ai/tools/handoff
#13 131.0 ├ ƒ /api/ai/tools/product-search
#13 131.0 ├ ƒ /api/ai/tools/select-product
#13 131.0 ├ ƒ /api/build-info
#13 131.0 ├ ƒ /api/dashboard/conversations
#13 131.0 ├ ƒ /api/dashboard/conversations/[id]
#13 131.0 ├ ƒ /api/dashboard/conversations/[id]/actions
#13 131.0 ├ ƒ /api/dashboard/logs
#13 131.0 ├ ƒ /api/dashboard/orders
#13 131.0 ├ ƒ /api/dashboard/settings
#13 131.0 ├ ƒ /api/dashboard/stats
#13 131.0 ├ ƒ /api/health
#13 131.0 ├ ƒ /api/internal/failed-events
#13 131.0 ├ ƒ /api/internal/messages/turn
#13 131.0 ├ ƒ /api/webhooks/evolution
#13 131.0 ├ ƒ /dashboard
#13 131.0 ├ ƒ /dashboard/command-center
#13 131.0 ├ ƒ /dashboard/inbox
#13 131.0 ├ ƒ /dashboard/logs
#13 131.0 ├ ƒ /dashboard/orders
#13 131.0 ├ ƒ /dashboard/orders/[id]/safety
#13 131.0 ├ ƒ /dashboard/settings
#13 131.0 └ ○ /login
#13 131.0 
#13 131.0 
#13 131.0 ƒ Proxy (Middleware)
#13 131.0 
#13 131.0 ○  (Static)   prerendered as static content
#13 131.0 ƒ  (Dynamic)  server-rendered on demand
#13 131.0 
#13 131.1 npm notice
#13 131.1 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#13 131.1 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#13 131.1 npm notice To update run: npm install -g npm@11.13.0
#13 131.1 npm notice
#13 DONE 131.4s

#15 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#15 DONE 1.0s

#16 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#16 DONE 0.1s

#17 [runner 6/7] COPY --from=builder /app/public ./public
#17 DONE 0.3s

#18 [runner 7/7] COPY --from=builder /app/docs ./docs
#18 DONE 0.1s

#19 exporting to image
#19 exporting layers
#19 exporting layers 1.1s done
#19 writing image sha256:e75dac3eca4c693700fc8ddbb45391945a72f915bbf3829e015db28d930c54ed done
#19 naming to docker.io/library/youlya-youlya-app done
#19 DONE 1.1s

#20 resolving provenance for metadata file
#20 DONE 0.0s
 Image youlya-youlya-app Built 
PASS: docker-compose-build

## Summary
- Verification status: PASS
