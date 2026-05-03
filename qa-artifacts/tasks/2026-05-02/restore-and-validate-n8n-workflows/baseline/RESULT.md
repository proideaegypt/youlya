# Baseline — restore-and-validate-n8n-workflows

Date: 2026-05-02
Task: restore-and-validate-n8n-workflows
Previous task: phase-e-internal-whatsapp-n8n-pilot (PARTIAL)

## Current workflow files

```
workflows/README.md
workflows/Sales Assistant - SubWorkflow.json   (untracked)
workflows/Whatsapp Youlya (4).json             (untracked)
n8n/workflows/youlya-whatsapp-main.json        (tracked)
```

## References found

- docs/15_N8N_EVOLUTION_CONTRACT_FINAL.md — contract spec
- docs/N8N_WHATSAPP_MANUAL_TEST_RUNBOOK.md — manual test runbook
- docs/PHASE_E_INTERNAL_WHATSAPP_N8N_PILOT.md — phase doc
- n8n/env.example — env template
- scripts/validate-n8n-workflows.mjs — existing validation script
- tests/integration/message-turn-evolution.test.ts — integration test
- tests/n8n-workflow-contract-tests.md — contract tests

## Expected workflow names

1. `workflows/Whatsapp Youlya (4).json` — raw n8n export (legacy architecture)
2. `workflows/Sales Assistant - SubWorkflow.json` — raw n8n export (legacy subworkflow)
3. `n8n/workflows/youlya-whatsapp-main.json` — canonical sanitized workflow (current architecture)

## Current version

- App: v2.5.2
- Git commit: 37b94b5
- Git branch: main (assumed)

## Health status

```
GET https://admin.youlya365.com/api/health
{"status":"ok","version":"2.5.2","timestamp":"...","checks":{"supabase":"ok","evolution":"ok","shopify":"ok"}}

GET https://admin.youlya365.com/api/build-info
{"appName":"Youlya AI Commerce OS","version":"2.5.2","versionName":"internal-whatsapp-n8n-pilot",...}
```

## Blockers

1. **SECRETS IN RAW EXPORTS**: `workflows/Whatsapp Youlya (4).json` and `workflows/Sales Assistant - SubWorkflow.json` contain hardcoded API keys. They MUST NOT be committed to git as-is.
2. **LEGACY ARCHITECTURE**: The raw exports use the old n8n-native AI architecture (Shopify tools, OpenAI agent, product search all inside n8n). The current canonical architecture delegates all business logic to Youlya app via `/api/internal/messages/turn`.
3. **WRONG WEBHOOK PATH**: Raw main workflow uses path `whatsapp-customer-service`; canonical uses `youlya-whatsapp`.
4. **SANITIZATION REQUIRED**: Before any raw export can be committed or imported, hardcoded secrets must be replaced with env references.
5. **CANONICAL WORKFLOW STATUS**: `n8n/workflows/youlya-whatsapp-main.json` is inactive (`"active": false`) in its JSON. Must be activated after import.

## Next steps

- Update validation script to check canonical workflow thoroughly.
- Create import/runbook documentation.
- Run all checks (validate:n8n, typecheck, lint, test, etc.).
- Document manual n8n import/activation steps.
- Do NOT commit raw exports with secrets.
