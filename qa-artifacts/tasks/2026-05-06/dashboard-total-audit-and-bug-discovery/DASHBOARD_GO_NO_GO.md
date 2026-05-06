# Dashboard GO / NO-GO

## Date
2026-05-06

## Version Audited
v2.22.1

## Decision Categories

### Navigation — GO
- Sidebar has all major sections
- Links work (static analysis confirmed hrefs)
- New settings pages (AI Agent, Channels, Shipping, Users) added correctly

### Auth — GO
- All dashboard APIs return 401/403 unauthenticated
- No auth bypass found

### Pilot Control — CONDITIONAL GO
- Metrics load correctly
- Quick buttons work (with toast feedback since v2.22.0)
- **P1**: Hardcoded old domain in Health API link and synthetic webhook test
- **P0**: Kill switch toggle-card calls internal API and will 401 — must use pilot actions API instead

### Inbox / History — GO
- Messages show readable body (body/text/final_reply fallback)
- Timeline loads correctly
- Date filters present

### Handoff — GO
- Tickets visible with correct columns (after v2.22.0 fix)
- Actions work: assign, note, resolve, return to AI
- Conversation preview loads timeline

### Products — GO
- Multiple tabs: overview, catalog, variants, search QA, sync health, mapping inspector
- Fetch calls use correct relative URLs

### Products Intelligence — GO
- Overview, products list, channels, product detail all have APIs

### Haidi Settings — GO
- Prompt editing works
- Settings persist
- Test/publish/rollback buttons present

### Haidi Lab / Learning — GO
- Scenario list, run, create learning suggestion
- Learning approve/reject/publish buttons present

### Orders — GO
- List loads
- Safety view exists

### Logs — GO
- Date filter present
- Export menu present

### Exports — GO
- RecordExportMenu component used on multiple pages
- Actual export implementation not fully audited (PDF/JPG/DOCX generation exists)

### Date Filters — GO
- RecordDateFilter used on inbox, conversations, handoff, logs
- parseDateRangeFromSearchParams handles today/this week/custom

### Notifications — NOT FULLY TESTED
- Notification bell UI exists
- API exists at `/api/dashboard/notifications`
- Actual notification count update not verified end-to-end

### Quick Actions — GO (with P0 caveat)
- Pilot actions API works
- Toast feedback added in v2.22.0
- Toggle-card on dashboard page is broken (P0)

### Mobile / Tablet — NOT TESTED
- Playwright swarm blocked by missing auth env
- No evidence of mobile-specific bugs in code

### Security / PII — GO (with P0 caveat)
- Auth enforced
- PII masked
- Toggle-card security issue (P0)

## Overall Decision

DASHBOARD_READY_FOR_PILOT: **CONDITIONAL YES**
- Must fix P0 toggle-card kill switch before pilot
- Must fix P1 hardcoded domain in pilot page

DASHBOARD_READY_FOR_TEAM_USE: **YES**
- Handoff, inbox, products, logs all functional
- Only the kill switch toggle is broken

## Top 3 Fixes Required Before Pilot
1. Fix toggle-card to call `/api/dashboard/pilot/actions` instead of `/api/admin/settings`
2. Replace hardcoded `admin.youlya365.com` with dynamic domain in pilot page
3. Add Playwright auth env vars to enable automated QA
