"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, UploadCloud, Clock3 } from "lucide-react";
import { StatusBadge } from "@/lib/ui/status-badge";

type Suggestion = {
  id: string;
  title: string;
  suggestion_text: string;
  status: "pending" | "approved" | "rejected" | "published" | string;
  source_type: string;
  created_at: string;
  reviewer_note: string | null;
};

type Data = {
  counts: { pending: number; approved: number; rejected: number; published: number };
  suggestions: Suggestion[];
};

export default function KnowledgeBasePage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/knowledge-base?store_id=youlya");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const review = async (suggestionId: string, action: "approve" | "reject" | "publish") => {
    await fetch("/api/dashboard/knowledge-base", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ store_id: "youlya", suggestion_id: suggestionId, action, actor: "dashboard_user" }),
    });
    await load();
  };

  return (
    <main className="p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Approved Knowledge Base</h1>
        <p className="text-sm text-muted-foreground mt-1">RAG uses published approved snippets only. No automatic self-learning.</p>
      </section>

      {loading || !data ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold">{data.counts.pending}</p></div>
            <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Approved</p><p className="text-xl font-bold">{data.counts.approved}</p></div>
            <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Rejected</p><p className="text-xl font-bold">{data.counts.rejected}</p></div>
            <div className="rounded-xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">Published</p><p className="text-xl font-bold">{data.counts.published}</p></div>
          </section>

          <section className="space-y-3">
            {data.suggestions.map((item) => (
              <article key={item.id} className="rounded-xl bg-card p-4 ring-1 ring-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.suggestion_text}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(item.created_at).toLocaleString("ar-EG")}</p>
                  </div>
                  <StatusBadge tone={item.status === "published" ? "success" : item.status === "rejected" ? "error" : "warning"}>{item.status}</StatusBadge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button className="rounded-lg px-3 py-1.5 text-xs bg-emerald-600 text-white" onClick={() => review(item.id, "approve")}><CheckCircle2 className="h-3.5 w-3.5 inline ml-1" />Approve</button>
                  <button className="rounded-lg px-3 py-1.5 text-xs bg-red-600 text-white" onClick={() => review(item.id, "reject")}><XCircle className="h-3.5 w-3.5 inline ml-1" />Reject</button>
                  <button className="rounded-lg px-3 py-1.5 text-xs bg-brand text-white" onClick={() => review(item.id, "publish")}><UploadCloud className="h-3.5 w-3.5 inline ml-1" />Publish</button>
                  <span className="rounded-lg px-3 py-1.5 text-xs bg-muted text-muted-foreground"><Clock3 className="h-3.5 w-3.5 inline ml-1" />{item.source_type}</span>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
