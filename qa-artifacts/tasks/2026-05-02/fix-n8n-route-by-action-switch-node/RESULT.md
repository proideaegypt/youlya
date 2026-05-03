# fix-n8n-route-by-action-switch-node — Result

## Original Error
```
Cannot read properties of undefined (reading 'caseSensitive')
```
Caused by the `Route by Action` Switch node (typeVersion 3) in n8n v2.3.6. The Switch node config used the newer `conditions.options.caseSensitive` format which is not supported in this n8n version.

## Backup
- **Path:** `qa-artifacts/tasks/2026-05-02/fix-n8n-route-by-action-switch-node/backup-youlya-whatsapp-main.json`
- **Method:** Exported via n8n REST API before editing
- **Sanitized:** Credentials stripped from backup

## Patched Nodes

### Removed
- **Route by Action** (`n8n-nodes-base.switch`, typeVersion 3)

### Added
- **Prepare Reply** (`n8n-nodes-base.code`, typeVersion 2)
  - Position: [1140, 120]
  - Computes `action`, `reply`, `shouldSend`, `number` from turn endpoint response
  - References `$node["Normalize Message"].json.remote_jid` for the WhatsApp number

- **Should Send Reply** (`n8n-nodes-base.if`, typeVersion 2)
  - Position: [1360, 120]
  - Condition: `$json.shouldSend` equals `true`
  - True branch -> Send Text
  - False branch -> empty (no-op)

### Modified
- **Send Text** (`n8n-nodes-base.httpRequest`)
  - Updated `jsonBody` to: `={"number": "{{$json.number}}", "text": "{{$json.reply}}"}`
  - URL preserved: `={{$env.EVOLUTION_API_URL}}/message/sendText/{{$env.EVOLUTION_INSTANCE}}`
  - Header preserved: `apikey: {{$env.EVOLUTION_API_KEY}}`

## Workflow Status
- **ID:** joqfame4HXG775JO
- **Name:** Youlya WhatsApp Main
- **Active:** true
- **Webhook:** POST youlya-whatsapp (registered as `joqfame4HXG775JO/webhook/youlya-whatsapp`)

## Validation Checklist
- [x] Webhook path is still `youlya-whatsapp`
- [x] Call Turn Endpoint URL is `{{$env.APP_INTERNAL_URL}}/api/internal/messages/turn`
- [x] Call Turn Endpoint header is `x-internal-secret: {{$env.INTERNAL_API_SECRET}}`
- [x] Send Text uses env refs for URL, instance, apikey
- [x] No hardcoded secrets in any node parameter
- [x] Workflow active=true after patch
- [x] No node named "Route by Action" remains
- [x] Prepare Reply and Should Send Reply are connected correctly

## Safe Execution Check
- **No real WhatsApp message was sent automatically.**
- Workflow was deactivated before update and reactivated after.
- Webhook registration was preserved in n8n database.
- Manual retest required before confirming end-to-end flow.

## Manual Retest Instruction
1. Send a test WhatsApp message to the Evolution instance.
2. Verify n8n receives the webhook and executes the workflow.
3. Check that `Prepare Reply` runs without error.
4. Check that `Should Send Reply` evaluates correctly based on action.
5. If action is not `duplicate_ignored` and reply exists, verify `Send Text` posts to Evolution API.
6. Monitor the n8n execution log for any new errors.
7. If errors persist, deactivate the workflow and review the execution data.

## Release
- v2.6.3 — n8n-route-by-action-switch-node
- verify:release PASS
