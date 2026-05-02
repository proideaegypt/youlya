# Baseline — add-dashboard-login-route (2026-05-01)

## Current root behavior
- `app/page.tsx` renders static placeholder: "Youlya AI Commerce OS — Phase 0".
- Root path `/` does not direct admins to dashboard.

## Dashboard auth behavior
- `app/dashboard/layout.tsx` checks for any `sb-*` cookies from `next/headers` cookies API.
- If no matching cookie exists, layout redirects to `/login`.
- Auth guard exists and is active, but relies on cookie-presence only.

## Login route missing/present
- Explicit file `app/login/page.tsx` is missing.
- Existing grouped route file `app/(auth)/login/page.tsx` exists and already implements Supabase email/password login using public anon credentials.
- Runtime dashboard redirect target is `/login`; implementation should be made explicit under `app/login/page.tsx` to avoid route ambiguity and align deployment expectations.

## Recommended implementation
- Create explicit `app/login/page.tsx` route with Arabic RTL login UI and BuildIdentityFooter.
- Keep client-side login using `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` only.
- On success, redirect user to `/dashboard`.
- Change `app/page.tsx` to server redirect `/` -> `/dashboard`.
- Keep dashboard auth guard in `app/dashboard/layout.tsx`; no auth bypass.
- Optional future hardening: validate Supabase session server-side (not just cookie name prefix).
