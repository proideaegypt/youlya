# Baseline — wire-n8n-api-and-mcp-agent-tooling

Date: 2026-05-02
Task: wire-n8n-api-and-mcp-agent-tooling
Previous task: restore-and-validate-n8n-workflows (PARTIAL)

## n8n-related files found

```
workflows/README.md
workflows/Sales Assistant - SubWorkflow.json   (untracked, raw export, has secrets)
workflows/Whatsapp Youlya (4).json             (untracked, raw export, has secrets)
n8n/workflows/youlya-whatsapp-main.json        (canonical, sanitized)
n8n/env.example                                (env template)
scripts/validate-n8n-workflows.mjs             (existing, comprehensive)
docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md
docs/N8N_WHATSAPP_MANUAL_TEST_RUNBOOK.md
docs/N8N_WORKFLOW_IMPORT_AND_VALIDATION.md
docs/MCP_SETUP.md
docs/05_AGENTS.md
.mcp.json                                      (untracked, has hardcoded N8N_API_KEY)
.codex/config.example.toml
```

## Workflow export status

- Raw exports present in `workflows/` but contain hardcoded secrets
- Canonical workflow at `n8n/workflows/youlya-whatsapp-main.json` is clean
- No n8n API workflow discovery/export scripts exist yet

## Existing MCP config status

- `.mcp.json` exists with hardcoded `N8N_API_KEY` — must NOT be committed
- `docs/MCP_SETUP.md` documents MCP servers but uses placeholder examples
- `.codex/config.example.toml` has commented-out n8n MCP config
- No dedicated `configs/mcp/` templates with env-only placeholders
- No `N8N_MCP_URL` or `N8N_MCP_TOKEN` references found in repo configs

## Missing scripts/docs

- `scripts/check-n8n-env.mjs` — env validator
- `scripts/n8n-list-workflows.mjs` — API workflow discovery
- `scripts/n8n-export-workflows.mjs` — API workflow export
- `configs/mcp/codex.config.example.toml` — Codex MCP template
- `configs/mcp/claude.mcp.example.json` — Claude MCP template
- `configs/mcp/opencode.example.jsonc` — OpenCode MCP template
- `docs/N8N_MCP_AND_API_AGENT_SETUP.md` — comprehensive agent setup doc
- `.mcp.json.example` — safe template
- `.gitignore` entry for `.mcp.json`

## Env vars available (name only)

```
N8N_MCP_URL=***REDACTED***
N8N_MCP_TOKEN=***REDACTED***
N8N_API_URL=***REDACTED***
N8N_API_KEY=***REDACTED***
```

All four required keys are present in `.env.production` and `.env.local`.

## Safe plan

1. Add `.mcp.json` to `.gitignore`
2. Create `.mcp.json.example` with env placeholders
3. Create `scripts/check-n8n-env.mjs`
4. Create `scripts/n8n-list-workflows.mjs`
5. Create `scripts/n8n-export-workflows.mjs`
6. Update `scripts/validate-n8n-workflows.mjs` to scan for N8N secrets
7. Create MCP config templates in `configs/mcp/`
8. Create `docs/N8N_MCP_AND_API_AGENT_SETUP.md`
9. Update `docs/05_AGENTS.md` with n8n agent rules
10. Run all checks and deploy
