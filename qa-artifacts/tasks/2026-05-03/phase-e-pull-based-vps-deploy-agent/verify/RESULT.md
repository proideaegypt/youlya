# Verify Before Deploy

- Date: 2026-05-03
- Branch: main
- Commit: 2f03968

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

> youlya-phase0-app@2.6.4 lint
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

/root/youlya/lib/adapters/supabase/product-sync-repository.ts
  168:51  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  185:52  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  195:52  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  205:52  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  216:51  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/root/youlya/lib/services/product-search-service.ts
  43:34  error  'productError' is never reassigned. Use 'const' instead  prefer-const

/root/youlya/lib/services/shopify-product-sync-service.ts
  48:54  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/root/youlya/scripts/auto-release.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/scripts/update-readme.js
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

/root/youlya/tests/unit/supabase-browser-client.test.ts
  3:40  warning  '_url' is defined but never used  @typescript-eslint/no-unused-vars
  3:54  warning  '_key' is defined but never used  @typescript-eslint/no-unused-vars

✖ 22 problems (7 errors, 15 warnings)
  0 errors and 2 warnings potentially fixable with the `--fix` option.

