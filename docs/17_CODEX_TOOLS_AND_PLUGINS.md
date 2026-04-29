# Codex Tools, Plugins, and Setup Recommendation

Use a small professional toolset. Do not install random plugins.

## Minimum recommended setup

```text
1. GitHub repo access
2. Codex CLI or Codex in ChatGPT/IDE
3. Node.js 22+
4. npm/pnpm (project can choose one during scaffold)
5. Docker + Docker Compose
6. Supabase CLI
7. Shopify CLI
8. Playwright browsers
9. n8n access
10. Evolution API access
```

## VS Code / IDE extensions

Useful but not mandatory:

```text
ESLint
Prettier
Tailwind CSS IntelliSense
Docker
PostgreSQL/Supabase helper
Playwright Test for VS Code
GitLens
```

Avoid installing too many AI extensions at once. One primary coding agent + one reviewer is enough.

## Security tools

Codex should add scripts or CI checks for:

```text
secret scanning
TypeScript strict
ESLint
unit tests
Playwright E2E
scenario validation
n8n workflow validation
```

Optional later:

```text
CodeQL
Dependabot
Snyk or npm audit policy
```

## Shopify tools

Use:

```text
Shopify Admin API credentials
Shopify CLI for app/webhook/dev support if needed
GraphQL Admin API for product/variant sync where practical
Webhooks for product/inventory/order updates later
```

Do not give Codex permission to mutate live Shopify orders until mock order flow and internal tests pass.

## Supabase tools

Use:

```text
Supabase CLI
SQL migrations
RLS policies
local migration validation where possible
```

Do not expose service role key to browser/client.

## n8n tools

Use:

```text
n8n UI for workflow import/export
n8n credentials store
n8n error workflow
n8n executions log
```

Do not store secrets directly in workflow JSON.

## Recommended agent roles

```text
Codex = implementation
Claude/Opus = reviewer
Human/Ahmed = product owner and production approval
```

Do not run multiple coding agents editing the same files at the same time unless the tasks are split by folder and reviewed carefully.

## Good Codex operating mode

For each task:

```text
Read docs
Create short plan
Edit small scope
Run tests
Write QA artifact
Update PROGRESS-LOG
Return PASS/PARTIAL/FAIL
```

## What not to install now

Skip for Phase 0/1:

```text
analytics warehouse
Kafka/RabbitMQ
Redis queue unless actually needed
full observability stack
custom design system package
feature flag SaaS
billing provider SDK
RAG/vector database
multi-channel SDKs
```

Install later only when the roadmap phase requires them.
