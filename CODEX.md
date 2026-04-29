# CODEX.md — Youlya AI Commerce OS
## Vibe Code Workflow (MANDATORY — NEVER SKIP)

Every task in this project follows this exact loop — no exceptions:

```
PROMPT → WORK → TESTS → PUSH → VERSION → README → (REPULL if dashboard) → DONE YA BOSS ✅
```

---

## Step-by-Step Workflow

### 1. PROMPT
- Read the task from the user.
- Before writing a single line of code, read in this order:
  1. `docs/04_CLAUDE.md`
  2. `docs/05_AGENTS.md`
  3. `docs/08_RUNBOOK.md`
  4. `docs/01_SPEC_DRIVEN_MASTER_SPEC.md`
  5. `docs/02_ROADMAP_PHASES.md`
  6. `LEARNINGS.md`
  7. `PROGRESS-LOG.md`
  8. `MEMORY.md`
- If any file is missing → create a task note and STOP. Do not code.

---

### 2. WORK
- Implement the task in the smallest safe increment.
- Follow all Golden Rules from `docs/04_CLAUDE.md`.
- No hardcoded secrets. No `any`. No `ts-ignore`.
- Run local checks before anything else:
  ```bash
  npm run typecheck && npm run lint && npm run build && npm test && npx playwright test
  ```
- Fix ALL errors before proceeding.

---

### 3. TESTS
- Save artifacts:
  - `qa-artifacts/tasks/YYYY-MM-DD/<task-slug>/baseline-RESULT.md`
  - `qa-artifacts/tasks/YYYY-MM-DD/<task-slug>/after-RESULT.md`
- Save screenshots for every UI flow.
- Update `PROGRESS-LOG.md`.
- Update `LEARNINGS.md` if ANY mistake occurred.

---

### 4. PUSH — GIT SAFETY RULES (READ CAREFULLY)

**NEVER commit or push these — ever:**
- `.env`
- `.env.local`
- `.env.production`
- `.env*.local`
- Any file matching `*.key`, `*.pem`, `*.p12`
- `node_modules/`
- Any file listed in `.gitignore`

**Before every commit, run:**
```bash
git diff --staged --name-only
```
If ANY sensitive file appears in the staged list → STOP immediately. Do not commit. Remove it from staging with `git reset HEAD <file>`.

**Verify `.gitignore` contains:**
```
.env
.env.local
.env.production
.env*.local
*.key
*.pem
node_modules/
.next/
```

**Then commit:**
```bash
git add .
git status   # verify no .env files in staged
git commit -m "[<phase>] <task-slug> — <one-line summary>

Version: vX.Y.Z-<name>"
git tag -a vX.Y.Z-<name> -m "<summary>"
git push origin main --tags
```

---

### 5. README per Release

Create `RELEASES/<version-name>.md`:

```markdown
# Release: vX.Y.Z — <Version Name>

## Task
<what was the prompt>

## What Was Done
- bullet list of changes

## Files Changed
- list of files

## Tests Run
- test names and pass/fail

## Phase Progress
Phase X — ~X% complete

## Known Risks
- anything not covered yet

## Next Step
<next task slug>

## Status
✅ DONE YA BOSS
```

Also append to root `README.md` under `## Changelog`:
```markdown
- **vX.Y.Z-<name>** — <date> — <one-line summary>
```

---

### 6. REPULL (Dashboard Phase 2+ Only)

Only when the task is a dashboard/UI change AND the VPS stack is configured:

```bash
curl -X POST   -H "X-API-Key: $PORTAINER_API_KEY"   "$PORTAINER_URL/api/stacks/$PORTAINER_STACK_ID/git/redeploy"   -H "Content-Type: application/json"   -d '{"pullImage": true}'
```

Wait for health check. Screenshot the live URL. Save to `qa-artifacts/`.

---

### 7. DONE YA BOSS ✅

**Final output after EVERY task — no exceptions:**

```
✅ DONE YA BOSS

Version  : vX.Y.Z-<version-name>
Phase    : Phase X — <name>
Task     : <slug>
Pushed   : github.com/PROIDEA-EGYPT/youlya
Tag      : vX.Y.Z-<version-name>
Release  : RELEASES/<version-name>.md
Tests    : ✅ PASS / ⚠️ PARTIAL / ❌ FAIL
Repull   : ✅ Live / ⏭️ Skipped
Next     : <next task>
```

---

## Version Naming Convention

| Pattern | When |
|---------|------|
| `v0.0.x-<fix>` | Quick fix or config change |
| `v0.x.0-<feature>` | New feature, new API, new page |
| `v1.0.0-phase0-complete` | Phase 0 gate passed |
| `v1.1.0-phase1-youlya-live` | Phase 1 gate passed |
| `v1.2.0-phase2-dashboard-mvp` | Phase 2 gate passed |
| `v2.0.0-saas-multitenancy` | SaaS phase |

---

## Hard Rules (violations = task rejected)

1. Never push if tests fail.
2. Never push `.env` or any secret file — EVER.
3. Never skip the version tag.
4. Never skip `RELEASES/<version>.md`.
5. Always update `PROGRESS-LOG.md`.
6. Always update `LEARNINGS.md` if any mistake happened.
7. If user approval needed → STOP and ask.
