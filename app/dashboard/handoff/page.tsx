"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Pause,
  Play,
  RefreshCw,
  Shield,
  UserCheck,
  Filter,
  StickyNote,
  Bot,
  User,
  Search,
} from "lucide-react";
import { EmptyState } from "@/lib/ui/empty-state";
import { StatusBadge } from "@/lib/ui/status-badge";
import { RecordDateFilter } from "@/components/dashboard/record-date-filter";
import { RecordExportMenu } from "@/components/dashboard/record-export-menu";
import { useSearchParams } from "next/navigation";

type HandoffTicket = {
  id: string;
  conversationId: string;
  conversationIdDisplay: string;
  reason: string;
  priority: string;
  status: string;
  assignedTo: string | null;
  handoffType: string;
  problemSummary: string;
  aiPaused: boolean;
  aiSummary: string;
  notes: string | null;
  createdAt: string;
};

type TimelineItem = {
  id: string;
  type: string;
  direction?: string;
  event_type?: string;
  text?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

function PriorityBadge({ priority }: { priority: string }) {
  const tone = priority === "HIGH" ? "error" : "neutral";
  return <StatusBadge tone={tone}>{priority === "HIGH" ? "عالي" : "عادي"}</StatusBadge>;
}

function StatusBadgeCustom({ status }: { status: string }) {
  const map: Record<string, { tone: "error" | "warning" | "success" | "neutral"; label: string }> = {
    open: { tone: "error", label: "مفتوح" },
    assigned: { tone: "warning", label: "معين" },
    resolved: { tone: "success", label: "مغلق" },
    returned_to_ai: { tone: "success", label: "رجع للـ AI" },
  };
  const s = map[status] ?? { tone: "neutral", label: status };
  return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>;
}

function directionLabel(dir?: string) {
  if (dir === "inbound") return { icon: User, label: "العميل", color: "text-brand" };
  if (dir === "outbound") return { icon: Bot, label: "AI", color: "text-emerald-500" };
  return { icon: MessageCircle, label: "النظام", color: "text-muted-foreground" };
}

export default function HandoffCenterPage() {
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const [tickets, setTickets] = useState<HandoffTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<HandoffTicket | null>(null);
  const [noteText, setNoteText] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams(searchKey);
    params.set("status", statusFilter);
    params.set("priority", priorityFilter);
    params.set("type", typeFilter);
    params.set("assignee", assigneeFilter);
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  }, [assigneeFilter, priorityFilter, search, searchKey, statusFilter, typeFilter]);

  async function load() {
    const res = await fetch(`/api/dashboard/handoff?${queryString}`);
    const json = await res.json().catch(() => ({ tickets: [] }));
    const nextTickets: HandoffTicket[] = json.tickets ?? [];
    setTickets(nextTickets);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      const res = await fetch(`/api/dashboard/handoff?${queryString}`);
      const json = await res.json().catch(() => ({ tickets: [] }));
      if (!active) return;
      const nextTickets: HandoffTicket[] = json.tickets ?? [];
      setTickets(nextTickets);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [queryString]);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    void (async () => {
      setTimelineLoading(true);
      try {
        const res = await fetch(`/api/dashboard/conversations/${encodeURIComponent(selected.conversationId)}/timeline`);
        const json = await res.json().catch(() => ({ timeline: [] }));
        if (!active) return;
        setTimeline(json.timeline ?? []);
      } catch {
        if (active) setTimeline([]);
      } finally {
        if (active) setTimelineLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selected]);

  async function assign(id: string) {
    setActionLoading(id);
    await fetch(`/api/dashboard/handoff/${id}/assign`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ assignedTo: "staff" }) });
    await load();
    setActionLoading(null);
  }

  async function markContacted(id: string) {
    setActionLoading(id);
    await fetch(`/api/dashboard/handoff/${id}/note`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ note: "تم التواصل مع العميل من الفريق." }),
    });
    await assign(id);
    setActionLoading(null);
  }

  async function returnToAI(id: string) {
    setActionLoading(id);
    await fetch(`/api/dashboard/handoff/${id}/return-to-ai`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ actor: "staff" }) });
    await load();
    setSelected(null);
    setActionLoading(null);
  }

  async function resolve(id: string) {
    setActionLoading(id);
    await fetch(`/api/dashboard/handoff/${id}/resolve`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ resolvedBy: "staff" }) });
    await load();
    setSelected(null);
    setActionLoading(null);
  }

  async function addNote(id: string) {
    if (!noteText.trim()) return;
    setActionLoading(id);
    await fetch(`/api/dashboard/handoff/${id}/note`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ note: noteText }) });
    setNoteText("");
    await load();
    setActionLoading(null);
  }

  const openCount = tickets.filter((t) => t.status === "open").length;
  const assignedCount = tickets.filter((t) => t.status === "assigned").length;
  const filteredRows = tickets.map((ticket) => ({
    ...ticket,
    createdAt: ticket.createdAt,
  }));
  const lastCustomerMessage = useMemo(() => {
    return timeline.find((item) => item.type === "message" && item.direction === "inbound" && item.text)?.text ?? "";
  }, [timeline]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-sidebar-gradient p-6 text-white shadow-sm">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            <Shield className="h-3.5 w-3.5" />
            Human Handoff Center
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-balance text-3xl font-semibold">مركز التحويل البشري</h1>
            <p className="text-sm leading-6 text-white/90">
              إدارة المحادثات المحولة للبشر: تعيين، ملاحظات، إيقاف AI، وإرجاع المحادثة للذكاء الاصطناعي.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={openCount > 0 ? "error" : "success"}>{openCount} مفتوح</StatusBadge>
            <StatusBadge tone={assignedCount > 0 ? "warning" : "success"}>{assignedCount} معين</StatusBadge>
            <StatusBadge tone="neutral">{tickets.length} سجل</StatusBadge>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      </section>

      <RecordDateFilter />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-card p-2 ring-1 ring-border">
          <Filter className="h-4 w-4 text-muted-foreground ml-2" />
          <select
            aria-label="تصفية الحالة"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            <option value="all">كل الحالات</option>
            <option value="open">مفتوح</option>
            <option value="assigned">معين</option>
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-card p-2 ring-1 ring-border">
          <select
            aria-label="تصفية الأولوية"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            <option value="all">كل الأولويات</option>
            <option value="HIGH">عالي</option>
            <option value="NORMAL">عادي</option>
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-card p-2 ring-1 ring-border">
          <select
            aria-label="تصفية النوع"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            <option value="all">كل الأنواع</option>
            <option value="customer_service">خدمة العملاء</option>
            <option value="manager_request">طلب الإدارة</option>
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-card p-2 ring-1 ring-border">
          <input
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            placeholder="Assignee"
            className="w-28 bg-transparent text-sm outline-none"
            aria-label="تصفية المعين"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-card p-2 ring-1 ring-border">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في التذاكر"
            className="w-48 bg-transparent text-sm outline-none"
            aria-label="البحث في التحويلات"
          />
        </div>
        <RecordExportMenu
          title="Handoff queue report"
          page="handoff"
          columns={[
            { key: "conversationIdDisplay", label: "Conversation" },
            { key: "handoffType", label: "Type" },
            { key: "priority", label: "Priority" },
            { key: "status", label: "Status" },
            { key: "problemSummary", label: "Problem Summary" },
            { key: "createdAt", label: "Created At" },
          ]}
          rows={filteredRows}
          summaryLines={[
            { label: "Open", value: openCount },
            { label: "Assigned", value: assignedCount },
          ]}
          className="ml-auto"
        />
        <button onClick={load} className="ml-auto flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm ring-1 ring-border hover:bg-muted transition">
          <RefreshCw className="h-4 w-4" />
          تحديث
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border">
          <RefreshCw className="h-5 w-5 animate-spin text-brand" />
          <span className="mr-3 text-sm text-muted-foreground">جاري التحميل...</span>
        </div>
      ) : selected ? (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-brand hover:underline">
            <ArrowLeft className="h-4 w-4" />
            رجوع للقائمة
          </button>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Ticket details */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">محادثة {selected.conversationIdDisplay}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(selected.createdAt).toLocaleString("ar-EG")}</p>
                  </div>
                  <div className="flex gap-2">
                    <PriorityBadge priority={selected.priority} />
                    <StatusBadgeCustom status={selected.status} />
                  </div>
                </div>

                <div className="rounded-xl bg-muted p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">ملخص AI</p>
                  <p className="text-sm text-muted-foreground">{selected.aiSummary}</p>
                </div>

                <div className="rounded-xl bg-brand/5 p-4 space-y-2 border border-brand/10">
                  <p className="text-sm font-medium text-foreground">Problem Summary</p>
                  <p className="text-sm text-muted-foreground">{selected.problemSummary}</p>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 space-y-2 border border-border">
                  <p className="text-sm font-medium text-foreground">آخر رسالة من العميل</p>
                  <p className="text-sm text-muted-foreground">{lastCustomerMessage || "لا توجد رسالة واردة حديثة"}</p>
                </div>

                <a
                  href={`/dashboard/conversations?conversation=${encodeURIComponent(selected.conversationId)}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  فتح المحادثة
                </a>

                {selected.notes && (
                  <div className="rounded-xl bg-amber-500/5 p-4 space-y-2 border border-amber-500/10">
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium text-foreground">ملاحظات داخلية</p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{selected.notes}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">إضافة ملاحظة</p>
                  <div className="flex gap-2">
                    <input
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="اكتب ملاحظة داخلية..."
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand"
                    />
                    <button
                      onClick={() => addNote(selected.id)}
                      disabled={actionLoading === selected.id || !noteText.trim()}
                      className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50 transition"
                    >
                      إضافة
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {selected.status === "open" && (
                    <button
                      onClick={() => assign(selected.id)}
                      disabled={actionLoading === selected.id}
                      className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition"
                    >
                      <UserCheck className="h-4 w-4" />
                      تولى المحادثة
                    </button>
                  )}
                  {selected.status !== "resolved" && (
                    <button
                      onClick={() => markContacted(selected.id)}
                      disabled={actionLoading === selected.id}
                      className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 hover:bg-amber-500/20 transition"
                    >
                      <Play className="h-4 w-4" />
                      تم التواصل
                    </button>
                  )}
                  <button
                    onClick={() => returnToAI(selected.id)}
                    disabled={actionLoading === selected.id}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-500 hover:bg-emerald-500/20 transition"
                  >
                    <Play className="h-4 w-4" />
                    إرجاع المحادثة للذكاء الاصطناعي
                  </button>
                  <button
                    onClick={() => resolve(selected.id)}
                    disabled={actionLoading === selected.id}
                    className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Resolve
                  </button>
                </div>
              </div>
            </div>

            {/* Conversation preview */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-brand" />
                  <p className="text-sm font-semibold text-foreground">Conversation Preview</p>
                </div>

                {timelineLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-5 w-5 animate-spin text-brand" />
                    <span className="mr-3 text-sm text-muted-foreground">جاري تحميل المحادثة...</span>
                  </div>
                ) : timeline.length === 0 ? (
                  <div className="rounded-xl bg-muted p-6 text-center">
                    <p className="text-sm text-muted-foreground">لا توجد رسائل لهذه المحادثة</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {timeline.map((item) => {
                      const isMessage = item.type === "message";
                      const dir = directionLabel(item.direction);
                      const Icon = dir.icon;
                      return (
                        <div key={item.id} className={`flex gap-3 rounded-xl p-3 ${isMessage ? "bg-muted/50" : "bg-amber-500/5 border border-amber-500/10"}`}>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border">
                            <Icon className={`h-4 w-4 ${dir.color}`} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-foreground">{dir.label}</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleString("ar-EG")}</span>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {item.text ?? item.summary ?? "حدث نظامي"}
                            </p>
                            {item.event_type && (
                              <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-600">{item.event_type}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState title="لا توجد تحويلات مفتوحة" description="جميع المحادثات تحت السيطرة الآن. سيظهر هنا أي تحويل بشري جديد." />
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t)}
              className="cursor-pointer rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border transition hover:ring-brand/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{t.conversationIdDisplay}</p>
                      <PriorityBadge priority={t.priority} />
                      <StatusBadgeCustom status={t.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Type: {t.handoffType} · Summary: {t.problemSummary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString("ar-EG")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {t.aiPaused && t.status === "open" && (
                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400">
                      <Pause className="h-3 w-3" />
                      AI متوقف
                    </span>
                  )}
                  {t.status === "assigned" && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-500">
                      <UserCheck className="h-3 w-3" />
                      معين
                    </span>
                  )}
                  {t.status !== "resolved" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        returnToAI(t.id);
                      }}
                      disabled={actionLoading === t.id}
                      className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/20 transition disabled:opacity-50"
                    >
                      إرجاع للذكاء الاصطناعي
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
