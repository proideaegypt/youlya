# Baseline Analysis: Port Next-Link Dashboard to Youlya Commerce

**Date:** 2026-05-01
**Task:** port-next-link-dashboard-system-to-youlya-commerce
**Youlya Version:** v2.2.1 (add-official-youlya-brand-logo-assets)

## Current Youlya Dashboard State

### Files
- `app/dashboard/layout.tsx` - Dashboard shell wrapper with auth
- `app/dashboard/command-center/page.tsx` - Main KPI dashboard
- `app/dashboard/inbox/page.tsx` - AI handoff inbox
- `app/dashboard/orders/page.tsx` - Orders list
- `app/dashboard/logs/page.tsx` - System logs
- `app/dashboard/settings/page.tsx` - Settings page
- `lib/ui/dashboard-shell.tsx` - Shell component
- `lib/ui/dashboard-sidebar.tsx` - Sidebar navigation
- `lib/ui/dashboard-topbar.tsx` - Top header bar
- `lib/ui/kpi-card.tsx` - KPI metric card
- `lib/ui/chart-card.tsx` - Simple bar chart card
- `lib/ui/animated-panel.tsx` - Panel wrapper
- `lib/ui/empty-state.tsx` - Empty state component
- `lib/ui/status-badge.tsx` - Status chip/badge
- `lib/ui/build-identity-footer.tsx` - Version footer
- `lib/ui/youlya-logo.tsx` - Logo component
- `lib/ui/language-toggle.tsx` - AR/EN toggle
- `lib/ui/theme-toggle.tsx` - Light/dark toggle

### Dependencies
- React 19.2.4
- Next.js 16.2.4
- Tailwind CSS 4
- next-themes 0.4.6
- Supabase SSR auth
- **No MUI, no Recharts**

### Brand Identity
- Primary blush pink #EFB6C1
- Soft pink #F8D7DD
- Dark charcoal #2B2525
- Warm white #FFF8F8
- Muted rose #C97E8E
- Cairo font for Arabic
- Logo: public/brand/youlya-logo-light.jpeg, youlya-logo-dark.jpeg

## Next-Link Reference Dashboard

### Key Components
- `components/dashboard/dashboard-shell.tsx` (730 lines) - Full MUI-based shell
- `components/dashboard/dashboard-sidebar.tsx` (457 lines) - Rich sidebar with profile menu
- `components/dashboard/dashboard-topbar.tsx` (69 lines) - Topbar with notifications
- `components/dashboard/kpi-card.tsx` (80 lines) - KPI with sparkline
- `components/dashboard/section-card.tsx` (168 lines) - Task list card
- `components/dashboard/charts/DashboardCharts.tsx` (165 lines) - Recharts visualizations
- `components/dashboard/charts/KpiSparkline.tsx` (47 lines) - Mini sparkline chart

### Dependencies
- @mui/material 7.3.6
- @mui/icons-material 7.3.6
- @emotion/react 11.14.0
- @emotion/styled 11.14.1
- recharts 3.8.1
- next-intl 4.8.3
- stylis-plugin-rtl (for Arabic RTL)

### i18n Structure
- messages/en.json (985 lines) - Full translation dictionary
- messages/ar.json - Arabic translations
- next-intl provider pattern

## Porting Strategy

### Dependencies to Add
```json
{
  "@mui/material": "^7.3.6",
  "@mui/icons-material": "^7.3.6",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.0",
  "recharts": "^3.8.1",
  "stylis-plugin-rtl": "^2.1.1"
}
```

### Component Mapping

| Next-Link Component | Youlya Adaptation | Notes |
|--------------------|-------------------|-------|
| DashboardShell | lib/ui/dashboard-shell.tsx | Keep Youlya auth, add MUI polish |
| DashboardSidebar | lib/ui/dashboard-sidebar.tsx | Add profile menu, collapse animation |
| DashboardTopbar | lib/ui/dashboard-topbar.tsx | Add notification placeholder |
| KpiCard | lib/ui/kpi-card.tsx | Add sparkline, progress bar |
| SectionCard | lib/ui/section-card.tsx | New component for task lists |
| DashboardCharts | lib/ui/dashboard-charts.tsx | New Recharts-based charts |
| KpiSparkline | lib/ui/kpi-sparkline.tsx | New mini sparkline |

### Navigation Mapping (Youlya Commerce)

| Route | Arabic | English |
|-------|--------|---------|
| /dashboard/command-center | لوحة التحكم | Command Center |
| /dashboard/inbox | الرسائل | Inbox |
| /dashboard/orders | الطلبات | Orders |
| /dashboard/logs | السجلات | Logs |
| /dashboard/settings | الإعدادات | Settings |

### Risks
1. **Dependency churn** - Adding MUI + Recharts increases bundle size
2. **RTL compatibility** - Need to verify MUI RTL with stylis-plugin-rtl
3. **Theme migration** - Must map Youlya brand colors to MUI theme
4. **i18n approach** - next-intl adds complexity; may use simple dictionary instead

### Recommendations
1. Add MUI + Recharts dependencies (Next-Link quality depends on them)
2. Use simple dictionary-based i18n (avoid next-intl complexity)
3. Create MUI theme with Youlya brand colors
4. Port component architecture, not medical domain labels
5. Keep existing Supabase auth and business logic unchanged

## Next Steps
1. Install dependencies
2. Create MUI theme provider with Youlya colors
3. Port dashboard-shell with MUI components
4. Port sidebar with collapse/expand, profile menu
5. Port topbar with notification placeholder
6. Enhance KPI cards with sparklines
7. Create section-card for task lists
8. Create dashboard-charts with Recharts
9. Update all dashboard pages
10. Run Playwright swarm QA
