# Verify Before Deploy

- Date: 2026-04-30
- Branch: main
- Commit: 992bb1e

Running: typecheck

> youlya-phase0-app@2.0.1 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.0.1 lint
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

✖ 6 problems (0 errors, 6 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.0.1 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/api/message-turn.test.ts (1 test) 24ms
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

 ✓ tests/integration/message-turn.test.ts (4 tests) 64ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1032ms
   ✓ evolution client > sendText 429 retries then resolves  1004ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 71ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 19ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 58ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 28ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 10ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 8ms
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 33ms
 ✓ tests/unit/shipping.test.ts (2 tests) 20ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 10ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 12ms
 ✓ tests/unit/select-product.test.ts (4 tests) 28ms

 Test Files  14 passed (14)
      Tests  55 passed (55)
   Start at  15:20:50
   Duration  5.59s (transform 1.26s, setup 0ms, collect 4.78s, tests 1.42s, environment 5ms, prepare 3.24s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.0.1 validate:scenarios
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

> youlya-phase0-app@2.0.1 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: build

> youlya-phase0-app@2.0.1 build
> npm run build:info && next build


> youlya-phase0-app@2.0.1 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (Turbopack)
- Environments: .env.local

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
Found 1 warning while optimizing generated CSS:

[2m│   }[22m
[2m│ }[22m
[2m│[22m @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap");
[2m┆[22m        [33m[2m^--[22m @import rules must precede all rules aside from @charset and @layer statements[39m
[2m┆[22m
[2m│ :root {[22m
[2m│   --background: #09090b;[22m

✓ Compiled successfully in 15.4s
  Running TypeScript ...
  Finished TypeScript in 9.8s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/29) ...
  Generating static pages using 3 workers (7/29) 
  Generating static pages using 3 workers (14/29) 
  Generating static pages using 3 workers (21/29) 
✓ Generating static pages using 3 workers (29/29) in 538ms
  Finalizing page optimization ...

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
env file /root/youlya/.env not found: stat /root/youlya/.env: no such file or directory
