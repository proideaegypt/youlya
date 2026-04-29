# Phase 1 Integration and Deploy Prompt

Use only after Phase 0 passes.

Task: connect real systems and deploy safely.

Do:

1. Implement real Shopify product/variant sync.
2. Implement live Shopify order adapter behind explicit environment gate.
3. Import/validate n8n workflow JSONs.
4. Connect Evolution inbound/outbound.
5. Add duplicate webhook protection.
6. Add failed events/dead letter handling.
7. Add admin notifications.
8. Build Dockerfile and VPS stack.
9. Configure Nginx/SSL instructions.
10. Create soft launch QA artifact.

Do not enable all customers.

Acceptance:

```text
Real product cache matches Shopify
Internal WhatsApp number can complete safe flow
Duplicate webhook creates no duplicate order
Shopify payload verified
n8n workflows have no hardcoded secrets
/api/health passes on VPS
rollback documented
```
