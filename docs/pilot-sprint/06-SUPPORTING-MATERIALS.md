# Supporting Materials

## Reusable repo assets

- `docs/HAIDI_AI_SALES_AGENT_PROMPT.md`
- `docs/HAIDI_MEMORY_DESIGN.md`
- `lib/services/haidi-context-builder.ts`
- `lib/services/haidi-output-validator.ts`
- `n8n/workflows/HAIDI_AGENT_WORKFLOW_PATCH_PLAN.md`
- `n8n/workflows/youlya-whatsapp-main-haidi-draft.json`
- `tests/scenarios/pilot-day-5.jsonl`
- `docs/pilot-sprint/CURRENT-NEXT-ACTIONS.md`
- `docs/pilot-sprint/08-EMERGENCY-ROLLBACK.md`

## Safe scripts

- `scripts/smoke-test-daily.sh`
- `scripts/run-pilot-scenarios.sh`
- `scripts/internal-pilot-smoke.mjs`
- `scripts/validate-scenarios.mjs`
- `scripts/validate-n8n-workflows.mjs`
- `scripts/scan-secrets.mjs`

## Current production facts to keep visible

- Health: `checks.supabase`, `checks.evolution`, `checks.shopify`
- Build info: version and version name only
- Workflow: `Youlya WhatsApp Main`
- Webhook path: `youlya-whatsapp`

## Reporting

- Scenario reports should go under `qa-artifacts/scenarios/`.
- Task-specific reports should remain under `qa-artifacts/tasks/YYYY-MM-DD/...`.
