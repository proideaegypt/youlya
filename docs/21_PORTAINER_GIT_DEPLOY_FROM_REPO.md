# Portainer Git Deploy from Repo

## 1. Purpose
Deploy Youlya app/dashboard stack to VPS Docker using Portainer with Git repository source.

## 2. Prerequisites
- VPS with Docker and Portainer.
- Git repository accessible by Portainer.
- Branch/tag ready for deployment.
- Required env variables prepared.

## 3. Git repo requirements
- Compose file exists at `deploy/portainer/docker-compose.portainer.yml`.
- No production secret files committed.

## 4. Required compose path
`deploy/portainer/docker-compose.portainer.yml`

## 5. Required branch/tag
Use an explicit release branch or tag for controlled rollback.

## 6. Required Portainer environment variables
- NODE_ENV
- APP_BASE_URL
- INTERNAL_API_SECRET
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SHOPIFY_STORE_DOMAIN
- SHOPIFY_ADMIN_ACCESS_TOKEN
- SHOPIFY_API_VERSION
- EVOLUTION_API_URL
- EVOLUTION_API_KEY
- N8N_BASE_URL
- OPENAI_API_KEY
- LOG_LEVEL
- MOCK_MODE

## 7. How to add stack from Git repository
1. Portainer -> **Stacks** -> **Add stack**.
2. Select **Git Repository**.
3. Enter repository URL.
4. Select repository reference/branch.
5. Set Compose path: `deploy/portainer/docker-compose.portainer.yml`.

## 8. How to set env variables in Portainer
- Add values in Portainer UI environment section, or
- Upload private env file manually in Portainer.
- Never commit production env files in the repository.

## 9. How to deploy
1. Confirm compose path and branch/tag.
2. Confirm env vars are set.
3. Click **Deploy the stack**.

## 10. How to check /api/health
- Open your app domain and call `/api/health`.
- Confirm healthy response and no secret output.

## 11. How to view logs
- Open stack -> containers -> `youlya-app` -> logs.

## 12. How to rollback by branch/tag
1. Edit stack.
2. Change repository reference to previous tag/branch.
3. Redeploy stack.

## 13. How to trigger redeploy
- Redeploy after updating branch/tag or env vars in Portainer.

## 14. What not to do
- Do not expose raw internal ports publicly.
- Do not commit production env files.
- Do not hardcode secrets in compose files.
- Do not enable live traffic before Phase 0/1 gates.

## 15. Go-live checklist
- Health endpoint reachable.
- Logs clean for critical errors.
- MOCK_MODE set correctly for environment.
- Kill switch/handoff path validated.
- Secrets set only in Portainer/private env handling.
- Rollback branch/tag verified.

Mode B first: app/dashboard stack only. Keep n8n and Evolution external unless explicitly production-ready in repo.

Mode A later: full VPS stack (app + n8n + Evolution + nginx) after integration readiness.

