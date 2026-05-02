type Point = { label: string; value: number };

function MiniBars({ points }: { points: Point[] }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <div className="mt-4 flex items-end gap-2">
      {points.map((point) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-md bg-[var(--brand-primary)]/20" style={{ height: `${Math.max(12, (point.value / max) * 96)}px` }}>
            <div className="h-full w-full rounded-md bg-gradient-to-t from-[var(--brand-muted)] to-[var(--brand-primary)]" />
          </div>
          <span className="text-[10px] text-[var(--muted)]">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartCard({ title, subtitle, points }: { title: string; subtitle: string; points: Point[] }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-xs text-[var(--muted)]">{subtitle}</p>
      <MiniBars points={points} />
    </section>
  );
}
