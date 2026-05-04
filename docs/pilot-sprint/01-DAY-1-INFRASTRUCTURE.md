# Day 1 - Infrastructure

## Goal

Confirm the production foundation is visible, healthy, and documented without changing live commerce behavior.

## Current production snapshot

- App live: `https://admin.youlya365.com`
- Health endpoint: `/api/health`
- Build info endpoint: `/api/build-info`
- n8n workflow active: `Youlya WhatsApp Main`
- Workflow path: `youlya-whatsapp`
- Public surfaces stay public; private SSH/host values should use placeholders like `<VPS_HOST>` and `<SSH_USER>` in docs.

## Completed assumptions to carry forward

- Dashboard exists.
- Products dashboard exists.
- Product sync observability exists.
- n8n runtime env is configured.
- Shopify read-only verification has already passed.
- `Send Text` JSON body regression has already been verified in a synthetic test.

## Safe checks

- `curl -fsS https://admin.youlya365.com/api/health`
- `curl -fsS https://admin.youlya365.com/api/build-info`
- `node scripts/scan-secrets.mjs`
- `node scripts/validate-n8n-workflows.mjs`

## Operational notes

- Do not print secret values.
- Do not hardcode hostnames, IPs, or SSH usernames in docs.
- If a host or user must be mentioned, use placeholders like `<VPS_HOST>` and `<SSH_USER>`.
- Keep the app as the safety layer and n8n as transport.

## Day 1 outcomes

- Infrastructure is not a blank slate.
- The pilot must be built around existing production services.
- Any future change should preserve current workflow guard behavior.
