# N8N MCP and API Agent Setup

> **Security first**: Never print or commit `N8N_MCP_TOKEN` or `N8N_API_KEY`.

---

## Current n8n URLs (non-secret)

```text
N8N_MCP_URL=https://ai.youlya365.com/mcp-server/http
N8N_API_URL=https://ai.youlya365.com/
```

## Required Environment Variables

Configure these in your shell, `.env.production`, or n8n container environment:

```text
N8N_MCP_URL=https://ai.youlya365.com/mcp-server/http
N8N_MCP_TOKEN=<your-token>
N8N_API_URL=https://ai.youlya365.com/
N8N_API_KEY=<your-api-key>
```

> **Do not share or commit these values.**

---

## Quick Checks

### 1. Verify env vars are set

```bash
npm run check:n8n:env
```

Expected output:
```text
N8N_MCP_URL: SET
N8N_MCP_TOKEN: SET
N8N_API_URL: SET
N8N_API_KEY: SET
STATUS: PASS
```

### 2. List workflows from n8n API

```bash
npm run n8n:list
```

This queries the n8n API and writes safe metadata to:
```
qa-artifacts/tasks/YYYY-MM-DD/wire-n8n-api-and-mcp-agent-tooling/n8n-workflows.json
```

### 3. Validate local workflow JSON files

```bash
npm run validate:n8n
```

Checks:
- Workflow files exist and are valid JSON
- Nodes and connections are present
- Webhook path is `youlya-whatsapp`
- Calls `/api/internal/messages/turn`
- Uses env references (not hardcoded secrets)
- Has Evolution send text node
- No N8N/Evolution/internal secrets hardcoded

---

## Export Workflows from n8n API

### Export by name

```bash
npm run n8n:export -- --name "Whatsapp Youlya"
```

### Export by ID

```bash
npm run n8n:export -- --id "W_KlB6TE6fP0nj4WFHN4m"
```

### Export with custom output directory

```bash
npm run n8n:export -- --name "Sales Assistant - SubWorkflow" --out ./workflows
```

The export script automatically:
- Searches n8n API for the workflow
- Removes credential objects
- Replaces hardcoded `apikey` values with env references
- Backs up existing files before overwriting
- Prints only the output path (no secrets)

---

## MCP Configuration for Agents

### Claude Code (`.mcp.json`)

Use the example template:

```bash
cp configs/mcp/claude.mcp.example.json ~/.mcp.json
```

Then edit `~/.mcp.json` to replace `YOUR_N8N_API_KEY_HERE` with your real key.

**Important**: The repo `.mcp.json` is **gitignored** because it contains secrets. Never commit it.

### Codex (`.codex/config.toml`)

Codex TOML does not support `${ENV}` interpolation. Use one of these methods:

**Method A — CLI add (recommended):**
```bash
export N8N_API_URL=https://ai.youlya365.com/
export N8N_API_KEY=your-key
codex mcp add n8n-mcp -- npx n8n-mcp
```

**Method B — Wrapper script:**
Create a wrapper that exports vars before launching Codex.

**Method C — Direct config (manual edit):**
Copy the example and edit the key value directly:
```bash
cp configs/mcp/codex.config.example.toml ~/.codex/config.toml
# Edit N8N_API_KEY value manually
```

### OpenCode (`~/.config/opencode/opencode.json`)

```bash
cp configs/mcp/opencode.example.jsonc ~/.config/opencode/opencode.json
# Edit N8N_API_KEY value manually
```

---

## Security Rules

1. **Never print tokens**: Scripts and agents must never echo `N8N_MCP_TOKEN` or `N8N_API_KEY`.
2. **Never commit credentials**: `.mcp.json`, `.env.production`, and raw workflow exports are gitignored.
3. **Prefer env references**: Workflow JSON should use `$env.XXX` or `{{ $env.XXX }}` instead of raw values.
4. **Backup before edits**: The export script auto-backs up existing files.
5. **Read-only first**: Always use `n8n:list` before any mutation.
6. **No destructive mutation unless task-specific**: Do not delete, deactivate, or overwrite workflows without explicit task scope and backup.
7. **Validate before pilot**: Run `npm run validate:n8n` after every workflow change.

---

## How This Unblocks Phase E

Phase E requires:
1. ✅ n8n workflows exported and validated
2. ✅ n8n API accessible for read-only inspection
3. ✅ MCP tooling available to agents for workflow management
4. ✅ Env vars wired safely without secrets in repo

With these scripts and configs:
- Any agent can run `npm run check:n8n:env` to verify connectivity
- Any agent can run `npm run n8n:list` to inspect workflow status
- Any agent can run `npm run n8n:export` to safely backup workflows
- Any agent can run `npm run validate:n8n` to confirm workflow integrity
- MCP servers in Claude/Codex/OpenCode can query n8n metadata read-only

The remaining manual step is:
- Import the canonical workflow (`n8n/workflows/youlya-whatsapp-main.json`) into n8n
- Activate it
- Point Evolution webhook to the production webhook URL
- Send a real WhatsApp test message

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `N8N_API_KEY rejected` | Verify key is correct and has workflow read access |
| `n8n API timeout` | Check `N8N_API_URL` is reachable from this environment |
| `Workflow not found` | Check exact name spelling or use `--id` |
| `MCP server not connected` | Verify env vars exported before launching agent |
| `validate:n8n FAIL` | Check if raw exports contain hardcoded secrets; use canonical workflow |

---

## File Reference

| File | Purpose |
|------|---------|
| `scripts/check-n8n-env.mjs` | Validate env var presence |
| `scripts/n8n-list-workflows.mjs` | Read-only workflow discovery |
| `scripts/n8n-export-workflows.mjs` | Safe workflow export with sanitization |
| `scripts/validate-n8n-workflows.mjs` | Local workflow JSON validation |
| `configs/mcp/claude.mcp.example.json` | Claude MCP template |
| `configs/mcp/codex.config.example.toml` | Codex MCP template |
| `configs/mcp/opencode.example.jsonc` | OpenCode MCP template |
| `.mcp.json.example` | Repo-level MCP template |
| `docs/N8N_MCP_AND_API_AGENT_SETUP.md` | This document |
