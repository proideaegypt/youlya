"use client";

import { useState } from "react";

export function AiToggleCard({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    setLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ai_enabled: next, store_id: "youlya", updated_by: "dashboard" }),
    });
    if (!res.ok) setEnabled(!next);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 text-sm text-zinc-400">AI Kill Switch</div>
      <button
        onClick={toggle}
        disabled={loading}
        className={`rounded-lg border px-4 py-2 font-medium ${enabled ? "border-emerald-500 text-emerald-400" : "border-red-500 text-red-400"}`}
      >
        {enabled ? "AI مفعل" : "AI متوقف"}
      </button>
    </div>
  );
}
