# Bug Backlog

## P0 — Blocks pilot or causes data loss/security issues

### BUG-P0-001: Toggle-card calls internal-only API from browser
- **Page**: /dashboard (toggle-card.tsx)
- **Control**: AI Kill Switch toggle button
- **Steps**: Click AI toggle on dashboard
- **Expected**: AI enabled/disabled, persisted
- **Actual**: Returns 401 because `/api/admin/settings` requires `INTERNAL_API_SECRET` header
- **Severity**: P0
- **Blocks pilot**: Yes — kill switch doesn't work from dashboard
- **Fix**: Create `/api/dashboard/settings/kill-switch` that uses session auth, or make toggle-card call `/api/dashboard/pilot/actions`

---

## P1 — Major broken features or misleading UI

### BUG-P1-001: Pilot page hardcodes old domain `admin.youlya365.com`
- **Page**: /dashboard/pilot
- **Control**: Health API link, Synthetic Webhook Test section
- **Steps**: Open pilot page, click Health API or read webhook example
- **Expected**: Links to current domain `admin.nex-lnk.online`
- **Actual**: Links to dead domain `admin.youlya365.com`
- **Severity**: P1
- **Blocks pilot**: No, but confusing for operators
- **Fix**: Replace hardcoded domain with `window.location.origin` or `process.env.NEXT_PUBLIC_APP_URL`

### BUG-P1-002: Command-center uses `process.env.APP_URL` client-side
- **Page**: /dashboard/command-center
- **Control**: Stats fetch on page load
- **Steps**: Load command-center page
- **Expected**: Stats load from current domain
- **Actual**: `process.env.APP_URL` is undefined in browser, falls back to `http://127.0.0.1:3000`
- **Severity**: P1
- **Blocks pilot**: No, but stats may fail to load in production
- **Fix**: Use relative URL `/api/dashboard/stats` or `window.location.origin`

### BUG-P1-003: Playwright auth env missing
- **Page**: All Playwright tests
- **Control**: auth.setup.ts
- **Steps**: Run `npm run test:e2e:dashboard:swarm`
- **Expected**: Tests authenticate and run
- **Actual**: Error: Missing PLAYWRIGHT_BASE_URL, PLAYWRIGHT_ADMIN_EMAIL, PLAYWRIGHT_ADMIN_PASSWORD
- **Severity**: P1
- **Blocks pilot**: No, but blocks automated QA
- **Fix**: Add required env vars to `.env.playwright` or CI secrets

---

## P2 — Minor issues, polish, or incomplete features

### BUG-P2-001: No feedback when pilot action fails
- **Page**: /dashboard/pilot (before v2.22.0)
- **Control**: Quick action buttons
- **Steps**: Click pause/resume with network error
- **Expected**: Toast or error message
- **Actual**: Silent failure, button just stops loading
- **Severity**: P2
- **Status**: Fixed in v2.22.0 (toast added)

### BUG-P2-002: Settings pages don't show loading skeleton
- **Page**: /dashboard/settings/*
- **Control**: Page load
- **Steps**: Navigate to AI Agent, Shipping, Channels, Users settings
- **Expected**: Loading state while fetching
- **Actual**: "جاري التحميل..." text only
- **Severity**: P2
- **Fix**: Add proper skeleton loaders

### BUG-P2-003: `/dashboard/pilot-control` is just a re-export of `/dashboard/pilot`
- **Page**: /dashboard/pilot-control
- **Control**: Page component
- **Expected**: Distinct pilot-control page or meaningful redirect
- **Actual**: `export { default } from "../pilot/page"`
- **Severity**: P2
- **Fix**: Remove duplicate route or make it a redirect

---

## Previously Fixed (in v2.22.0)

### FIXED: Handoff API column name mismatch
- `assigned_user_id` → `assigned_to` fixed in handoff service and API

### FIXED: Product media output contract
- `sendMedia` array added for Evolution media endpoint

### FIXED: Pilot quick buttons toast feedback
- Success/error toast added to pilot actions
