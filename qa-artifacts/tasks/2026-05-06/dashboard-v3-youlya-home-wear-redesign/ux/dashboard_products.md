# UX Route Report: /dashboard/products

- route: /dashboard/products
- title: YOULYA HOME WEAR Dashboard
- h1Present: yes
- heading: المنتجات والمخزون
- bodyTextLength: 682
- shellSidebarPresent: yes
- sidebarVisible: true
- contentVisible: true
- footerBuildIdentityVisible: false
- hasArabicText: true
- direction: rtl
- hasHorizontalOverflow(>20px): false
- screenshot: /root/youlya/qa-artifacts/tasks/2026-05-06/dashboard-v3-youlya-home-wear-redesign/ux/screenshots/dashboard_products.png
- consoleErrorCount: 5
- realFailedRequestCount: 1
- ignoredNetworkNoiseCount: 7

## UX Issues

- Missing build identity

## Console Errors

- Failed to load resource: net::ERR_NETWORK_CHANGED
- Failed to load resource: net::ERR_NETWORK_CHANGED
- Failed to load resource: net::ERR_NETWORK_CHANGED
- Failed to load resource: net::ERR_NETWORK_CHANGED
- Failed to load resource: net::ERR_NETWORK_CHANGED

## Real Failed Requests

- [0] GET https://admin.nex-lnk.online/api/dashboard/products/overview (net::ERR_NETWORK_CHANGED)

## Ignored Framework/Network Noise

- [0] GET https://admin.nex-lnk.online/dashboard/settings/ai-agent?_rsc=1ipce (net::ERR_NETWORK_CHANGED)
- [0] GET https://admin.nex-lnk.online/dashboard/settings/channels?_rsc=1ipce (net::ERR_NETWORK_CHANGED)
- [0] GET https://admin.nex-lnk.online/dashboard/statistics?_rsc=1ipce (net::ERR_NETWORK_CHANGED)
- [0] GET https://admin.nex-lnk.online/dashboard/conversations?_rsc=1ipce (net::ERR_NETWORK_CHANGED)
- [0] GET https://admin.nex-lnk.online/dashboard/orders?_rsc=1ipce (net::ERR_ABORTED)
- [0] GET https://admin.nex-lnk.online/dashboard/inbox?_rsc=1ipce (net::ERR_ABORTED)
- [0] GET https://admin.nex-lnk.online/dashboard/handoff?_rsc=1ipce (net::ERR_ABORTED)

