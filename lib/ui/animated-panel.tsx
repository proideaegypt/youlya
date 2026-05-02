import type { ReactNode } from "react";

export function AnimatedPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`animate-enter rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 ${className}`}>{children}</div>;
}
