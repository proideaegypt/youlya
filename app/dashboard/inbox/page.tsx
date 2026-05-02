import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { MessageCircle, User, AlertTriangle, Send, XCircle } from "lucide-react";

type Handoff = {
  id: string;
  conversation_id: string;
  reason: string;
  requested_at: string;
};

async function loadHandoffs(): Promise<Handoff[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return getMockState().humanHandoffs
      .filter((h) => h.resolved_at === null)
      .map((h) => ({ id: h.id, conversation_id: h.conversation_id, reason: h.reason, requested_at: h.requested_at }));
  }
  const { data } = await supabase
    .from("human_handoffs")
    .select("id,conversation_id,reason,requested_at")
    .is("resolved_at", null)
    .order("requested_at", { ascending: false });
  return (data ?? []) as Handoff[];
}

export default async function InboxPage() {
  const handoffs = await loadHandoffs();
  const selected = handoffs[0];

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-balance text-2xl font-semibold text-foreground">صندوق الرسائل</h1>
          <p className="mt-2 text-muted-foreground">WhatsApp conversations / system alerts / handoff items</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-500">
          <AlertTriangle className="h-4 w-4" />
          {handoffs.length} pending
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        {/* Conversation List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">طلبات التحويل للبشر</h2>
          {handoffs.length === 0 ? (
            <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
              <p className="text-sm text-muted-foreground">لا يوجد تحويلات مفتوحة</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {handoffs.map((t, idx) => (
                <li
                  key={t.id}
                  className={`flex items-center gap-4 rounded-xl border p-3 transition cursor-pointer ${
                    idx === 0 ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                    {t.conversation_id[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium text-foreground text-sm">{t.conversation_id}</p>
                      <span className="text-xs text-muted-foreground">{new Date(t.requested_at).toLocaleDateString("ar-EG")}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{t.reason}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${idx === 0 ? "bg-amber-500/15 text-amber-500" : "bg-primary/10 text-primary"}`}>
                    {idx === 0 ? "Active" : "Queue"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Conversation Preview */}
        <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
          <h2 className="mb-4 text-base font-semibold text-foreground">Conversation Preview</h2>
          {selected ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{selected.conversation_id}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{selected.reason}</p>
              </div>

              <div className="rounded-xl border border-border bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Message timeline will appear here once conversation data is available via dashboard API.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reply" className="text-xs font-medium text-muted-foreground">
                  Manual reply / رد يدوي
                </label>
                <textarea
                  id="reply"
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={4}
                  placeholder="اكتب الرد اليدوي هنا..."
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                    إرسال
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-sm font-semibold transition hover:bg-background"
                  >
                    <XCircle className="h-4 w-4" />
                    إغلاق وتسليم للـ AI
                  </button>
                </div>
              </div>
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
