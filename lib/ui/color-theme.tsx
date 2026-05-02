"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_COLOR,
  YOULYA_COLOR_KEY,
  getStoredPreference,
  setStoredPreference,
  setPreferenceCookie,
  applyDocumentColorTheme,
  isValidColorTheme,
  type ValidColor,
} from "@/lib/ui/preferences";

const BRANDS = [
  { key: "pink", label: "Pink", color: "#efb6c1" },
  { key: "purple", label: "Purple", color: "#8b5cf6" },
  { key: "blue", label: "Blue", color: "#3b82f6" },
  { key: "teal", label: "Teal", color: "#14b8a6" },
  { key: "orange", label: "Orange", color: "#f97316" },
  { key: "rose", label: "Rose", color: "#f43f5e" },
] as const;

export function ColorThemePicker() {
  const [current, setCurrent] = useState<ValidColor>(() => {
    const saved = getStoredPreference(YOULYA_COLOR_KEY, "");
    return isValidColorTheme(saved) ? saved : "pink";
  });

  useEffect(() => {
    applyDocumentColorTheme(current);
  }, [current]);

  function setBrand(key: string) {
    if (!isValidColorTheme(key)) return;
    setCurrent(key);
    applyDocumentColorTheme(key);
    setStoredPreference(YOULYA_COLOR_KEY, key);
    setPreferenceCookie(COOKIE_COLOR, key);
  }

  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">Color theme</p>
      <div className="flex items-center gap-2">
        {BRANDS.map((b) => (
          <button
            key={b.key}
            aria-label={`Use ${b.label} theme`}
            onClick={() => setBrand(b.key)}
            className={`size-6 rounded-full ring-2 transition ${current === b.key ? "ring-ring" : "ring-transparent"} outline-none focus-visible:ring-2`}
            style={{ backgroundColor: b.color }}
          />
        ))}
      </div>
    </div>
  );
}
