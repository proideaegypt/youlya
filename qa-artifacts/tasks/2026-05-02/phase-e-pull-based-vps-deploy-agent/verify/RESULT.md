# Verify Before Deploy

- Date: 2026-05-02
- Branch: main
- Commit: b7637ac

Running: check-env-tracking

> youlya-phase0-app@2.4.1 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.4.1 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.4.1 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.4.1 lint
> eslint .


/root/youlya/app/dashboard/logs/page.tsx
  57:18  warning  'setFilter' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/settings/page.tsx
  2:47  warning  'Globe' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/shopify/live-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used    @typescript-eslint/no-unused-vars
  9:24  warning  '_payload' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/shopify/mock-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/supabase/product-mapping-repository.ts
  1:15  warning  'ProductRecommendation' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/ui/dashboard-shell.tsx
  11:3  warning  'hasBrandAssets' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/ui/dashboard-topbar.tsx
   5:10  warning  'ThemeToggle' is defined but never used       @typescript-eslint/no-unused-vars
   6:10  warning  'LanguageToggle' is defined but never used    @typescript-eslint/no-unused-vars
  15:60  warning  'onLanguageChange' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/auto-release.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/scripts/update-readme.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/tests/unit/supabase-browser-client.test.ts
  3:40  warning  '_url' is defined but never used  @typescript-eslint/no-unused-vars
  3:54  warning  '_key' is defined but never used  @typescript-eslint/no-unused-vars

✖ 14 problems (0 errors, 14 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.4.1 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/auth-middleware.test.ts (7 tests) 56ms
 ✓ tests/unit/root-page.test.ts (1 test) 55ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1069ms
   ✓ evolution client > sendText 429 retries then resolves  1014ms
 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 107ms
 ✓ tests/unit/shipping.test.ts (2 tests) 110ms
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

 ✓ tests/integration/message-turn.test.ts (4 tests) 218ms
 ✓ tests/api/message-turn.test.ts (1 test) 70ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 21ms
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 44ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 20ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 14ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 19ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 10ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 38ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 8ms
 ✓ tests/unit/select-product.test.ts (4 tests) 11ms

 Test Files  16 passed (16)
      Tests  58 passed (58)
   Start at  04:18:58
   Duration  8.76s (transform 2.43s, setup 0ms, collect 7.67s, tests 1.87s, environment 11ms, prepare 6.73s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.4.1 validate:scenarios
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

> youlya-phase0-app@2.4.1 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.4.1 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.4.1
- versionName: internal-whatsapp-n8n-pilot
- releaseFile: RELEASES/v2.4.1-internal-whatsapp-n8n-pilot.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.4.1 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.4.1 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
⚠ Compiled with warnings in 9.3s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

✓ Compiled successfully in 16.3s
  Running TypeScript ...
  Finished TypeScript in 17.0s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/29) ...
  Generating static pages using 3 workers (7/29) 
  Generating static pages using 3 workers (14/29) 
  Generating static pages using 3 workers (21/29) 
✓ Generating static pages using 3 workers (29/29) in 3.6s
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
#3 DONE 0.9s

#4 [internal] load .dockerignore
#4 transferring context: 45B 0.0s done
#4 DONE 0.1s

#5 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 96.86MB 5.1s
#6 transferring context: 100.02MB 10.1s
#6 transferring context: 102.34MB 15.2s
#6 transferring context: 102.49MB 16.2s done
#6 DONE 16.7s

#7 [deps 2/4] WORKDIR /app
#7 CACHED

#8 [deps 3/4] COPY package*.json ./
#8 CACHED

#9 [deps 4/4] RUN npm ci --omit=dev
#9 CACHED

#10 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#10 CACHED

#11 [builder 4/5] COPY . .

