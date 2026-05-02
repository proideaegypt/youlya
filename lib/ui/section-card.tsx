import type { ReactNode } from "react";

type TaskItem = {
  id: string;
  title: string;
  subtitle: string;
  status: "open" | "in_progress" | "pending" | "confirmed" | "error" | "done" | "warning" | "success";
  when?: string;
  priority?: string;
};

const statusTone: Record<string, { bg: string; text: string; border: string }> = {
  open: { bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/30" },
  in_progress: { bg: "bg-[var(--brand-primary)]/15", text: "text-[var(--brand-primary)]", border: "border-[var(--brand-primary)]/30" },
  pending: { bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/30" },
  confirmed: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30" },
  error: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  done: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30" },
  warning: { bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/30" },
  success: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30" },
};

const statusLabel: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  pending: "Pending",
  confirmed: "Confirmed",
  error: "Error",
  done: "Done",
  warning: "Warning",
  success: "Success",
};

export function SectionCard({
  title,
  helper,
  items,
  emptyText,
  headerAction,
  renderActions,
}: {
  title: string;
  helper: string;
  items: TaskItem[];
  emptyText: string;
  headerAction?: ReactNode;
  renderActions?: (item: TaskItem) => ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{helper}</p>
        </div>
        {headerAction ? <div className="flex-shrink-0">{headerAction}</div> : null}
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        {items.length === 0 ? (
          <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel-soft)] p-6 text-center">
            <p className="text-sm text-[var(--muted)]">{emptyText}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const tone = statusTone[item.status];
              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-3 transition hover:border-[var(--brand-primary)]/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${tone.bg} ${tone.text} ${tone.border}`}>
                          {statusLabel[item.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)]">{item.subtitle}</p>
                      {item.when || item.priority ? (
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          {item.when ? <span className="text-xs text-[var(--muted)]">{item.when}</span> : null}
                          {item.priority ? <span className="text-xs text-[var(--muted)]">• {item.priority}</span> : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {renderActions ? <div className="mt-2 flex flex-wrap gap-2">{renderActions(item)}</div> : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
