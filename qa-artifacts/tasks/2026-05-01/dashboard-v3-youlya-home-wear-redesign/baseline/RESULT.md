# Baseline — dashboard-v3-youlya-home-wear-redesign

- Date: 2026-05-01
- Current version: v2.1.1 (playwright-ux-swarm-signal-quality)

## Dashboard pages found
- /dashboard/command-center
- /dashboard/inbox
- /dashboard/orders
- /dashboard/orders/[id]/safety
- /dashboard/logs
- /dashboard/settings
- /login

## Existing UI components/status
- Existing: `BuildIdentityFooter`, `ThemeProvider`, basic dashboard layout/sidebar, basic login form.
- Missing/limited: branded logo component, bilingual toggle, modern responsive shell behavior, richer page components (KPI/chart/status/empty-state), polished dark/light brand system.

## Current Playwright QA status
- Latest dashboard swarm baseline before redesign: 24 passed, 0 failed (after swarm signal cleanup).
- QA report source: `qa-artifacts/tasks/2026-05-01/fix-playwright-ux-swarm-signal-quality/FINAL_QA_REPORT.md`.

## Missing h1 routes (from latest swarm report)
- /dashboard/inbox
- /dashboard/orders
- /dashboard/settings

## Logo asset status
- Missing in repo currently:
  - `public/brand/youlya-logo-light.jpeg`
  - `public/brand/youlya-logo-dark.jpeg`
- Code will be prepared to use these exact paths with safe fallback text if assets are not present.

## Recommended redesign plan
1. Introduce global Youlya design tokens (pink/charcoal), typography cleanup, and motion utilities.
2. Add reusable brand/logo, shell, sidebar, topbar, theme and language toggles, status/KPI/chart/empty-state components.
3. Refactor dashboard layout to responsive desktop+mobile shell while preserving Supabase auth guard and BuildIdentityFooter.
4. Redesign command center/inbox/orders/logs/settings with bilingual headings, safe data rendering, and actionable empty states.
5. Polish login branding and accessibility without touching auth mechanics.
6. Re-run dashboard swarm + collector, full verification, release, deploy, and live health/build checks.
