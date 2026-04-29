# Codex MCP Template

This directory contains project-scoped Codex MCP setup templates only.

- Copy `.codex/config.example.toml` to local machine config when needed.
- Use environment variables for secrets.
- Keep Supabase access read-only at setup stage.
- Keep Shopify direct write MCP disabled in Phase 0.
- Shopify production order creation must go through app `ShopifyAdapter`.

Do not commit real tokens to `.codex/`.

