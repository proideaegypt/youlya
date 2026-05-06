# Verify Before Deploy

- Date: 2026-05-04
- Branch: main
- Commit: b5ac014

Running: check-env-tracking

> youlya-phase0-app@2.19.6 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.19.6 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.19.6 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.19.6 lint
> eslint .


/root/youlya/app/dashboard/conversations/page.tsx
   1:10  warning  'cookies' is defined but never used                  @typescript-eslint/no-unused-vars
   2:10  warning  'getSupabaseServerClient' is defined but never used  @typescript-eslint/no-unused-vars
  15:3   warning  'RefreshCw' is defined but never used                @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/haidi/settings/page.tsx
   9:3  warning  'Smile' is defined but never used          @typescript-eslint/no-unused-vars
  10:3  warning  'MessageSquare' is defined but never used  @typescript-eslint/no-unused-vars
  13:3  warning  'Search' is defined but never used         @typescript-eslint/no-unused-vars
  15:3  warning  'AlertTriangle' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/inbox/page.tsx
  1:10  warning  'cookies' is defined but never used                  @typescript-eslint/no-unused-vars
  2:10  warning  'getSupabaseServerClient' is defined but never used  @typescript-eslint/no-unused-vars
  3:10  warning  'getMockState' is defined but never used             @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/layout.tsx
  3:8  warning  'fs' is defined but never used    @typescript-eslint/no-unused-vars
  4:8  warning  'path' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/logs/page.tsx
  57:18  warning  '_setFilter' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/pilot/page.tsx
  21:3  warning  'ShoppingCart' is defined but never used  @typescript-eslint/no-unused-vars

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

/root/youlya/tests/unit/haidi-agent.test.ts
  144:9  warning  'appReply' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/tests/unit/handoff-center.test.ts
  71:11  warning  'ticket' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/tests/unit/supabase-browser-client.test.ts
  3:40  warning  '_url' is defined but never used  @typescript-eslint/no-unused-vars
  3:54  warning  '_key' is defined but never used  @typescript-eslint/no-unused-vars

✖ 29 problems (0 errors, 29 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.19.6 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/failed-events.test.ts (2 tests) 27ms
stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"أكيد، دي شوية اختيارات مناسبة: 1) بيجامة شتوي أسود • 2) روب قطن وردي • 3) بوركيني أسود\n\nاختار المنتج اللي عايزه وابعتلي رقمه والمقاس."}

stdout | tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام، الأوردر اتأكد بنجاح."}

stdout | tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit human request -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

stdout | tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"هحولك لفريق الدعم دلوقتي."}

 ✓ tests/integration/message-turn.test.ts (5 tests) 43ms
 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 19ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1014ms
   ✓ evolution client > sendText 429 retries then resolves  1003ms
 ✓ tests/unit/root-page.test.ts (1 test) 24ms
 ✓ tests/unit/message-history-service.test.ts (11 tests) 43ms
 ✓ tests/unit/shipping.test.ts (2 tests) 15ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 41ms
 ✓ tests/api/message-turn.test.ts (4 tests) 44ms
 ✓ tests/integration/message-turn-evolution.test.ts (3 tests) 15ms
 ✓ tests/unit/shopify-order-service.test.ts (10 tests) 25ms
 ✓ tests/unit/products-intelligence-service.test.ts (33 tests) 21ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 9ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 30ms
 ✓ tests/unit/haidi-agent.test.ts (21 tests) 35ms
 ✓ tests/unit/select-product.test.ts (13 tests) 16ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 20ms
 ✓ tests/unit/handoff-center.test.ts (12 tests) 20ms
 ✓ tests/unit/haidi-lab-service.test.ts (3 tests) 15ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 16ms
 ✓ tests/unit/knowledge-base-service.test.ts (3 tests) 28ms
 ✓ tests/unit/haidi-settings-service.test.ts (6 tests) 22ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 5ms

 Test Files  23 passed (23)
      Tests  165 passed (165)
   Start at  22:59:23
   Duration  6.43s (transform 1.56s, setup 0ms, collect 5.15s, tests 1.55s, environment 11ms, prepare 4.30s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.19.6 validate:scenarios
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

> youlya-phase0-app@2.19.6 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.19.6 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.19.6
- versionName: dashboard-swarm-and-deploy-safety-gates
- releaseFile: RELEASES/v2.19.6-dashboard-swarm-and-deploy-safety-gates.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.19.6 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.19.6 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
⚠ Compiled with warnings in 12.0s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

✓ Compiled successfully in 19.8s
  Running TypeScript ...
  Finished TypeScript in 27.2s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/63) ...
  Generating static pages using 3 workers (15/63) 
  Generating static pages using 3 workers (31/63) 
  Generating static pages using 3 workers (47/63) 
✓ Generating static pages using 3 workers (63/63) in 1467ms
  Finalizing page optimization ...
  Collecting build traces ...
