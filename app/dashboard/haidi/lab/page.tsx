"use client";

import { useEffect, useState } from "react";

type Scenario = {
  id: string;
  title: string;
  input_text: string;
  expected_intent?: string | null;
  expected_tone?: string | null;
  must_include?: string[];
  must_not_include?: string[];
};

export default function HaidiLabPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [title, setTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [expectedIntent, setExpectedIntent] = useState("");
  const [expectedTone, setExpectedTone] = useState("");
  const [mustInclude, setMustInclude] = useState("");
  const [mustNotInclude, setMustNotInclude] = useState("");
  const [lastRun, setLastRun] = useState<Record<string, unknown> | null>(null);

  const load = async () => {
    const res = await fetch("/api/dashboard/haidi/lab?store_id=youlya");
    const data = await res.json();
    setScenarios(data.scenarios ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const createScenario = async () => {
    await fetch("/api/dashboard/haidi/lab", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        store_id: "youlya",
        title,
        input_text: inputText,
        expected_intent: expectedIntent || undefined,
        expected_tone: expectedTone || undefined,
        must_include: mustInclude ? mustInclude.split(",").map((v) => v.trim()).filter(Boolean) : [],
        must_not_include: mustNotInclude ? mustNotInclude.split(",").map((v) => v.trim()).filter(Boolean) : [],
      }),
    });
    setTitle("");
    setInputText("");
    setExpectedIntent("");
    setExpectedTone("");
    setMustInclude("");
    setMustNotInclude("");
    await load();
  };

  const runScenario = async (id: string) => {
    const res = await fetch("/api/dashboard/haidi/lab/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ store_id: "youlya", scenario_id: id }),
    });
    const data = await res.json();
    setLastRun(data.run ?? null);
  };

  const createLearning = async () => {
    if (!lastRun?.id) return;
    await fetch("/api/dashboard/haidi/lab/run", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        store_id: "youlya",
        run_id: String(lastRun.id),
        title: `Learning from run ${String(lastRun.id).slice(0, 8)}`,
        suggestion_text: `Improve intent/tone handling based on mismatches: ${JSON.stringify(lastRun.mismatches ?? [])}`,
      }),
    });
  };

  return (
    <main className="p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Haidi Lab</h1>
        <p className="text-sm text-muted-foreground">Scenario testing only. No automatic learning into production.</p>
      </section>

      <section className="grid gap-2 rounded-xl bg-card p-4 ring-1 ring-border">
        <input className="rounded-lg border p-2 bg-background" placeholder="Scenario title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="rounded-lg border p-2 bg-background" placeholder="Customer input text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
        <input className="rounded-lg border p-2 bg-background" placeholder="Expected intent" value={expectedIntent} onChange={(e) => setExpectedIntent(e.target.value)} />
        <input className="rounded-lg border p-2 bg-background" placeholder="Expected tone" value={expectedTone} onChange={(e) => setExpectedTone(e.target.value)} />
        <input className="rounded-lg border p-2 bg-background" placeholder="Must include (comma separated)" value={mustInclude} onChange={(e) => setMustInclude(e.target.value)} />
        <input className="rounded-lg border p-2 bg-background" placeholder="Must not include (comma separated)" value={mustNotInclude} onChange={(e) => setMustNotInclude(e.target.value)} />
        <button className="rounded-lg bg-brand px-3 py-2 text-white text-sm" onClick={createScenario}>Add Scenario</button>
      </section>

      <section className="space-y-3">
        {scenarios.map((s) => (
          <article key={s.id} className="rounded-xl bg-card p-4 ring-1 ring-border">
            <p className="font-semibold">{s.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.input_text}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white" onClick={() => runScenario(s.id)}>Run Scenario</button>
            </div>
          </article>
        ))}
      </section>

      {lastRun ? (
        <section className="rounded-xl bg-card p-4 ring-1 ring-border space-y-2">
          <h2 className="font-semibold">Last Run</h2>
          <p className="text-sm">Intent: {String(lastRun.actual_intent ?? "")}</p>
          <p className="text-sm">Score: {String(lastRun.score ?? 0)}</p>
          <p className="text-sm text-muted-foreground">{String(lastRun.actual_reply ?? "")}</p>
          <button className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs text-white" onClick={createLearning}>Create Learning Suggestion</button>
        </section>
      ) : null}
    </main>
  );
}
