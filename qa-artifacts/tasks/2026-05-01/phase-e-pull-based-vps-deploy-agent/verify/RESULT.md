# Verify Before Deploy

- Date: 2026-05-01
- Branch: main
- Commit: f19455a

Running: check-env-tracking

> youlya-phase0-app@2.0.8 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.0.8 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.0.8 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.0.8 lint
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

> youlya-phase0-app@2.0.8 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/auth-middleware.test.ts (7 tests) 72ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1032ms
   ✓ evolution client > sendText 429 retries then resolves  1011ms
stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"أكيد، دي شوية اختيارات مناسبة: 1) بيجامة شتوي أسود • 2) روب قطن وردي • 3) بوركيني أسود\n\nاختار المنتج اللي عايزه وابعتلي رقمه والمقاس."}

 ✓ tests/api/message-turn.test.ts (1 test) 35ms
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

 ✓ tests/integration/message-turn.test.ts (4 tests) 88ms
 ✓ tests/unit/shipping.test.ts (2 tests) 32ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 19ms
 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 19ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 11ms
 ✓ tests/unit/select-product.test.ts (4 tests) 29ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 18ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 53ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 19ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 12ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 18ms

 Test Files  14 passed (14)
      Tests  55 passed (55)
   Start at  03:07:34
   Duration  5.40s (transform 1.31s, setup 0ms, collect 4.49s, tests 1.46s, environment 10ms, prepare 3.23s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.0.8 validate:scenarios
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

> youlya-phase0-app@2.0.8 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.0.8 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.0.8
- versionName: schema-migration-reconciliation
- releaseFile: RELEASES/v2.0.8-schema-migration-reconciliation.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.0.8 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.0.8 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
⚠ Compiled with warnings in 6.1s

./app/api/health/route.ts
Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)

Import trace for requested module:
./app/api/health/route.ts

Found 1 warning while optimizing generated CSS:

[2m│   }[22m
[2m│ }[22m
[2m│[22m @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap");
[2m┆[22m        [33m[2m^--[22m @import rules must precede all rules aside from @charset and @layer statements[39m
[2m┆[22m
[2m│ :root {[22m
[2m│   --background: #09090b;[22m

✓ Compiled successfully in 10.3s
  Running TypeScript ...
  Finished TypeScript in 11.5s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/29) ...
  Generating static pages using 3 workers (7/29) 
  Generating static pages using 3 workers (14/29) 
  Generating static pages using 3 workers (21/29) 
✓ Generating static pages using 3 workers (29/29) in 844ms
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
#2 transferring dockerfile: 556B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.6s

#4 [internal] load .dockerignore
#4 transferring context: 45B done
#4 DONE 0.0s

#5 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 102.05MB 4.4s done
#6 DONE 4.5s

#7 [deps 2/4] WORKDIR /app
#7 CACHED

#8 [deps 3/4] COPY package*.json ./
#8 DONE 0.9s

#9 [deps 4/4] RUN npm ci --omit=dev
#9 32.28 
#9 32.28 added 46 packages, and audited 47 packages in 32s
#9 32.28 
#9 32.28 10 packages are looking for funding
#9 32.28   run `npm fund` for details
#9 32.37 
#9 32.37 2 moderate severity vulnerabilities
#9 32.37 
#9 32.37 To address all issues (including breaking changes), run:
#9 32.37   npm audit fix --force
#9 32.37 
#9 32.37 Run `npm audit` for details.
#9 32.37 npm notice
#9 32.37 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#9 32.37 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#9 32.37 npm notice To update run: npm install -g npm@11.13.0
#9 32.37 npm notice
#9 DONE 33.5s

#10 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#10 CACHED

#11 [builder 4/5] COPY . .
#11 DONE 41.1s

#12 [builder 5/5] RUN npm run build
#12 2.233 
#12 2.233 > youlya-phase0-app@2.0.8 build
#12 2.233 > npm run build:info && next build --webpack
#12 2.233 
#12 2.634 
#12 2.634 > youlya-phase0-app@2.0.8 build:info
#12 2.634 > node scripts/write-build-info.mjs
#12 2.634 
#12 2.801 build info written: /app/public/build-info.json
#12 4.436 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#12 4.439 This information is used to shape Next.js' roadmap and prioritize features.
#12 4.439 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#12 4.439 https://nextjs.org/telemetry
#12 4.439 
#12 7.441 ▲ Next.js 16.2.4 (webpack)
#12 7.441 - Environments: .env.local, .env.production
#12 7.441 
#12 7.613 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#12 7.743   Creating an optimized production build ...
#12 32.16 ⚠ Compiled with warnings in 20.9s
#12 32.16 
#12 32.16 ./app/api/health/route.ts
#12 32.16 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#12 32.16 
#12 32.16 Import trace for requested module:
#12 32.16 ./app/api/health/route.ts
#12 32.16 
#12 42.86 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#12 51.96 Found 1 warning while optimizing generated CSS:
#12 51.96 
#12 51.96 [2m│   }[22m
#12 51.96 [2m│ }[22m
#12 51.96 [2m│[22m @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap");
#12 51.96 [2m┆[22m        [33m[2m^--[22m @import rules must precede all rules aside from @charset and @layer statements[39m
#12 51.96 [2m┆[22m
#12 51.96 [2m│ :root {[22m
#12 51.96 [2m│   --background: #09090b;[22m
#12 51.96 
#12 56.90 ✓ Compiled successfully in 39.8s
#12 56.95   Running TypeScript ...
#12 74.77   Finished TypeScript in 17.8s ...
#12 74.79   Collecting page data using 3 workers ...
#12 82.53   Generating static pages using 3 workers (0/29) ...
#12 82.84   Generating static pages using 3 workers (7/29) 
#12 83.48   Generating static pages using 3 workers (14/29) 
#12 83.48   Generating static pages using 3 workers (21/29) 
#12 83.97 ✓ Generating static pages using 3 workers (29/29) in 1445ms
#12 86.48   Finalizing page optimization ...
#12 86.48   Collecting build traces ...
#12 127.5 
#12 127.5 Route (app)
#12 127.5 ┌ ○ /
#12 127.5 ├ ○ /_not-found
#12 127.5 ├ ƒ /api/admin/handoffs
#12 127.5 ├ ƒ /api/admin/settings
#12 127.5 ├ ƒ /api/ai/tools/calculate-shipping
#12 127.5 ├ ƒ /api/ai/tools/confirm-order
#12 127.5 ├ ƒ /api/ai/tools/create-shopify-order
#12 127.5 ├ ƒ /api/ai/tools/handoff
#12 127.5 ├ ƒ /api/ai/tools/product-search
#12 127.5 ├ ƒ /api/ai/tools/select-product
#12 127.5 ├ ƒ /api/build-info
#12 127.5 ├ ƒ /api/dashboard/conversations
#12 127.5 ├ ƒ /api/dashboard/conversations/[id]
#12 127.5 ├ ƒ /api/dashboard/conversations/[id]/actions
#12 127.5 ├ ƒ /api/dashboard/logs
#12 127.5 ├ ƒ /api/dashboard/orders
#12 127.5 ├ ƒ /api/dashboard/settings
#12 127.5 ├ ƒ /api/dashboard/stats
#12 127.5 ├ ƒ /api/health
#12 127.5 ├ ƒ /api/internal/failed-events
#12 127.5 ├ ƒ /api/internal/messages/turn
#12 127.5 ├ ƒ /api/webhooks/evolution
#12 127.5 ├ ƒ /dashboard
#12 127.5 ├ ƒ /dashboard/command-center
#12 127.5 ├ ƒ /dashboard/inbox
#12 127.5 ├ ƒ /dashboard/logs
#12 127.5 ├ ƒ /dashboard/orders
#12 127.5 ├ ƒ /dashboard/orders/[id]/safety
#12 127.5 ├ ƒ /dashboard/settings
#12 127.5 └ ○ /login
#12 127.5 
#12 127.5 
#12 127.5 ƒ Proxy (Middleware)
#12 127.5 
#12 127.5 ○  (Static)   prerendered as static content
#12 127.5 ƒ  (Dynamic)  server-rendered on demand
#12 127.5 
#12 127.7 npm notice
#12 127.7 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#12 127.7 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#12 127.7 npm notice To update run: npm install -g npm@11.13.0
#12 127.7 npm notice
#12 DONE 127.9s

#13 [runner 3/7] RUN apk add --no-cache curl
#13 CACHED

#14 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#14 DONE 1.2s

#15 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#15 DONE 0.2s

#16 [runner 6/7] COPY --from=builder /app/public ./public
#16 DONE 0.1s

#17 [runner 7/7] COPY --from=builder /app/docs ./docs
#17 DONE 0.2s

#18 exporting to image
#18 exporting layers
#18 exporting layers 1.1s done
#18 writing image sha256:714ad915dedf007d5eaf5b8b64bb6633c23eec505be1f6af6e2190ef345450d9 done
#18 naming to docker.io/library/youlya-youlya-app 0.0s done
#18 DONE 1.1s

#19 resolving provenance for metadata file
#19 DONE 0.0s
 Image youlya-youlya-app Built 
PASS: docker-compose-build

## Summary
- Verification status: PASS
