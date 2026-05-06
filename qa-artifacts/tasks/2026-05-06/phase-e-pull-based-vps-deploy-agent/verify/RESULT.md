# Verify Before Deploy

- Date: 2026-05-06
- Branch: main
- Commit: b5ac014

Running: check-env-tracking

> youlya-phase0-app@2.23.3 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env: ignored
.env.backup-youlya365-20260506: ignored
.env.local: ignored
.env.local.backup-youlya365-20260506: ignored
.env.playwright: ignored
.env.playwright.backup-youlya365-20260506: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.production.backup-youlya365-20260506: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.23.3 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.23.3 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.23.3 lint
> eslint .


/root/youlya/app/api/dashboard/channels/evolution/accounts/[id]/connect/route.ts
  4:10  warning  'fetchEvolutionQR' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/api/dashboard/channels/evolution/accounts/route.ts
  4:49  warning  'updateChannelAccount' is defined but never used         @typescript-eslint/no-unused-vars
  5:35  warning  'getEvolutionConnectionState' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/api/dashboard/settings/ai-agent/route.ts
  48:27  warning  'req' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/api/dashboard/settings/shipping/route.ts
  4:175  warning  'matchShippingZone' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/api/internal/messages/turn/route.ts
  10:44  warning  'logError' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/app/dashboard/products-intelligence/page.tsx
  231:15  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
  454:21  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/root/youlya/app/dashboard/products/page.tsx
  306:25  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/root/youlya/app/dashboard/settings/ai-agent/page.tsx
  2:1  warning  Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions

/root/youlya/app/dashboard/settings/channels/page.tsx
  2:1  warning  Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions

/root/youlya/app/dashboard/settings/shipping/page.tsx
  2:1  warning  Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions

/root/youlya/app/dashboard/settings/users/page.tsx
  2:1  warning  Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions

/root/youlya/lib/adapters/shopify/live-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used    @typescript-eslint/no-unused-vars
  9:24  warning  '_payload' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/shopify/mock-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/supabase/product-mapping-repository.ts
  1:15  warning  'ProductRecommendation' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/services/channel-settings-service.ts
    2:48  warning  'decryptSecret' is defined but never used         @typescript-eslint/no-unused-vars
    2:83  warning  'deserializeEncrypted' is defined but never used  @typescript-eslint/no-unused-vars
  122:3   warning  'actorUserId' is defined but never used           @typescript-eslint/no-unused-vars
  133:3   warning  'actorUserId' is defined but never used           @typescript-eslint/no-unused-vars

/root/youlya/lib/services/shipping-settings-service.ts
  61:3  warning  'actorUserId' is defined but never used  @typescript-eslint/no-unused-vars
  74:3  warning  'actorUserId' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/_tmp-check-tables.ts
  18:14  warning  'e' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/auto-release.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/scripts/test-product-search-and-selection.ts
  32:9  warning  'missingSkuHidden' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/update-n8n-haidi-v22.mjs
   20:7  warning  'parseNode' is assigned a value but never used         @typescript-eslint/no-unused-vars
   22:7  warning  'prepareReplyNode' is assigned a value but never used  @typescript-eslint/no-unused-vars
  171:7  warning  'buildPromptPos' is assigned a value but never used    @typescript-eslint/no-unused-vars

/root/youlya/scripts/update-readme.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/tests/unit/haidi-v22-compliance.test.ts
  6:7  warning  'APP_REPLY' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/tests/unit/supabase-browser-client.test.ts
  3:40  warning  '_url' is defined but never used  @typescript-eslint/no-unused-vars
  3:54  warning  '_key' is defined but never used  @typescript-eslint/no-unused-vars

✖ 33 problems (0 errors, 33 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.23.3 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 53ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1033ms
   ✓ evolution client > sendText 429 retries then resolves  1005ms
 ✓ tests/unit/message-history-service.test.ts (11 tests) 103ms
stdout | tests/api/message-turn.test.ts > message turn route > returns required shape in testMode
{"level":"metric","event":"message_turn_completed","action":"product_results","intent":"product_search","handoff":false,"toolsCalled":["product_search"]}

stdout | tests/api/message-turn.test.ts > message turn route > returns required shape in testMode
{"level":"info","requestId":"a081154868fd465b","method":"POST","path":"/api/internal/messages/turn","duration_ms":97,"action":"product_results","handoff":false}

stdout | tests/api/message-turn.test.ts > message turn route > derives conversation id from remote_jid when missing
{"level":"metric","event":"message_turn_completed","store_id":"youlya","action":"ai_disabled","intent":"ai_disabled","handoff":true,"toolsCalled":[]}

stdout | tests/api/message-turn.test.ts > message turn route > derives conversation id from remote_jid when missing
{"level":"info","requestId":"d051c2685a3c4795","method":"POST","path":"/api/internal/messages/turn","duration_ms":3,"action":"ai_disabled","handoff":true}

stdout | tests/api/message-turn.test.ts > message turn route > customer service request triggers handoff
{"level":"metric","event":"message_turn_completed","store_id":"youlya","action":"handoff","intent":"handoff","handoff":true,"toolsCalled":["handoff"]}

stdout | tests/api/message-turn.test.ts > message turn route > customer service request triggers handoff
{"level":"info","requestId":"d05939b309be454e","method":"POST","path":"/api/internal/messages/turn","duration_ms":10,"action":"handoff","handoff":true}

stdout | tests/api/message-turn.test.ts > message turn route > manager request triggers high priority handoff
{"level":"metric","event":"message_turn_completed","store_id":"youlya","action":"handoff","intent":"handoff","handoff":true,"toolsCalled":["handoff"]}

stdout | tests/api/message-turn.test.ts > message turn route > manager request triggers high priority handoff
{"level":"info","requestId":"d2721b27f202420b","method":"POST","path":"/api/internal/messages/turn","duration_ms":9,"action":"handoff","handoff":true}

stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"أكيد، دي شوية اختيارات مناسبة: 1) بيجامة شتوي أسود • 2) روب قطن وردي • 3) بوركيني أسود\n\nاختار المنتج اللي عايزه وابعتلي رقمه والمقاس."}

stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
{"level":"metric","event":"message_turn_completed","store_id":"11111111-1111-1111-1111-111111111111","action":"product_results","intent":"PRODUCT_SEARCH","handoff":false,"toolsCalled":["product_search"]}

 ✓ tests/api/message-turn.test.ts (7 tests) 235ms
stdout | tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
{"level":"info","requestId":"1dfbd2d5301547f3","method":"POST","path":"/api/internal/messages/turn","duration_ms":45,"action":"product_results","handoff":false}

stdout | tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام، الأوردر اتأكد بنجاح."}

stdout | tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
{"level":"metric","event":"message_turn_completed","store_id":"11111111-1111-1111-1111-111111111111","action":"order_created","intent":"CONFIRM_ORDER","handoff":false,"toolsCalled":["confirm_order","create_shopify_order"]}

stdout | tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
{"level":"info","requestId":"91df34b9b83b475b","method":"POST","path":"/api/internal/messages/turn","duration_ms":20,"action":"order_created","handoff":false}

stdout | tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"الخدمة متوقفة مؤقتاً، بنرجع قريب."}

stdout | tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
{"level":"metric","event":"message_turn_completed","store_id":"11111111-1111-1111-1111-111111111111","action":"ai_disabled","intent":"ai_disabled","handoff":false,"toolsCalled":[]}

stdout | tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
{"level":"info","requestId":"56f83e2764aa4533","method":"POST","path":"/api/internal/messages/turn","duration_ms":2,"action":"ai_disabled","handoff":false}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit customer service request -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.\nتم تسجيل الطلب، وسيتواصل معاكي حد من الفريق."}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit customer service request -> immediate handoff
{"level":"metric","event":"message_turn_completed","store_id":"11111111-1111-1111-1111-111111111111","action":"handoff","intent":"handoff","handoff":true,"toolsCalled":["handoff"]}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit customer service request -> immediate handoff
{"level":"info","requestId":"69f5749c943244d1","method":"POST","path":"/api/internal/messages/turn","duration_ms":28,"action":"handoff","handoff":true}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit manager request -> immediate handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.\nتم تسجيل الطلب، وسيتواصل معاكي حد من الفريق."}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit manager request -> immediate handoff
{"level":"metric","event":"message_turn_completed","store_id":"11111111-1111-1111-1111-111111111111","action":"handoff","intent":"handoff","handoff":true,"toolsCalled":["handoff"]}

stdout | tests/integration/message-turn.test.ts > message turn integration > explicit manager request -> immediate handoff
{"level":"info","requestId":"737035d25f484032","method":"POST","path":"/api/internal/messages/turn","duration_ms":10,"action":"handoff","handoff":true}

stdout | tests/integration/message-turn.test.ts > message turn integration > greeting and unclear messages do not handoff
[MOCK-EVOLUTION] Would send: {"instanceName":"youlya","remoteJid":"201000000000@s.whatsapp.net","text":"ممكن توضحي أكثر؟"}

stdout | tests/integration/message-turn.test.ts > message turn integration > greeting and unclear messages do not handoff
{"level":"metric","event":"message_turn_completed","store_id":"11111111-1111-1111-1111-111111111111","action":"ai_reply","intent":"UNCLEAR","handoff":false,"toolsCalled":[]}

stdout | tests/integration/message-turn.test.ts > message turn integration > greeting and unclear messages do not handoff
{"level":"info","requestId":"8edd24633d3047c1","method":"POST","path":"/api/internal/messages/turn","duration_ms":9,"action":"ai_reply","handoff":false}

 ✓ tests/integration/message-turn.test.ts (6 tests) 217ms
 ✓ tests/unit/haidi-agent.test.ts (21 tests) 133ms
 ✓ tests/unit/haidi-prompt-service.test.ts (4 tests) 102ms
 ✓ tests/unit/shopify-order-service.test.ts (10 tests) 95ms
 ✓ tests/integration/message-turn-evolution.test.ts (3 tests) 57ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 53ms
 ✓ tests/unit/handoff-policy-service.test.ts (13 tests) 37ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 175ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 45ms
 ✓ tests/unit/haidi-settings-service.test.ts (6 tests) 79ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 10ms
 ✓ tests/unit/shipping.test.ts (2 tests) 13ms
 ✓ tests/unit/handoff-service.test.ts (5 tests) 9ms
 ✓ tests/unit/handoff-center.test.ts (12 tests) 19ms
 ✓ tests/unit/haidi-v22-compliance.test.ts (23 tests) 30ms
 ✓ tests/unit/products-intelligence-service.test.ts (33 tests) 38ms
 ✓ tests/unit/root-page.test.ts (1 test) 157ms
stdout | tests/unit/haidi-lab-service.test.ts > haidi-lab-service > runs scenario in safe test mode and returns score
{"level":"metric","event":"message_turn_completed","store_id":"youlya","action":"product_results","intent":"PRODUCT_SEARCH","handoff":false,"toolsCalled":["product_search"]}

stdout | tests/unit/haidi-lab-service.test.ts > haidi-lab-service > runs scenario in safe test mode and returns score
{"level":"metric","event":"message_turn_completed","action":"product_results","intent":"PRODUCT_SEARCH","handoff":false,"toolsCalled":["product_search"]}

 ✓ tests/unit/haidi-lab-service.test.ts (3 tests) 27ms
 ✓ tests/unit/admin-control-plane.test.ts (10 tests) 51ms
 ✓ tests/unit/knowledge-base-service.test.ts (3 tests) 98ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 49ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 90ms
 ✓ tests/unit/user-management-route-guards.test.ts (5 tests) 40ms
 ✓ tests/unit/select-product.test.ts (13 tests) 17ms

 Test Files  28 passed (28)
      Tests  223 passed (223)
   Start at  07:27:29
   Duration  18.45s (transform 4.22s, setup 0ms, collect 14.62s, tests 3.07s, environment 56ms, prepare 11.72s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.23.3 validate:scenarios
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

> youlya-phase0-app@2.23.3 scan:secrets
> node scripts/scan-secrets.mjs

Secret scan passed: no obvious live secrets found.
PASS: scan-secrets
Running: verify-release

> youlya-phase0-app@2.23.3 verify:release
> node scripts/verify-release.mjs

PASS
- version: v2.23.3
- versionName: finish-user-management-update-deactivate-invite-flow
- releaseFile: RELEASES/v2.23.3-finish-user-management-update-deactivate-invite-flow.md
PASS: verify-release
Running: build

> youlya-phase0-app@2.23.3 build
> npm run build:info && next build --webpack


> youlya-phase0-app@2.23.3 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
▲ Next.js 16.2.4 (webpack)
- Environments: .env.local, .env.production, .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
