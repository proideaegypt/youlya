import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

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
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-4 font-semibold">طلبات التحويل للبشر</h2>
        <div className="space-y-2">
          {handoffs.map((item) => (
            <div key={item.id} className="rounded-lg border border-zinc-800 p-3">
              <div className="font-medium">{item.conversation_id}</div>
              <div className="text-xs text-zinc-400">{item.reason}</div>
              <div className="text-xs text-zinc-500">{new Date(item.requested_at).toLocaleString("ar-EG")}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-4 font-semibold">المحادثة</h2>
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 p-3 text-sm text-zinc-300">
              {selected.conversation_id}
            </div>
            <div className="space-y-2 rounded-lg border border-zinc-800 p-3">
              <div className="text-sm text-zinc-400">عرض آخر الرسائل من السجلات متاح بعد ربط جدول messages.</div>
            </div>
            <form className="space-y-2">
              <textarea className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm" rows={4} placeholder="اكتبي الرد اليدوي..." />
              <div className="flex gap-2">
                <button type="button" className="rounded-lg border border-zinc-800 px-4 py-2 font-medium">إرسال</button>
                <button type="button" className="rounded-lg border border-zinc-800 px-4 py-2 font-medium">إغلاق وتسليم للـ AI</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-sm text-zinc-400">لا يوجد تحويلات مفتوحة حالياً.</div>
        )}
      </section>
    </div>
  );
}
