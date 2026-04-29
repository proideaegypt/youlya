# Portainer Deployment Files

This folder provides Git-based Portainer deployment templates for Youlya.

## Files
- `deploy/portainer/docker-compose.portainer.yml`: stack compose template.
- `deploy/portainer/stack.env.example`: env placeholder template only.
- `deploy/portainer/nginx/youlya-app.conf.example`: optional nginx reverse proxy template.

## Compose path
Use this compose path in Portainer:
`deploy/portainer/docker-compose.portainer.yml`

## Environment handling
- Do not commit `stack.env` with real values.
- Do not commit `.env.production`.
- Set environment variables in Portainer UI or upload a private env file in Portainer.

## Deploy from Git in Portainer
1. Portainer -> Stacks -> Add stack.
2. Select **Git Repository**.
3. Enter repository URL and branch/tag.
4. Set compose path to `deploy/portainer/docker-compose.portainer.yml`.
5. Add environment variables in Portainer UI.
6. Deploy stack.

## Health checks
- Check container health in Portainer.
- Open `/api/health` from your app domain.

## Rollback
- Change stack repository reference to previous branch/tag.
- Redeploy stack.

## What not to do
- Do not expose raw internal ports publicly.
- Do not hardcode secrets in compose or docs.
- Do not deploy live customer traffic before safety gates pass.

