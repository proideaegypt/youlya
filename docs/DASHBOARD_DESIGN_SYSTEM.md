# Youlya Dashboard Design System

**Version:** v2.4.0
**Theme:** Smart Home Adaptation

## Philosophy

Polished admin dashboard for YOULYA HOME WEAR AI Commerce OS, adapted from the ThemeWagon Smart Home Next.js theme. Clean card-based layouts, gradient sidebar, and consistent token-based theming.

## Color Tokens

### Light Mode
| Token | Value | Usage |
|---|---|---|
| `--background` | `#fff8f8` | Page background |
| `--foreground` | `#2b2525` | Primary text |
| `--card` | `#ffffff` | Card surfaces |
| `--muted` | `#fde9ee` | Muted backgrounds |
| `--muted-foreground` | `#7f5a63` | Secondary text |
| `--border` | `#f0cad2` | Borders, dividers |
| `--primary` | `#efb6c1` | Brand pink, active states |
| `--primary-foreground` | `#2b2525` | Text on primary |
| `--destructive` | `#ef4444` | Errors, danger |
| `--brand` | `#efb6c1` | Gradient start |
| `--brand-2` | `#f8d7dd` | Gradient end |

### Dark Mode
| Token | Value | Usage |
|---|---|---|
| `--background` | `#201a1b` | Page background |
| `--foreground` | `#fff4f6` | Primary text |
| `--card` | `#2b2525` | Card surfaces |
| `--muted` | `#382f31` | Muted backgrounds |
| `--muted-foreground` | `#d3a8b2` | Secondary text |
| `--border` | `#534548` | Borders, dividers |
| `--primary` | `#efb6c1` | Brand pink |
| `--brand-2` | `#c97e8e` | Gradient end (darker) |

## Tone Colors

| Tone | Background | Text | Usage |
|---|---|---|---|
| Success | `bg-emerald-500/15` | `text-emerald-500` | Healthy, confirmed, active |
| Warning | `bg-amber-500/15` | `text-amber-500` | Pending, review, caution |
| Error | `bg-red-500/15` | `text-red-400` | Failed, blocked, danger |
| Neutral | `bg-muted` | `text-muted-foreground` | Default, info |
| Brand | `bg-primary/15` | `text-primary` | Brand highlights |

## Typography

- **Font:** Cairo (Arabic), Inter (Latin fallback)
- **Headings:** Semibold, tight line-height
- **Body:** Regular weight, comfortable reading
- **Labels:** Medium weight, muted color

## Spacing

- Cards: `p-4` to `p-5` padding
- Card radius: `rounded-2xl`
- Shell radius: `rounded-3xl`
- Gap between cards: `gap-4` to `gap-5`
- Section spacing: `space-y-5`

## Components

### Sidebar
- Gradient background (`bg-sidebar-gradient`)
- White text, white/20 hover states
- Active item: white background, dark text
- Collapse/expand with localStorage persistence
- Footer: promo card + logout button

### Topbar
- Sticky with backdrop blur
- Search input with icon
- AI status badge
- Notification bell with indicator
- User badge

### Cards
- `bg-card` background
- `ring-1 ring-border` border
- `shadow-sm` elevation
- Hover: `-translate-y-0.5` + `shadow-md`

### Buttons
- Primary: `bg-brand text-primary-foreground`
- Secondary: `bg-muted` or border style
- Icon buttons: rounded-full, hover:bg-muted
- All buttons must have visible text or sr-only text + aria-label

### Badges
- Rounded-full pills
- Tone-colored backgrounds with matching text
- `px-2.5 py-1 text-xs font-semibold`

## Responsive

- **Desktop (lg+):** Sidebar visible, full layout
- **Tablet (md):** Sidebar collapsible, adjusted grid
- **Mobile (<lg):** Sidebar as fixed drawer, stacked cards

## Accessibility

- All buttons have text content
- All inputs have labels or aria-label
- Navigation has aria-current for active page
- Color contrast meets WCAG AA
- RTL support for Arabic
