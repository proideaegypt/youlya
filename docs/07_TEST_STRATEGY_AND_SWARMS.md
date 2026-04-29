# Test Strategy and Swarms

## Testing principle

Tests exist to prevent wrong orders, duplicate orders, unsafe AI behavior, and hidden production failures.

## Scenario validation

Run:

```bash
node scripts/validate-scenarios.mjs
```

Expected:

```text
90 real scenarios
80 CONV
10 DASH
no fake header id
no duplicate ids
```

## Playwright E2E

Default Phase 0 run:

```bash
APP_URL=http://localhost:3000 SCENARIO_PREFIX=CONV npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

Dashboard scenarios are Phase 2:

```bash
APP_URL=http://localhost:3000 SCENARIO_PREFIX=DASH npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

Do not run `DASH` scenarios against `/api/internal/messages/turn` as a Phase 0 blocker.

## Required unit tests

```text
shipping Cairo/Alex/free threshold
unknown city handling
confirmation parser explicit yes
confirmation parser ambiguous after summary
confirmation parser ambiguous without summary
product index parser
size parser
multi-item parser
product mapping expired
select product by index + size
OOS blocks order
cart max item limit
idempotency duplicate confirmation
handoff triggers
kill switch
env does not expose server secrets
```

## Required API tests

```text
GET /api/health
POST /api/internal/messages/turn testMode
POST /api/ai/tools/product-search
POST /api/ai/tools/select-product
POST /api/ai/tools/calculate-shipping
POST /api/ai/tools/confirm-order
POST /api/ai/tools/create-shopify-order in mock mode
POST /api/ai/tools/handoff
```

## Required integration/manual tests before live

```text
Real Shopify product sync
Real Shopify COD order on internal/test order
Evolution inbound text
Evolution outbound text
Media fallback
n8n retry/backoff
Duplicate webhook
Shopify API failure
Evolution send failure
Human handoff
Kill switch
```

## Agent responsibilities

### Implementation agent / Codex

```text
writes code
runs tests
creates QA artifact
updates PROGRESS-LOG
```

### Reviewer / Claude Opus

```text
reviews safety gates
checks overengineering
checks product mapping/order logic
checks tests and blockers
```

### Human owner / Ahmed

```text
provides credentials
approves live Shopify mutations
approves production enablement
confirms business rules
```

## QA artifact standard

Every task creates:

```text
qa-artifacts/tasks/YYYY-MM-DD/<task-name>/RESULT.md
```

Template:

```text
# RESULT

STATUS: PASS/PARTIAL/FAIL
PHASE:
TASK:
SUMMARY:
FILES CHANGED:
COMMANDS RUN:
TESTS PASSED:
TESTS FAILED/SKIPPED:
BLOCKERS:
RISKS:
MANUAL QA:
NEXT STEP:
```

## Production acceptance

Do not mark production ready unless:

```text
typecheck pass
lint pass
unit pass
API pass
build pass
scenario validation pass
CONV E2E pass or approved manual-run result
secret scan pass
n8n workflow validation pass
internal soft launch pass
owner signoff
```
