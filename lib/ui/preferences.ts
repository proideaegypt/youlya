"use client";

export const YOULYA_THEME_KEY = "youlya.theme";
export const YOULYA_COLOR_KEY = "youlya.colorTheme";
export const YOULYA_LANGUAGE_KEY = "youlya.language";
export const YOULYA_SIDEBAR_KEY = "youlya.sidebarCollapsed";

export const COOKIE_THEME = "youlya-theme";
export const COOKIE_COLOR = "youlya-color-theme";
export const COOKIE_LANGUAGE = "youlya-language";
export const COOKIE_SIDEBAR = "youlya-sidebar-collapsed";

export const VALID_THEMES = ["light", "dark"] as const;
export const VALID_COLORS = ["pink", "purple", "blue", "teal", "orange", "rose"] as const;
export const VALID_LANGUAGES = ["ar", "en"] as const;

export type ValidTheme = (typeof VALID_THEMES)[number];
export type ValidColor = (typeof VALID_COLORS)[number];
export type ValidLanguage = (typeof VALID_LANGUAGES)[number];

export function isValidTheme(value: string | null): value is ValidTheme {
  return VALID_THEMES.includes(value as ValidTheme);
}

export function isValidColorTheme(value: string | null): value is ValidColor {
  return VALID_COLORS.includes(value as ValidColor);
}

export function isValidLanguage(value: string | null): value is ValidLanguage {
  return VALID_LANGUAGES.includes(value as ValidLanguage);
}

export function getStoredPreference(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ?? fallback;
  } catch {
    return fallback;
  }
}

export function setStoredPreference(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage errors (e.g., private mode)
  }
}

export function setPreferenceCookie(name: string, value: string, maxAge = 60 * 60 * 24 * 365): void {
  if (typeof document === "undefined") return;
  try {
    const encoded = encodeURIComponent(value);
    document.cookie = `${name}=${encoded};path=/;max-age=${maxAge};SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function getPreferenceCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  } catch {
    return null;
  }
}

export function applyDocumentLanguage(language: ValidLanguage): void {
  if (typeof document === "undefined") return;
  const dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = language;
  document.documentElement.dir = dir;
}

export function applyDocumentColorTheme(colorTheme: ValidColor): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-brand", colorTheme);
}
