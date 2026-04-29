# Codex Install and Skills Setup

## 1) Purpose
Prepare this repository for safe Codex execution before Phase 0 implementation.

## 2) What this setup installs
- Repo-scoped skills in `.agents/skills/`.
- Codex MCP template in `.codex/`.
- Local tooling checker script.
- Playwright Test + Playwright Agent CLI setup guidance.
- Portainer Git deployment templates/docs.
- QA artifact templates and task logging updates.

## 3) What it does not install
- Production credentials.
- Production deployment.
- SaaS features, RAG, campaign engine, or multi-channel expansions.
- Live Shopify/Evolution side effects.

## 4) Required local tools
- `node`
- `npm`
- `git`

## 5) Recommended local tools
- `docker`
- `docker compose`
- `supabase`
- `shopify`
- `npx`
- `jq`
- `rg`
- `gitleaks`

## 6) Repo-scoped skills list
- `youlya-phase-guardian`
- `youlya-commerce-safety-reviewer`
- `youlya-scenario-qa-runner`
- `youlya-shopify-product-sync`
- `youlya-supabase-rls-migration-reviewer`
- `youlya-n8n-evolution-contract-reviewer`
- `youlya-security-secret-auditor`
- `youlya-vps-docker-deployer`
- `youlya-dashboard-mvp-builder`
- `youlya-docs-progress-updater`

## 7) MCP setup guide
1. Copy `.codex/config.example.toml` to your local Codex config location.
2. Fill env vars in your shell or local secret manager.
3. Start with read-only sources where possible.
4. Keep Shopify direct write MCP disabled in Phase 0.
5. Route production Shopify order creation through app `ShopifyAdapter` only.

## 8) Permissions model
### 9) Safe from start
- Read/write repository files.
- Run local validation scripts.
- Run `npm install` only after `package.json` exists.
- Run typecheck/lint/tests.
- Run Playwright locally.
- Run Playwright Agent CLI against local/staging only.
- Create QA artifacts.
- Create branches/PRs if GitHub access exists.

### 10) Approval required
- Install new dependencies.
- Apply Supabase migration remotely.
- Edit production Docker/Nginx config.
- Touch Shopify live write logic.
- Edit n8n workflow JSON.
- Change confirmation rules.
- Change idempotency logic.
- Global Playwright Agent CLI install.
- Production browser login.

### 11) Do not give until later
- Production Shopify write token.
- Unrestricted production Supabase service role.
- Production Evolution send-message access.
- Production n8n admin write access.
- SSH root access to VPS.
- Direct push to main.
- Delete data permissions.

## 12) Playwright Test setup
Playwright Test is for automated tests.

```bash
npx playwright --version
npx playwright install --with-deps chromium
npx playwright test tests/playwright-youlya-scenarios.spec.ts --reporter=list
```

## 13) Playwright Agent CLI / AI Browser setup
Playwright Agent CLI is for AI/coding-agent browser use.

- Prefer local `npx` first.
- Global install only after approval.
- Browser deps may require `--with-deps`.
- Use local/staging dashboard first.
- Save screenshots/traces only inside `qa-artifacts`.
- Never capture screenshots with secrets visible.
- Never trigger production order creation through browser.

Commands:

```bash
npx playwright-cli --help
npx playwright-cli install-browser --with-deps
```

Optional global install (approval required):

```bash
npm install -g @playwright/cli@latest
playwright-cli --help
playwright-cli install-browser --with-deps
playwright-cli install --skills
```

## 14) Portainer overview
Deployment target is VPS Docker + Portainer from Git repo, using:
- `deploy/portainer/docker-compose.portainer.yml`
- `deploy/portainer/stack.env.example`
- `docs/21_PORTAINER_GIT_DEPLOY_FROM_REPO.md`

## 15) How to run tooling check
```bash
node scripts/check-codex-tooling.mjs
```

## 16) How to start Phase 0 after setup
1. Read required files in project read order.
2. Use `$youlya-phase-guardian` first.
3. Run scenario + secret + workflow validations.
4. Start Phase 0 commerce safety core in small increments only.

## 17) Troubleshooting
- Missing optional CLIs: continue and record as `PARTIAL`.
- Playwright CLI unavailable: use Playwright Test first, then install Agent CLI after approval.
- Missing workflow JSON: mark n8n validation `BLOCKED`, not `FAIL`.
- Missing real Shopify export/credentials: mark product validation `BLOCKED/TEMPLATE_OK`.

## 18) No-overengineering reminder
Do only what the current phase requires. Delay SaaS/dashboard growth features until Phase 0/1 safety gates pass.

