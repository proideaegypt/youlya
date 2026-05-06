# AGENT SWARM — Full System Audit, QA, and Live Launch Readiness
# Youlya AI Commerce OS — v2.17.x — 2026-05-04

> **For:** Codex (executor) + Kimi (independent reviewer)
> **Mode:** AUDIT ONLY — no business logic changes, no deployments, no pushing, no live WhatsApp traffic
> **Verdict:** Go / No-Go for live pilot launch + prioritized fix list

---

## 0. MANDATORY PRE-READS

Before any agent writes a single line or runs a single command, every agent must read these files completely from `/root/youlya/`:

1. `CLAUDE.md`
2. `START_HERE_FOR_CODEX.md`
3. `MEMORY.md`
4. `PROGRESS-LOG.md`
5. `LEARNINGS.md`
6. `AGENTS.md`
7. `docs/05_AGENTS.md`
8. `docs/08_RUNBOOK.md`
9. `docs/01_SPEC_DRIVEN_MASTER_SPEC.md`
10. `docs/02_ROADMAP_PHASES.md`
11. `docs/07_TEST_STRATEGY_AND_SWARMS.md`
12. `docs/10_DEPLOYMENT_ARCHITECTURE.md`
13. `docs/11_SHOPIFY_PRODUCT_NAME_CODE_SPEC.md`
14. `docs/12_DASHBOARD_SYSTEM_FEATURES_FINAL.md`
15. `docs/13_API_AND_STATE_CONTRACTS.md`
16. `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md`
17. `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md`
18. `docs/18_NO_OVERENGINEERING_RULES.md`

---

## 1. ABSOLUTE SAFETY RULES (CANNOT BE OVERRIDDEN)

1. **NEVER** create, test, or submit a real Shopify order.
2. **NEVER** print, log, echo, or expose any secret value. Report key presence as SET/MISSING only.
3. **NEVER** commit `.env*`, `.mcp.json`, or raw n8n workflow exports to git.
4. **NEVER** import raw n8n workflow exports that contain hardcoded credentials.
5. **NEVER** run `git push` or `npm run deploy:production` without explicit `TEST Ya AHMED` approval from the owner.
6. **NEVER** open real WhatsApp inbound traffic or send real messages to customers.
7. **NEVER** run `--no-verify`, `--force`, `git reset --hard`, or skip any hook.
8. **NEVER** change business logic. This is audit-only mode — flag issues as findings, do NOT silently fix.
9. **NEVER** apply production DB migrations without owner approval.
10. If any agent discovers a **P0 blocker** (active secret leak, auth bypass, real Shopify mutation path, live customer data exposure), **STOP the entire swarm immediately** and report it before any further actions.

**Stop condition trigger**: P0 = write `qa-artifacts/tasks/2026-05-04/full-system-audit-swarm/P0_STOP_REPORT.md` and halt.

---

## 2. ROLES AND DIVISION OF WORK

### Codex — Executor Agent
Codex runs all commands, reads all files, generates all findings, and writes all output artifacts.

Codex runs these agent personas sequentially, writing a RESULT.md per agent:

1. `CodeReviewAgent`
2. `SecurityAgent`
3. `RLS_DBAgent`
4. `CommerceSafetyAgent`
5. `N8nWorkflowAgent`
6. `HaidiAIAgent`
7. `DashboardUXAgent`
8. `PerformanceAgent`
9. `GapAnalysisAgent`
10. `ReportAgent` (consolidator — runs last, writes final report)

### Kimi — Independent Reviewer
Kimi reads the entire codebase independently without looking at Codex output first. Kimi provides:
- Architecture critique (does code match CLAUDE.md architecture boundaries?)
- Prompt safety review (is the Haidi system prompt safe?)
- Independent second opinion on any finding Codex rated PASS (especially security, auth, RLS)
- Second-opinion on the Gap Analysis gate matrix
- Write findings to `qa-artifacts/tasks/2026-05-04/full-system-audit-swarm/kimi/KIMI_REVIEW.md`

---

## 3. OUTPUT ARTIFACT PATHS

All output files go under:
```
qa-artifacts/tasks/2026-05-04/full-system-audit-swarm/
├── code-review/RESULT.md
├── security/RESULT.md
├── rls-db/RESULT.md
├── commerce-safety/RESULT.md
├── n8n-workflow/RESULT.md
├── haidi-ai/RESULT.md
├── dashboard-ux/RESULT.md
├── performance/RESULT.md
├── gap-analysis/RESULT.md
├── kimi/KIMI_REVIEW.md
├── EXECUTIVE_REPORT.md        ← final consolidated report
└── LAUNCH_READINESS.md        ← Go / No-Go verdict + manual go-live checklist
```

At the end of the task: append a worktime.md entry and a PROGRESS-LOG.md entry per project rules.

---

## 4. AGENT 1 — CodeReviewAgent

**Scope**: TypeScript quality, architecture boundary violations, overengineering, file size limits, dead code.

### Commands to run:
```bash
npm run typecheck
npm run lint
npm test -- --reporter=verbose
```

### Manual review checklist:
- [ ] All files under `app/api/**/route.ts` ≤ 150 lines (grep `wc -l`)
- [ ] All files under `lib/*.ts` ≤ 400 lines
- [ ] All files under `components/*.tsx` ≤ 300 lines
- [ ] No `any` types: `grep -r ":\s*any" lib/ app/ --include="*.ts" --include="*.tsx"`
- [ ] No `@ts-ignore`: `grep -r "@ts-ignore" . --include="*.ts" --include="*.tsx"`
- [ ] No `@ts-expect-error` without issue reference: `grep -r "@ts-expect-error" . --include="*.ts" --include="*.tsx"`
- [ ] Shared interfaces in `lib/types/` only: `grep -r "^interface\|^type " app/ --include="*.ts" --include="*.tsx" | grep -v "lib/types"`
- [ ] Every mutation API route has: auth, store context, Zod validation, permission check, idempotency, service call, audit log, safe error response
- [ ] Architecture boundary: n8n owns only (webhook intake, media, calling app endpoints, sending messages). Check for business logic in n8n nodes.
- [ ] Architecture boundary: App backend owns (AI turn, product search, cart, order state, Shopify mutations, handoff, logs, dashboard APIs)
- [ ] No hardcoded store IDs, tenant IDs, customer data, or product IDs in service code
- [ ] Every DB query includes `store_id` or `tenant_id` filter

### Known issues to verify still exist:
- `verify:deploy` script hangs during build step — identify root cause
- `package.json` `versionName` is `undefined` in v2.17.2 — was this ever fixed?
- Haidi type/test failures referenced in worktime.md PROMPT 60 for `stabilize-whatsapp-loop-foundation`
- Lint warnings count (last known: 21 warnings in v2.10.0) — have they grown?

### Report format:
```markdown
## CodeReview RESULT
Status: PASS / PARTIAL / FAIL
Test results: X/X pass
Lint: X errors, X warnings
TypeScript: PASS/FAIL

### File size violations (if any)
### Architecture boundary violations (if any)
### Type safety issues (if any)
### Dead code (if any)
### Findings (CRITICAL / HIGH / MEDIUM / LOW)
```

---

## 5. AGENT 2 — SecurityAgent

**Scope**: Secrets exposure, auth middleware, JWT validation, webhook signature checks, rate limiting, input sanitization, XSS/CSRF/injection surfaces, OWASP Top 10.

### Commands to run:
```bash
npm run scan:secrets
npm run check:env:tracking
npm run check:env:production
```

### Manual audit checklist:

**Secrets:**
- [ ] No API keys, tokens, passwords in any `.ts`, `.tsx`, `.json`, `.md` file tracked in git
- [ ] `.env*` files are gitignored (check `.gitignore`)
- [ ] `scripts/scan-secrets.mjs` exclusions are safe (not overly broad)
- [ ] `supabase service role key` is server-only and never reaches frontend bundle
- [ ] `INTERNAL_API_SECRET` — is the production value a real secret or still a placeholder? Check `.env.production` key presence only — DO NOT PRINT VALUE. If key shows as SET but was `placeholder_secret_change_me` in earlier tasks, flag as HIGH.

**Auth:**
- [ ] `app/dashboard/layout.tsx` — does the auth guard use server-side Supabase `getUser()` (not cookie heuristic)?
- [ ] `lib/middleware/auth.ts` (or equivalent) — is JWT validation real (Supabase-backed) not just existence check?
- [ ] `lib/middleware/internal-auth.ts` — does internal API secret check use constant-time comparison?
- [ ] Admin routes (`app/api/admin/**`) — are they protected by owner/admin role check?
- [ ] Dashboard API routes (`app/api/dashboard/**`) — all require auth?
- [ ] Internal routes (`app/api/internal/**`) — all require `INTERNAL_API_SECRET` header?
- [ ] Webhook routes (`app/api/webhooks/**`) — is Evolution webhook signature validated?

**Input validation:**
- [ ] All POST routes have Zod schema validation before any DB or service call
- [ ] No SQL injection risk — all DB queries use parameterized queries (Supabase client), not string concatenation
- [ ] No XSS risk — user-supplied text never inserted as raw HTML in React components
- [ ] Evolution webhook `text` field — is it sanitized before passing to AI or product search?
- [ ] Product search query — is it length-limited and sanitized?

**Rate limiting:**
- [ ] Are public/internal endpoints rate-limited? Check for `next-rate-limit` or `upstash` or middleware patterns.
- [ ] If no rate limiting: flag as MEDIUM (acceptable for private pilot, must fix for SaaS)

**Audit logs:**
- [ ] Every Shopify mutation writes an audit log entry
- [ ] Audit logs are immutable (no UPDATE/DELETE on audit_logs table)
- [ ] AI tool calls are logged (check `ai_tool_calls` table writes)

**PII:**
- [ ] Customer phone numbers not logged in plain text (check `ai-tool-logger.ts` PII masking)
- [ ] `dead-letter-service.ts` — does it mask PII?
- [ ] Dashboard APIs — do they return masked customer IDs?

### Report format:
```markdown
## Security RESULT
Status: PASS / PARTIAL / FAIL

### CRITICAL findings
### HIGH findings
### MEDIUM findings
### LOW findings
### Passed checks
```

---

## 6. AGENT 3 — RLS_DBAgent

**Scope**: Supabase RLS policies, migration safety, schema vs spec alignment, multi-tenant isolation.

### Commands to run:
```bash
node scripts/schema-inventory.mjs
node scripts/schema-reconcile-check.mjs
npm run check:migration:safe -- supabase/migrations/20260504070000_haidi_settings.sql
npm run check:migration:safe -- supabase/migrations/20260504170000_approved_rag_knowledge_base.sql
npm run check:migration:safe -- supabase/migrations/20260504173000_haidi_lab_scenarios.sql
npm run check:migration:safe -- supabase/migrations/20260504060000_handoff_center_and_ai_pause.sql
npm run check:migration:safe -- supabase/migrations/20260504050000_message_history_and_timeline.sql
npm run check:migration:safe -- supabase/migrations/20260504040000_product_notes.sql
```

### Manual checklist:
- [ ] Every multi-tenant table has RLS ENABLED and at least one SELECT policy gating by `store_id` or `auth.uid()`
- [ ] Tables that must have RLS per spec: `stores`, `customers`, `conversations`, `messages`, `orders`, `order_items`, `products`, `product_variants`, `product_recommendations`, `handoff_tickets`, `ai_tool_calls`, `audit_logs`, `ai_settings`, `human_handoffs`, `processed_messages`, `dead_letter_log`, `knowledge_base`, `haidi_settings`, `haidi_lab_scenarios`
- [ ] All new migrations (2026-05-04) have been applied to production? Cross-check against Supabase migration history.
- [ ] No CASCADE DELETE on business-critical data (orders, products, customers)
- [ ] `audit_logs` table — is there a policy that prevents DELETE?
- [ ] All migration files pass `check:migration:safe` (no DROP TABLE, no TRUNCATE, no CASCADE on sensitive tables)
- [ ] `conversations.id` is TEXT type (was fixed in migration `20260502050000_fix_conversation_id_text.sql`) — verify no remaining UUID type mismatch in app code

### Report format:
```markdown
## RLS/DB RESULT
Status: PASS / PARTIAL / FAIL

### RLS gaps (tables without policies)
### Unsafe migration patterns
### Schema drift from spec
### UnApplied migrations
### Findings
```

---

## 7. AGENT 4 — CommerceSafetyAgent

**Scope**: The 16 Golden Rules (especially rules 1–5, 7, 9, 12), order creation safety, product mapping integrity, confirmation gate, idempotency, kill switch, handoff.

### Commands to run:
```bash
npm run validate:scenarios
npm run shopify:assert-readonly
```

### Manual checklist:

**Golden Rule compliance:**
- [ ] Rule 1: NEVER create Shopify order without explicit customer confirmation — check `shopify-order-service.ts`: is `confirmationParser` required before any `createCodOrder` call?
- [ ] Rule 2: NEVER guess price, stock, size, shipping — check `product-search-service.ts`: does it return only Supabase-cached Shopify data, never LLM hallucinations?
- [ ] Rule 3: Always resolve product by persisted mapping — check `product-mapping-service.ts`: is the mapping lookup from `last_product_recommendations` DB table, not from LLM memory?
- [ ] Rule 4: Always recheck stock before confirmation — does `shopify-order-service.ts` call inventory check before Shopify order?
- [ ] Rule 5: Idempotency key for order creation — check `idempotency-service.ts`: is the key generated deterministically and checked before Shopify create?
- [ ] Rule 12: Human handoff and kill switch must override AI immediately — check `message-turn-service.ts`: is `isAiEnabled` (kill switch) and `isHumanHandedOff` checked FIRST before any AI processing?

**Order creation flow integrity:**
- [ ] `POST /api/ai/tools/select-product` — validates auth, store context, Zod, calls service, logs?
- [ ] `POST /api/internal/messages/turn` — kill switch short circuit works?
- [ ] Duplicate order protection — `processed_messages` idempotency for incoming webhook messages still active?
- [ ] Dead letter logging — failed message turns write to `dead_letter_log`?
- [ ] Mock Shopify adapter — in testMode=true, does it ALWAYS return mock data and NEVER call real Shopify?

**Handoff system:**
- [ ] `handoff-service.ts` — does angry tone trigger immediate handoff?
- [ ] `handoff-service.ts` — does 3x unclear intent auto-trigger handoff?
- [ ] Kill switch route (`POST /api/admin/settings`) — does setting `ai_enabled=false` immediately stop message-turn processing (within 30s cache TTL)?
- [ ] Human handoff dashboard UI — can operator mark conversation as handed off and resumed?

### Report format:
```markdown
## CommerceSafety RESULT
Status: PASS / PARTIAL / FAIL

### Golden Rule violations (if any)
### Order creation safety gaps
### Handoff/kill-switch gaps
### Idempotency gaps
### Findings
```

---

## 8. AGENT 5 — N8nWorkflowAgent

**Scope**: Active n8n workflow correctness, Evolution webhook contract, loop guard, Send Text safety, env refs only, no hardcoded secrets.

### Commands to run:
```bash
npm run validate:n8n
npm run check:n8n:env
npm run n8n:list
```

### Manual checklist:
- [ ] Active `Youlya WhatsApp Main` workflow (ID `joqfame4HXG775JO`): verify active=true, webhook path=`youlya-whatsapp`, no hardcoded secrets
- [ ] Guard node `Guard Inbound Customer Message` is FIRST node after `Webhook`: `fromMe=true` returns 0 items and stops execution
- [ ] `Normalize Message` correctly reads `body.data.key.remoteJid`, `body.data.message.conversation`, `body.data.key.fromMe`, `body.data.key.id`
- [ ] `Prepare Reply` correctly maps `number` (non-blank), `reply` (non-empty fallback), `shouldSend` boolean
- [ ] `Prepare Evolution Payload` uses `JSON.stringify(...)` to build body, not raw expression concatenation
- [ ] `Send Text` uses env refs for Evolution URL and API key — NO hardcoded credentials
- [ ] No Switch node with `caseSensitive` property (known bug replaced in task fix-n8n-route-by-action-switch-node)
- [ ] Canonical workflow JSON at `n8n/workflows/youlya-whatsapp-main.json` matches live workflow shape (not stale draft)
- [ ] Haidi AI nodes (if present in active workflow): do they use env refs for OpenAI key? Do they route through Haidi validator before Send Text?
- [ ] n8n daily Shopify sync workflow (ID `H7l8PiCss9ZeqGug`): verify active=true, scheduled for 04:00 daily, calls `/api/internal/shopify/sync-products` only
- [ ] No second active workflow using webhook path `youlya-whatsapp` (duplicate webhook risk)
- [ ] `APP_INTERNAL_URL`, `INTERNAL_API_SECRET`, `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` — all SET in n8n container env? (key check only)

### Report format:
```markdown
## N8nWorkflow RESULT
Status: PASS / PARTIAL / FAIL

### Active workflow issues
### Loop guard status
### Send Text correctness
### Secret hygiene
### Env var completeness
### Findings
```

---

## 9. AGENT 6 — HaidiAIAgent

**Scope**: Haidi system prompt safety, context builder correctness, output validator strictness, Haidi-in-workflow safety.

### Files to review:
- `docs/HAIDI_AI_SALES_AGENT_PROMPT.md`
- `docs/HAIDI_MEMORY_DESIGN.md`
- `lib/services/haidi-context-builder.ts`
- `lib/services/haidi-output-validator.ts`
- `lib/services/haidi-settings-service.ts`
- `lib/services/haidi-lab-service.ts`
- `n8n/workflows/youlya-whatsapp-main-haidi-draft.json`
- `tests/unit/haidi-agent.test.ts`

### Commands to run:
```bash
npm test -- tests/unit/haidi-agent.test.ts --reporter=verbose
```

### Manual checklist:

**System prompt safety (docs/HAIDI_AI_SALES_AGENT_PROMPT.md):**
- [ ] Haidi is instructed NEVER to confirm prices without app confirmation
- [ ] Haidi is instructed NEVER to say "order is placed" unless app returned `action=order_created`
- [ ] Haidi is instructed NEVER to invent product IDs, SKUs, variant IDs
- [ ] Haidi is instructed NEVER to reveal internal system data (product IDs, store IDs, API responses)
- [ ] Haidi replies in customer's detected language (AR/EN)
- [ ] Haidi uses soft sales techniques (one upsell, free shipping nudge, size guidance) — NOT aggressive
- [ ] Haidi escalates to human after 3 unclear turns

**Context builder (`haidi-context-builder.ts`):**
- [ ] Does NOT pass raw Shopify IDs to Haidi prompt (only human-readable names/sizes)
- [ ] Cart summary is accurate to current session, not previous session
- [ ] `blockedReason` is passed to Haidi when there's a safety block (e.g., kill switch, OOS)
- [ ] Upsell suggestions come from Supabase cache, not LLM hallucination

**Output validator (`haidi-output-validator.ts`):**
- [ ] Blocks Haidi reply if it contains order confirmation claims without `app action=order_created`
- [ ] Blocks reply if it contains internal Supabase/Shopify IDs
- [ ] Blocks reply if it contains unverified price claims (e.g., exact price not in app context)
- [ ] Falls back to safe app reply template when Haidi output is blocked
- [ ] Unit tests cover: blocked unsafe order claim, blocked leaked IDs, blocked unverified price, safe passthrough

**Haidi in workflow:**
- [ ] Is Haidi active on the live workflow or still draft? (MUST confirm this — a parallel Codex process may have activated it)
- [ ] If active: does the live workflow route through `haidi-output-validator` before `Send Text`?
- [ ] If active: does OpenAI call use env ref for API key, not hardcoded?
- [ ] If Haidi is active but Haidi settings has `enabled=false`, does workflow fall back gracefully?

### Report format:
```markdown
## HaidiAI RESULT
Status: PASS / PARTIAL / FAIL

### Prompt safety issues
### Context builder issues
### Output validator gaps
### Workflow activation status (IS HAIDI LIVE OR DRAFT?)
### Test coverage gaps
### Findings
```

---

## 10. AGENT 7 — DashboardUXAgent

**Scope**: All dashboard pages, Playwright swarm quality, RTL/AR support, dark/light/auto theme, mobile responsiveness, a11y, missing h1, broken UI.

### Commands to run:
```bash
# Requires .env.playwright with real credentials — skip execution if env missing, report as BLOCKED
npm run test:e2e:dashboard:swarm
npm run qa:collect
```

### Dashboard pages to verify exist and render (check app/dashboard/ tree):
```
/dashboard/command-center     ← KPIs, live stats, AI status
/dashboard/inbox              ← conversation list
/dashboard/orders             ← order list
/dashboard/logs               ← AI tool call logs
/dashboard/products           ← product cache observability
/dashboard/products-intelligence ← AI selling insights
/dashboard/handoff            ← human handoff center
/dashboard/knowledge-base     ← RAG knowledge base
/dashboard/pilot              ← pilot control room
/dashboard/haidi              ← Haidi AI settings/lab
/dashboard/settings           ← store settings
/dashboard/statistics         ← analytics
/dashboard/devices            ← (mapped from smart-home theme)
/dashboard/profile            ← user profile
/dashboard/security           ← security settings
/dashboard/messages           ← message timeline
/dashboard/conversations      ← conversation detail
```

### Manual checklist:
- [ ] Login page (`/login`) — does it render correctly in AR and EN? Is Cairo font applied for Arabic?
- [ ] RTL support — all Arabic text renders right-to-left? Check `dir="rtl"` on body or html element when language=ar
- [ ] Dark/light/auto theme — CSS variables applied correctly? No hardcoded hex colors in component styles?
- [ ] Sidebar collapsed/expanded state — persists on page reload? (localStorage `youlya.sidebarCollapsed`)
- [ ] Language toggle — switching AR/EN works without page reload? Language preference persists after logout?
- [ ] Color theme — persists after refresh and after logout?
- [ ] Mobile layout — sidebar collapses to drawer on small screens?
- [ ] All dashboard pages have `<h1>` (or accessible heading) — check qa:collect report for missing h1
- [ ] Build identity footer shows correct version number
- [ ] No `console.error` or hydration mismatch warnings in browser (check if any `suppressHydrationWarning` is masking real issues)
- [ ] `/dashboard/handoff` — handoff center shows queue, team leader UI, AI pause button
- [ ] `/dashboard/knowledge-base` — shows knowledge items, add/edit/delete UI
- [ ] `/dashboard/pilot` — shows pilot control, live mode toggle, test scenarios
- [ ] `/dashboard/haidi` — Haidi AI settings panel renders correctly

### Playwright swarm scope check:
- Are all 18 dashboard pages covered in the UX swarm spec (`tests/playwright/dashboard-ux-swarm.spec.ts`)?
- Are all pages covered in a11y swarm?
- Are all API endpoints tested in API health swarm?
- Are functional flows tested (login → dashboard → toggle theme → toggle language → logout)?

### Report format:
```markdown
## DashboardUX RESULT
Status: PASS / PARTIAL / FAIL
Playwright swarm: X/X passed (or BLOCKED if no env)

### Missing pages
### Missing h1 routes
### RTL issues
### Theme issues
### Accessibility issues
### Playwright swarm gaps (pages not covered)
### Findings
```

---

## 11. AGENT 8 — PerformanceAgent

**Scope**: Build size, API response latency, DB query efficiency, N+1 risk, product search speed on 252 products.

### Commands to run:
```bash
npm run build 2>&1 | grep -E "size|chunks|KB|MB|First Load"
```

### Manual checklist:

**Build size:**
- [ ] Next.js First Load JS — check build output. Flag if any route > 500KB first-load JS.
- [ ] Are MUI or Recharts imports fully tree-shaken? (MUI removed in v2.4.0, but verify no residual import)
- [ ] Is the Tailwind CSS bundle reasonable? No purge config issues?

**API latency (analyze code, not live load test — flag risks):**
- [ ] `/api/internal/messages/turn` — how many sequential DB queries on a typical request? List them.
- [ ] `/api/ai/tools/product-search` — does it query Supabase products table? Is there an index on `available_for_ai=true` and store_id?
- [ ] `/api/dashboard/products/overview` — does it aggregate counts in one query or N queries?
- [ ] `/api/dashboard/products/catalog` — does it paginate? What's the default page size?
- [ ] `/api/dashboard/products-intelligence/products` — does it N+1 on product variants?
- [ ] Kill switch check in message-turn — is the 30s cache working? (No DB hit on every request)
- [ ] AI settings cache — is it in-memory or does it hit DB each turn?
- [ ] Product search on 252 products, 1082 variants — is the ILIKE query indexed? Check migration for GIN index or ILIKE-friendly index on `product_name`.

**DB query health:**
- [ ] Check all Supabase queries in `lib/adapters/supabase/` for missing `.select()` column lists (SELECT * is expensive)
- [ ] Check for missing `.limit()` on list queries that could return unbounded rows
- [ ] Check `last_product_recommendations` query — does it include `store_id` filter and `expires_at > now()` filter?

### Report format:
```markdown
## Performance RESULT
Status: PASS / PARTIAL / FAIL

### Build size analysis
### API latency risks
### DB query efficiency
### N+1 risks
### Missing indexes
### Findings
```

---

## 12. AGENT 9 — GapAnalysisAgent

**Scope**: Compare current implementation against Phase 0, Phase 1, and Phase 2 gate criteria from CLAUDE.md. Produce a gate matrix.

### Gate Matrix to produce:

#### Phase 0 — Youlya Production Hardening Gates
| Gate | Criterion | Status | Evidence |
|------|-----------|--------|----------|
| P0-1 | Product mapping works | ? | |
| P0-2 | Order confirmation works | ? | |
| P0-3 | Order creation idempotent | ? | |
| P0-4 | Error handling works | ? | |
| P0-5 | No hardcoded secrets | ? | |
| P0-6 | Handoff works | ? | |

#### Phase 1 — Youlya Live Gates
| Gate | Criterion | Status | Evidence |
|------|-----------|--------|----------|
| P1-1 | All core conversation scenarios pass | ? | |
| P1-2 | 0 duplicate orders | ? | |
| P1-3 | 0 wrong variant orders | ? | |
| P1-4 | Stock failure handled | ? | |
| P1-5 | Dashboard live monitor works | ? | |

#### Phase 2 — Dashboard MVP Gates
| Gate | Criterion | Status | Evidence |
|------|-----------|--------|----------|
| P2-1 | Auth/roles working | ? | |
| P2-2 | Command Center | ? | |
| P2-3 | Inbox | ? | |
| P2-4 | Orders | ? | |
| P2-5 | Products | ? | |
| P2-6 | AI Studio (Haidi) | ? | |
| P2-7 | Channels | ? | |
| P2-8 | Reports basic | ? | |
| P2-9 | AR/EN + dark/light/auto | ? | |

### Additional gap analysis:
- [ ] Are there any API routes documented in `docs/13_API_AND_STATE_CONTRACTS.md` that don't have implementations?
- [ ] Are there any DB tables in `docs/14_DATABASE_SCHEMA_AND_RLS_SPEC.md` that don't have migrations?
- [ ] Are there any n8n workflow nodes in `docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md` that don't exist in the canonical workflow?
- [ ] Are there any dashboard pages in `docs/12_DASHBOARD_SYSTEM_FEATURES_FINAL.md` marked MVP that aren't built?
- [ ] Is there a `/dashboard/channels` page? (Phase 2 requires Channels)
- [ ] Is there a basic Reports page? (Phase 2 requires Reports basic)
- [ ] Is AI Studio feature complete? (Haidi settings + lab + prompt versioning)
- [ ] Is `docs/HAIDI_AI_SALES_AGENT_PROMPT.md` versioned per the "Prompt changes require Draft → Test → Publish" rule?
- [ ] Is there any approval-based self-learning implemented yet (Phase 3 gate)?
- [ ] Is multi-channel normalization started (Phase 4 gate)?

### Report format:
```markdown
## GapAnalysis RESULT
Status: PASS / PARTIAL / FAIL

### Phase 0 Gate Matrix
### Phase 1 Gate Matrix
### Phase 2 Gate Matrix
### Missing features vs spec
### Overfeatured beyond current phase (may indicate drift)
### Findings
```

---

## 13. AGENT 10 — ReportAgent (Consolidator — runs last)

Reads all 9 agent RESULT.md files and Kimi's review, then produces:

### EXECUTIVE_REPORT.md

```markdown
# Executive Report — Full System Audit
# Youlya AI Commerce OS — v2.17.x — 2026-05-04

## System Summary
- Current version: X.X.X
- Production URL: https://admin.youlya365.com
- WhatsApp webhook: https://ai.youlya365.com/webhook/youlya-whatsapp
- Test count: X unit tests, X scenarios, X Playwright specs

## Agent Results Summary
| Agent | Status | Critical | High | Medium | Low |
|-------|--------|----------|------|--------|-----|
| CodeReview | | | | | |
| Security | | | | | |
| RLS/DB | | | | | |
| CommerceSafety | | | | | |
| N8nWorkflow | | | | | |
| HaidiAI | | | | | |
| DashboardUX | | | | | |
| Performance | | | | | |
| GapAnalysis | | | | | |

## All Findings by Priority
### CRITICAL (P0 — must fix before any live traffic)
### HIGH (P1 — must fix before 48h pilot)
### MEDIUM (P2 — fix before public launch)
### LOW (P3 — backlog)

## Phase Gate Summary
(copy gate matrix from GapAnalysisAgent)

## Kimi Independent Review Summary
(key divergences from Codex findings)
```

### LAUNCH_READINESS.md

```markdown
# Launch Readiness — Go / No-Go
# 2026-05-04

## Verdict: GO / NO-GO / CONDITIONAL GO

### Pre-conditions for CONDITIONAL GO (if applicable)
1. Fix X before opening real WhatsApp traffic
2. Confirm Y is resolved
3. ...

## Manual Go-Live Checklist (Owner executes — DO NOT automate)
- [ ] Owner types `TEST Ya AHMED` to approve live launch
- [ ] Run `npm run deploy:production` after all CRITICAL findings resolved
- [ ] Verify `https://admin.youlya365.com/api/health` → `checks.supabase: ok`
- [ ] Verify `https://admin.youlya365.com/api/build-info` → correct version
- [ ] Verify n8n webhook `POST https://ai.youlya365.com/webhook/youlya-whatsapp` returns 200
- [ ] Send one synthetic test message via WhatsApp (not public traffic, internal test number only)
- [ ] Verify dashboard shows the message in Inbox
- [ ] Verify product search responds in Arabic
- [ ] Verify handoff trigger works from dashboard
- [ ] Verify kill switch disables AI responses within 30s
- [ ] Run `npm run test:e2e:dashboard:swarm` one final time after deploy

## What is NOT automated (owner-only):
- Real WhatsApp inbound customer messages
- Real Shopify order creation approval
- DNS/TLS certificate renewal
- Supabase production migration apply (if any new migrations pending)
- n8n workflow activation/deactivation decisions
```

---

## 14. KNOWN ISSUES — VERIFY STILL REAL

These were outstanding issues as of the last task. Each agent must check if they still exist:

1. **verify:deploy script hangs** — bash subshell during build step. Individual commands pass. Root cause unknown. `PerformanceAgent` or `CodeReviewAgent` should investigate the script.
2. **package.json versionName undefined** — v2.17.2 shows `versionName: undefined`. Is this from release governance drift? Does it affect build-info endpoint?
3. **Haidi type/test failures** — referenced in worktime.md PROMPT 60 for `stabilize-whatsapp-loop-foundation`. Are these still failing or were they fixed later?
4. **INTERNAL_API_SECRET placeholder risk** — was confirmed SET in production but was `placeholder_secret_change_me` in an earlier task. `SecurityAgent` must confirm key is SET (value check forbidden — infer from behavioral test only).
5. **Lint warnings (21+)** — are they growing? Any of them hide real issues?
6. **Mock catalog fallback** — product search falls back to mock catalog when Supabase cache is empty. With 252 synced products, this should not trigger. But verify the fallback doesn't silently activate.
7. **Haidi activation status** — parallel Codex processes may have activated Haidi on live workflow before explicit approval. `HaidiAIAgent` must definitively determine: is Haidi live or draft?
8. **New migrations (2026-05-04) applied to production?** — Migrations for handoff center, message history, haidi settings, knowledge base, haidi lab. Were these applied? `RLS_DBAgent` must cross-check.

---

## 15. CODEX EXECUTION ORDER

```
Step 1: Pre-reads (all 18 docs)
Step 2: Create output directory: qa-artifacts/tasks/2026-05-04/full-system-audit-swarm/
Step 3: Run CodeReviewAgent → write code-review/RESULT.md
Step 4: Run SecurityAgent → write security/RESULT.md
Step 5: Run RLS_DBAgent → write rls-db/RESULT.md
Step 6: Run CommerceSafetyAgent → write commerce-safety/RESULT.md
Step 7: Run N8nWorkflowAgent → write n8n-workflow/RESULT.md
Step 8: Run HaidiAIAgent → write haidi-ai/RESULT.md
Step 9: Run DashboardUXAgent → write dashboard-ux/RESULT.md
Step 10: Run PerformanceAgent → write performance/RESULT.md
Step 11: Run GapAnalysisAgent → write gap-analysis/RESULT.md
Step 12: Run ReportAgent → write EXECUTIVE_REPORT.md + LAUNCH_READINESS.md
Step 13: Append entry to worktime.md (PROMPT / RESULT format per project rules)
Step 14: Append entry to PROGRESS-LOG.md (project log format per project rules)
Step 15: Run release governance: npm run release:task -- --task "full-system-audit-swarm" --type minor
Step 16: Run npm run verify:release
Step 17: STOP. Do NOT deploy. Wait for owner to read LAUNCH_READINESS.md and give TEST Ya AHMED.
```

---

## 16. KIMI EXECUTION ORDER (independent, after Codex)

```
Step 1: Pre-reads (all 18 docs, same list as Codex)
Step 2: Independent codebase review — do NOT read Codex RESULT.md files first
Step 3: Write kimi/KIMI_REVIEW.md covering:
  a. Architecture critique (is the code structure aligned with CLAUDE.md boundaries?)
  b. Haidi system prompt safety review (is the prompt in docs/HAIDI_AI_SALES_AGENT_PROMPT.md safe?)
  c. Second-opinion security review (auth, RLS, secret scan — did Codex miss anything?)
  d. Second-opinion Gap Analysis (gate matrix — did Codex rate anything PASS that should be FAIL?)
  e. Key divergences from Codex findings (where you disagree or found something Codex missed)
Step 4: DO NOT run deploy commands. Report only.
```

---

## 17. FINAL NOTE ON "LIVE PUBLISHING TODAY"

The swarm's job is to produce the **Go/No-Go verdict** with a complete evidence trail.

**"Live publishing"** in the context of this project means:
1. Owner reads `LAUNCH_READINESS.md`
2. Owner types `TEST Ya AHMED`
3. Owner or authorized agent runs `npm run deploy:production`
4. Owner performs manual go-live checklist
5. Owner sends first real WhatsApp message for internal pilot (not public)

The swarm **cannot** and **must not** perform steps 2–5 autonomously.

Real WhatsApp public customer traffic is owner-controlled manual step only.

---

*Generated: 2026-05-04 | Repo: /root/youlya | Version: 2.17.x*
*This prompt file: prompts/AGENT_SWARM_FULL_SYSTEM_AUDIT.md*
