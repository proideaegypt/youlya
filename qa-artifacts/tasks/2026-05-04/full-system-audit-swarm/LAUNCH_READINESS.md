# Launch Readiness - Go / No-Go
# 2026-05-04

## Verdict: NO-GO

### Pre-conditions for CONDITIONAL GO
1. Make `testMode` suppress all live Evolution and Shopify side effects.
2. Enforce auth before any internal message-turn state mutation.
3. Require webhook auth by configuration, not by optional presence.
4. Reconcile the live Supabase schema for idempotency and Haidi/knowledge-base tables.
5. Remove hardcoded tenant scope from dashboard APIs and n8n workflow nodes.

## Manual Go-Live Checklist
- [ ] Owner types `TEST Ya AHMED` to approve live launch
- [ ] Run `npm run deploy:production` after all critical findings are resolved
- [ ] Verify `https://admin.youlya365.com/api/health`
- [ ] Verify `https://admin.youlya365.com/api/build-info`
- [ ] Verify n8n webhook `POST https://ai.youlya365.com/webhook/youlya-whatsapp` returns 200
- [ ] Send one synthetic test message via WhatsApp internal test number only
- [ ] Verify dashboard shows the message in Inbox
- [ ] Verify product search responds in Arabic
- [ ] Verify handoff trigger works from dashboard
- [ ] Verify kill switch disables AI responses within 30s
- [ ] Run `npm run test:e2e:dashboard:swarm` again after deploy

## What is NOT automated
- Real WhatsApp inbound customer messages
- Real Shopify order creation approval
- DNS/TLS certificate renewal
- Supabase production migration apply
- n8n workflow activation/deactivation decisions
