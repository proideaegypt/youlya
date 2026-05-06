# n8n / Evolution / Haidi Workflow Swarm Audit — RESULT

Date: 2026-05-04
Task: n8n-evolution-haidi-workflow-swarm-audit-and-readiness
Version: v2.18.0

## Executive Summary

A full swarm audit of the n8n workflow, Evolution API, Haidi AI layer, and message pipeline was performed. The n8n workflow architecture is correct and safe. The Haidi AI agent is properly constrained. The **only P0 blocker** is the Evolution WhatsApp instance "AI" returning HTTP 500 "Connection Closed" due to an internal Prisma/database error in the `ChannelStartupService`.

## Overall Status

| Component | Status | Notes |
|---|---|---|
| n8n Container | UP | 15 hours uptime |
| Evolution Container | UP | 15 hours uptime, but instance ERROR |
| Youlya App | UP | Healthy on :3000 |
| Apache Proxy | UP | TLS + reverse proxy active |
| Active Workflow | ACTIVE | Youlya WhatsApp Main (15 nodes) |
| Webhook Registration | PASS | Local + public return 200 |
| Send Text Config | PASS | JSON.stringify body, env-driven |
| Haidi Layer | PASS | 4 nodes, validated, safe |
| App Safety Gate | PASS | Call Turn Endpoint present |
| Shopify Direct | PASS | None found |
| n8n Validation | PASS | Repo validation 0 errors |
| Evolution Instance | **FAIL** | AI instance: 500 Connection Closed |

## P0 Blocker

**Evolution Instance "AI" is in ERROR state.**
- Send Text receives HTTP 500: `{"status":500,"error":"Internal Server Error","response":{"message":"Connection Closed"}}`
- Evolution logs show: `PrismaClientKnownRequestError` in `ChannelStartupService` at `integrationSession.update()`
- This prevents any outbound WhatsApp message from being sent

## Recommendation

**NO-GO for real WhatsApp pilot until Evolution instance is restored.**

The n8n workflow, Haidi layer, and app safety gates are all ready. Once the Evolution instance is reconnected/rescanned, the pipeline will work end-to-end.

## Next Step
1. Fix Evolution instance "AI" (rescan QR, restart container, or fix Prisma DB)
2. Re-run synthetic webhook test
3. Verify Send Text returns 200 with `status: success`
4. Then approve 10-message controlled pilot
