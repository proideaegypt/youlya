"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { COOKIE_THEME, setPreferenceCookie } from "@/lib/ui/preferences";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = resolvedTheme ?? theme;
    if (t === "light" || t === "dark") {
      setPreferenceCookie(COOKIE_THEME, t);
    }
  }, [resolvedTheme, theme]);

  if (!mounted) return null;

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
    >
      <span>Theme</span>
      {isDark ? (
        <span className="inline-flex items-center gap-2">
          Dark <Moon className="size-4" />
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          Light <Sun className="size-4" />
        </span>
      )}
    </button>
  );
}
