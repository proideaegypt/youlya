"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Save,
  RefreshCw,
  Languages,
  TrendingUp,
  Package,
  Hand,
  Shield,
  FileText,
  CheckCircle2,
  Undo2,
  FlaskConical,
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
  humanHandoffEnabled: boolean;
  handoffCustomerServiceEnabled: boolean;
  handoffManagerRequestEnabled: boolean;
  pauseAiAfterHandoff: boolean;
  sendHandoffAcknowledgement: boolean;
  notifyHumanTeam: boolean;
  defaultHandoffAssignee: string;
  customerServiceReplyTemplateAr: string;
  managerRequestReplyTemplateAr: string;
  handoffFinalAckTemplateAr: string;
  globalAiPaused: boolean;
  ordersPaused: boolean;
  promptVersion: string;
};

type HaidiPrompt = {
  currentPrompt: string;
  currentVersion: string;
  source: "repo" | "db";
  updatedAt: string;
  safetyRulesSummary: string[];
  draftPrompt: string | null;
  draftVersion: string | null;
  publishedPrompt: string | null;
  publishedVersion: string | null;
  previousPublishedPrompt?: string | null;
  previousPublishedVersion?: string | null;
  repoDefaultVersion: string;
  canPublish: boolean;
  lastTestScore: number | null;
  lastTestRunId: string | null;
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
  humanHandoffEnabled: true,
  handoffCustomerServiceEnabled: true,
  handoffManagerRequestEnabled: true,
  pauseAiAfterHandoff: true,
  sendHandoffAcknowledgement: true,
  notifyHumanTeam: true,
  defaultHandoffAssignee: "",
  customerServiceReplyTemplateAr: "تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.",
  managerRequestReplyTemplateAr: "تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.",
  handoffFinalAckTemplateAr: "تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.",
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

function TextAreaField({
  label,
  value,
  rows = 3,
  onChange,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}

export default function HaidiSettingsPage() {
  const [settings, setSettings] = useState<HaidiSettings>(DEFAULTS);
  const [prompt, setPrompt] = useState<HaidiPrompt | null>(null);
  const [promptDraft, setPromptDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promptSaving, setPromptSaving] = useState(false);
  const [testingPrompt, setTestingPrompt] = useState(false);
  const [saved, setSaved] = useState(false);
  const [promptSaved, setPromptSaved] = useState(false);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [promptMessage, setPromptMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastTestScore, setLastTestScore] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/haidi/settings").then((r) => r.json()),
      fetch("/api/dashboard/haidi/prompt").then((r) => r.json()),
    ])
      .then(([settingsJson, promptJson]) => {
        if (settingsJson.settings) {
          setSettings((s) => ({ ...s, ...settingsJson.settings }));
        }
        if (promptJson.prompt) {
          setPrompt(promptJson.prompt);
          setPromptDraft(String(promptJson.prompt.draftPrompt ?? promptJson.prompt.currentPrompt ?? ""));
          setLastTestScore(typeof promptJson.prompt.lastTestScore === "number" ? promptJson.prompt.lastTestScore : null);
        }
      })
      .catch(() => setError("فشل تحميل الإعدادات"))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);
    const res = await fetch("/api/dashboard/haidi/settings", {
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

  const refreshPrompt = async () => {
    const res = await fetch("/api/dashboard/haidi/prompt");
    const json = await res.json();
    if (json.prompt) {
      setPrompt(json.prompt);
      setPromptDraft(String(json.prompt.draftPrompt ?? json.prompt.currentPrompt ?? ""));
      setLastTestScore(typeof json.prompt.lastTestScore === "number" ? json.prompt.lastTestScore : null);
    }
  };

  const saveDraft = async () => {
    setPromptSaving(true);
    setPromptError(null);
    setPromptMessage(null);
    const res = await fetch("/api/dashboard/haidi/prompt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "save_draft",
        storeId: "youlya",
        promptText: promptDraft,
        promptVersion: prompt?.draftVersion ?? undefined,
        updatedBy: "dashboard_haidi_settings",
      }),
    });
    const json = await res.json();
    if (res.ok && json.prompt) {
      setPrompt(json.prompt);
      setPromptDraft(String(json.prompt.draftPrompt ?? json.prompt.currentPrompt ?? ""));
      setPromptSaved(true);
      setPromptMessage("تم حفظ المسودة");
      setTimeout(() => setPromptSaved(false), 3000);
    } else {
      setPromptError(String(json.error ?? "فشل حفظ المسودة"));
    }
    setPromptSaving(false);
  };

  const publishPrompt = async () => {
    setPromptSaving(true);
    setPromptError(null);
    setPromptMessage(null);
    const res = await fetch("/api/dashboard/haidi/prompt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "publish",
        storeId: "youlya",
        updatedBy: "dashboard_haidi_settings",
        requirePassingLabRun: true,
      }),
    });
    const json = await res.json();
    if (res.ok && json.prompt) {
      setPrompt(json.prompt);
      setPromptDraft(String(json.prompt.draftPrompt ?? json.prompt.currentPrompt ?? ""));
      setPromptMessage("تم نشر prompt جديد");
      setLastTestScore(typeof json.prompt.lastTestScore === "number" ? json.prompt.lastTestScore : lastTestScore);
      await refreshSettingsOnly();
    } else {
      setPromptError(String(json.error ?? "فشل نشر prompt"));
    }
    setPromptSaving(false);
  };

  const rollbackPrompt = async () => {
    setPromptSaving(true);
    setPromptError(null);
    setPromptMessage(null);
    const res = await fetch("/api/dashboard/haidi/prompt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "rollback",
        storeId: "youlya",
        updatedBy: "dashboard_haidi_settings",
      }),
    });
    const json = await res.json();
    if (res.ok && json.prompt) {
      setPrompt(json.prompt);
      setPromptDraft(String(json.prompt.draftPrompt ?? json.prompt.currentPrompt ?? ""));
      setPromptMessage("تم الرجوع للإصدار السابق");
      await refreshSettingsOnly();
    } else {
      setPromptError(String(json.error ?? "فشل الرجوع للإصدار السابق"));
    }
    setPromptSaving(false);
  };

  const testPrompt = async () => {
    setTestingPrompt(true);
    setPromptError(null);
    setPromptMessage(null);
    const scenariosRes = await fetch("/api/dashboard/haidi/lab?store_id=youlya");
    const scenariosJson = await scenariosRes.json();
    const scenarioId = scenariosJson.scenarios?.[0]?.id;
    if (!scenarioId) {
      setPromptError("لا توجد سيناريوهات اختبار متاحة في Haidi Lab");
      setTestingPrompt(false);
      return;
    }
    const runRes = await fetch("/api/dashboard/haidi/lab/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ store_id: "youlya", scenario_id: scenarioId }),
    });
    const runJson = await runRes.json();
    if (runRes.ok && runJson.run) {
      const score = typeof runJson.run.score === "number" ? runJson.run.score : null;
      setLastTestScore(score);
      await fetch("/api/dashboard/haidi/prompt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "test",
          storeId: "youlya",
          runId: String(runJson.run.id),
          score: score ?? 0,
          updatedBy: "dashboard_haidi_settings",
        }),
      });
      setPromptMessage(`تم اختبار prompt على السيناريو ${scenarioId}`);
      await refreshPrompt();
    } else {
      setPromptError(String(runJson.error ?? "فشل اختبار prompt"));
    }
    setTestingPrompt(false);
  };

  const refreshSettingsOnly = async () => {
    const res = await fetch("/api/dashboard/haidi/settings");
    const json = await res.json();
    if (json.settings) {
      setSettings((s) => ({ ...s, ...json.settings }));
    }
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
            <StatusBadge tone="neutral">Prompt {prompt?.currentVersion ?? settings.promptVersion}</StatusBadge>
            <StatusBadge tone={prompt?.source === "db" ? "success" : "neutral"}>
              Source {prompt?.source ?? "repo"}
            </StatusBadge>
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
          <ToggleField
            label="Human Handoff Enabled"
            checked={settings.humanHandoffEnabled}
            onChange={(v) => patch({ humanHandoffEnabled: v })}
          />
          <ToggleField
            label="Customer Service Request Enabled"
            checked={settings.handoffCustomerServiceEnabled}
            onChange={(v) => patch({ handoffCustomerServiceEnabled: v })}
          />
          <ToggleField
            label="Manager Request Enabled"
            checked={settings.handoffManagerRequestEnabled}
            onChange={(v) => patch({ handoffManagerRequestEnabled: v })}
          />
          <ToggleField
            label="Pause AI After Handoff"
            checked={settings.pauseAiAfterHandoff}
            onChange={(v) => patch({ pauseAiAfterHandoff: v })}
          />
          <ToggleField
            label="Send Acknowledgement"
            checked={settings.sendHandoffAcknowledgement}
            onChange={(v) => patch({ sendHandoffAcknowledgement: v })}
          />
          <ToggleField
            label="Notify Human Team"
            checked={settings.notifyHumanTeam}
            onChange={(v) => patch({ notifyHumanTeam: v })}
          />
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-foreground">Default Assignee</label>
            <input
              type="text"
              value={settings.defaultHandoffAssignee}
              onChange={(e) => patch({ defaultHandoffAssignee: e.target.value })}
              className="w-48 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <TextAreaField
            label="Customer Service Arabic Template"
            value={settings.customerServiceReplyTemplateAr}
            onChange={(v) => patch({ customerServiceReplyTemplateAr: v })}
          />
          <TextAreaField
            label="Manager Request Arabic Template"
            value={settings.managerRequestReplyTemplateAr}
            onChange={(v) => patch({ managerRequestReplyTemplateAr: v })}
          />
          <TextAreaField
            label="Final Acknowledgement Arabic Template"
            value={settings.handoffFinalAckTemplateAr}
            onChange={(v) => patch({ handoffFinalAckTemplateAr: v })}
          />
        </Section>

        <Section title="Prompt Editor" icon={FlaskConical}>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="grid gap-2 rounded-2xl bg-muted/40 p-4 ring-1 ring-border">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={prompt?.source === "db" ? "success" : "neutral"}>{prompt?.source ?? "repo"}</StatusBadge>
                <StatusBadge tone="neutral">Version {prompt?.currentVersion ?? "loading"}</StatusBadge>
                <StatusBadge tone={typeof lastTestScore === "number" && lastTestScore >= 90 ? "success" : "warning"}>
                  Test {typeof lastTestScore === "number" ? `${lastTestScore}/100` : "not run"}
                </StatusBadge>
              </div>
              <p className="text-xs leading-5">
                Repo default: {prompt?.repoDefaultVersion ?? "docs/HAIDI_AI_SALES_AGENT_PROMPT.md@v1.0"}
                {" "}
                {prompt?.canPublish ? "Publish gate open." : "Publish gate waits for a passing lab run."}
              </p>
              <p className="text-xs leading-5">
                {prompt?.safetyRulesSummary?.length ? prompt.safetyRulesSummary.join(" ") : "No safety summary loaded."}
              </p>
            </div>
            <textarea
              value={promptDraft}
              onChange={(e) => {
                setPromptDraft(e.target.value);
                setPromptSaved(false);
                setPromptError(null);
              }}
              rows={16}
              className="min-h-[360px] rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:ring-2 focus:ring-brand"
              placeholder="Haidi prompt draft"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveDraft}
                disabled={promptSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {promptSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save draft
              </button>
              <button
                onClick={testPrompt}
                disabled={testingPrompt}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition disabled:opacity-50"
              >
                {testingPrompt ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
                Test prompt
              </button>
              <button
                onClick={publishPrompt}
                disabled={promptSaving || !prompt?.canPublish}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50"
              >
                Publish prompt
              </button>
              <button
                onClick={rollbackPrompt}
                disabled={promptSaving || !prompt?.publishedPrompt || !prompt?.previousPublishedPrompt}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition disabled:opacity-50"
              >
                <Undo2 className="h-4 w-4" />
                Rollback
              </button>
            </div>
            {promptMessage && <p className="text-sm text-emerald-600">{promptMessage}</p>}
            {promptError && <p className="text-sm text-red-500">{promptError}</p>}
            {promptSaved && <p className="text-sm text-emerald-600">Draft saved.</p>}
          </div>
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
