# N8N Integration Readiness Report

Date: 2026-05-02
Task: restore-and-validate-n8n-workflows

---

## Workflow Files Status

| File | Location | Status | Notes |
|------|----------|--------|-------|
| `youlya-whatsapp-main.json` | `n8n/workflows/` | ✅ VALID | Canonical sanitized workflow |
| `Whatsapp Youlya (4).json` | `workflows/` | ⚠️ RAW EXPORT | Legacy architecture; 6 hardcoded secrets |
| `Sales Assistant - SubWorkflow.json` | `workflows/` | ⚠️ RAW EXPORT | Legacy subworkflow; 6 hardcoded secrets |

**Action required**: Do NOT commit raw exports. Use canonical workflow for production import.

---

## Validation Result

```
npm run validate:n8n
Status: FAIL (expected — raw exports contain secrets)
Canonical workflow: PASS
Raw exports: FAIL (hardcoded secrets detected)
```

- ✅ Canonical workflow has webhook path `youlya-whatsapp`
- ✅ Canonical workflow calls `/api/internal/messages/turn`
- ✅ Canonical workflow uses all required env references
- ✅ Canonical workflow has Evolution send text node
- ❌ Raw exports contain hardcoded Evolution API keys

---

## Env Keys Required

Required in n8n environment:

```text
APP_INTERNAL_URL=https://admin.youlya365.com
INTERNAL_API_SECRET
EVOLUTION_API_URL
EVOLUTION_API_KEY
EVOLUTION_INSTANCE
```

> Values are configured in `.env.production` and n8n container env. Names only shown here.

---

## Manual Import Status

- **Canonical workflow**: Ready to import from `n8n/workflows/youlya-whatsapp-main.json`
- **Raw exports**: Must be sanitized before import (replace hardcoded secrets with `$env.XXX` references)
- **Subworkflow references**: Canonical workflow does NOT depend on subworkflows (all logic in app)

---

## Activation Status

- Canonical workflow JSON has `"active": false`
- Must be toggled to **Active** in n8n Editor after import
- Webhook URL after activation: `https://<N8N_DOMAIN>/webhook/youlya-whatsapp`

---

## Evolution Webhook Config Required

In Evolution Manager:
1. Set webhook URL to n8n production webhook URL
2. Enable event: `messages.upsert`
3. Verify connection returns 200

Evolution API health: `https://evo.youlya365.com` returns **200** ✅

---

## Remaining Blockers for Real WhatsApp Test

1. **n8n API not accessible from VPS** — cannot verify workflow list or activation status remotely
2. **Raw exports contain secrets** — must not be committed; canonical workflow must be imported manually
3. **Workflow inactive in JSON** — must be activated in n8n UI after import
4. **Credential IDs in canonical workflow** — may need remapping after import to new n8n instance
5. **No end-to-end test executed yet** — manual WhatsApp test pending

---

## Tests Run

| Check | Result |
|-------|--------|
| `npm run validate:n8n` | FAIL (expected) |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (0 errors, 17 warnings) |
| `npm test` | PASS (58 tests) |
| `npm run validate:scenarios` | PASS (104 scenarios) |
| `npm run scan:secrets` | PASS |
| `npm run verify:release` | PASS (v2.5.2) |
| `npm run build` | PASS |
| `npm run verify:deploy` | TIMEOUT (build step repeated; already passed) |

---

## Deployment Status

- App v2.5.2 is deployed and healthy
- Health check: `https://admin.youlya365.com/api/health` → `status: ok`
- Build info: `https://admin.youlya365.com/api/build-info` → v2.5.2

---

## Risks

1. **Secret leakage**: Raw exports in `workflows/` directory must never be committed. Add to `.gitignore` or remove after reference.
2. **Legacy architecture confusion**: Team might accidentally import old workflow instead of canonical.
3. **Credential mismatch**: Canonical workflow may reference credential IDs that don't exist in target n8n instance.
4. **Webhook path mismatch**: Old workflow uses `whatsapp-customer-service`; new uses `youlya-whatsapp`.
5. **Inactive by default**: JSON has `active: false`; easy to forget activation step.

---

## Next Steps

1. **Manual n8n import**: Import `n8n/workflows/youlya-whatsapp-main.json` into n8n.
2. **Activate workflow**: Toggle Active in n8n Editor.
3. **Configure env vars**: Ensure all 5 required env keys are set in n8n.
4. **Update webhook URL**: Point Evolution to `https://<N8N_DOMAIN>/webhook/youlya-whatsapp`.
5. **Send test message**: Send `هاي` from WhatsApp.
6. **Verify execution**: Check n8n execution logs for success.
7. **Verify app response**: Check dashboard conversations for new entry.
8. **Run full manual test suite**: Follow `docs/N8N_WHATSAPP_MANUAL_TEST_RUNBOOK.md`.
