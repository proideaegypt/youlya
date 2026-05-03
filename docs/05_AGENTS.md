# 05 — AGENTS.md — Youlya AI Commerce OS Agent Swarm

> Claude Code is Architect/Reviewer. Codex is executor swarm.  
> No agent pushes without approval.

---

## Swarm Principles
- One agent = one domain.
- Agents do not touch files outside scope.
- Parallel when independent.
- Sequential when dependent.
- Every agent returns: changes, tests, risks, artifacts.
- Every agent checks LEARNINGS before starting.
- Every agent logs mistakes.

---

## Core Agent Roster

| Agent | Owns | Trigger |
|---|---|---|
| ArchitectAgent | system plan, architecture, decisions | every phase |
| WorkflowAgent | n8n workflows, Evolution, retries | workflow changes |
| ShopifyAgent | Shopify orders, inventory, GraphQL/REST | commerce changes |
| DataAgent | Supabase schema, sync, RLS | DB/API changes |
| AIAgent | prompts, tools, RAG, language/tone | AI behavior |
| UIAgent | dashboard UI, themes, RTL/LTR | UI changes |
| i18nAgent | translations, Arabic/English | UI/copy changes |
| SecurityAgent | auth, roles, secrets, webhooks | before merge |
| TestAgent | Playwright, scenario runner, QA artifacts | every task |
| LoadAgent | performance, rate limits, queues | scale tests |
| ReportAgent | exports, charts, KPIs | dashboard reports |
| ReleaseAgent | version, changelog, deploy | approved release |
| LearningAgent | LEARNINGS audit | after every task |
| ReviewAgent | final cross-domain review | before approval |

---

## Execution Flow

```text
User task
→ ArchitectAgent creates spec + task scope
→ Relevant agents run
→ SecurityAgent reviews
→ TestAgent runs baseline/after tests
→ ReviewAgent checks output
→ Claude says APPROVED or rejects
→ Deploy live for manual test
→ User approval
→ ReleaseAgent commits/pushes/tags
```

---

## Agent Contracts

### ArchitectAgent
Input:
- user request
- existing specs
- current phase

Output:
- task plan
- impacted modules
- risk rating
- acceptance criteria
- agent assignments

Rules:
- no scope creep.
- do not skip phase gates.
- if high risk, require user approval.

### WorkflowAgent
Owns:
- n8n workflow JSON.
- webhook routing.
- media handling.
- Evolution API calls.
- retries and error workflow.

Must test:
- workflow JSON valid.
- no hardcoded secrets.
- duplicate webhook idempotency.
- sendText/sendMedia fallback.
- audio/image branches.
- error path.

Agent Rules for n8n Tasks:
- For every n8n task, run `npm run check:n8n:env` first.
- Use n8n MCP/API read-only first (`npm run n8n:list`).
- Export workflow before editing (`npm run n8n:export -- --name "..."`).
- Validate workflow JSON before pilot (`npm run validate:n8n`).
- Never hardcode n8n, Evolution, or internal secrets in workflow JSON.
- Do not run real WhatsApp tests until workflows validate PASS.

### ShopifyAgent
Owns:
- product sync.
- variant resolver.
- order creation.
- order update/cancel tag.
- inventory checks.

Must test:
- wrong variant blocked.
- out-of-stock blocked.
- duplicate order blocked.
- order tags/notes correct.
- update rules correct.
- Shopify API errors handled.

### DataAgent
Owns:
- migrations.
- RLS.
- Supabase queries.
- cache tables.
- indexes.

Must test:
- store_id isolation.
- no cross-store reads.
- schema constraints.
- indexes for search/mapping.
- seed data.

### AIAgent
Owns:
- system prompts.
- tool descriptions.
- intent detection.
- language/tone.
- RAG rules.
- handoff logic.

Must test:
- no hallucinated prices.
- asks missing fields once.
- same-language reply.
- short replies.
- escalation after unclear 3.
- no order without confirmation.

### UIAgent
Owns:
- components.
- pages.
- themes.
- charts.
- responsive behavior.

Must test:
- light/dark/auto.
- RTL/LTR.
- mobile.
- empty/loading/error.
- visual consistency.
- screenshots.

### i18nAgent
Owns:
- messages/ar.json.
- messages/en.json.
- direction.
- fonts.

Must test:
- all keys present.
- no raw strings.
- Arabic Cairo.
- RTL layout.

### SecurityAgent
Owns:
- permissions.
- auth.
- webhook secrets.
- credentials.
- audit logs.

Must test:
- no service role in client.
- no secrets in bundle.
- roles enforced.
- RLS enabled.
- mutation audit log.

### TestAgent
Owns:
- scenario datasets.
- Playwright specs.
- API contract tests.
- n8n contract tests.
- screenshots.

Must produce:
- baseline/after artifacts.
- pass/fail report.
- reproducible command.

### LoadAgent
Owns:
- k6/artillery tests.
- webhook throughput.
- media queue.
- rate limits.

Must test:
- burst messages.
- 100 concurrent conversations.
- Shopify retry/backoff.
- Evolution send throttling.

### LearningAgent
Owns:
- LEARNINGS.md.
- repeated mistake detection.

Must test:
- no repeated mistakes.
- every mistake has prevention.

---

## Prompt Format to Agents

```text
AGENT: <Name>
PHASE: <Phase>
FILES ALLOWED:
- <paths>
TASK:
- <precise work>
CONSTRAINTS:
- no scope creep
- no secrets
- no any
- respect store_id
VERIFY:
- commands
- expected results
REPORT:
- files changed
- tests run
- risks
- screenshots/artifacts
```

---

## Agent Review Checklist

Before saying done:
- [ ] Pre-task docs read.
- [ ] Scope respected.
- [ ] Tests run.
- [ ] Security checked.
- [ ] i18n checked if UI.
- [ ] No hardcoded secrets.
- [ ] No order risk.
- [ ] Logs/audits included.
- [ ] Artifacts saved.
- [ ] LEARNINGS updated if any mistake.

---

## ReleaseAgent — Full Workflow Contract

**Triggers:** After every task is complete, before saying Done.

**Owns:**
- Semantic version bump (patch/minor/major)
- Version name generation from task slug
- Git commit + tag + push
- `RELEASES/<version-name>.md` creation
- Root `README.md` changelog update
- `PROGRESS-LOG.md` update
- Portainer repull trigger (Dashboard phases only)
- Final "DONE YA BOSS ✅" output block

**Steps (in order):**
1. Confirm all checks pass: `typecheck + lint + build + unit + playwright`
2. Run `git diff --staged --name-only` — verify zero `.env` or secret files
3. Calculate next semantic version
4. Generate version name from task slug
5. Write `RELEASES/<version-name>.md`
6. Append to root `README.md` changelog
7. `git add . && git commit && git tag && git push origin main --tags`
8. If Dashboard Phase 2+: trigger Portainer repull + screenshot
9. Output DONE YA BOSS block

**Must verify before every push:**
- [ ] `git diff --staged` shows no `.env*` files
- [ ] No hardcoded secrets in diff
- [ ] No `any` or `ts-ignore` added
- [ ] `LEARNINGS.md` updated if mistake occurred
- [ ] `PROGRESS-LOG.md` updated
- [ ] `RELEASES/<version-name>.md` written
- [ ] Tag created and pushed

**Never push if:**
- Tests fail
- User approval is pending
- `.env` or credentials appear in staged files
