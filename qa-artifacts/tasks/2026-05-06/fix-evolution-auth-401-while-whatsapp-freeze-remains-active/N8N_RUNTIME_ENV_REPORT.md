# n8n Runtime Env Report

## Presence checks
- n8n container:
  - `EVOLUTION_API_URL=SET`
  - `EVOLUTION_API_KEY=SET`
  - `EVOLUTION_INSTANCE=SET`
- app container:
  - `EVOLUTION_API_URL=SET`
  - `EVOLUTION_API_KEY=SET`
  - `EVOLUTION_INSTANCE=SET`

## Runtime values (non-secret)
- n8n URL: `https://evo.nex-lnk.online`
- app URL: `https://evo.nex-lnk.online`
- n8n instance: `AI`
- app instance before fix: `next-link-main`
- app instance after fix: `AI`

## Key source diagnosis
- Evolution server auth key hash matched n8n key hash.
- App key hash initially differed from Evolution/n8n, causing auth failure from app-side probes.
- App key source was realigned to active Evolution auth source.
