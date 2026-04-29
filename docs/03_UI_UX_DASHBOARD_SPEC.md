# 03 — Dashboard UI/UX Spec

## 1. Design Direction
Youlya dashboard must feel:
- premium
- feminine but not childish
- clean and enterprise-ready
- analytics-heavy
- Arabic-first
- fast and trustworthy

The visual inspiration combines:
- soft Youlya pink/black brand identity.
- dense analytics dashboard style.
- side navigation like DashboardKit/Cloudflare.
- dark Arabic dashboard feel from the provided dark screenshot.
- modern Next.js/Tailwind dashboard structure.

## 2. Design Tokens

### Typography
```css
--font-ar: "Cairo", sans-serif;
--font-en: "Inter", "Poppins", sans-serif;
```

Use:
- Arabic: Cairo.
- English: Inter or Poppins.
- Dashboard numbers: tabular numerals.

### Light Theme
```css
--bg: #FFF7F9;
--surface: #FFFFFF;
--surface-soft: #F9EEF2;
--surface-elevated: #FFFFFF;
--text: #2A2325;
--text-muted: #7A6B70;
--border: #E8D8DD;
--primary: #EFB6C1;
--primary-strong: #E59AAA;
--accent: #8B1545;
--lavender: #D8CEDD;
--success: #16A34A;
--warning: #F59E0B;
--danger: #DC2626;
--info: #2563EB;
```

### Dark Theme
```css
--bg: #1F1A1B;
--surface: #2A2425;
--surface-soft: #362E30;
--surface-elevated: #30292B;
--text: #FFFFFF;
--text-muted: #CFC6C9;
--border: #403638;
--primary: #F1B7C3;
--primary-strong: #F5C7D0;
--accent: #B83268;
```

### Layout
- Sidebar width desktop: 280px.
- Collapsed sidebar: 76px.
- Topbar height: 72px.
- Page max content width: none for analytics pages.
- Card radius: 18–24px.
- Button radius: 999px for primary actions.
- Card shadow: soft, low opacity.

## 3. App Shell

### Arabic RTL
- Sidebar on right.
- Content direction RTL.
- Charts should keep numeric axes readable.
- Tables columns should be RTL ordered only if labels are Arabic.

### English LTR
- Sidebar on left.
- Content direction LTR.

### Topbar
Must include:
- Store switcher.
- Command search.
- AI status.
- Channel health badges.
- Language switcher.
- Theme toggle: light/dark/auto.
- Notifications.
- Profile menu.

### Sidebar
Sections:
```text
Command Center
Inbox
Orders
Customers
Products & Stock
AI Agent Studio
Knowledge Base
Channels
Reports
Team
Settings
```

## 4. Pages

### 4.1 Command Center
Purpose: executive overview.

Widgets:
- AI Revenue.
- Orders by AI.
- Conversion Rate.
- Handoff Rate.
- Failed Messages.
- Average Response Time.
- Channel Health.
- Sales Funnel.
- Revenue Chart.
- Top Products.
- Low Stock Alerts.
- Recent AI Orders.
- Recent Handoffs.

### 4.2 Inbox
Three-panel layout:
1. Conversation list.
2. Chat thread.
3. Customer context.

Features:
- AI/Human mode indicator.
- Take Over button.
- Return to AI button.
- Customer profile.
- Last product recommendations.
- Cart state.
- Shopify orders.
- Suggested next action.
- Internal notes.

### 4.3 Orders
Features:
- order list.
- filters: AI orders, pending confirmation, canceled tag, modified, shipped.
- order timeline.
- customer conversation link.
- Shopify link.
- audit log.

### 4.4 Products & Stock
Features:
- sync status.
- low stock.
- out-of-stock.
- top requested unavailable products.
- product quality score.
- missing images/descriptions.
- AI product optimizer suggestions.

### 4.5 AI Agent Studio
Tabs:
- Prompt.
- Personality.
- Sales Rules.
- Shipping Rules.
- Upsell Rules.
- Tool Permissions.
- Handoff Rules.
- Safety.
- Test Simulator.
- Versions.

Rules:
- Prompt edits must be Draft → Test → Publish.
- Published prompt must have version number.
- Rollback is mandatory.

### 4.6 Knowledge Base
Tabs:
- Policies.
- FAQs.
- Product Guides.
- Old Conversations.
- Suggested Learnings.
- Approved Knowledge.

### 4.7 Channels
Cards:
- Evolution WhatsApp.
- Meta WhatsApp.
- Instagram.
- Facebook.
- Email.

Each card:
- status.
- last received.
- last sent.
- last error.
- reconnect.
- webhook setup.
- credentials health.

### 4.8 Reports
Exports:
- PDF.
- PNG.
- JPG.
- CSV.

Reports:
- Daily Sales.
- AI Performance.
- Product Demand.
- Stock Alerts.
- Handoff.
- Lost Sales.
- Channel Performance.

### 4.9 Settings
Sections:
- Store.
- Shipping.
- Users/Roles.
- Integrations.
- Security.
- Notifications.
- Appearance.
- Language.
- Billing later.

## 5. Component Rules

Every component must support:
- default.
- hover.
- focus-visible.
- active.
- disabled.
- loading.
- error.
- empty.
- RTL/LTR.
- dark/light.

### KPI Card
Required:
- title.
- value.
- delta.
- period.
- sparkline optional.
- tooltip.

### AI Status Badge
States:
- Live.
- Paused.
- Human Only.
- Degraded.
- Error.

### Chat Bubble
Variants:
- customer.
- AI.
- human.
- system.
- tool event.
- error.

### Product Recommendation Card
Must show:
- index.
- image.
- title.
- price.
- available sizes.
- inventory flag.
- select action.

### Prompt Editor
Must include:
- syntax-aware textarea.
- save draft.
- test.
- publish.
- version history.
- diff against published.

## 6. Accessibility
Must meet WCAG 2.2 AA.
- Keyboard navigation for all menus/dialogs.
- Visible focus rings.
- Contrast AA.
- No icon-only buttons without labels.
- Tables accessible with headers.
- Charts have text summaries.
- Toasts announced to screen readers.
- Dialogs trap focus.

## 7. Motion
Use motion for:
- sidebar slide.
- cards enter.
- chart loading.
- notification drawer.
- skeleton transitions.

Do not use excessive animation in data-heavy pages.

## 8. Visual QA Checklist
- Arabic RTL correct.
- English LTR correct.
- Dark mode no low-contrast text.
- Mobile sidebar works.
- Data tables scroll horizontally.
- Long customer names truncate with tooltip.
- Empty states are helpful.
- Error states explain next action.
- Loading skeletons are consistent.
- Export buttons are clear.
