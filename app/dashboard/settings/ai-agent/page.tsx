"use client";

import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";

import { useEffect, useState } from "react";

const OPENAI_MODELS = ["gpt-4o", "gpt-4.1", "gpt-5", "custom"];
const ANTHROPIC_MODELS = ["claude-3-5-sonnet", "claude-3-opus", "custom"];
const GEMINI_MODELS = ["gemini-1.5-pro", "gemini-1.5-flash", "custom"];

export default function AIAgentSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/settings/ai-agent")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setLoading(false);
      });
  }, []);

  const models =
    settings?.provider === "openai"
      ? OPENAI_MODELS
      : settings?.provider === "anthropic"
      ? ANTHROPIC_MODELS
      : settings?.provider === "gemini"
      ? GEMINI_MODELS
      : ["custom"];

  const save = async () => {
    setSaving(true);
    const body: Record<string, unknown> = {
      agent_name: settings?.agent_name,
      provider: settings?.provider,
      model: settings?.model,
      active: settings?.active,
    };
    if (apiKey) body.api_key = apiKey;
    await fetch("/api/dashboard/settings/ai-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setApiKey("");
    setSaving(false);
    // Refresh
    const r = await fetch("/api/dashboard/settings/ai-agent");
    const d = await r.json();
    setSettings(d.settings);
  };

  const testConnection = async () => {
    setTesting(true);
    const r = await fetch("/api/dashboard/settings/ai-agent", { method: "PUT" });
    const d = await r.json();
    setSettings((s) => ({ ...(s ?? {}), connection_status: d.ok ? "ok" : "error" }));
    setTesting(false);
    alert(d.ok ? "الاتصال ناجح" : `فشل الاتصال: ${d.message}`);
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border" dir="rtl">
      <h1 className="text-2xl font-semibold">إعدادات الذكاء الاصطناعي</h1>

      <div className="mt-6 grid gap-4 max-w-xl">
        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">اسم المساعد</span>
          <input
            className="h-10 rounded-md bg-background ring-1 ring-border px-3"
            value={String(settings?.agent_name ?? "")}
            onChange={(e) => setSettings({ ...(settings ?? {}), agent_name: e.target.value })}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">المزود</span>
          <select
            className="h-10 rounded-md bg-background ring-1 ring-border px-3"
            value={String(settings?.provider ?? "openai")}
            onChange={(e) => setSettings({ ...(settings ?? {}), provider: e.target.value, model: "" })}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic Claude</option>
            <option value="gemini">Google Gemini</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">الموديل</span>
          <select
            className="h-10 rounded-md bg-background ring-1 ring-border px-3"
            value={String(settings?.model ?? "")}
            onChange={(e) => setSettings({ ...(settings ?? {}), model: e.target.value })}
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">API Key</span>
          <input
            type="password"
            placeholder={String(settings?.api_key_status ?? "") === "SET" ? `••••••••${String(settings?.api_key_last4 ?? "")}` : "أدخل مفتاح API"}
            className="h-10 rounded-md bg-background ring-1 ring-border px-3"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            الحالة: {String(settings?.api_key_status ?? "") === "SET" ? "مضبوط" : "غير مضبوط"}
          </span>
        </label>

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="h-10 rounded-md bg-brand text-white font-semibold hover:opacity-90 disabled:opacity-50 px-4">
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
          <button onClick={testConnection} disabled={testing} className="h-10 rounded-md bg-emerald-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 px-4">
            {testing ? "جاري الاختبار..." : "اختبار الاتصال"}
          </button>
        </div>

        <div className="mt-2 text-sm">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            settings?.connection_status === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            {String(settings?.connection_status ?? "") === "ok" ? "✓ متصل" : "⚠ حالة الاتصال غير معروفة"}
          </span>
            {Boolean(settings?.last_tested_at) && (
              <span className="mr-2 text-xs text-muted-foreground">
                آخر اختبار: {new Date(String(settings?.last_tested_at)).toLocaleString("ar-EG")}
              </span>
            )}
        </div>
      </div>
    </section>
  );
}
