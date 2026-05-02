# Dashboard Playwright Swarm Final QA Report

- Date: 2026-05-02
- Task: dashboard-v3-youlya-home-wear-redesign
- Playwright summary: not available

## Executive summary
- UX route reports generated: 9
- Failed tests count: unknown
- UX issues: 17
- Console errors: 4
- Real network failures: 4
- Ignored network noise count: 38
- Missing h1 routes: 0

## Screenshots index
- /dashboard/command-center: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_command-center.png
- /dashboard/devices: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_devices.png
- /dashboard/inbox: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_inbox.png
- /dashboard/logs: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_logs.png
- /dashboard/orders: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_orders.png
- /dashboard/profile: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_profile.png
- /dashboard/security: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_security.png
- /dashboard/settings: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_settings.png
- /dashboard/statistics: /root/youlya/qa-artifacts/tasks/2026-05-02/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_statistics.png

## UX issues
- /dashboard/command-center: Missing build identity
- /dashboard/devices: Missing build identity
- /dashboard/devices: Missing Arabic labels
- /dashboard/devices: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/inbox: Missing build identity
- /dashboard/logs: Missing build identity
- /dashboard/orders: Missing build identity
- /dashboard/profile: Missing build identity
- /dashboard/profile: Missing Arabic labels
- /dashboard/profile: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/security: Missing build identity
- /dashboard/security: Missing Arabic labels
- /dashboard/security: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/settings: Missing build identity
- /dashboard/statistics: Missing build identity
- /dashboard/statistics: Missing Arabic labels
- /dashboard/statistics: sidebar=false, content=false, overflow=false, overlay=false

## Functional issues
- Review functional swarm test output in Playwright report for any failed assertions.

## Console errors
- /dashboard/devices: Failed to load resource: the server responded with a status of 404 ()
- /dashboard/profile: Failed to load resource: the server responded with a status of 404 ()
- /dashboard/security: Failed to load resource: the server responded with a status of 404 ()
- /dashboard/statistics: Failed to load resource: the server responded with a status of 404 ()

## Real network failures
- /dashboard/devices: [404] GET https://admin.youlya365.com/dashboard/devices
- /dashboard/profile: [404] GET https://admin.youlya365.com/dashboard/profile
- /dashboard/security: [404] GET https://admin.youlya365.com/dashboard/security
- /dashboard/statistics: [404] GET https://admin.youlya365.com/dashboard/statistics

## Ignored framework/network noise
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/orders?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/orders?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=h7hf8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/orders?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=352w6
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=j0h8i
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=j0h8i
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/orders?_rsc=j0h8i
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=j0h8i
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=hbebf
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=hbebf
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/orders?_rsc=hbebf
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=hbebf
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=hbebf
- /dashboard/orders: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=11hkw
- /dashboard/orders: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=11hkw
- /dashboard/orders: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=11hkw
- /dashboard/orders: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=11hkw
- /dashboard/orders: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=10l79
- /dashboard/orders: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=10l79
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=1c9xt
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=1c9xt
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/orders?_rsc=1c9xt
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=1c9xt
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/settings?_rsc=1r8oa
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/orders?_rsc=1r8oa
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=1r8oa
- /dashboard/settings: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=1r8oa

## Missing h1 list
- None.

## A11Y/RTL/responsive issues
- /dashboard/devices: hasArabicText=false, direction=rtl
- /dashboard/profile: hasArabicText=false, direction=rtl
- /dashboard/security: hasArabicText=false, direction=rtl
- /dashboard/statistics: hasArabicText=false, direction=rtl

## API/health issues
- Playwright JSON report not found; API swarm execution may be skipped.

## UX issue priority
- P0: crash, auth loop, 500 API, blank page
- P1: missing heading, broken layout, inaccessible nav
- P2: weak empty states, visual polish, spacing

## Pilot blockers
- Any 500 API responses, auth redirects loops, or missing build footer should block pilot.

## Non-blocking improvements
- Enrich empty states with guidance and relevant next actions.
- Add page-level skeleton/loading states and error boundaries for data-heavy views.

