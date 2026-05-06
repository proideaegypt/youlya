# Dashboard UX Audit

## Route + architecture evidence
- Dashboard pages and APIs are present for command center, products, inbox/messages, orders, logs, settings, handoff, conversations, pilot-control, Haidi lab/learning/settings.
- Unauthenticated route access is blocked (redirect/login or 401).

## Staff-operations feature presence
- conversation timeline: present (pages + timeline API)
- handoff queue: present
- kill switch / pilot control: present
- product search QA: present
- n8n/evolution/shopify status surfaces: present in pilot/control and product sync health endpoints
- error/log visibility: present via logs pages/APIs
- Haidi settings/prompt controls: present via haidi settings/lab/learning pages/APIs

## Gaps
- P1: no fresh browser-level validation because Playwright swarm failed at launch.
- P1: there is no confirmed end-to-end evidence from this run that dashboard widgets reflect live operational truth.
