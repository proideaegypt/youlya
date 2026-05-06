"use client";

import { useState } from "react";
import { HandHelping, RefreshCw } from "lucide-react";

export function HandoffConversationButton({ conversationId }: { conversationId: string }) {
  const [loading, setLoading] = useState(false);

  const handoff = async () => {
    setLoading(true);
    await fetch(`/api/dashboard/conversations/${encodeURIComponent(conversationId)}/actions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "handoff", reason: "manual_dashboard" }),
    });
    setLoading(false);
    window.location.reload();
  };

  return (
    <button
      onClick={handoff}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 hover:bg-amber-500/20 transition disabled:opacity-50"
    >
      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <HandHelping className="h-4 w-4" />}
      تحويل لفريق الدعم
    </button>
  );
}
