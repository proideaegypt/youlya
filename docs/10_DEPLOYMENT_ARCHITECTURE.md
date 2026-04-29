# Deployment Architecture — VPS Docker

Decision: **VPS Docker via Portainer**.

## Target layout

```text
VPS
├── Nginx / reverse proxy / SSL :80/:443
├── Next.js app container       :3000 internal
├── n8n container               :5678 internal
├── Evolution API container     :8080 internal
└── optional postgres/redis only if needed by n8n/Evolution

External managed services:
├── Supabase/Postgres
└── Shopify
```

## Public domains

```text
https://app.youlya.ai  → Next.js app
https://n8n.youlya.ai  → n8n, protected by auth
https://evo.youlya.ai  → Evolution API, protected by API key/firewall where possible
```

Do not expose raw service ports publicly.

## Containers

### Next.js app

Responsibilities:

```text
business logic
API routes
dashboard later
Shopify adapter
Supabase access
AI/tool orchestration
```

### n8n

Responsibilities:

```text
Evolution webhook intake
payload normalization
call Next.js internal endpoint
send reply through Evolution
retry/error workflow
```

No business logic.

### Evolution API

Responsibilities:

```text
WhatsApp session/API
send/receive messages
media send/download
```

## Env handling

Production env exists only on server/Portainer secret config. Never commit real env values.

Required production groups:

```text
App/Internal secrets
Supabase
Shopify
Evolution
n8n
OpenAI
Commerce rules
Security/alerts
```

## Health checks

Required:

```text
GET https://app.youlya.ai/api/health
n8n workflow active check
Evolution status check
Shopify API token check in app health summary without secrets
Supabase connection check
```

Health endpoint must not expose secret values.

## Release flow

```text
1. Build app image
2. Deploy to VPS stack
3. Run migration
4. Verify /api/health
5. Verify n8n webhook
6. Verify Evolution send to internal test number
7. Verify Shopify mock/live mode
8. Run internal smoke tests
9. Enable internal test numbers
10. Limited production live
```

## Rollback

Keep previous image/tag and env. Rollback means:

```text
Disable AI order creation
Enable global kill switch if needed
Revert app container to previous image
Leave Shopify orders untouched
Send handoff/static message for active conversations
Review failed events
```

## Production ports

| Service | Internal port | Public? |
|---|---:|---|
| Nginx | 80/443 | yes |
| Next.js | 3000 | no direct public port; proxied |
| n8n | 5678 | proxied + auth |
| Evolution | 8080 | proxied + API key/auth |

## Security requirements

```text
HTTPS everywhere
n8n protected by basic/auth or stronger
Evolution API key required
internal API secret between n8n and app
Shopify webhook signature verification
no service role key in client
no secrets in workflow JSON
logs masked for PII/secrets
```
