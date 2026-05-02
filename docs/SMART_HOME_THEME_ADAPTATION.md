# Smart Home Theme Adaptation

**Date:** 2026-05-02
**Task:** port-smart-home-theme-to-youlya-admin-dashboard
**Version:** v2.4.0

## Source Theme

- **Theme:** ThemeWagon Smart Home Next.js Theme
- **Path:** `/root/youlya/reference/themes/smart-home-1.0.0/`
- **Source URL:** https://themewagon.com/themes/smart-home/

## What Was Used

### Design System
- CSS variable token system (light/dark modes)
- `bg-sidebar-gradient` utility for sidebar background
- Card-based layout with `ring-1 ring-border` and `shadow-sm`
- Rounded corners (`rounded-2xl`, `rounded-3xl`)
- Surface hierarchy (`bg-card`, `bg-muted`, `bg-background`)

### Components
- **Sidebar:** Collapsible gradient sidebar with icon+label navigation
- **Topbar:** Search bar, notification bell, user avatar, mobile menu
- **Theme Toggle:** Moon/Sun icon button with state
- **Welcome Card:** Gradient hero card with app summary
- **KPI Widgets:** Icon + metric cards with tone colors
- **Charts:** Recharts bar charts with theme-aware colors

### Layout
- Dashboard shell with sidebar + main content
- Mobile drawer with overlay
- Responsive breakpoints (lg, md, sm)
- Sticky topbar with backdrop blur

## What Was Not Used

- Smart-home specific widgets (air-conditioning, light-controls, room-cards)
- Scene/shortcut panels
- Energy gauge widget
- Device cards
- User avatar group widget
- Color theme picker (purple/blue/teal/orange/pink)
- Sign-up page
- Profile/security/statistics pages (kept as settings/logs)

## Youlya Commerce Mapping

| Smart Home Concept | Youlya Adaptation |
|---|---|
| Dashboard | Command Center |
| Devices | Products / Integrations |
| Messages | WhatsApp Inbox / Handoffs |
| Security | AI Safety / Kill Switch |
| Statistics | Sales & Conversation Analytics |
| Profile | Store Profile / Settings |
| Energy consumption | Revenue / Order volume |
| Rooms | Channels / Workflows |
| Scenes | Quick actions |
| Users | Operators / Customers |
| Light controls | AI controls / Automation toggles |
| Air conditioning | System health / Integration status |

## Dependencies

### Added
- `lucide-react` - Icon library
- `class-variance-authority` - Component variant helper
- `clsx` - Conditional classnames
- `tailwind-merge` - Tailwind class deduplication

### Removed (from v2.3.0)
- `@mui/material` - Replaced with Tailwind CSS
- `@mui/icons-material` - Replaced with lucide-react
- `@emotion/react` - No longer needed
- `@emotion/styled` - No longer needed
- `stylis-plugin-rtl` - No longer needed

### Kept
- `next-themes` - Theme provider
- `recharts` - Charts (still used)
- `next` / `react` / `react-dom` - Core framework
- `@supabase/*` - Auth and database

## RTL / Arabic Notes

- Sidebar is on the left in LTR, right in RTL (handled by `dir` attribute)
- Navigation labels bilingual (Arabic default, English toggle)
- Cairo font preserved for Arabic
- Search and filter inputs support Arabic text

## Future Design Tasks

- Add `/dashboard/statistics` route with full analytics
- Add `/dashboard/profile` route for operator profile
- Add real-time conversation stream in inbox
- Add order detail page with Shopify link
- Add product catalog view
- Implement real data APIs for KPIs and charts
- Add dark mode polish for specific components
