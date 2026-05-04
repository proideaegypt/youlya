import type { ReactNode } from "react";

export function EmptyState({ title, description, action, compact }: { title: string; description: string; action?: ReactNode; compact?: boolean }) {
  return (
    <section className={`rounded-2xl border border-dashed border-border bg-muted text-center ${compact ? "p-3" : "p-6"}`}>
      <h3 className={`font-semibold text-foreground ${compact ? "text-sm" : "text-lg"}`}>{title}</h3>
      <p className={`text-muted-foreground ${compact ? "mt-1 text-xs" : "mt-2 text-sm"}`}>{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
