"use client";

import { useState } from "react";
import { Bot, Loader2 } from "lucide-react";

export function ReturnToAiButton({ conversationId }: { conversationId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleReturn() {
    if (!confirm("هل تريد إلغاء التحويل البشري وإرجاع هذه المحادثة للذكاء الاصطناعي؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/conversations/${encodeURIComponent(conversationId)}/return-to-ai`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "dashboard" }),
      });
      if (res.ok) {
        setDone(true);
        alert("تم إرجاع المحادثة للذكاء الاصطناعي.");
        window.location.reload();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "تعذر إرجاع المحادثة. حاول مرة أخرى.");
      }
    } catch {
      alert("تعذر إرجاع المحادثة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-500">
        <Bot className="h-3 w-3" />
        تم إرجاعها للذكاء الاصطناعي
      </span>
    );
  }

  return (
    <button
      onClick={handleReturn}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 transition disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />}
      إرجاع المحادثة للذكاء الاصطناعي
    </button>
  );
}
