import {
  listConversations,
  getConversationTimeline,
  maskCustomerIdentifier,
} from "@/lib/services/message-history-service";
import {
  MessageCircle,
  User,
  AlertTriangle,
  Bot,
  HandHelping,
  Clock,
} from "lucide-react";
import { RecordDateFilter } from "@/components/dashboard/record-date-filter";
import { RecordExportMenu } from "@/components/dashboard/record-export-menu";
import { parseDateRangeFromSearchParams } from "@/lib/dashboard/date-range";
import { ReturnToAiButton } from "@/components/dashboard/return-to-ai-button";
import { ChannelBadge } from "@/lib/ui/channel-identity";

async function loadConversations(filter?: string, searchParams?: Record<string, string | undefined>) {
  const storeId = "youlya";
  return listConversations(storeId, {
    limit: 50,
    status: filter && filter !== "all" ? filter : undefined,
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
        <HandHelping className="h-3 w-3" /> تحويل بشري
      </span>
    );
  if (status === "resolved")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
        مغلق
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
      <Bot className="h-3 w-3" /> ذكاء اصطناعي
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

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string; filter?: string; from?: string; to?: string; preset?: string; channel?: string; assignee?: string; search?: string }>;
}) {
  const params = await searchParams;
  const selectedId = params.conversation ?? "";
  const filter = params.filter ?? "all";
  const range = parseDateRangeFromSearchParams(params);
  const conversations = await loadConversations(filter, { ...params, from: range.from, to: range.to });
  const selected = selectedId
    ? conversations.find((c) => String(c.id) === selectedId)
    : conversations[0] ?? null;

  const timeline = selected ? await loadTimeline(String(selected.id)) : [];

  const handoffCount = conversations.filter((c) => String(c.status) === "handoff").length;

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-balance text-2xl font-semibold text-foreground">المحادثات</h1>
          <p className="mt-2 text-muted-foreground">سجل المحادثات والرسائل الواردة والصادرة</p>
        </div>
        <div className="flex items-center gap-3">
          {handoffCount > 0 ? (
            <div className="flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-500">
              <AlertTriangle className="h-4 w-4" />
              {handoffCount} تحويل بشري معلق
            </div>
          ) : null}
          <RecordExportMenu
            title="Conversations report"
            page="conversations"
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
              { label: "Handoffs", value: handoffCount },
            ]}
          />
          <a
            href="/dashboard/handoff"
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition"
          >
            <HandHelping className="h-4 w-4" />
            مركز التحويل البشري
          </a>
        </div>
      </div>

      <form className="mb-4">
        <input
          type="search"
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="ابحث برقم العميل أو المحادثة..."
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-primary/50"
        />
      </form>

      <div className="mb-4">
        <RecordDateFilter />
      </div>

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        {/* Conversation List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">قائمة المحادثات</h2>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
              {["all", "handoff", "ai_active"].map((f) => (
                <a
                  key={f}
                  href={`/dashboard/conversations?filter=${f}${selectedId ? `&conversation=${encodeURIComponent(selectedId)}` : ""}`}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition ${
                    filter === f
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "الكل" : f === "handoff" ? "تحويل بشري" : "ذكاء اصطناعي"}
                </a>
              ))}
            </div>
          </div>

          {conversations.length === 0 ? (
            <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
              <p className="text-sm text-muted-foreground">لا توجد محادثات</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((c) => {
                const id = String(c.id ?? "");
                const isActive = selected && String(selected.id) === id;
                return (
                  <li key={id}>
                    <a
                      href={`/dashboard/conversations?filter=${filter}&conversation=${encodeURIComponent(id)}`}
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
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {statusBadge(String(c.status ?? "ai_active"))}
                          {c.channel ? <ChannelBadge channel={String(c.channel)} /> : null}
                          {c.ai_paused || String(c.status ?? "") === "handoff" ? (
                            <span className="text-[10px] text-red-400">الذكاء الاصطناعي متوقف</span>
                          ) : null}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">الجدول الزمني</h2>
            {selected ? (
              <span className="text-[10px] text-muted-foreground">
                <Clock className="inline h-3 w-3 ml-1" />
                {timeline.length} عنصر
              </span>
            ) : null}
          </div>

          {selected ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">
                    {maskCustomerIdentifier(String(selected.customer_id ?? selected.id))}
                  </p>
                </div>
                {selected.ai_paused || String(selected.status ?? "") === "handoff" ? (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-red-400">الذكاء الاصطناعي متوقف لهذه المحادثة</p>
                    <div className="mt-2">
                      <ReturnToAiButton conversationId={String(selected.id)} />
                    </div>
                  </div>
                ) : null}
                {selected.assigned_to ? (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    معين لـ: {String(selected.assigned_to)}
                  </p>
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
