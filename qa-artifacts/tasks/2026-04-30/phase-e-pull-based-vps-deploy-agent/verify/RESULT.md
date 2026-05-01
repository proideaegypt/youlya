# Verify Before Deploy

- Date: 2026-04-30
- Branch: main
- Commit: f19455a

Running: typecheck

> youlya-phase0-app@2.0.3 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.0.3 lint
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

> youlya-phase0-app@2.0.3 test
> vitest run


 RUN  v3.2.4 /root/youlya

 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 37ms
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

 ✓ tests/integration/message-turn.test.ts (4 tests) 83ms
stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1025ms
   ✓ evolution client > sendText 429 retries then resolves  1010ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 78ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 7ms
 ✓ tests/api/message-turn.test.ts (1 test) 29ms
 ✓ tests/unit/failed-events.test.ts (2 tests) 33ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 13ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 10ms
 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 33ms
 ✓ tests/unit/shipping.test.ts (2 tests) 25ms
 ✓ tests/unit/select-product.test.ts (4 tests) 12ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 11ms
 ✓ tests/unit/handoff-service.test.ts (6 tests) 12ms

 Test Files  14 passed (14)
      Tests  55 passed (55)
   Start at  22:23:29
   Duration  5.46s (transform 1.35s, setup 0ms, collect 4.68s, tests 1.41s, environment 8ms, prepare 3.36s)

PASS: unit-tests
Running: validate-scenarios

> youlya-phase0-app@2.0.3 validate:scenarios
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

> youlya-phase0-app@2.0.3 scan:secrets
> node scripts/scan-secrets.mjs

Potential secrets found:
- .env.production:11 possible Supabase service role JWT
- .env.production:12 possible Supabase service role JWT
- .env.production:13 possible Supabase service role JWT
- .env.production:18 possible Shopify admin token
- .env.production:19 possible OpenAI key
