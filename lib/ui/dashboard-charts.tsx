"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = { label: string; value: number; [key: string]: unknown };

const tooltipStyle = {
  contentStyle: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    fontSize: 12,
  },
  itemStyle: { color: "var(--brand-primary)" },
};

const CHART_COLORS = {
  primary: "#EFB6C1",
  secondary: "#C97E8E",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

export function DashboardCharts({
  salesTrend,
  aiVsHuman,
  ordersTrend,
  conversionFunnel,
}: {
  salesTrend?: ChartPoint[];
  aiVsHuman?: ChartPoint[];
  ordersTrend?: ChartPoint[];
  conversionFunnel?: ChartPoint[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {salesTrend && salesTrend.length > 0 ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Sales Trend</h3>
          <p className="text-xs text-[var(--muted)]">اتجاه المبيعات - Last 7 days</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fill="url(#salesGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {aiVsHuman && aiVsHuman.length > 0 ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">AI vs Human Handoff</h3>
          <p className="text-xs text-[var(--muted)]">توازن التشغيل</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiVsHuman} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {aiVsHuman.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? CHART_COLORS.primary : CHART_COLORS.secondary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {ordersTrend && ordersTrend.length > 0 ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Orders Trend</h3>
          <p className="text-xs text-[var(--muted)]">اتجاه الطلبات - Last 7 days</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersTrend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS.success}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: CHART_COLORS.success, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {conversionFunnel && conversionFunnel.length > 0 ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Conversion Funnel</h3>
          <p className="text-xs text-[var(--muted)]">قمع التحويل</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionFunnel}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {conversionFunnel.map((_, i) => (
                    <Cell key={i} fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.success][i % 3]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v) => [typeof v === "number" ? v : Number(v ?? 0), ""]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}
    </div>
  );
}
