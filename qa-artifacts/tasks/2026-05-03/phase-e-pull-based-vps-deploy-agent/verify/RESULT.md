# Verify Before Deploy

- Date: 2026-05-03
- Branch: main
- Commit: ab8fba9

Running: check-env-tracking

> youlya-phase0-app@2.6.5 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: untracked
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.6.5 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.6.5 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.6.5 lint
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

✖ 15 problems (0 errors, 15 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.6.5 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/intent-detector.test.ts (6 tests) 16ms
 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 66ms
 ✓ tests/unit/root-page.test.ts (1 test) 58ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 59ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1048ms
   ✓ evolution client > sendText 429 retries then resolves  1026ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 136ms
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 23ms
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

 ✓ tests/integration/message-turn.test.ts (4 tests) 118ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 16ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 24ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 12ms
 ✓ tests/api/message-turn.test.ts (1 test) 31ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 42ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 34ms
 ✓ tests/unit/select-product.test.ts (4 tests) 8ms
 ✓ tests/unit/shipping.test.ts (2 tests) 13ms

 Test Files  16 passed (16)
      Tests  58 passed (58)
   Start at  17:26:31
   Duration  7.33s (transform 1.76s, setup 0ms, collect 6.30s, tests 1.70s, environment 8ms, prepare 4.12s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.6.5 validate:scenarios
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

> youlya-phase0-app@2.6.5 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.6.5 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.6.5
- versionName: allow-n8n-workflow-env-access-for-youlya-workflow
- releaseFile: RELEASES/v2.6.5-allow-n8n-workflow-env-access-for-youlya-workflow.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.6.5 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.6.5 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
⚠ Compiled with warnings in 8.6s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

✓ Compiled successfully in 16.2s
  Running TypeScript ...
  Finished TypeScript in 18.3s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/35) ...
  Generating static pages using 3 workers (8/35) 
  Generating static pages using 3 workers (17/35) 
  Generating static pages using 3 workers (26/35) 
✓ Generating static pages using 3 workers (35/35) in 1587ms
  Finalizing page optimization ...
  Collecting build traces ...
