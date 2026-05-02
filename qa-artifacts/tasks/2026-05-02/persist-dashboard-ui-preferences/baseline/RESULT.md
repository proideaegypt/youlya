# Baseline: persist-dashboard-ui-preferences

## Date
2026-05-02

## Current Preference Implementation

### Theme (dark/light)
- **File**: `lib/ui/theme-provider.tsx`
- **Library**: `next-themes`
- **Storage key**: `youlya-theme`
- **Cookie**: None
- **Default**: `light`
- **System preference**: `enableSystem` is true

### Color theme (pink/purple/blue/teal/orange/rose)
- **File**: `lib/ui/color-theme.tsx`
- **Storage key**: `youlya-brand`
- **Cookie**: None
- **Default**: `pink`
- **Applied via**: `document.documentElement.setAttribute("data-brand", key)`
- **CSS**: `globals.css` has `[data-brand="..."]` selectors

### Language (ar/en)
- **File**: `lib/ui/dashboard-shell.tsx`
- **Storage key**: `youlya_lang`
- **Cookie**: None
- **Default**: `ar`
- **Applied via**: `document.documentElement.dir` and `document.documentElement.lang`

### Sidebar collapsed/expanded
- **File**: `lib/ui/dashboard-sidebar.tsx`
- **Storage key**: `youlya-sidebar-open`
- **Cookie**: None
- **Default**: `true` (open)
- **Format**: `"1"` = open, `"0"` = closed

### Logout
- **File**: `lib/ui/dashboard-shell.tsx` (prop passed to Sidebar)
- **Current implementation**:
  ```tsx
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };
  ```
- **File**: `lib/ui/dashboard-sidebar.tsx` (fallback)
  ```tsx
  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    }
  };
  ```
- **No `localStorage.clear()`** currently found.
- **No cookie clearing** currently found.
- **Bug**: `/api/auth/logout` route does **not exist** in `app/api/`. Logout currently results in a 404 but still redirects to `/login`, meaning the user is **not actually signed out from Supabase**.

### Root layout
- **File**: `app/layout.tsx`
- Hardcodes `<html lang="ar" dir="rtl">`
- No pre-hydration script for color/language
- `suppressHydrationWarning` is present

## Likely Reset Cause

1. **No pre-hydration script**: When user logs out, `window.location.href = "/login"` causes a full page reload. On return to dashboard, `data-brand`, `dir`, and `lang` are only restored in `useEffect` / component mount, causing a visible flash to defaults and potentially perceived "reset".
2. **No cookie backup**: Without cookies, SSR cannot know preferences. On full reload, the HTML is always `lang="ar" dir="rtl"` with no `data-brand`.
3. **Supabase not actually signed out**: The non-existent `/api/auth/logout` means the auth session persists, but this is not directly related to UI preference reset.
4. **Inconsistent storage keys**: Keys use mixed naming (`youlya-theme`, `youlya-brand`, `youlya_lang`, `youlya-sidebar-open`) which makes maintenance harder.

## Files to Change

- `lib/ui/preferences.ts` (create)
- `app/layout.tsx`
- `lib/ui/theme-provider.tsx`
- `lib/ui/theme-toggle.tsx`
- `lib/ui/color-theme.tsx`
- `lib/ui/dashboard-shell.tsx`
- `lib/ui/dashboard-sidebar.tsx`
- `tests/playwright/dashboard-preferences-persistence.spec.ts` (create)
