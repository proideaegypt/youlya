# workflows/

Place real n8n workflow exports here when available.

Expected files:

```text
Whatsapp Youlya (4).json
Sales Assistant - SubWorkflow.json
```

Do not commit workflow files with hardcoded API keys, Bearer tokens, Shopify tokens, OpenAI keys, Supabase service keys, or real customer PII.

Run:

```bash
node scripts/validate-n8n-workflows.mjs
```

If files are absent, the script returns `BLOCKED`, which is acceptable for this starter pack but not acceptable before production live.
