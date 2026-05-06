"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import {
  YOULYA_COLOR_KEY,
  applyDocumentColorTheme,
  getStoredPreference,
  isValidColorTheme,
} from "@/lib/ui/preferences";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // One-time migration from old key
    try {
      const old = localStorage.getItem("youlya-theme");
      if (old && !localStorage.getItem("youlya.theme")) {
        localStorage.setItem("youlya.theme", old);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const saved = getStoredPreference(YOULYA_COLOR_KEY, "");
      if (isValidColorTheme(saved)) {
        applyDocumentColorTheme(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="youlya.theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
