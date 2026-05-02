import type { ReactNode } from "react";

type Tone = "success" | "warning" | "error" | "neutral" | "brand";

const toneClass: Record<Tone, string> = {
  success: "bg-emerald-500/15 text-emerald-500",
  warning: "bg-amber-500/15 text-amber-500",
  error: "bg-red-500/15 text-red-400",
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-primary/15 text-primary",
};

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass[tone]}`}>{children}</span>;
}
