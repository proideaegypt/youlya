"use client";

import { Globe } from "lucide-react";

type Language = "ar" | "en";

export function LanguageToggle({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(language === "ar" ? "en" : "ar")}
      className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:bg-muted"
      aria-label="Toggle language"
    >
      <span>Language</span>
      <span className="inline-flex items-center gap-2 font-medium">
        <Globe className="h-4 w-4" />
        {language === "ar" ? "العربية" : "English"}
      </span>
    </button>
  );
}
