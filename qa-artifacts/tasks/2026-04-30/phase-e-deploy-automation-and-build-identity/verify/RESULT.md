# Verify Before Deploy

- Date: 2026-04-30
- Branch: main
- Commit: 6903a00

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

 ✓ tests/unit/auth-middleware.test.ts (7 tests) 51ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1026ms
   ✓ evolution client > sendText 429 retries then resolves  1005ms
 ✓ tests/api/message-turn.test.ts (1 test) 30ms
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

 ✓ tests/integration/message-turn.test.ts (4 tests) 72ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 13ms
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 27ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 39ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 16ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 8ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 19ms
 ✓ tests/unit/select-product.test.ts (4 tests) 16ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 32ms
 ✓ tests/unit/shipping.test.ts (2 tests) 28ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 14ms

 Test Files  14 passed (14)
      Tests  55 passed (55)
   Start at  15:07:58
   Duration  5.61s (transform 1.33s, setup 0ms, collect 4.65s, tests 1.39s, environment 25ms, prepare 3.19s)

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

✓ Compiled successfully in 13.3s
  Running TypeScript ...
  Finished TypeScript in 9.3s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/29) ...
  Generating static pages using 3 workers (7/29) 
  Generating static pages using 3 workers (14/29) 
  Generating static pages using 3 workers (21/29) 
✓ Generating static pages using 3 workers (29/29) in 478ms
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
Running: docker-build
#0 building with "default" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 556B done
#1 DONE 0.0s

#2 [internal] load metadata for docker.io/library/node:20-alpine
#2 DONE 0.5s

#3 [internal] load .dockerignore
#3 transferring context: 2B done
#3 DONE 0.0s

#4 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#4 DONE 0.0s

#5 [internal] load build context
#5 transferring context: 74.64MB 4.2s done
#5 DONE 4.3s

#6 [deps 2/4] WORKDIR /app
#6 CACHED

#7 [deps 3/4] COPY package*.json ./
#7 CACHED

#8 [deps 4/4] RUN npm ci --omit=dev
#8 CACHED

#9 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#9 CACHED

#10 [builder 4/5] COPY . .
#10 DONE 39.7s

#11 [builder 5/5] RUN npm run build
#11 3.082 
#11 3.082 > youlya-phase0-app@2.0.1 build
#11 3.082 > npm run build:info && next build
#11 3.082 
#11 3.573 
#11 3.573 > youlya-phase0-app@2.0.1 build:info
#11 3.573 > node scripts/write-build-info.mjs
#11 3.573 
#11 3.797 build info written: /app/public/build-info.json
#11 5.818 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 5.820 This information is used to shape Next.js' roadmap and prioritize features.
#11 5.820 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 5.820 https://nextjs.org/telemetry
#11 5.820 
#11 8.045 ▲ Next.js 16.2.4 (Turbopack)
#11 8.045 - Environments: .env.local
#11 8.045 
#11 8.183 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 8.300   Creating an optimized production build ...
#11 16.91 Found 1 warning while optimizing generated CSS:
#11 16.91 
#11 16.91 [2m│   }[22m
#11 16.91 [2m│ }[22m
#11 16.91 [2m│[22m @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap");
#11 16.91 [2m┆[22m        [33m[2m^--[22m @import rules must precede all rules aside from @charset and @layer statements[39m
#11 16.91 [2m┆[22m
#11 16.91 [2m│ :root {[22m
#11 16.91 [2m│   --background: #09090b;[22m
#11 16.91 
#11 27.26 ✓ Compiled successfully in 18.1s
#11 27.27   Running TypeScript ...
#11 49.95   Finished TypeScript in 22.7s ...
#11 49.97   Collecting page data using 3 workers ...
#11 51.77   Generating static pages using 3 workers (0/29) ...
#11 51.94   Generating static pages using 3 workers (7/29) 
#11 52.25   Generating static pages using 3 workers (14/29) 
#11 52.39   Generating static pages using 3 workers (21/29) 
#11 52.47 ✓ Generating static pages using 3 workers (29/29) in 702ms
#11 52.50   Finalizing page optimization ...
#11 53.61 
#11 53.65 Route (app)
#11 53.65 ┌ ○ /
#11 53.65 ├ ○ /_not-found
#11 53.65 ├ ƒ /api/admin/handoffs
#11 53.65 ├ ƒ /api/admin/settings
#11 53.65 ├ ƒ /api/ai/tools/calculate-shipping
#11 53.65 ├ ƒ /api/ai/tools/confirm-order
#11 53.65 ├ ƒ /api/ai/tools/create-shopify-order
#11 53.65 ├ ƒ /api/ai/tools/handoff
#11 53.65 ├ ƒ /api/ai/tools/product-search
#11 53.65 ├ ƒ /api/ai/tools/select-product
#11 53.65 ├ ƒ /api/build-info
#11 53.65 ├ ƒ /api/dashboard/conversations
#11 53.65 ├ ƒ /api/dashboard/conversations/[id]
#11 53.65 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 53.65 ├ ƒ /api/dashboard/logs
#11 53.65 ├ ƒ /api/dashboard/orders
#11 53.65 ├ ƒ /api/dashboard/settings
#11 53.65 ├ ƒ /api/dashboard/stats
#11 53.65 ├ ƒ /api/health
#11 53.65 ├ ƒ /api/internal/failed-events
#11 53.65 ├ ƒ /api/internal/messages/turn
#11 53.65 ├ ƒ /api/webhooks/evolution
#11 53.65 ├ ƒ /dashboard
#11 53.65 ├ ƒ /dashboard/command-center
#11 53.65 ├ ƒ /dashboard/inbox
#11 53.65 ├ ƒ /dashboard/logs
#11 53.65 ├ ƒ /dashboard/orders
#11 53.65 ├ ƒ /dashboard/orders/[id]/safety
#11 53.65 ├ ƒ /dashboard/settings
#11 53.65 └ ○ /login
#11 53.65 
#11 53.65 
#11 53.65 ƒ Proxy (Middleware)
#11 53.65 
#11 53.65 ○  (Static)   prerendered as static content
#11 53.65 ƒ  (Dynamic)  server-rendered on demand
#11 53.65 
#11 53.83 npm notice
#11 53.83 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#11 53.83 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#11 53.83 npm notice To update run: npm install -g npm@11.13.0
#11 53.83 npm notice
#11 DONE 54.1s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 0.9s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.1s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.1s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers
#17 exporting layers 0.8s done
#17 writing image sha256:6f79863ad6902ec47941a3125f179f2eed878630821398f70ddff7bda1c45e82 0.0s done
#17 naming to docker.io/library/youlya-app:verify 0.0s done
#17 DONE 0.9s
PASS: docker-build

## Summary
- Verification status: PASS
