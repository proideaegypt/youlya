# Baseline — fix-playwright-ux-swarm-signal-quality

- Date: 2026-05-01
- Task: fix-playwright-ux-swarm-signal-quality

## Current failed tests summary
- Dashboard swarm summary from collector: expected=19, passed=14, failed=5.
- `dashboard-ux-swarm` failures are currently driven by request failures and heading timeout behavior.
- Only 2 UX route reports were emitted before timeout/failure interruption.

## False-positive network pattern
- Failed requests are mostly `GET /dashboard/*?_rsc=...` with Playwright `requestfailed` status `0`.
- These are expected Next.js RSC prefetch/navigation aborts (`net::ERR_ABORTED`) and should be classified as framework noise, not route failures.

## Missing h1 behavior
- Current code uses `await page.locator("h1").first().textContent()` directly.
- On routes without an `h1`, this waits until timeout (60s in failing runs) and fails the test without producing actionable UX findings.

## Intended signal-quality fix
- Add explicit ignorable failure filtering for aborted `_rsc` requests and documented favicon 404 noise.
- Split network results into `realFailedRequests` vs `ignoredNetworkNoise` and assert only on real failures.
- Replace heading extraction with non-blocking `count()` + short timeout fetch and log missing h1 as UX issue.
- Keep meaningful checks active for blank page, shell/sidebar presence, build identity, console crashes, and real API/navigation failures.
- Improve per-route markdown and final collector report to surface actionable UX findings and severity priorities.
