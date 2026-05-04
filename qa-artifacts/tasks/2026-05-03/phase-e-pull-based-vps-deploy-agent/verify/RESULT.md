# Verify Before Deploy

- Date: 2026-05-03
- Branch: main
- Commit: be3670a

Running: check-env-tracking

> youlya-phase0-app@2.7.1 check:env:tracking
> git status --ignored --short .env .env.local .env.production .env.test ".env.production.backup*" ".env.*" | node scripts/check-env-files-not-tracked.mjs

.env.local: ignored
.env.playwright: ignored
.env.playwright.example: ignored
.env.production: ignored
.env.test: ignored

ENV tracking check passed.
PASS: check-env-tracking
Running: check-env-production

> youlya-phase0-app@2.7.1 check:env:production
> node scripts/check-production-env.mjs

Checked .env.production keys only (values not printed).
Required keys: 7
Present keys: 7
Production env key check passed.
PASS: check-env-production
Running: typecheck

> youlya-phase0-app@2.7.1 typecheck
> tsc --noEmit

PASS: typecheck
Running: lint

> youlya-phase0-app@2.7.1 lint
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

/root/youlya/app/dashboard/products/page.tsx
  306:25  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/root/youlya/lib/adapters/shopify/live-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used    @typescript-eslint/no-unused-vars
  9:24  warning  '_payload' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/shopify/mock-shopify-adapter.ts
  5:26  warning  '_items' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/lib/adapters/supabase/product-mapping-repository.ts
  1:15  warning  'ProductRecommendation' is defined but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/auto-release.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/scripts/test-product-search-and-selection.ts
  32:9  warning  'missingSkuHidden' is assigned a value but never used  @typescript-eslint/no-unused-vars

/root/youlya/scripts/update-readme.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/tests/unit/supabase-browser-client.test.ts
  3:40  warning  '_url' is defined but never used  @typescript-eslint/no-unused-vars
  3:54  warning  '_key' is defined but never used  @typescript-eslint/no-unused-vars

✖ 17 problems (0 errors, 17 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

PASS: lint
Running: unit-tests

> youlya-phase0-app@2.7.1 test
> vitest run


 RUN  v3.2.4 /root/youlya

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > angry tone -> HIGH priority ticket created
handoff_tickets insert error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'ai_summary' column of 'handoff_tickets' in the schema cache"[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > angry tone -> HIGH priority ticket created
human_handoffs insert error {
  code: [32m'22P02'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'invalid input syntax for type uuid: "conv-1"'[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered
readConversationState error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column conversations.state_json does not exist'[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered
writeConversationState error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'agent_handling' column of 'conversations' in the schema cache"[39m
}

stderr | tests/unit/select-product.test.ts > select product > select by index + size
saveRecommendations failed invalid input syntax for type uuid: "c1"

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered
readConversationState error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column conversations.state_json does not exist'[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered
writeConversationState error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'agent_handling' column of 'conversations' in the schema cache"[39m
}

stderr | tests/unit/select-product.test.ts > select product > select by index + size
getRecommendations failed invalid input syntax for type uuid: "c1"

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered
readConversationState error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column conversations.state_json does not exist'[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered
writeConversationState error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'agent_handling' column of 'conversations' in the schema cache"[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > tool logger strips phone/address from input_summary
logToolCall insert error {
  code: [32m'22P02'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'invalid input syntax for type uuid: "conv-3"'[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > duplicate handoff same conversation -> upsert not duplicate
handoff_tickets insert error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'ai_summary' column of 'handoff_tickets' in the schema cache"[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > duplicate handoff same conversation -> upsert not duplicate
human_handoffs insert error {
  code: [32m'22P02'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'invalid input syntax for type uuid: "conv-4"'[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > duplicate handoff same conversation -> upsert not duplicate
handoff_tickets insert error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'ai_summary' column of 'handoff_tickets' in the schema cache"[39m
}

stderr | tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > duplicate handoff same conversation -> upsert not duplicate
human_handoffs insert error {
  code: [32m'22P02'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'invalid input syntax for type uuid: "conv-4"'[39m
}

 ❯ tests/unit/handoff-service.test.ts (6 tests | 2 failed) 2098ms
   ✓ handoff + kill switch + ai tool logs > angry tone -> HIGH priority ticket created  792ms
   × handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered 879ms
     → expected +0 to be 1 // Object.is equality
   ✓ handoff + kill switch + ai tool logs > kill switch on -> true 1ms
   ✓ handoff + kill switch + ai tool logs > kill switch off -> false 0ms
   × handoff + kill switch + ai tool logs > tool logger strips phone/address from input_summary 77ms
     → expected undefined to be 'pajama' // Object.is equality
   ✓ handoff + kill switch + ai tool logs > duplicate handoff same conversation -> upsert not duplicate 263ms
stderr | tests/unit/select-product.test.ts > select product > fails safely when mapping expired
saveRecommendations failed invalid input syntax for type uuid: "c2"

stderr | tests/unit/select-product.test.ts > select product > fails safely when mapping expired
clearRecommendations failed invalid input syntax for type uuid: "c2"

stderr | tests/unit/select-product.test.ts > select product > fails safely when mapping expired
getRecommendations failed invalid input syntax for type uuid: "c2"

stderr | tests/unit/select-product.test.ts > select product > blocks out-of-stock selection
saveRecommendations failed invalid input syntax for type uuid: "c3"

stderr | tests/unit/select-product.test.ts > select product > blocks out-of-stock selection
getRecommendations failed invalid input syntax for type uuid: "c3"

stderr | tests/unit/select-product.test.ts > select product > supports multi-item selection with one size
saveRecommendations failed invalid input syntax for type uuid: "c4"

stderr | tests/unit/select-product.test.ts > select product > supports multi-item selection with one size
getRecommendations failed invalid input syntax for type uuid: "c4"

 ❯ tests/unit/select-product.test.ts (4 tests | 4 failed) 3345ms
   × select product > select by index + size 1641ms
     → expected 'M 60-70kg' to be 'XL' // Object.is equality
   × select product > fails safely when mapping expired 870ms
     → expected 'added_to_cart' to be 'mapping_expired' // Object.is equality
   × select product > blocks out-of-stock selection 392ms
     → expected 'added_to_cart' to be 'oos' // Object.is equality
   × select product > supports multi-item selection with one size 383ms
     → expected 'not_found' to be 'added_to_cart' // Object.is equality
 ❯ tests/integration/message-turn.test.ts (4 tests | 4 failed) 1453ms
   × message turn integration > text message -> intent -> product search -> reply 299ms
     → expected undefined to be 'PRODUCT_SEARCH' // Object.is equality
   × message turn integration > confirm -> idempotency check -> order created 279ms
     → expected undefined to be 'CONFIRM_ORDER' // Object.is equality
   × message turn integration > kill switch ON -> immediate handoff 287ms
     → expected 'duplicate_ignored' to be 'handoff' // Object.is equality
   × message turn integration > unclear x3 -> auto handoff triggered 541ms
     → expected 'duplicate_ignored' to be 'handoff' // Object.is equality
 ❯ tests/unit/failed-events.test.ts (2 tests | 1 failed) 331ms
   ✓ failed-events route > without auth returns 401 26ms
   × failed-events route > with auth returns 201 300ms
     → expected 500 to be 201 // Object.is equality
stderr | tests/unit/shopify-order-service.test.ts > shopify order service > happy path: order created + audit log written
checkOrderIdempotencyKey error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column order_idempotency_keys.shopify_order_id does not exist'[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > happy path: order created + audit log written
markOrderIdempotencyCreated error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'idempotency_key' column of 'order_idempotency_keys' in the schema cache"[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > happy path: order created + audit log written
orders insert error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'channel' column of 'orders' in the schema cache"[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > duplicate call returns existing, no second Shopify call
checkOrderIdempotencyKey error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column order_idempotency_keys.shopify_order_id does not exist'[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > duplicate call returns existing, no second Shopify call
markOrderIdempotencyCreated error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'idempotency_key' column of 'order_idempotency_keys' in the schema cache"[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > duplicate call returns existing, no second Shopify call
orders insert error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'channel' column of 'orders' in the schema cache"[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > duplicate call returns existing, no second Shopify call
checkOrderIdempotencyKey error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column order_idempotency_keys.shopify_order_id does not exist'[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > OOS recheck blocks order
checkOrderIdempotencyKey error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column order_idempotency_keys.shopify_order_id does not exist'[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > Shopify 429 triggers retry
checkOrderIdempotencyKey error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column order_idempotency_keys.shopify_order_id does not exist'[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > Shopify 429 triggers retry
markOrderIdempotencyCreated error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'idempotency_key' column of 'order_idempotency_keys' in the schema cache"[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > Shopify 429 triggers retry
orders insert error {
  code: [32m'PGRST204'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m"Could not find the 'channel' column of 'orders' in the schema cache"[39m
}

stderr | tests/unit/shopify-order-service.test.ts > shopify order service > Shopify 500 error returns failure with no fake order
checkOrderIdempotencyKey error {
  code: [32m'42703'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'column order_idempotency_keys.shopify_order_id does not exist'[39m
}

 ✓ tests/unit/shopify-order-service.test.ts (6 tests) 1837ms
   ✓ shopify order service > happy path: order created + audit log written  1010ms
   ✓ shopify order service > duplicate call returns existing, no second Shopify call  392ms
stderr | tests/integration/message-turn-evolution.test.ts > message turn evolution integration > duplicate provider_message_id returns cached result
logToolCall insert error {
  code: [32m'22P02'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'invalid input syntax for type uuid: "c-evo-1"'[39m
}

stderr | tests/integration/message-turn-evolution.test.ts > message turn evolution integration > duplicate provider_message_id returns cached result
logToolCall insert error {
  code: [32m'22P02'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'invalid input syntax for type uuid: "c-evo-dup"'[39m
}

 ✓ tests/integration/message-turn-evolution.test.ts (2 tests) 629ms
   ✓ message turn evolution integration > duplicate provider_message_id returns cached result  365ms
stderr | logToolCall (/root/youlya/lib/services/ai-tool-logger.ts:48:24)
logToolCall insert error {
  code: [32m'22P02'[39m,
  details: [1mnull[22m,
  hint: [1mnull[22m,
  message: [32m'invalid input syntax for type uuid: "c-evo-dup"'[39m
}

stdout | tests/unit/evolution-client.test.ts > evolution client > mock mode does not call HTTP
[MOCK-EVOLUTION] Would send: {"instanceName":"YoulyaMain","remoteJid":"2010@s.whatsapp.net","text":"hi"}

 ✓ tests/unit/evolution-client.test.ts (3 tests) 1068ms
   ✓ evolution client > sendText 429 retries then resolves  1006ms
 ✓ tests/unit/auth-middleware.test.ts (7 tests) 286ms
 ✓ tests/unit/root-page.test.ts (1 test) 72ms
 ✓ tests/unit/supabase-browser-client.test.ts (2 tests) 85ms
 ✓ tests/unit/product-mapping-repository.test.ts (4 tests) 11ms
 ✓ tests/unit/intent-detector.test.ts (6 tests) 25ms
 ✓ tests/api/message-turn.test.ts (1 test) 54ms
 ✓ tests/unit/confirmation.test.ts (2 tests) 33ms
 ✓ tests/unit/cart-validation.test.ts (6 tests) 24ms
 ✓ tests/unit/shipping.test.ts (2 tests) 37ms

⎯⎯⎯⎯⎯⎯ Failed Tests 11 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/integration/message-turn.test.ts > message turn integration > text message -> intent -> product search -> reply
AssertionError: expected undefined to be 'PRODUCT_SEARCH' // Object.is equality

[32m- Expected:[39m 
"PRODUCT_SEARCH"

[31m+ Received:[39m 
undefined

 ❯ tests/integration/message-turn.test.ts:59:25
     57|     );
     58|     const body = (await res.json()) as Record<string, unknown>;
     59|     expect(body.intent).toBe("PRODUCT_SEARCH");
       |                         ^
     60|     expect(body.action).toBe("product_results");
     61|     expect(Array.isArray(body.toolsCalled)).toBe(true);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/11]⎯

 FAIL  tests/integration/message-turn.test.ts > message turn integration > confirm -> idempotency check -> order created
AssertionError: expected undefined to be 'CONFIRM_ORDER' // Object.is equality

[32m- Expected:[39m 
"CONFIRM_ORDER"

[31m+ Received:[39m 
undefined

 ❯ tests/integration/message-turn.test.ts:93:25
     91|     );
     92|     const body = (await res.json()) as Record<string, unknown>;
     93|     expect(body.intent).toBe("CONFIRM_ORDER");
       |                         ^
     94|     expect(body.action).toBe("order_created");
     95|     expect(body.handoff).toBe(false);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/11]⎯

 FAIL  tests/integration/message-turn.test.ts > message turn integration > kill switch ON -> immediate handoff
AssertionError: expected 'duplicate_ignored' to be 'handoff' // Object.is equality

Expected: [32m"handoff"[39m
Received: [31m"duplicate_ignored"[39m

 ❯ tests/integration/message-turn.test.ts:118:25
    116|     );
    117|     const body = (await res.json()) as Record<string, unknown>;
    118|     expect(body.action).toBe("handoff");
       |                         ^
    119|     expect(body.handoff).toBe(true);
    120|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/11]⎯

 FAIL  tests/integration/message-turn.test.ts > message turn integration > unclear x3 -> auto handoff triggered
AssertionError: expected 'duplicate_ignored' to be 'handoff' // Object.is equality

Expected: [32m"handoff"[39m
Received: [31m"duplicate_ignored"[39m

 ❯ tests/integration/message-turn.test.ts:143:29
    141|     }
    142| 
    143|     expect(lastBody.action).toBe("handoff");
       |                             ^
    144|     expect(lastBody.handoff).toBe(true);
    145|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/11]⎯

 FAIL  tests/unit/failed-events.test.ts > failed-events route > with auth returns 201
AssertionError: expected 500 to be 201 // Object.is equality

[32m- Expected[39m
[31m+ Received[39m

[32m- 201[39m
[31m+ 500[39m

 ❯ tests/unit/failed-events.test.ts:38:24
     36|       ),
     37|     );
     38|     expect(res.status).toBe(201);
       |                        ^
     39|   });
     40| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/11]⎯

 FAIL  tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > unclear 3x -> handoff auto-triggered
AssertionError: expected +0 to be 1 // Object.is equality

[32m- Expected[39m
[31m+ Received[39m

[32m- 1[39m
[31m+ 0[39m

 ❯ tests/unit/handoff-service.test.ts:37:44
     35|     await incrementUnclearCount("conv-2", { store_id: "youlya", custom…
     36|     await incrementUnclearCount("conv-2", { store_id: "youlya", custom…
     37|     expect(getMockState().handoffs.length).toBe(1);
       |                                            ^
     38|     expect(getMockState().handoffs[0]?.reason).toBe("UNCLEAR_3X");
     39|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/11]⎯

 FAIL  tests/unit/handoff-service.test.ts > handoff + kill switch + ai tool logs > tool logger strips phone/address from input_summary
AssertionError: expected undefined to be 'pajama' // Object.is equality

[32m- Expected:[39m 
"pajama"

[31m+ Received:[39m 
undefined

 ❯ tests/unit/handoff-service.test.ts:70:42
     68|     expect(logged?.input_summary?.phone).toBeUndefined();
     69|     expect(logged?.input_summary?.address).toBeUndefined();
     70|     expect(logged?.input_summary?.query).toBe("pajama");
       |                                          ^
     71|   });
     72| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/11]⎯

 FAIL  tests/unit/select-product.test.ts > select product > select by index + size
AssertionError: expected 'M 60-70kg' to be 'XL' // Object.is equality

Expected: [32m"XL"[39m
Received: [31m"M 60-70kg"[39m

 ❯ tests/unit/select-product.test.ts:25:35
     23|     });
     24|     expect(result.status).toBe("added_to_cart");
     25|     expect(result.items[0]?.size).toBe("XL");
       |                                   ^
     26|   });
     27| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/11]⎯

 FAIL  tests/unit/select-product.test.ts > select product > fails safely when mapping expired
AssertionError: expected 'added_to_cart' to be 'mapping_expired' // Object.is equality

Expected: [32m"mapping_expired"[39m
Received: [31m"added_to_cart"[39m

 ❯ tests/unit/select-product.test.ts:46:27
     44|       testMode: true,
     45|     });
     46|     expect(result.status).toBe("mapping_expired");
       |                           ^
     47|   });
     48| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/11]⎯

 FAIL  tests/unit/select-product.test.ts > select product > blocks out-of-stock selection
AssertionError: expected 'added_to_cart' to be 'oos' // Object.is equality

Expected: [32m"oos"[39m
Received: [31m"added_to_cart"[39m

 ❯ tests/unit/select-product.test.ts:66:27
     64|       testMode: true,
     65|     });
     66|     expect(result.status).toBe("oos");
       |                           ^
     67|   });
     68| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/11]⎯

 FAIL  tests/unit/select-product.test.ts > select product > supports multi-item selection with one size
AssertionError: expected 'not_found' to be 'added_to_cart' // Object.is equality

Expected: [32m"added_to_cart"[39m
Received: [31m"not_found"[39m

 ❯ tests/unit/select-product.test.ts:86:27
     84|       testMode: true,
     85|     });
     86|     expect(result.status).toBe("added_to_cart");
       |                           ^
     87|     expect(result.items.length).toBe(2);
     88|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/11]⎯


 Test Files  4 failed | 12 passed (16)
      Tests  11 failed | 47 passed (58)
   Start at  23:30:59
   Duration  19.58s (transform 5.32s, setup 0ms, collect 18.55s, tests 11.39s, environment 54ms, prepare 9.94s)

