"use client";

import { useState } from "react";
import { FileText, Search, AlertTriangle, Info, AlertCircle } from "lucide-react";

const sampleLogs = [
  { id: "1", timestamp: "2026-05-01 18:00", type: "AI_TOOL", level: "info", message: "Product search executed", details: "Query: 'summer dress'" },
  { id: "2", timestamp: "2026-05-01 17:42", type: "ORDER", level: "warning", message: "Pending confirmation timeout", details: "Order #Y-1023" },
  { id: "3", timestamp: "2026-05-01 17:31", type: "SECURITY", level: "error", message: "Auth retry blocked", details: "IP: 192.168.1.100" },
  { id: "4", timestamp: "2026-05-01 17:15", type: "WEBHOOK", level: "info", message: "Shopify order webhook received", details: "Order #SH-4521" },
  { id: "5", timestamp: "2026-05-01 16:58", type: "EVOLUTION", level: "info", message: "WhatsApp message sent", details: "To: +201xxxxxxx" },
  { id: "6", timestamp: "2026-05-01 16:30", type: "AUDIT", level: "info", message: "User login successful", details: "user@example.com" },
];

const levelIcon = (level: string) => {
  switch (level) {
    case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "warning": return <AlertCircle className="h-4 w-4 text-amber-500" />;
    default: return <Info className="h-4 w-4 text-emerald-500" />;
  }
};

const levelBadge = (level: string) => {
  const classes: Record<string, string> = {
    info: "bg-emerald-500/15 text-emerald-500",
    warning: "bg-amber-500/15 text-amber-500",
    error: "bg-red-500/15 text-red-400",
  };
  return classes[level] || "bg-muted text-muted-foreground";
};

const typeBadge = (type: string) => {
  const classes: Record<string, string> = {
    AI_TOOL: "bg-primary/15 text-primary",
    ORDER: "bg-amber-500/15 text-amber-500",
    WEBHOOK: "bg-emerald-500/15 text-emerald-500",
    EVOLUTION: "bg-emerald-500/15 text-emerald-500",
    AUDIT: "bg-muted text-muted-foreground",
    SECURITY: "bg-red-500/15 text-red-400",
  };
  return classes[type] || "bg-muted text-muted-foreground";
};

const typeLabel = (type: string) => {
  const labels: Record<string, string> = {
    AI_TOOL: "AI Tool",
    ORDER: "Order",
    WEBHOOK: "Webhook",
    EVOLUTION: "Evolution",
    AUDIT: "Audit",
    SECURITY: "Security",
  };
  return labels[type] || type;
};

export default function DashboardLogsPage() {
  const [filter, _setFilter] = useState<"all" | "info" | "warning" | "error">("all");
  const [search, setSearch] = useState("");

  const filteredLogs = sampleLogs.filter((log) => {
    if (filter !== "all" && log.level !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-balance text-2xl font-semibold text-foreground">السجلات</h1>
          <p className="mt-2 text-muted-foreground">Logs</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-full border border-border bg-background pl-9 pr-3 text-sm"
              aria-label="Search logs"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">All</span>
          </div>
          <p className="mt-1 text-xl font-bold">{sampleLogs.length}</p>
        </div>
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">Info</span>
          </div>
          <p className="mt-1 text-xl font-bold">{sampleLogs.filter((l) => l.level === "info").length}</p>
        </div>
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Warning</span>
          </div>
          <p className="mt-1 text-xl font-bold">{sampleLogs.filter((l) => l.level === "warning").length}</p>
        </div>
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-muted-foreground">Error</span>
          </div>
          <p className="mt-1 text-xl font-bold">{sampleLogs.filter((l) => l.level === "error").length}</p>
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">No logs match your filters.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredLogs.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-border p-3 transition hover:border-primary/30 hover:bg-muted"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {levelIcon(entry.level)}
                  <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeBadge(entry.type)}`}>
                    {typeLabel(entry.type)}
                  </span>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${levelBadge(entry.level)}`}>
                  {entry.level}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground">{entry.message}</p>
              {entry.details ? <p className="mt-1 text-xs text-muted-foreground">{entry.details}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
