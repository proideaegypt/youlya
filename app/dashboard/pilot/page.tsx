"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ban,
  MessagesSquare,
  MessageCircle,
  RefreshCw,
  Shield,
  Workflow,
  Zap,
  Package,
  Search,
  ExternalLink,
  Pause,
  Play,
  Smartphone,
  Bot,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { EmptyState } from "@/lib/ui/empty-state";
import { StatusBadge } from "@/lib/ui/status-badge";

type PilotControlData = {
  health: {
    supabase: string;
    evolution: string;
    shopify: string;
    n8n: string;
    appUrl: string;
    testMode: boolean;
  };
  buildInfo: {
    version: string;
    versionName: string | null;
    commit: string;
    builtAt: string;
  };
  killSwitchStatus: "ON" | "OFF";
  globalAiPaused: boolean;
  ordersPaused: boolean;
  n8nWorkflowActive: boolean;
  evolutionConnected: boolean;
  inboundMessages: Array<{
    id: string;
    conversationId: string;
    body: string;
    createdAt: string;
    channel: string;
  }>;
  outboundMessages: Array<{
    id: string;
    conversationId: string;
    body: string;
    createdAt: string;
    channel: string;
  }>;
  deadLetterCount: number;
  handoffCount: number;
  duplicateBlockedCount: number;
  safetyBlockers: string[];
  lastSyncTime: string | null;
  lastUpdated: string;
  error?: string;
};

function StatusPill({ label, tone }: { label: string; tone: "success" | "warning" | "error" | "neutral" | "brand" }) {
  return <StatusBadge tone={tone}>{label}</StatusBadge>;
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "warning" | "error" | "neutral" | "brand";
}) {
  const toneClasses = {
    success: "bg-emerald-500/15 text-emerald-500",
    warning: "bg-amber-500/15 text-amber-500",
    error: "bg-red-500/15 text-red-400",
    neutral: "bg-muted text-muted-foreground",
    brand: "bg-brand/15 text-brand",
  };

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  tone,
  onClick,
  loading,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "warning" | "error" | "neutral" | "brand";
  onClick: () => void;
  loading?: boolean;
}) {
  const toneBtn = {
    success: "border-emerald-500 text-emerald-600 hover:bg-emerald-500/10",
    warning: "border-amber-500 text-amber-600 hover:bg-amber-500/10",
    error: "border-red-500 text-red-500 hover:bg-red-500/10",
    neutral: "border-border text-muted-foreground hover:bg-muted",
    brand: "border-brand text-brand hover:bg-brand/10",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${toneBtn[tone]}`}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-right">{label}</span>
      {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
    </button>
  );
}

function MessagePanel({
  title,
  icon: Icon,
  items,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Array<{ id: string; conversationId: string; body: string; createdAt: string; channel: string }>;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {items.length === 0 ? (
        <EmptyState compact title={emptyTitle} description={emptyDescription} />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl bg-muted p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="neutral">{item.channel}</StatusBadge>
                  <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("ar-EG")}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Conversation {item.conversationId}</span>
              </div>
              <p className="mt-2 text-sm text-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function PilotPage() {
  const [data, setData] = useState<PilotControlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/pilot-control")
      .then((r) => r.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  const doAction = async (action: string) => {
    setActionLoading(action);
    const res = await fetch("/api/dashboard/pilot/actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, updatedBy: "dashboard_pilot" }),
    });
    if (res.ok) {
      // Refresh pilot data
      const refreshed = await fetch("/api/dashboard/pilot-control").then((r) => r.json());
      setData(refreshed);
    }
    setActionLoading(null);
  };

  const blockers = data?.safetyBlockers ?? [];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-sidebar-gradient p-6 text-white shadow-sm">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            <Shield className="h-3.5 w-3.5" />
            Pilot control room
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-balance text-3xl font-semibold">غرفة الطيار للواتساب</h1>
            <p className="text-sm leading-6 text-white/90">
              متابعة health، n8n، Evolution، آخر الرسائل، وعدّادات الحماية قبل تشغيل التجربة اليدوية الآمنة.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label={data ? (data.killSwitchStatus === "OFF" ? "Kill switch OFF" : "Kill switch ON") : "Loading"} tone={data?.killSwitchStatus === "OFF" ? "success" : "warning"} />
            <StatusPill label={data?.n8nWorkflowActive ? "n8n active" : "n8n pending"} tone={data?.n8nWorkflowActive ? "success" : "warning"} />
            <StatusPill label={data?.evolutionConnected ? "Evolution connected" : "Evolution pending"} tone={data?.evolutionConnected ? "success" : "warning"} />
            <StatusPill label={data?.health?.testMode ? "testMode" : "live-ready"} tone={data?.health?.testMode ? "neutral" : "success"} />
            {data?.ordersPaused && <StatusPill label="Orders paused" tone="warning" />}
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      </section>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border">
          <RefreshCw className="h-5 w-5 animate-spin text-brand" />
          <span className="mr-3 text-sm text-muted-foreground">جاري تحميل غرفة الطيار...</span>
        </div>
      ) : data ? (
        <>
          {/* Metrics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="الصحة العامة"
              value={[
                data.health.supabase,
                data.health.evolution,
                data.health.n8n,
              ].join(" · ")}
              helper={`App: ${data.health.appUrl}`}
              icon={Activity}
              tone="brand"
            />
            <MetricCard
              label="Kill switch"
              value={data.killSwitchStatus}
              helper="يجب أن يبقى OFF أثناء التجربة"
              icon={Zap}
              tone={data.killSwitchStatus === "OFF" ? "success" : "warning"}
            />
            <MetricCard
              label="Dead letters"
              value={data.deadLetterCount}
              helper="رسائل فشل بحاجة مراجعة"
              icon={AlertTriangle}
              tone={data.deadLetterCount > 0 ? "warning" : "success"}
            />
            <MetricCard
              label="Handoffs"
              value={data.handoffCount}
              helper="تحويلات بشرية مفتوحة"
              icon={MessagesSquare}
              tone={data.handoffCount > 0 ? "warning" : "success"}
            />
          </section>

          {/* Build Info + Sync */}
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand" />
                <h2 className="text-sm font-semibold text-foreground">Build Identity</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-semibold">{data.buildInfo.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version Name</span>
                  <span className="font-semibold">{data.buildInfo.versionName ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Commit</span>
                  <span className="font-mono text-xs">{data.buildInfo.commit.slice(0, 8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Built</span>
                  <span className="text-xs">{new Date(data.buildInfo.builtAt).toLocaleString("ar-EG")}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center gap-2">
                <Workflow className="h-5 w-5 text-brand" />
                <h2 className="text-sm font-semibold text-foreground">Workflow & Integrations</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <span className="text-muted-foreground">n8n workflow</span>
                  <StatusBadge tone={data.n8nWorkflowActive ? "success" : "warning"}>{data.n8nWorkflowActive ? "Active" : "Pending"}</StatusBadge>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <span className="text-muted-foreground">Evolution</span>
                  <StatusBadge tone={data.evolutionConnected ? "success" : "warning"}>{data.evolutionConnected ? "Connected" : "Pending"}</StatusBadge>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <span className="text-muted-foreground">Shopify last sync</span>
                  <span className="font-semibold text-foreground">{data.lastSyncTime ? new Date(data.lastSyncTime).toLocaleString("ar-EG") : "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <span className="text-muted-foreground">Duplicate blocks</span>
                  <span className="font-semibold text-foreground">{data.duplicateBlockedCount}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center gap-2">
                <Ban className="h-5 w-5 text-amber-500" />
                <h2 className="text-sm font-semibold text-foreground">Safety blockers</h2>
              </div>
              {blockers.length === 0 ? (
                <EmptyState compact title="لا توجد blockers" description="لا توجد عوائق Safety ظاهرة الآن" />
              ) : (
                <ul className="grid gap-2">
                  {blockers.map((blocker) => (
                    <li key={blocker} className="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-500">
                      {blocker}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Actions */}
          <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-brand" />
              <h2 className="text-sm font-semibold text-foreground">Pilot Actions</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ActionButton
                label={data.globalAiPaused ? "استئناف Haidi" : "إيقاف Haidi"}
                icon={data.globalAiPaused ? Play : Pause}
                tone={data.globalAiPaused ? "success" : "warning"}
                onClick={() => doAction(data.globalAiPaused ? "resume_haidi" : "pause_haidi")}
                loading={actionLoading === (data.globalAiPaused ? "resume_haidi" : "pause_haidi")}
              />
              <ActionButton
                label={data.ordersPaused ? "استئناف الطلبات" : "إيقاف الطلبات"}
                icon={data.ordersPaused ? Play : Pause}
                tone={data.ordersPaused ? "success" : "warning"}
                onClick={() => doAction(data.ordersPaused ? "resume_orders" : "pause_orders")}
                loading={actionLoading === (data.ordersPaused ? "resume_orders" : "pause_orders")}
              />
              <ActionButton
                label="فتح Products Search QA"
                icon={Search}
                tone="brand"
                onClick={() => (window.location.href = "/dashboard/products")}
              />
              <ActionButton
                label="فتح Handoff Center"
                icon={AlertTriangle}
                tone="brand"
                onClick={() => (window.location.href = "/dashboard/handoff")}
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="https://admin.youlya365.com/api/health"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted transition"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="flex-1 text-right">Health API</span>
              </a>
              <a
                href="/dashboard/haidi/settings"
                className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted transition"
              >
                <Bot className="h-4 w-4" />
                <span className="flex-1 text-right">Haidi Settings</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>

          {/* Messages */}
          <section className="grid gap-4 xl:grid-cols-2">
            <MessagePanel
              title="آخر 10 inbound messages"
              icon={MessageCircle}
              items={data.inboundMessages}
              emptyTitle="لا توجد رسائل واردة"
              emptyDescription="ستظهر الرسائل الواردة هنا بعد وصول حركة حقيقية أو synthetic."
            />
            <MessagePanel
              title="آخر 10 outbound messages"
              icon={MessagesSquare}
              items={data.outboundMessages}
              emptyTitle="لا توجد رسائل صادرة"
              emptyDescription="ستظهر الرسائل الصادرة بعد إرسال أول رد آمن."
            />
          </section>

          {/* Synthetic webhook test instructions */}
          <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-brand" />
              <h2 className="text-sm font-semibold text-foreground">Synthetic Webhook Test</h2>
            </div>
            <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground space-y-2">
              <p>Send a safe synthetic message to verify the loop without real WhatsApp:</p>
              <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs text-foreground">
{`curl -X POST https://admin.youlya365.com/webhook/youlya-whatsapp \\
  -H "Content-Type: application/json" \\
  -d '{"data":{"key":{"remoteJid":"201000000000@s.whatsapp.net","fromMe":false},"message":{"conversation":"هاي"},"messageTimestamp":$(date +%s)}}'`}
              </pre>
              <p className="text-xs">Expected: HTTP 200, workflow execution created, no real message sent to customer.</p>
            </div>
          </section>
        </>
      ) : (
        <EmptyState title="تعذر تحميل غرفة الطيار" description="لم نتمكن من جلب بيانات pilot control الآن" />
      )}
    </div>
  );
}
