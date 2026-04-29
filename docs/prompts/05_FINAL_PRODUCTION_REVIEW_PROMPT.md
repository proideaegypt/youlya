# Final Production Review Prompt

Use before full production enablement.

Review against these gates:

```text
No order without explicit confirmation
No wrong product/variant from index selection
No duplicate Shopify order from repeated webhook/confirmation
No order if OOS or stock unknown
Shipping Cairo/Alex/free threshold verified
Shopify COD tags/note verified
Product name/code/SKU stored from Shopify
Handoff works
Kill switch works
Audit/tool logs visible
No secrets in git/frontend
n8n workflows validated
Evolution failures handled
Shopify failures handled
Rollback plan ready
Team trained
Owner signoff artifact exists
```

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run validate:scenarios
npm run scan:secrets
node scripts/validate-shopify-products.mjs
node scripts/validate-n8n-workflows.mjs
APP_URL=<production-or-staging-url> SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

Create:

```text
qa-artifacts/tasks/YYYY-MM-DD/final-production-review/RESULT.md
```

Return PASS only if all critical gates pass.
