# configure-n8n-runtime-env-for-youlya-whatsapp-workflow — Result

## Summary
Successfully configured n8n runtime environment variables for the Youlya WhatsApp Main workflow.

## n8n Container
- **Name:** n8n-n8n-1
- **Image:** n8nio/n8n:latest
- **Status:** Up (recreated safely, database/volume preserved)

## Compose File
- **Path:** /root/n8n/docker-compose.yml
- **Backup:** /root/n8n/docker-compose.yml.backup.20260502232141

## Environment Variables (SET/MISSING only)
| Key | Status |
|-----|--------|
| APP_INTERNAL_URL | SET |
| INTERNAL_API_SECRET | SET |
| EVOLUTION_API_URL | SET |
| EVOLUTION_API_KEY | SET |
| EVOLUTION_INSTANCE | SET |

## Workflow Status
- **Workflow ID:** joqfame4HXG775JO
- **Name:** Youlya WhatsApp Main
- **Active:** true
- **Duplicate webhook check:** Only 1 active workflow uses the youlya-whatsapp path

## Health Checks
- **Youlya app /api/health:** PASS (`{"status":"ok","version":"2.5.7",...}`)
- **Youlya app /api/build-info:** PASS (version 2.5.7, versionName `quarantine-unsafe-n8n-raw-exports-and-enforce-canonical-workflow`)
- **n8n /rest/settings:** PASS (HTTP 200, n8n responding)
- **n8n root /**: 404 (expected, no root route)

## Webhook Endpoint Note
- The workflow's webhook node is typeVersion 2 (legacy path format).
- Production webhook is registered internally as `joqfame4HXG775JO/webhook/youlya-whatsapp`.
- Direct URL `https://ai.youlya365.com/webhook/youlya-whatsapp` currently returns 404 from n8n because the node uses the old URL format.
- **Working URL:** `https://ai.youlya365.com/webhook/joqfame4HXG775JO/webhook/youlya-whatsapp` returns `{"message":"Workflow was started"}`.
- Action required: either update the webhook node to typeVersion 2.1+ (direct path format) or ensure Evolution API is configured to call the correct URL.

## Next Step
1. Update Evolution API webhook configuration to point to the correct n8n webhook URL.
2. Run manual WhatsApp inbound test (WA-001 from internal pilot runbook).
3. Verify n8n -> Youlya -> Evolution end-to-end message flow.
4. Consider upgrading the webhook node to typeVersion 2.1+ to use the cleaner `/webhook/youlya-whatsapp` path.

## Release
- v2.6.2 — configure-n8n-runtime-env-for-youlya-whatsapp-workflow
- verify:release PASS
