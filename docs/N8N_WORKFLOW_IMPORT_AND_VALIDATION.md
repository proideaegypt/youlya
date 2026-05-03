# N8N Workflow Import and Validation Guide

> **WARNING**: Raw workflow exports contain **hardcoded secrets**. They are quarantined outside the repo. Use only the canonical sanitized workflow (`n8n/workflows/youlya-whatsapp-main.json`) for production import.

---

## Required Workflow Files

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| `youlya-whatsapp-main.json` | `n8n/workflows/` | ✅ Canonical | Production webhook → Youlya app → Evolution reply |

### Raw Exports (Quarantined)

The following raw exports contain hardcoded secrets and are **quarantined outside the repo**:

| File | Quarantine Location | Status |
|------|---------------------|--------|
| `Whatsapp Youlya (4).json` | `/root/youlya-private/n8n-raw-exports/` | ❌ Quarantined |
| `Sales Assistant - SubWorkflow.json` | `/root/youlya-private/n8n-raw-exports/` | ❌ Quarantined |

- Do not commit raw exports.
- Do not import raw exports into n8n.
- Do not share raw exports.

---

## How to Export from n8n

1. Open n8n Editor.
2. Open the workflow you want to export.
3. Click **Menu** (top left) → **Download** / **Export workflow**.
4. Choose **JSON** format.
5. Save to `workflows/<Workflow Name>.json`.
6. Before committing, run `npm run scan:secrets` and `npm run validate:n8n`.

---

## How to Import into n8n

1. Open n8n Editor.
2. Click **Menu** → **Import from file**.
3. Select `n8n/workflows/youlya-whatsapp-main.json`.
4. Review the workflow nodes.
5. Update any placeholder credential IDs to match your n8n instance.
6. Save the workflow.

---

## How to Activate Workflow

1. In n8n Editor, open the imported workflow.
2. Toggle the **Active** switch in the top-right corner.
3. Verify the Webhook node shows a green check.
4. Copy the webhook URL:
   - Production: `https://<N8N_DOMAIN>/webhook/youlya-whatsapp`
   - Test: `https://<N8N_DOMAIN>/webhook-test/youlya-whatsapp`

---

## Required n8n Environment Variables

Configure these in n8n **Settings → Environment variables** or in your Docker Compose env:

```text
APP_INTERNAL_URL=https://admin.youlya365.com
INTERNAL_API_SECRET=<your-secret>
EVOLUTION_API_URL=https://evo.youlya365.com
EVOLUTION_API_KEY=<your-evolution-key>
EVOLUTION_INSTANCE=YoulyaMain
```

> **Do not share or commit these values.**

---

## Required Evolution Webhook Event

In Evolution Manager:
1. Go to **Instance Settings** → **Webhooks**.
2. Set webhook URL to: `https://<N8N_DOMAIN>/webhook/youlya-whatsapp`
3. Enable event: `messages.upsert` (or equivalent conversation message event).
4. Save and test connection.

---

## Verification Steps (End-to-End)

1. **Send test message** from WhatsApp: type `هاي`.
2. **Inspect n8n execution**:
   - Go to n8n **Executions**.
   - Find the latest execution for `youlya-whatsapp` webhook.
   - Verify **Webhook** node received the message.
   - Verify **Normalize Message** node output is correct.
   - Verify **Call Turn Endpoint** node returned 200 with reply JSON.
3. **Verify Evolution Send Text** node returned 200.
4. **Check dashboard**:
   - Navigate to `/dashboard/conversations`.
   - Verify the conversation appears.
   - Verify AI reply is logged.
   - Verify no duplicate messages.

---

## Architecture Note

The current production architecture delegates all business logic to the Youlya app:

```
Evolution Webhook → n8n Webhook → Normalize → Call /api/internal/messages/turn
                                                          ↓
                                              Youlya App (AI + Commerce Logic)
                                                          ↓
                                              n8n Send Text → Evolution API → Customer
```

The raw exports (`workflows/Whatsapp Youlya (4).json`) use the **legacy** architecture where:
- AI Agent runs inside n8n
- Shopify tools are n8n nodes
- Product search is done in n8n

These raw exports are kept for reference only and must not be used in production without full sanitization and architecture alignment.

---

## Validation

Run before every commit:

```bash
npm run validate:n8n
```

This checks:
- Canonical workflow exists at `n8n/workflows/youlya-whatsapp-main.json`
- JSON is valid
- Nodes and connections are present
- Webhook path is `youlya-whatsapp`
- Calls `/api/internal/messages/turn`
- Uses env references (not hardcoded secrets)
- Has Evolution send text node
- **No raw workflow exports are present in the repo**

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| n8n not receiving webhooks | Evolution webhook URL, n8n workflow active status |
| Turn endpoint returns 401/403 | `INTERNAL_API_SECRET` env in n8n |
| Turn endpoint returns 500 | App logs, `testMode` flag |
| Evolution not sending replies | `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` |
| Duplicate messages | Idempotency key, `provider_message_id` |
| Workflow import fails | Credential IDs don't exist in target n8n instance |

---

## Secret Rotation

If raw exports were ever committed to git or shared:

| Secret | Rotation Action |
|--------|-----------------|
| `INTERNAL_API_SECRET` | Generate new 32+ char secret, update n8n env + app env |
| `EVOLUTION_API_KEY` | Regenerate in Evolution Manager, update n8n env |
| `N8N_API_KEY` | Regenerate in n8n Settings → API, update all clients |
| `N8N_MCP_TOKEN` | Regenerate in n8n Settings → API, update MCP configs |

## Safety Rules

- Do not commit raw exports with secrets.
- Do not import raw exports into n8n.
- Do not activate legacy workflows in production.
- Do not create real Shopify orders during testing.
- Always verify `testMode=true` in test environments.
- Every mutation writes audit logs.
