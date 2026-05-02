"use client";

import { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

type KpiTrend = { label: string; value: number };

export function KpiCard({
  label,
  value,
  hint,
  sparkline,
  progress,
}: {
  label: string;
  value: number | string;
  hint?: string;
  sparkline?: KpiTrend[];
  progress?: number;
}) {
  const target = useMemo(() => (typeof value === "number" ? value : Number.NaN), [value]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const duration = 500;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <article className="group rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
            {typeof value === "number" ? count.toLocaleString() : value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      {sparkline && sparkline.length > 0 ? (
        <div className="mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                itemStyle={{ color: "var(--brand-primary)" }}
                labelStyle={{ display: "none" }}
                formatter={(v) => [typeof v === "number" ? v : Number(v ?? 0), ""]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--brand-primary)"
                strokeWidth={2}
                fill={`url(#grad-${label})`}
                dot={false}
                activeDot={{ r: 3, fill: "var(--brand-primary)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {progress !== undefined ? (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--panel-soft)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand-muted)] to-[var(--brand-primary)] transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">{progress}%</p>
        </div>
      ) : null}

      {hint ? <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p> : null}
    </article>
  );
}
