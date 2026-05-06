# Dashboard Playwright Swarm Final QA Report

- Date: 2026-05-04
- Task: dashboard-v3-youlya-home-wear-redesign
- Playwright summary: expected=65, passed=65, failed=0

## Executive summary
- UX route reports generated: 14
- Failed tests count: 0
- UX issues: 18
- Console errors: 2
- Real network failures: 2
- Ignored network noise count: 58
- Missing h1 routes: 0

## Screenshots index
- /dashboard/command-center: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_command-center.png
- /dashboard/devices: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_devices.png
- /dashboard/haidi/settings: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_haidi_settings.png
- /dashboard/inbox: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_inbox.png
- /dashboard/logs: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_logs.png
- /dashboard/orders: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_orders.png
- /dashboard/pilot-control: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_pilot-control.png
- /dashboard/pilot: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_pilot.png
- /dashboard/products-intelligence: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_products-intelligence.png
- /dashboard/products: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_products.png
- /dashboard/profile: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_profile.png
- /dashboard/security: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_security.png
- /dashboard/settings: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_settings.png
- /dashboard/statistics: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_statistics.png

## UX issues
- /dashboard/command-center: Missing build identity
- /dashboard/devices: Missing build identity
- /dashboard/haidi/settings: Missing build identity
- /dashboard/haidi/settings: Missing Arabic labels
- /dashboard/haidi/settings: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/inbox: Missing build identity
- /dashboard/logs: Missing build identity
- /dashboard/orders: Missing build identity
- /dashboard/pilot-control: Missing build identity
- /dashboard/pilot: Missing build identity
- /dashboard/pilot: Missing Arabic labels
- /dashboard/pilot: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/products-intelligence: Missing build identity
- /dashboard/products: Missing build identity
- /dashboard/profile: Missing build identity
- /dashboard/security: Missing build identity
- /dashboard/settings: Missing build identity
- /dashboard/statistics: Missing build identity

## Functional issues
- Review functional swarm test output in Playwright report for any failed assertions.

## Console errors
- /dashboard/haidi/settings: Failed to load resource: the server responded with a status of 404 ()
- /dashboard/pilot: Failed to load resource: the server responded with a status of 404 ()

## Real network failures
- /dashboard/haidi/settings: [404] GET https://admin.youlya365.com/dashboard/haidi/settings
- /dashboard/pilot: [404] GET https://admin.youlya365.com/dashboard/pilot

## Ignored framework/network noise
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/statistics?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/devices?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/products?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/handoff?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/devices?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/statistics?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/security?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/pilot-control?_rsc=1sjum
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/conversations?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/handoff?_rsc=h7hf8
- /dashboard/command-center: [0] GET https://admin.youlya365.com/dashboard/pilot-control?_rsc=h7hf8
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/security?_rsc=1ypm1
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=1ypm1
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/products?_rsc=1ypm1
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/statistics?_rsc=1ypm1
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/security?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/devices?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/statistics?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/products?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/handoff?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/conversations?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/pilot-control?_rsc=1n4r8
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/devices?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/security?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/statistics?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/conversations?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/products?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/handoff?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/pilot-control?_rsc=352w6
- /dashboard/inbox: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=352w6
- /dashboard/logs: [0] GET https://admin.youlya365.com/dashboard/devices?_rsc=j0h8i
- /dashboard/products-intelligence: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=sfe36
- /dashboard/products: [0] GET https://admin.youlya365.com/dashboard/handoff?_rsc=1ipce
- /dashboard/products: [0] GET https://admin.youlya365.com/dashboard/inbox?_rsc=1ipce
- /dashboard/products: [0] GET https://admin.youlya365.com/dashboard/pilot-control?_rsc=1ipce
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/devices?_rsc=11aqc
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/statistics?_rsc=11aqc
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=11aqc
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/products?_rsc=11aqc
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/pilot-control?_rsc=11aqc
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/conversations?_rsc=11aqc
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=11aqc
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/devices?_rsc=1g9gs
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/security?_rsc=1g9gs
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/statistics?_rsc=1g9gs
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=1g9gs
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/conversations?_rsc=1g9gs
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/handoff?_rsc=1g9gs
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/pilot-control?_rsc=1g9gs
- /dashboard/security: [0] GET https://admin.youlya365.com/dashboard/command-center?_rsc=1g9gs

## Missing h1 list
- None.

## A11Y/RTL/responsive issues
- /dashboard/haidi/settings: hasArabicText=false, direction=rtl
- /dashboard/pilot: hasArabicText=false, direction=rtl

## API/health issues
- No API/health issues detected by collector inputs.

## UX issue priority
- P0: crash, auth loop, 500 API, blank page
- P1: missing heading, broken layout, inaccessible nav
- P2: weak empty states, visual polish, spacing

## Pilot blockers
- Any 500 API responses, auth redirects loops, or missing build footer should block pilot.

## Non-blocking improvements
- Enrich empty states with guidance and relevant next actions.
- Add page-level skeleton/loading states and error boundaries for data-heavy views.

