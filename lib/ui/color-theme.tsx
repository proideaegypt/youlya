"use client";

import { useEffect, useState } from "react";

const BRANDS = [
  { key: "pink", label: "Pink", color: "#efb6c1" },
  { key: "purple", label: "Purple", color: "#8b5cf6" },
  { key: "blue", label: "Blue", color: "#3b82f6" },
  { key: "teal", label: "Teal", color: "#14b8a6" },
  { key: "orange", label: "Orange", color: "#f97316" },
  { key: "rose", label: "Rose", color: "#f43f5e" },
] as const;

export function ColorThemePicker() {
  const [current, setCurrent] = useState<string>("pink");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("youlya-brand") || "pink" : "pink";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(saved);
    document.documentElement.setAttribute("data-brand", saved);
  }, []);

  function setBrand(key: string) {
    setCurrent(key);
    document.documentElement.setAttribute("data-brand", key);
    localStorage.setItem("youlya-brand", key);
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
