"use client";

import { useState } from "react";

export function AiToggleCard({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    setLoading(true);
    const res = await fetch("/api/dashboard/pilot/actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: next ? "resume_haidi" : "pause_haidi", updatedBy: "dashboard_toggle" }),
    });
    if (!res.ok) setEnabled(!next);
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-1 text-sm font-semibold">AI Settings</div>
      <div className="mb-3 text-xs text-[var(--muted)]">AI Kill Switch</div>
      <button
        onClick={toggle}
        disabled={loading}
        className={`rounded-xl border px-4 py-2 font-semibold ${enabled ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-red-500 text-red-500 dark:text-red-400"}`}
      >
        {enabled ? "AI مفعل" : "AI متوقف"}
      </button>
    </div>
  );
}
