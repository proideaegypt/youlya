# Dashboard Playwright Swarm Final QA Report

- Date: 2026-05-04
- Task: dashboard-v3-youlya-home-wear-redesign
- Playwright summary: not available

## Executive summary
- UX route reports generated: 12
- Failed tests count: unknown
- UX issues: 40
- Console errors: 16
- Real network failures: 12
- Ignored network noise count: 5
- Missing h1 routes: 5

## Screenshots index
- /dashboard/command-center: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_command-center.png
- /dashboard/devices: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_devices.png
- /dashboard/inbox: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_inbox.png
- /dashboard/logs: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_logs.png
- /dashboard/orders: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_orders.png
- /dashboard/pilot-control: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_pilot-control.png
- /dashboard/products-intelligence: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_products-intelligence.png
- /dashboard/products: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_products.png
- /dashboard/profile: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_profile.png
- /dashboard/security: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_security.png
- /dashboard/settings: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_settings.png
- /dashboard/statistics: /root/youlya/qa-artifacts/tasks/2026-05-04/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_statistics.png

## UX issues
- /dashboard/command-center: Missing build identity
- /dashboard/command-center: Missing Arabic labels
- /dashboard/command-center: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/devices: Missing build identity
- /dashboard/inbox: Missing build identity
- /dashboard/inbox: Missing Arabic labels
- /dashboard/inbox: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/logs: Missing h1/main page heading
- /dashboard/logs: Missing build identity
- /dashboard/logs: Missing Arabic labels
- /dashboard/logs: Blank-looking page
- /dashboard/logs: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/orders: Missing h1/main page heading
- /dashboard/orders: Missing build identity
- /dashboard/orders: Missing Arabic labels
- /dashboard/orders: Blank-looking page
- /dashboard/orders: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/pilot-control: Missing build identity
- /dashboard/pilot-control: Missing Arabic labels
- /dashboard/pilot-control: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/products-intelligence: Missing build identity
- /dashboard/products: Missing build identity
- /dashboard/products: Missing Arabic labels
- /dashboard/products: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/profile: Missing build identity
- /dashboard/security: Missing h1/main page heading
- /dashboard/security: Missing build identity
- /dashboard/security: Missing Arabic labels
- /dashboard/security: Blank-looking page
- /dashboard/security: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/settings: Missing h1/main page heading
- /dashboard/settings: Missing build identity
- /dashboard/settings: Missing Arabic labels
- /dashboard/settings: Blank-looking page
- /dashboard/settings: sidebar=false, content=false, overflow=false, overlay=false
- /dashboard/statistics: Missing h1/main page heading
- /dashboard/statistics: Missing build identity
- /dashboard/statistics: Missing Arabic labels
- /dashboard/statistics: Blank-looking page
- /dashboard/statistics: sidebar=false, content=false, overflow=false, overlay=false

## Functional issues
- Review functional swarm test output in Playwright report for any failed assertions.

## Console errors
- /dashboard/command-center: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/command-center: Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).
- /dashboard/inbox: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/inbox: %c%s%c listConversations error background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server   {code: 42703, details: null, hint: null, message: column conversations.ai_paused does not exist}
- /dashboard/inbox: Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).
- /dashboard/logs: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/orders: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/pilot-control: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/pilot-control: Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).
- /dashboard/products-intelligence: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

%s%s https://react.dev/link/hydration-mismatch 

  ...
    <SegmentViewNode type="layout" pagePath="dashboard/...">
      <SegmentTrieNode>
      <script>
      <script>
      <script>
      <script>
      <script>
      <script>
      <script>
      <DashboardLayout>
        <DashboardShell aiEnabled={true}>
          <div className="min-h-scre...">
            <div className="mx-auto px...">
              <div className="rounded-3x...">
                <div className="flex h-[95vh]">
                  <div>
                  <main className="flex-1 w-f...">
                    <Topbar onMenuClick={function onMenuClick} aiEnabled={true} language="ar" ...>
                      <header className="lg:-mx-7 s...">
                        <div className="h-16 px-4 ...">
                          <button>
                          <div className="flex-1 max...">
                            <label className="relative b...">
                              <span>
                              <input
                                value=""
                                onChange={function onChange}
                                placeholder="بحث في الطلبات والمحادثات..."
                                className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-sm"
                                aria-label="Search"
-                               style={{caret-color:"transparent"}}
                              >
                          ...
                    ...

- /dashboard/products: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/products: Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).
- /dashboard/security: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/security: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/settings: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- /dashboard/statistics: Failed to load resource: the server responded with a status of 500 (Internal Server Error)

## Real network failures
- /dashboard/command-center: [500] GET http://localhost:3001/dashboard/command-center
- /dashboard/inbox: [500] GET http://localhost:3001/dashboard/inbox
- /dashboard/logs: [500] GET http://localhost:3001/dashboard/logs
- /dashboard/orders: [500] GET http://localhost:3001/dashboard/orders
- /dashboard/pilot-control: [500] GET http://localhost:3001/dashboard/pilot-control
- /dashboard/products: [500] GET http://localhost:3001/dashboard/products
- /dashboard/security: [500] GET http://localhost:3001/dashboard/security
- /dashboard/security: [0] GET http://localhost:3001/dashboard/security
- /dashboard/security: [0] GET http://localhost:3001/dashboard/security
- /dashboard/security: [500] GET http://localhost:3001/dashboard/security
- /dashboard/settings: [500] GET http://localhost:3001/dashboard/settings
- /dashboard/statistics: [500] GET http://localhost:3001/dashboard/statistics

## Ignored framework/network noise
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/profile?_rsc=1ypm1
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=1ypm1
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/products-intelligence?_rsc=1ypm1
- /dashboard/devices: [0] GET https://admin.youlya365.com/dashboard/products?_rsc=1ypm1
- /dashboard/profile: [0] GET https://admin.youlya365.com/dashboard/logs?_rsc=1f5xx

## Missing h1 list
- /dashboard/logs
- /dashboard/orders
- /dashboard/security
- /dashboard/settings
- /dashboard/statistics

## A11Y/RTL/responsive issues
- /dashboard/command-center: hasArabicText=false, direction=unset
- /dashboard/inbox: hasArabicText=false, direction=unset
- /dashboard/logs: hasArabicText=false, direction=unset
- /dashboard/orders: hasArabicText=false, direction=unset
- /dashboard/pilot-control: hasArabicText=false, direction=unset
- /dashboard/products: hasArabicText=false, direction=unset
- /dashboard/security: hasArabicText=false, direction=unset
- /dashboard/settings: hasArabicText=false, direction=unset
- /dashboard/statistics: hasArabicText=false, direction=unset

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

