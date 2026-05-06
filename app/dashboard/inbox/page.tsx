import {
  listConversations,
  getConversationTimeline,
  maskCustomerIdentifier,
} from "@/lib/services/message-history-service";
import { MessageCircle, User, AlertTriangle, Bot, HandHelping, Pause } from "lucide-react";
import { RecordDateFilter } from "@/components/dashboard/record-date-filter";
import { RecordExportMenu } from "@/components/dashboard/record-export-menu";
import { ReturnToAiButton } from "@/components/dashboard/return-to-ai-button";
import { parseDateRangeFromSearchParams } from "@/lib/dashboard/date-range";

async function loadConversations(searchParams?: Record<string, string | undefined>) {
  const storeId = "youlya";
  return listConversations(storeId, {
    limit: 50,
    status: searchParams?.filter && searchParams.filter !== "all" ? searchParams.filter : undefined,
    channel: searchParams?.channel || undefined,
    assignee: searchParams?.assignee || undefined,
    search: searchParams?.search || undefined,
    from: searchParams?.from || undefined,
    to: searchParams?.to || undefined,
  });
}

async function loadTimeline(conversationId: string) {
  const storeId = "youlya";
  return getConversationTimeline(conversationId, storeId, { limit: 100 });
}

function statusBadge(status: string) {
  if (status === "handoff")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
        <HandHelping className="h-3 w-3" /> Handoff
      </span>
    );
  if (status === "resolved")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
        Resolved
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
      <Bot className="h-3 w-3" /> AI
    </span>
  );
}

function directionBadge(direction?: string) {
  if (direction === "inbound")
    return <span className="text-[10px] font-semibold text-muted-foreground">IN</span>;
  if (direction === "outbound")
    return <span className="text-[10px] font-semibold text-primary">OUT</span>;
  return <span className="text-[10px] font-semibold text-amber-500">SYS</span>;
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string; filter?: string; from?: string; to?: string; preset?: string; channel?: string; assignee?: string; search?: string }>;
}) {
  const params = await searchParams;
  const selectedId = params.conversation ?? "";
  const range = parseDateRangeFromSearchParams(params);
  const conversations = await loadConversations({ ...params, from: range.from, to: range.to });
  const selected = selectedId
    ? conversations.find((c) => String(c.id) === selectedId)
    : conversations[0] ?? null;

  const timeline = selected ? await loadTimeline(String(selected.id)) : [];

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-balance text-2xl font-semibold text-foreground">طلبات التحويل للبشر</h1>
          <p className="mt-2 text-muted-foreground">Conversation timeline / AI events / handoff history</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            {conversations.filter((c) => String(c.status) === "handoff").length} pending handoffs
          </div>
          <RecordExportMenu
            title="Inbox report"
            page="inbox"
            columns={[
              { key: "id", label: "Conversation" },
              { key: "customer_id_masked", label: "Customer" },
              { key: "status", label: "Status" },
              { key: "channel", label: "Channel" },
              { key: "last_message_at", label: "Last Message" },
            ]}
            rows={conversations}
            summaryLines={[
              { label: "Total", value: conversations.length },
              { label: "Pending handoffs", value: conversations.filter((c) => String(c.status) === "handoff").length },
            ]}
          />
        </div>
      </div>

      <div className="mb-4">
        <RecordDateFilter />
      </div>

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        {/* Conversation List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">المحادثات</h2>
          {conversations.length === 0 ? (
            <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
              <p className="text-sm text-muted-foreground">لا يوجد تحويلات مفتوحة</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((c) => {
                const id = String(c.id ?? "");
                const isActive = selected && String(selected.id) === id;
                return (
                  <li key={id}>
                    <a
                      href={`/dashboard/inbox?conversation=${encodeURIComponent(id)}`}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition cursor-pointer ${
                        isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate font-medium text-foreground text-sm">
                            {maskCustomerIdentifier(String(c.customer_id ?? id))}
                          </p>
                          {c.last_message_at ? (
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(String(c.last_message_at)).toLocaleDateString("ar-EG")}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {statusBadge(String(c.status ?? "ai_active"))}
                          <span className="text-[10px] text-muted-foreground">{String(c.channel ?? "")}</span>
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Timeline */}
        <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
          <h2 className="mb-4 text-base font-semibold text-foreground">Timeline</h2>
          {selected ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">
                    {maskCustomerIdentifier(String(selected.customer_id ?? selected.id))}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {statusBadge(String(selected.status ?? "ai_active"))}
                  {selected.ai_paused ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      <Pause className="h-3 w-3" />
                      الذكاء الاصطناعي متوقف لهذه المحادثة
                    </span>
                  ) : null}
                  <span className="text-xs text-muted-foreground">ID: {String(selected.id).slice(0, 24)}…</span>
                </div>
                {selected.ai_paused ? (
                  <div className="mt-3">
                    <ReturnToAiButton conversationId={String(selected.id)} />
                  </div>
                ) : null}
              </div>

              {timeline.length === 0 ? (
                <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted p-6 text-center">
                  <p className="text-sm text-muted-foreground">لا توجد رسائل أو أحداث</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {timeline.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="mt-1 shrink-0">
                        {item.type === "message" ? directionBadge(item.direction) : (
                          <span className="text-[10px] font-semibold text-amber-500">EVT</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/50 p-3">
                        {item.type === "message" && item.text ? (
                          <p className="text-sm text-foreground whitespace-pre-wrap">{String(item.text)}</p>
                        ) : (
                          <p className="text-sm text-foreground">{String(item.summary ?? item.text ?? "")}</p>
                        )}
                        {item.event_type ? (
                          <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wide">{item.event_type}</p>
                        ) : null}
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {new Date(item.created_at).toLocaleString("ar-EG")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-muted p-6 text-center">
              <p className="text-sm text-muted-foreground">لا توجد محادثة محددة</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
