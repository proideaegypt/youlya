# Baseline — phase-e-internal-whatsapp-n8n-pilot

- Date: 2026-05-02
- Current version: v2.4.0 (`port-smart-home-theme-to-youlya-admin-dashboard`)

## Health / build-info status
- `/api/health`: PASS (`status=ok`)
- `/api/build-info`: PASS (`version=2.4.0`)

## n8n / WhatsApp / Evolution docs found
- `docs/data/youlya_human_test_scenarios.csv`
- `docs/data/youlya_human_test_scenarios.jsonl`
- No dedicated current pilot runbook file found for Phase E internal WhatsApp+n8n pilot in the scanned docs set.

## Evolution integration files found
- `app/api/webhooks/evolution/route.ts`
- `lib/adapters/evolution/evolution-client.ts`
- `lib/services/evolution-sender-service.ts`
- `app/api/internal/messages/turn/route.ts`
- `lib/services/message-turn-service.ts`
- `lib/middleware/idempotency.ts`
- `lib/services/idempotency-service.ts`
- `lib/services/dead-letter-service.ts`

## Pilot safety constraints
- Internal traffic only (no public enablement).
- No secrets or unmasked PII in committed artifacts.
- No live order mutation unless explicitly approved for WA-006/WA-007.
- Keep duplicate protection, confirmation gate, internal auth, and kill-switch behavior intact.
- Stop immediately on duplicate order, pre-confirmation order, wrong product/variant, spam loop, or repeated infra failures.

## Test plan
1. Validate env readiness as key-level SET/MISSING only.
2. Publish Phase E pilot runbook and masked manual QA template.
3. Prepare WA-001..WA-010 controlled manual test checklist.
4. Validate dashboard observability points during pilot.
5. Execute full safe verification + dashboard swarm + collector.
6. Apply release governance and deploy only if all checks pass.
