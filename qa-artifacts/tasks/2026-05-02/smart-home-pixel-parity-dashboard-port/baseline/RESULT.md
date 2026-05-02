# Baseline — smart-home-pixel-parity-dashboard-port

## Date
2026-05-02

## Current Live Version
- v2.4.1 (internal-whatsapp-n8n-pilot)
- Health: ok
- Build info: version 2.4.0, versionName port-smart-home-theme-to-youlya-admin-dashboard

## Theme Source
- Found: /root/youlya/reference/themes/smart-home-1.0.0/
- Zip: /root/youlya/reference/themes/smart-home-1.0.0.zip

## Current Dashboard Files
### App
- app/dashboard/layout.tsx
- app/dashboard/page.tsx (redirects to command-center)
- app/dashboard/command-center/page.tsx
- app/dashboard/inbox/page.tsx
- app/dashboard/orders/page.tsx
- app/dashboard/logs/page.tsx
- app/dashboard/settings/page.tsx
- app/dashboard/toggle-card.tsx
- app/login/page.tsx
- app/login/login-form.tsx
- app/layout.tsx
- app/globals.css

### Lib UI Components
- lib/ui/dashboard-shell.tsx
- lib/ui/dashboard-sidebar.tsx
- lib/ui/dashboard-topbar.tsx
- lib/ui/theme-provider.tsx
- lib/ui/theme-toggle.tsx
- lib/ui/language-toggle.tsx
- lib/ui/youlya-logo.tsx
- lib/ui/build-identity-footer.tsx
- lib/ui/kpi-card.tsx
- lib/ui/chart-card.tsx
- lib/ui/dashboard-charts.tsx
- lib/ui/animated-panel.tsx
- lib/ui/empty-state.tsx
- lib/ui/section-card.tsx
- lib/ui/status-badge.tsx

### Public Assets
- public/brand/youlya-logo-light.jpeg
- public/brand/youlya-logo-dark.jpeg

## Current UI Mismatch Summary
1. Topbar missing Smart Home settings dropdown with color theme picker
2. Topbar missing notification bell dropdown
3. Topbar missing user avatar dropdown
4. Active sidebar nav uses `text-[#2b2525]` instead of `text-brand`
5. Missing download/floating action button
6. Missing bottom-right promo/action element
7. Color theme switcher not implemented as Smart Home style
8. Language toggle is separate component instead of integrated
9. Missing new routes: statistics, security, devices, profile
10. Login page does not match Smart Home auth card style closely
11. Dashboard pages lack Smart Home widget/card rhythm
12. Dark mode colors are washed-out pink instead of Smart Home charcoal

## Exact Plan
1. Update globals.css with Smart Home CSS variable structure + brand presets
2. Update theme-provider.tsx to match Smart Home (storageKey, etc.)
3. Create color-theme.tsx with 6 swatches (pink default, purple, blue, teal, orange, rose)
4. Update theme-toggle.tsx to Smart Home dropdown style
5. Replace dashboard-shell.tsx with exact Smart Home shell (rounded container, sidebar, topbar, footer)
6. Replace dashboard-sidebar.tsx with Smart Home sidebar + Youlya nav mapping
7. Replace dashboard-topbar.tsx with Smart Home topbar (search, notifications dropdown, settings dropdown with theme+color, user dropdown)
8. Add SmartHomeDownloadButton component
9. Update login page to match Smart Home signin style
10. Create /dashboard/statistics, /dashboard/security, /dashboard/devices, /dashboard/profile
11. Update command-center, inbox, orders, logs, settings to match Smart Home card/page rhythm
12. Update Playwright tests for new routes
13. Run full verification pipeline
14. Release and deploy

## Theme Components to Port
- components/sidebar.tsx -> lib/ui/dashboard-sidebar.tsx
- components/topbar.tsx -> lib/ui/dashboard-topbar.tsx
- components/theme-toggle.tsx -> lib/ui/theme-toggle.tsx
- components/color-theme.tsx -> lib/ui/color-theme.tsx
- components/theme-provider.tsx -> lib/ui/theme-provider.tsx
- components/button-download.tsx -> lib/ui/download-button.tsx
- app/(dashboard)/layout.tsx -> app/dashboard/layout.tsx (adapt to SSR auth)
- app/(auth)/signin/page.tsx -> app/login/page.tsx (adapt to Supabase auth)

## Pages to Port/Adapt
- dashboard -> command-center
- messages -> inbox
- statistics -> new
- security -> new
- devices -> new
- profile -> new

## Dependencies
Already installed: lucide-react, class-variance-authority, clsx, tailwind-merge, next-themes, recharts
No new dependencies needed.
