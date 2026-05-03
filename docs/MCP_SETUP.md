# MCP Configuration for Youlya

This file configures MCP (Model Context Protocol) servers for Claude Code, Codex, and OpenCode.

## Installed Skills

### n8n Skills (czlonkowski/n8n-skills)
Installed to:
- `~/.claude/skills/` (7 skills)
- `~/.opencode/skills/` (7 skills + .skillfish.json)
- `~/.codex/skills/` (7 skills + .skillfish.json)

Skills:
1. **n8n-expression-syntax** — `{{}}` patterns, `$json`, `$node` variables
2. **n8n-mcp-tools-expert** — How to use n8n-mcp tools effectively
3. **n8n-workflow-patterns** — 5 proven architectural patterns
4. **n8n-validation-expert** — Interpret validation errors
5. **n8n-node-configuration** — Operation-aware node setup
6. **n8n-code-javascript** — Code node JS patterns
7. **n8n-code-python** — Code node Python usage

### MCP Servers

#### n8n-mcp (czlonkowski/n8n-mcp)
- **Status**: Installed globally (`npx n8n-mcp`)
- **Purpose**: Access to 1,650 n8n nodes, 2,352 templates, validation tools
- **Required Env**: `N8N_API_URL`, `N8N_API_KEY`
- **Config**: `.mcp.json` in home + project root

#### Supabase MCP (supabase-community/supabase-mcp)
- **Status**: Installed globally (`npx @supabase/mcp-server-supabase`)
- **Purpose**: Query DB, manage schema, execute SQL
- **Required Env**: `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`
- **Config**: `.mcp.json` in home + project root
- **Security**: Use read-only mode for production

## Configuration

Edit `.mcp.json` in `/root/` or `/root/youlya/` to set real credentials:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "N8N_API_URL": "https://your-n8n-instance.com/api/v1",
        "N8N_API_KEY": "your-n8n-api-key"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_PROJECT_REF": "your-project-ref",
        "SUPABASE_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

## Additional Recommended MCP Servers (Not Yet Installed)

### WhatsApp MCP (lharries/whatsapp-mcp)
- **Stars**: 5.6k
- **Purpose**: Direct WhatsApp control via Baileys
- **Setup**: Requires Go + Python + UV + QR code scan
- **Use case**: Alternative to Evolution for direct WhatsApp access

### Shopify MCP (GeLi2001/shopify-mcp)
- **Stars**: 200
- **Purpose**: Shopify Admin API integration
- **Use case**: Debug orders/products/variants directly

## Tool Support

| Tool | Skills | MCP Support | Notes |
|------|--------|-------------|-------|
| Claude Code | ✅ 7 n8n skills | ✅ Full MCP | Primary target for n8n-skills |
| OpenCode | ✅ 7 n8n skills | ⚠️ Unknown | Skills copied + .skillfish.json added |
| Codex | ✅ 7 n8n skills | ⚠️ Unknown | Skills copied + .skillfish.json added |

## Next Steps

1. Configure real `N8N_API_URL` and `N8N_API_KEY` in `.mcp.json`
2. Configure real `SUPABASE_PROJECT_REF` and `SUPABASE_ACCESS_TOKEN`
3. Test MCP connectivity with `npx n8n-mcp --version`
4. If WhatsApp direct control is needed, install `lharries/whatsapp-mcp`
5. If Shopify debugging is needed, install `GeLi2001/shopify-mcp`
