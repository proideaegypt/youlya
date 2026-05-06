"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/lib/ui/status-badge";

type LearningRow = {
  id: string;
  title: string;
  suggestion_text: string;
  status: string;
  source_ref?: string | null;
};

async function fetchLearningQueue() {
  const res = await fetch("/api/dashboard/haidi/learning?store_id=youlya");
  const data = await res.json();
  return data as {
    suggestions?: LearningRow[];
    counts?: { pending: number; approved: number; rejected: number; published: number };
    publishedKnowledgeVersionPlaceholder?: string;
  };
}

export default function HaidiLearningPage() {
  const [rows, setRows] = useState<LearningRow[]>([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, published: 0 });
  const [versionPlaceholder, setVersionPlaceholder] = useState("v1-placeholder");

  useEffect(() => {
    void fetchLearningQueue().then((data) => {
      setRows(data.suggestions ?? []);
      setCounts(data.counts ?? { pending: 0, approved: 0, rejected: 0, published: 0 });
      setVersionPlaceholder(String(data.publishedKnowledgeVersionPlaceholder ?? "v1-placeholder"));
    });
  }, []);

  const review = async (id: string, action: "approve" | "reject" | "publish") => {
    await fetch("/api/dashboard/haidi/learning", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ store_id: "youlya", suggestion_id: id, action }),
    });
    void fetchLearningQueue().then((data) => {
      setRows(data.suggestions ?? []);
      setCounts(data.counts ?? { pending: 0, approved: 0, rejected: 0, published: 0 });
      setVersionPlaceholder(String(data.publishedKnowledgeVersionPlaceholder ?? "v1-placeholder"));
    });
  };

  return (
    <main className="p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Haidi Learning Queue</h1>
        <p className="text-sm text-muted-foreground">Approval-only learning pipeline. Auto-learning is disabled.</p>
        <p className="text-xs text-muted-foreground mt-1">Published knowledge version placeholder: {versionPlaceholder}</p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold">{counts.pending}</p></div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Approved</p><p className="text-xl font-bold">{counts.approved}</p></div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Rejected</p><p className="text-xl font-bold">{counts.rejected}</p></div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Published</p><p className="text-xl font-bold">{counts.published}</p></div>
      </section>

      <section className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{row.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{row.suggestion_text}</p>
                <p className="text-xs text-muted-foreground mt-1">{row.source_ref ?? "no-source-ref"}</p>
              </div>
              <StatusBadge tone={row.status === "published" ? "success" : row.status === "rejected" ? "error" : "warning"}>{row.status}</StatusBadge>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white" onClick={() => review(row.id, "approve")}>Approve</button>
              <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white" onClick={() => review(row.id, "reject")}>Reject</button>
              <button className="rounded-lg bg-brand px-3 py-1.5 text-xs text-white" onClick={() => review(row.id, "publish")}>Publish</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
