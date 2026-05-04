"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Save,
  RefreshCw,
  Languages,
  Smile,
  MessageSquare,
  TrendingUp,
  Package,
  Search,
  Hand,
  AlertTriangle,
  Shield,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/lib/ui/status-badge";

type HaidiSettings = {
  defaultLanguage: "ar-EG" | "en" | "auto";
  tone: "warm" | "premium" | "playful" | "concise" | "supportive";
  emojiLevel: "none" | "light" | "normal";
  replyLength: "short" | "balanced" | "detailed";
  upsellMode: "off" | "soft" | "normal";
  maxUpsellsPerConversation: number;
  recommendAlternativesWhenOOS: boolean;
  recommendComplementaryProducts: boolean;
  useUrgencyOnlyFromRealStock: boolean;
  useSocialProofOnlyFromRealData: boolean;
  maxProductsShownPerReply: number;
  maxSearchResultsInternal: number;
  handoffOnHumanRequest: boolean;
  handoffAfterUnclearCount: number;
  handoffOnAngryTone: boolean;
  globalAiPaused: boolean;
  ordersPaused: boolean;
  promptVersion: string;
};

const DEFAULTS: HaidiSettings = {
  defaultLanguage: "ar-EG",
  tone: "warm",
  emojiLevel: "normal",
  replyLength: "balanced",
  upsellMode: "soft",
  maxUpsellsPerConversation: 1,
  recommendAlternativesWhenOOS: true,
  recommendComplementaryProducts: true,
  useUrgencyOnlyFromRealStock: true,
  useSocialProofOnlyFromRealData: true,
  maxProductsShownPerReply: 3,
  maxSearchResultsInternal: 10,
  handoffOnHumanRequest: true,
  handoffAfterUnclearCount: 3,
  handoffOnAngryTone: true,
  globalAiPaused: false,
  ordersPaused: false,
  promptVersion: "v1",
};

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand" />
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-brand" : "bg-muted"}`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}

export default function HaidiSettingsPage() {
  const [settings, setSettings] = useState<HaidiSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/haidi-settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.settings) {
          setSettings((s) => ({ ...s, ...json.settings }));
        }
      })
      .catch(() => setError("فشل تحميل الإعدادات"))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);
    const res = await fetch("/api/dashboard/haidi-settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...settings, updatedBy: "dashboard_haidi_settings" }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("فشل حفظ الإعدادات");
    }
    setSaving(false);
  }

  const patch = (partial: Partial<HaidiSettings>) => {
    setSettings((s) => ({ ...s, ...partial }));
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border">
        <RefreshCw className="h-5 w-5 animate-spin text-brand" />
        <span className="mr-3 text-sm text-muted-foreground">جاري تحميل إعدادات Haidi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-sidebar-gradient p-6 text-white shadow-sm">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            <Bot className="h-3.5 w-3.5" />
            Haidi AI Settings
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-balance text-3xl font-semibold">إعدادات Haidi</h1>
            <p className="text-sm leading-6 text-white/90">
              تحكم في سلوك Haidi: اللغة، التون، الإيموجي، طول الرد، Upsell، الحماية، والتحويل البشري.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={settings.globalAiPaused ? "warning" : "success"}>
              {settings.globalAiPaused ? "AI متوقف" : "AI مفعل"}
            </StatusBadge>
            <StatusBadge tone={settings.ordersPaused ? "warning" : "success"}>
              {settings.ordersPaused ? "الطلبات متوقفة" : "الطلبات مفعلة"}
            </StatusBadge>
            <StatusBadge tone="neutral">Prompt {settings.promptVersion}</StatusBadge>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      </section>

      {error && (
        <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Language & Tone" icon={Languages}>
          <SelectField
            label="Default Language"
            value={settings.defaultLanguage}
            options={["ar-EG", "en", "auto"]}
            onChange={(v) => patch({ defaultLanguage: v as HaidiSettings["defaultLanguage"] })}
          />
          <SelectField
            label="Tone"
            value={settings.tone}
            options={["warm", "premium", "playful", "concise", "supportive"]}
            onChange={(v) => patch({ tone: v as HaidiSettings["tone"] })}
          />
          <SelectField
            label="Emoji Level"
            value={settings.emojiLevel}
            options={["none", "light", "normal"]}
            onChange={(v) => patch({ emojiLevel: v as HaidiSettings["emojiLevel"] })}
          />
          <SelectField
            label="Reply Length"
            value={settings.replyLength}
            options={["short", "balanced", "detailed"]}
            onChange={(v) => patch({ replyLength: v as HaidiSettings["replyLength"] })}
          />
        </Section>

        <Section title="Sales Behavior" icon={TrendingUp}>
          <SelectField
            label="Upsell Mode"
            value={settings.upsellMode}
            options={["off", "soft", "normal"]}
            onChange={(v) => patch({ upsellMode: v as HaidiSettings["upsellMode"] })}
          />
          <NumberField
            label="Max Upsells Per Conversation"
            value={settings.maxUpsellsPerConversation}
            min={0}
            max={2}
            onChange={(v) => patch({ maxUpsellsPerConversation: v })}
          />
          <ToggleField
            label="Recommend Alternatives When OOS"
            checked={settings.recommendAlternativesWhenOOS}
            onChange={(v) => patch({ recommendAlternativesWhenOOS: v })}
          />
          <ToggleField
            label="Recommend Complementary Products"
            checked={settings.recommendComplementaryProducts}
            onChange={(v) => patch({ recommendComplementaryProducts: v })}
          />
          <ToggleField
            label="Use Urgency Only From Real Stock"
            checked={settings.useUrgencyOnlyFromRealStock}
            onChange={(v) => patch({ useUrgencyOnlyFromRealStock: v })}
          />
          <ToggleField
            label="Use Social Proof Only From Real Data"
            checked={settings.useSocialProofOnlyFromRealData}
            onChange={(v) => patch({ useSocialProofOnlyFromRealData: v })}
          />
        </Section>

        <Section title="Product Display & Search" icon={Package}>
          <NumberField
            label="Max Products Shown Per Reply"
            value={settings.maxProductsShownPerReply}
            min={1}
            max={10}
            onChange={(v) => patch({ maxProductsShownPerReply: v })}
          />
          <NumberField
            label="Max Search Results Internal"
            value={settings.maxSearchResultsInternal}
            min={1}
            max={50}
            onChange={(v) => patch({ maxSearchResultsInternal: v })}
          />
        </Section>

        <Section title="Handoff & Safety" icon={Hand}>
          <ToggleField
            label="Handoff On Human Request"
            checked={settings.handoffOnHumanRequest}
            onChange={(v) => patch({ handoffOnHumanRequest: v })}
          />
          <NumberField
            label="Handoff After Unclear Count"
            value={settings.handoffAfterUnclearCount}
            min={2}
            max={3}
            onChange={(v) => patch({ handoffAfterUnclearCount: v })}
          />
          <ToggleField
            label="Handoff On Angry Tone"
            checked={settings.handoffOnAngryTone}
            onChange={(v) => patch({ handoffOnAngryTone: v })}
          />
        </Section>

        <Section title="Global Controls" icon={Shield}>
          <ToggleField
            label="Global AI Paused"
            checked={settings.globalAiPaused}
            onChange={(v) => patch({ globalAiPaused: v })}
          />
          <ToggleField
            label="Orders Paused"
            checked={settings.ordersPaused}
            onChange={(v) => patch({ ordersPaused: v })}
          />
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-foreground">Prompt Version</label>
            <input
              type="text"
              value={settings.promptVersion}
              onChange={(e) => patch({ promptVersion: e.target.value })}
              className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </Section>

        <Section title="Status" icon={FileText}>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Review your settings before saving. Unsafe values are blocked by validation.</p>
            <p>No secrets are stored in this form.</p>
            {saved && (
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>تم الحفظ بنجاح</span>
              </div>
            )}
          </div>
        </Section>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}
