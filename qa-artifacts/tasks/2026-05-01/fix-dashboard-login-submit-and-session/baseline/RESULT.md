# Baseline — fix-dashboard-login-submit-and-session (2026-05-01)

## Discovery summary
- Login route exists at `app/login/page.tsx` and returns HTTP 200 in production.
- Root route currently redirects to `/dashboard` (`app/page.tsx`).
- Dashboard route returns HTTP 307 to `/login` when unauthenticated (expected guard behavior).
- Current build-info endpoint reports production app version `2.0.9` with `schema-migration-reconciliation` build name.

## Current auth/session implementation
- Login submit uses `@supabase/supabase-js` `createClient(...).auth.signInWithPassword(...)` inside browser form.
- Dashboard middleware uses `@supabase/ssr` `createServerClient(...).auth.getUser()` for `/dashboard/*` route guard.
- Dashboard layout also checks for `sb-*` cookie presence and redirects to `/login`.

## Likely root cause
- Browser login path and SSR guard path are inconsistent.
- Login uses plain supabase-js browser client (local session) while dashboard guard expects SSR-compatible cookie-backed session.
- Result can be successful sign-in without SSR-visible session cookies, causing redirect loop or apparent no-op after submit.

## Production route/build checks
- `curl -I https://admin.youlya365.com/login` => 200
- `curl -I https://admin.youlya365.com/dashboard` => 307 Location: `/login`
- `curl -fsS https://admin.youlya365.com/api/build-info` => version `2.0.9` / build name `schema-migration-reconciliation`
