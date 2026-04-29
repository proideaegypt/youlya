# 04 — CLAUDE.md — Youlya AI Commerce OS
# Operating Contract for Claude Code + Codex

> Root canonical copy exists at `CLAUDE.md`; this numbered docs copy is kept for the documentation read order.

---

> Read this file completely before touching code.  
> This is the operating contract for the Youlya AI Commerce OS project.

---

## Project Identity

| Field | Value |
|---|---|
| Product | Youlya AI Commerce OS |
| First Client | Youlya — Shopify fashion/sleepwear/lingerie brand |
| Core Stack | Next.js App Router · TypeScript strict · Supabase/Postgres · Tailwind/shadcn or selected template · n8n · Shopify · Evolution API |
| AI Stack | OpenAI/OpenRouter/Kimi/Claude/Codex as dev tools; production model configurable |
| Channels | WhatsApp Evolution first; Meta WhatsApp, Instagram, Facebook, Email later |
| Goal | AI employee for sales, support, order creation, post-sale, and analytics |
| Primary Launch | Youlya WhatsApp live |

---

## Mandatory Pre-Task Read Order

Before any coding task, read these files completely from the project root:

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

Hard rule:
- No coding, deployment, commit, or push before reading these files.
- If any file conflicts, follow: `CLAUDE.md` → `MEMORY.md` → `docs/18_NO_OVERENGINEERING_RULES.md` → current task prompt → older docs.

---

## Golden Rules

1. Never create Shopify order without explicit customer confirmation.
2. Never guess product price, stock, size, shipping, or delivery promise.
3. Always resolve product by persisted recommendation mapping, not AI memory.
4. Always recheck stock before order confirmation.
5. Always use idempotency key for order creation.
6. Never expose secrets to frontend or git.
7. Every store-scoped DB query must include `store_id` or `tenant_id`.
8. RLS must be enabled for multi-tenant tables.
9. Every mutation must write audit log.
10. Every AI tool call must be logged.
11. n8n orchestrates only; business logic lives in app endpoints.
12. Human handoff and kill switch must override AI immediately.
13. Prompt changes require Draft → Test → Publish.
14. Self-learning is approval-based only.
15. Arabic UI must support RTL and Cairo font.
16. UI must support light/dark/auto.

---

## Architecture Boundaries

### n8n owns
- Webhook intake from channels.
- Media conversion/transcription request.
- Calling app endpoints.
- Sending messages/media.
- Error workflow trigger.
- Retry orchestration.

### App backend owns
- Auth and roles.
- AI turn orchestration.
- Product search logic.
- Product mapping.
- Cart/order state.
- Shopify mutations.
- Handoff tickets.
- Logs/audits.
- Dashboard APIs.
- RAG retrieval.

### Supabase/Postgres owns
- Tenants/stores.
- Customers.
- Conversations/messages.
- Products/variants cache.
- Orders.
- Knowledge base.
- Prompt versions.
- Audit logs.

### Shopify owns
- Source of truth for catalog, variants, inventory, orders.

---

## Phase Gates

### Phase 0 — Youlya Production Hardening
Must pass:
- product mapping works.
- order confirmation works.
- order creation idempotent.
- error handling works.
- no hardcoded secrets.
- handoff works.

### Phase 1 — Youlya Live
Must pass:
- all core conversation scenarios.
- 0 duplicate orders.
- 0 wrong variant orders.
- stock failure handled.
- dashboard live monitor works.

### Phase 2 — Dashboard MVP
Must pass:
- auth/roles.
- Command Center.
- Inbox.
- Orders.
- Products.
- AI Studio.
- Channels.
- Reports basic.
- AR/EN + dark/light/auto.

### Phase 3 — RAG + Learning
Must pass:
- approval-based learning.
- no unapproved knowledge in production.
- retrieval is store-scoped.
- prompt rollback.

### Phase 4 — Multi-Channel
Must pass:
- normalized event schema across channels.
- channel adapters tested.
- per-channel health.

### Phase 5 — SaaS
Must pass:
- multi-tenant isolation.
- onboarding wizard.
- billing/usage.
- white-label readiness.

---

## Coding Standards

### TypeScript
- Strict mode.
- No `any`.
- No `@ts-ignore`.
- No `@ts-expect-error` unless there is an issue reference and explicit reviewer approval.
- Shared interfaces in `lib/types`.

### API Routes
Every mutation route must include:
- auth.
- store context.
- Zod validation.
- permission check.
- idempotency where needed.
- business logic service call.
- audit log.
- safe error response.

### Example Pattern
```ts
export async function POST(req: NextRequest) {
  const ctx = await requireStoreContext(req);
  if ("error" in ctx) return NextResponse.json({ error: ctx.error }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await assertPermission(ctx, "orders:create");

  const result = await createCodOrder({
    storeId: ctx.storeId,
    actorId: ctx.userId,
    input: parsed.data,
  });

  await writeAuditLog(ctx, "order.create", result.audit);

  return NextResponse.json({ data: result.data });
}
```

### File Limits
- `app/api/**/route.ts`: 150 lines max.
- `lib/*.ts`: 400 lines max.
- `components/*.tsx`: 300 lines max.
- split services by domain.

---

## i18n Rules
Supported:
- `ar`
- `en`

Later:
- `fr`, `de`, `es`, `uk` optional SaaS expansion.

Rules:
- No visible hardcoded text in UI.
- Arabic must use `dir="rtl"`.
- English must use `dir="ltr"`.
- Use Cairo for Arabic.
- Use Inter/Poppins for English.
- Language switcher in topbar.
- All user-facing AI templates must be translatable.

---

## Security Rules
- Secrets in env/secret manager only.
- Shopify/Evolution/Meta credentials encrypted or referenced by secret id.
- Supabase service role server-only.
- RLS on.
- Audit logs immutable.
- Webhooks must validate secret/signature where provider supports.
- Rate limit public/internal endpoints.
- Protect admin credential pages with owner/admin role.
- Never log full API keys or full PII in plain logs.

---

## AI Behavior Rules
The AI agent must:
- detect language.
- detect tone.
- keep reply short.
- use tools for products/orders.
- ask missing fields once.
- escalate after 3 unclear turns.
- never promise exact shipping date unless available.
- never say order is created unless Shopify returned success.
- never invent product info.
- never expose internal tool data to customer.
- use sales techniques softly:
  - one upsell only.
  - free shipping nudge.
  - product alternatives.
  - size guidance.

---

## Release Protocol
1. Baseline tests.
2. Implement.
3. Local checks.
4. Deploy to live/staging target.
5. Post-change Playwright.
6. Ask user manual QA:
   `TEST Ya AHMED`
7. Wait for explicit approval.
8. Version bump.
9. Commit.
10. Push.
11. Release notes.
12. Monitor.

Never push before explicit user approval.

---

## Learning Rule
Every mistake must be logged in `LEARNINGS.md`:
- context.
- exact mistake.
- root cause.
- fix.
- prevention rule.
- verification.

Repeating a documented mistake rejects the task.
