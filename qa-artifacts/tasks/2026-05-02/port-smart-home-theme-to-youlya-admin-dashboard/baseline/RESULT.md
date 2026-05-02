# Baseline: Port Smart Home Theme to Youlya Admin Dashboard

**Date:** 2026-05-02
**Task:** port-smart-home-theme-to-youlya-admin-dashboard
**Youlya Version:** v2.3.0

## Current Youlya State

### Existing Dashboard Files
- app/dashboard/layout.tsx
- app/dashboard/command-center/page.tsx
- app/dashboard/inbox/page.tsx
- app/dashboard/orders/page.tsx
- app/dashboard/logs/page.tsx
- app/dashboard/settings/page.tsx
- lib/ui/dashboard-shell.tsx
- lib/ui/dashboard-sidebar.tsx
- lib/ui/dashboard-topbar.tsx
- lib/ui/kpi-card.tsx
- lib/ui/section-card.tsx
- lib/ui/dashboard-charts.tsx
- lib/ui/theme-provider.tsx
- lib/ui/theme-toggle.tsx
- lib/ui/language-toggle.tsx
- lib/ui/build-identity-footer.tsx
- lib/ui/youlya-logo.tsx

### Dependencies
- Next.js 16.2.4, React 19.2.4
- Tailwind CSS 4
- next-themes 0.4.6
- @mui/material, @mui/icons-material
- @emotion/react, @emotion/styled
- recharts
- supabase-js, supabase/ssr

## Smart Home Theme Source

**Path:** /root/youlya/reference/themes/smart-home-1.0.0/

### Key Files
- app/(dashboard)/layout.tsx - Dashboard shell with sidebar+topbar
- app/(auth)/signin/page.tsx - Auth page
- components/sidebar.tsx - Collapsible sidebar with icons
- components/topbar.tsx - Search, notifications, settings, user dropdown
- components/theme-provider.tsx - next-themes wrapper
- components/theme-toggle.tsx - Light/dark toggle
- components/color-theme.tsx - Brand color picker
- components/dashboard/main-dashboard.tsx - Main dashboard layout
- components/dashboard/welcome-card.tsx - Hero welcome card
- components/dashboard/energy-widget.tsx - Gauge + bar chart
- components/dashboard/consumption-chart.tsx - Multi-bar chart
- components/dashboard/users.tsx - User avatars
- components/ui/* - shadcn UI primitives

### Theme CSS (globals.css)
- Uses Tailwind CSS v4 with oklch color tokens
- CSS variables for light/dark modes
- Brand color system with data-brand attribute
- Custom utilities: bg-brand, text-brand, bg-sidebar-gradient, themed-range
- Recharts theming support

## Porting Plan

### 1. Dependencies
Need to add:
- lucide-react (for icons)
- class-variance-authority, clsx, tailwind-merge (for cn helper)
- tw-animate-css (for Tailwind v4 animations)

Optional (if using shadcn components):
- @radix-ui/react-avatar
- @radix-ui/react-dropdown-menu
- @radix-ui/react-slot

### 2. CSS Migration
Replace current globals.css with Smart Home CSS variable system.
Map Youlya brand colors to the CSS variable system:
- --brand -> #EFB6C1 (blush pink)
- --brand-2 -> #F8D7DD (soft pink)
- Light bg -> #FFF8F8 (warm white)
- Dark bg -> #2B2525 (charcoal)

### 3. Components to Port
- **Sidebar:** Adapt Smart Home sidebar with Youlya nav items, logo, logout
- **Topbar:** Adapt Smart Home topbar with search, notifications, theme, language, user
- **ThemeProvider:** Use Smart Home next-themes wrapper
- **ThemeToggle:** Use Smart Home toggle with Moon/Sun icons
- **WelcomeCard:** Adapt for operator welcome / daily summary
- **EnergyWidget:** Adapt for AI activity / order conversion gauge
- **ConsumptionChart:** Adapt for orders/conversations trend
- **UsersWidget:** Adapt for active operators/customers

### 4. Pages to Redesign
- **Command Center:** Welcome card + KPIs + charts + integration cards
- **Inbox:** Messages layout from theme
- **Orders:** Card/table layout from theme
- **Logs:** Statistics/security layout from theme
- **Settings:** Profile/security layout from theme
- **Login:** Signin visual style from theme

### 5. Domain Mapping
- Smart Home Dashboard -> Command Center
- Devices -> Products/Integrations
- Messages -> WhatsApp Inbox
- Security -> AI Safety/Kill Switch
- Statistics -> Sales Analytics
- Profile -> Store Profile
- Energy consumption -> Revenue/orders
- Rooms -> Channels/workflows
- Scenes -> Quick actions
- Users -> Operators/customers
- Light controls -> AI controls
- Air conditioning -> System health

## Risks
1. Tailwind CSS v4 syntax differences between theme and Youlya
2. MUI + shadcn/ui potential conflicts
3. RTL Arabic layout with new sidebar design
4. Playwright tests may need updates for new selectors
5. Bundle size increase with lucide-react

## Recommended Approach
1. Remove MUI dependencies (keep only if needed)
2. Use Tailwind + CSS variables + lucide-react for consistency
3. Keep existing auth/business logic untouched
4. Test RTL carefully
5. Update Playwright selectors if needed
