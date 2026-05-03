# create-and-activate-youlya-whatsapp-main-in-n8n

## Summary
Created the canonical `Youlya WhatsApp Main` workflow in the live n8n instance from the sanitized repo JSON and activated it.

## Workflow
- Workflow ID: `joqfame4HXG775JO`
- Workflow name: `Youlya WhatsApp Main`
- Active: `true`
- Webhook path: `youlya-whatsapp`
- Production webhook URL: `https://ai.youlya365.com/webhook/youlya-whatsapp`

## Nodes created
- Webhook
- Filter Message Type
- Normalize Message
- Call Turn Endpoint
- Route by Action
- Send Text
- Dead Letter

## Env check
- `APP_INTERNAL_URL`: MISSING in local repo env check
- `INTERNAL_API_SECRET`: SET
- `EVOLUTION_API_URL`: SET
- `EVOLUTION_API_KEY`: SET
- `EVOLUTION_INSTANCE`: MISSING in local repo env check
- `N8N_API_URL`: SET
- `N8N_API_KEY`: SET
- `N8N_MCP_URL`: SET
- `N8N_MCP_TOKEN`: SET

## Secrets check
- No secrets were printed.
- No raw workflow export was imported.
- Workflow uses env references for internal URL, secret, Evolution URL, Evolution API key, and Evolution instance.

## Blockers
- Local repo env does not expose `APP_INTERNAL_URL` / `EVOLUTION_INSTANCE`; confirm those are set in the actual n8n runtime before the first real WhatsApp inbound test.

## Next step
- Send one controlled internal WhatsApp message only after confirming the n8n host has the required env vars.
