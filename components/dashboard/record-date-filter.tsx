"use client";

import { useMemo, useState } from "react";
import { CalendarRange, RotateCcw, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  applyDateRangeToQuery,
  getThisMonthRange,
  getThisWeekRange,
  getTodayRange,
  parseDateRangeFromSearchParams,
  type DatePreset,
} from "@/lib/dashboard/date-range";

type Props = {
  timezone?: string;
  className?: string;
};

export function RecordDateFilter({ timezone = "Africa/Cairo", className = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(() => parseDateRangeFromSearchParams(searchParams, timezone), [searchParams, timezone]);
  const [from, setFrom] = useState(current.from);
  const [to, setTo] = useState(current.to);
  const [preset, setPreset] = useState<DatePreset>(current.preset);

  const pushRange = (nextPreset: DatePreset, rangeFrom: string, rangeTo: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const next = applyDateRangeToQuery(params, { preset: nextPreset, from: rangeFrom, to: rangeTo });
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div className={`rounded-2xl border border-border bg-card p-4 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Date filters
        </div>
        <button
          type="button"
          onClick={() => {
            const range = getTodayRange(timezone);
            setPreset(range.preset);
            setFrom(range.from);
            setTo(range.to);
            pushRange(range.preset, range.from, range.to);
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${preset === "today" ? "bg-brand text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => {
            const range = getThisWeekRange(timezone);
            setPreset(range.preset);
            setFrom(range.from);
            setTo(range.to);
            pushRange(range.preset, range.from, range.to);
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${preset === "this_week" ? "bg-brand text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          This week
        </button>
        <button
          type="button"
          onClick={() => {
            const range = getThisMonthRange(timezone);
            setPreset(range.preset);
            setFrom(range.from);
            setTo(range.to);
            pushRange(range.preset, range.from, range.to);
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${preset === "this_month" ? "bg-brand text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          This month
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
        <div className="grid gap-1">
          <label className="text-xs font-medium text-muted-foreground">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setPreset("custom");
              setFrom(e.target.value);
            }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium text-muted-foreground">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setPreset("custom");
              setTo(e.target.value);
            }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <button
          type="button"
          onClick={() => pushRange("custom", from, to)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <CalendarRange className="h-4 w-4" />
          Apply
        </button>
        <button
          type="button"
          onClick={() => {
            const range = getTodayRange(timezone);
            setPreset(range.preset);
            setFrom(range.from);
            setTo(range.to);
            const params = new URLSearchParams(searchParams.toString());
            params.delete("from");
            params.delete("to");
            params.set("preset", "today");
            router.replace(`${pathname}?${params.toString()}`);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
