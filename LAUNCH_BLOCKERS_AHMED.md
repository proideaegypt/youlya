# Launch Blockers Ahmed

## 1. Current canonical domain
- Canonical active domain: `admin.nex-lnk.online`.
- Evidence: health/build-info live on this domain.
- `admin.youlya365.com` is currently unresolved (DNS failure) and treated as legacy.

## 2. Current local/live/container version
- Local version: `2.23.6` (`package.json`, local `public/build-info.json`).
- Live version (`admin.nex-lnk.online`): `2.23.4`.
- Container version (`youlya-youlya-app-1` `/app/public/build-info.json`): `2.23.4`.
- Conclusion: deployed runtime is behind local by 2 patch versions.

## 3. Fixed blockers
- Command center hard-crash risk reduced:
  - Removed internal self-fetch dependency for stats in `/dashboard/command-center`.
  - Stats now load server-side directly with guarded `try/catch` and fallback.
  - Arabic fallback warning preserved: `تعذر تحميل الإحصائيات الحية. يتم عرض أرقام مؤقتة.`
- Security headers hardened:
  - Added/kept HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
  - CSP strengthened with `object-src 'none'` and `base-uri 'self'`.
  - API CORS default no longer uses wildcard.
- Internal auth-ordering check:
  - `requireInternalAuth` executes before `_preconditions` mutations in `POST /api/internal/messages/turn`.
  - Existing regression test confirms unauthenticated `_preconditions` cannot mutate state.
- Legacy domain docs normalized in pilot-sprint docs to `admin.nex-lnk.online`.

## 4. Remaining blockers
- TypeScript gate failure blocks full green release verification:
  - `app/dashboard/settings/channels/page.tsx` imports non-exported `Facebook` and `Instagram` icons from `lucide-react`.
- Build pipeline reliability issue observed:
  - intermittent `Another next build process is already running` in validation sequence.
- Production version drift:
  - live/container are older than local.
- Playwright dashboard swarm failed (20 tests), mainly accessibility/label and functional assertions.

## 5. WhatsApp hi status
- `POST /api/webhooks/evolution` exists and validates `x-evolution-token` against `EVOLUTION_WEBHOOK_SECRET` when set.
- Invalid token is ignored safely (200 + ignored payload).
- Route logs inbound/outbound/system and runs `runMessageTurn`.
- Critical operational note:
  - route does not directly send outbound via Evolution API; reply delivery depends on orchestrator path (n8n/transport).
- Status: `NOT VERIFIED` end-to-end for "hi -> customer receives AI reply" in this run.

## 6. Command center status
- Code path is now safer (direct load + fallback + warning).
- Status: `PASS` for crash-hardening implementation.
- Live confirmation pending deploy of updated version.

## 7. Internal auth-ordering status
- Status: `FIXED/CONFIRMED` in current code.
- No unauthenticated precondition mutation before auth.

## 8. Security headers status
- Status: `PASS` (headers configured and CSP strengthened with compatibility-safe additions).

## 9. Playwright status
- Credentials existed and run executed.
- Result: `FAIL` (48 passed, 20 failed, 2 did not run).
- Major failures:
  - unlabeled input controls across pilot-control/handoff/inbox/profile/orders/logs.
  - dashboard functional assertions (missing nav text target, missing `AI Tool` log label).

## 10. Exact next commands
1. Fix TypeScript import blockers:
```bash
sed -n '1,120p' app/dashboard/settings/channels/page.tsx
```
then replace invalid lucide imports with valid icons and run:
```bash
npm run typecheck
```
2. Re-run core gates:
```bash
npm run lint
npm test
npm run build
npm run verify:release
npm run verify:deploy
```
3. Validate deployed version sync after deployment:
```bash
curl -fsS https://admin.nex-lnk.online/api/build-info
docker exec youlya-youlya-app-1 cat /app/public/build-info.json
```
4. WhatsApp end-to-end check with canonical URL + valid webhook token + active n8n transport:
```bash
npm run check:evolution:webhook
```

## 11. Launch decision: GO / LIMITED-GO / NO-GO
- Decision: `NO-GO` for broad launch.
- Reason: typecheck blocker + Playwright swarm failures + live version drift + WhatsApp end-to-end not verified.
