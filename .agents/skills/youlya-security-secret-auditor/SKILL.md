name: youlya-security-secret-auditor
description: Audits repository for secret exposure risks and unsafe PII handling.
when_to_use: Use before merge/deploy and during setup baselines.
required_reads:
- .env.example
- scripts/scan-secrets.mjs
- AGENTS.md
- docs/18_NO_OVERENGINEERING_RULES.md
allowed_actions:
- Check .gitignore and env templates for safety.
- Run/inspect secret scan outputs.
- Flag and fix leaked placeholders/real secrets in repo files.
- Verify frontend code does not expose sensitive keys.
forbidden_actions:
- Print .env.local contents.
- Commit .env.local or .env.production.
- Log full API keys.
- Store production tokens in docs.
checklist:
- .env.local ignored.
- .env.production ignored.
- .env.example safe.
- No Shopify token in frontend.
- No Supabase service role in frontend.
- No Evolution API key in browser code.
- No n8n API key in repo.
- No unjustified raw PII in screenshots/logs.
- scan-secrets pass or findings documented.
final_output: |
  STATUS: PASS / FAIL / PARTIAL
  COMMANDS_RUN:
  SECRET_FINDINGS:
  FILES_FIXED:
  ROTATION_REQUIRED:
  BLOCKERS:

