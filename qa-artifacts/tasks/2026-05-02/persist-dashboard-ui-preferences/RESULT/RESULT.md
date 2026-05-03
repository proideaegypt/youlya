# QA Result: persist-dashboard-ui-preferences

## Date
2026-05-02

## Task
persist-dashboard-ui-preferences

## Version
v2.5.2

## What Changed
- Created `lib/ui/preferences.ts` with SSR-safe localStorage/cookie helpers.
- Migrated storage keys:
  - `youlya.theme` (was `youlya-theme`)
  - `youlya.colorTheme` (was `youlya-brand`)
  - `youlya.language` (was `youlya_lang`)
  - `youlya.sidebarCollapsed` (was `youlya-sidebar-open`)
- Added pre-hydration script in `app/layout.tsx` to apply color theme and language direction before React paint.
- Added one-time localStorage key migration in pre-hydration script and theme provider.
- Updated `theme-provider.tsx`: `storageKey="youlya.theme"`, `enableSystem={false}`, cookie sync.
- Updated `theme-toggle.tsx`: writes `youlya-theme` cookie on change.
- Updated `color-theme.tsx`: uses `ValidColor` type, writes `youlya-color-theme` cookie, applies `data-brand` immediately.
- Updated `dashboard-shell.tsx`: persists language to localStorage + cookie, fixes logout to use `supabase.auth.signOut()`.
- Updated `dashboard-sidebar.tsx`: persists collapsed state to localStorage + cookie, fixes fallback logout.
- Added Playwright persistence test (`dashboard-preferences-persistence.spec.ts`) with reload and logout/login assertions.
- Added `dashboard-preferences-persistence` project to `playwright.config.ts`.

## Verification Results

### Automated Checks
- `npm run typecheck`: PASS
- `npm run lint`: PASS (0 errors, 15 pre-existing warnings)
- `npm test`: PASS (58/58)
- `npm run validate:scenarios`: PASS (104 scenarios)
- `npm run scan:secrets`: PASS
- `npm run build`: PASS
- `docker compose build`: PASS
- `npm run verify:release`: PASS (v2.5.2, persist-dashboard-ui-preferences)

### Production Deploy
- Deploy command: `docker compose build && docker compose up -d`
- Container recreated successfully.

### Live Health Checks
- `curl -fsS https://admin.youlya365.com/api/health`
  - Result: PASS
  - Response: `{"status":"ok","version":"2.5.2","checks":{"supabase":"ok","evolution":"ok","shopify":"ok"}}`
- `curl -fsS https://admin.youlya365.com/api/build-info`
  - Result: PASS
  - Response: `{"version":"2.5.2","versionName":"persist-dashboard-ui-preferences","builtAt":"2026-05-02T05:08:17.050Z"}`
- `curl -I https://admin.youlya365.com/login`: HTTP 200
- `curl -I https://admin.youlya365.com/dashboard`: HTTP 307 (redirect to /login, auth guard active)

## Manual QA Checklist
1. Login to dashboard.
2. Change theme to dark → persists after refresh.
3. Change color to purple → persists after refresh.
4. Change language to English → persists after refresh, LTR active.
5. Collapse sidebar → persists after refresh.
6. Logout.
7. Login again.
8. Confirm all preferences survived logout/login.
9. Switch back to Arabic/light/pink if desired.

## Storage Summary
| Preference | localStorage Key | Cookie Name | Default |
|---|---|---|---|
| Theme | `youlya.theme` | `youlya-theme` | `light` |
| Color | `youlya.colorTheme` | `youlya-color-theme` | `pink` |
| Language | `youlya.language` | `youlya-language` | `ar` |
| Sidebar | `youlya.sidebarCollapsed` | `youlya-sidebar-collapsed` | `false` (open) |

## Logout Fix
- Old behavior: `fetch("/api/auth/logout")` → 404, not actually signing out from Supabase.
- New behavior: `getSupabaseBrowserClient().auth.signOut()` then redirect to `/login`.
- No `localStorage.clear()` called.
- No cookies cleared.

## Files Changed
- `lib/ui/preferences.ts` (new)
- `app/layout.tsx`
- `lib/ui/theme-provider.tsx`
- `lib/ui/theme-toggle.tsx`
- `lib/ui/color-theme.tsx`
- `lib/ui/dashboard-shell.tsx`
- `lib/ui/dashboard-sidebar.tsx`
- `tests/playwright/dashboard-preferences-persistence.spec.ts` (new)
- `playwright.config.ts`
- `package.json`
- `worktime.md`

## Status
PASS
