# Result — add-dashboard-login-route (2026-05-01)

## Summary
- Added explicit `/login` route for dashboard auth redirect target.
- Updated root `/` to redirect to `/dashboard`.
- Kept dashboard auth guard in place (`sb-*` cookie check -> `/login`).

## Route/Auth Changes
- `app/page.tsx` now redirects to `/dashboard`.
- `app/login/page.tsx` added with Arabic RTL login page and `BuildIdentityFooter`.
- `app/login/login-form.tsx` added as client-only Supabase email/password login using anon public keys only.
- `app/(auth)/login/page.tsx` removed to avoid duplicate route mapping.

## Verification
- `npm run typecheck`: PASS
- `npm run lint`: PASS (warnings only, pre-existing)
- `npm test`: PASS
- `npm run validate:scenarios`: PASS
- `npm run scan:secrets`: PASS
- `npm run verify:release`: PASS
- `npm run build`: PASS
- `npm run verify:deploy`: PASS

## Release Governance
- `npm run release:task -- --task "add-dashboard-login-route" --type patch`: PASS
- Generated release file: `RELEASES/v2.0.10-add-dashboard-login-route.md`
- `npm run verify:release` after release update: PASS

## Deploy and Runtime Checks
- `npm run deploy:production`: PASS
- `curl -fsS https://admin.youlya365.com/api/health`: PASS (`status=ok`)
- `curl -fsS https://admin.youlya365.com/api/build-info`: PASS
- `curl -I https://admin.youlya365.com/`: `307` -> `/dashboard`
- `curl -I https://admin.youlya365.com/login`: `200`
- `curl -I https://admin.youlya365.com/dashboard`: `307` -> `/login` (unauthenticated guard active)

## Notes
- Deploy/build-info endpoint reports runtime version `2.0.11` (`dashboard-login-submit-and-session`), indicating remote branch head advanced beyond local `2.0.10` during deploy pull; runtime behavior still satisfies this task requirements.
- Future hardening item: replace cookie-prefix-only dashboard auth guard with server-side Supabase session validation.
