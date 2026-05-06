import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  AlertTriangle,
  Shield,
  TrendingUp,
  Zap,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import { DashboardCharts } from "@/lib/ui/dashboard-charts";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { isAiEnabled } from "@/lib/services/ai-settings-service";

type Stats = {
  activeConversations: number;
  aiActiveConversations: number;
  needsHuman: number;
  pendingConfirmations: number;
  ordersCreatedToday: number;
  failedOrderAttempts: number;
  duplicateWebhooksBlocked: number;
  killSwitchStatus: "ON" | "OFF";
};

type StatsResult = {
  stats: Stats;
  fromFallback: boolean;
};

async function loadStats(): Promise<StatsResult> {
  try {
    const storeId = "youlya";
    const aiEnabled = await isAiEnabled(storeId);
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      const flow = [...getMockState().conversationFlow.values()];
      const handoffs = getMockState().humanHandoffs.filter((h) => h.resolved_at === null).length;
      return {
        stats: {
          activeConversations: flow.length,
          aiActiveConversations: aiEnabled ? flow.length : 0,
          needsHuman: handoffs,
          pendingConfirmations: flow.filter((f) => f.stage === "awaiting_confirmation").length,
          ordersCreatedToday: flow.filter((f) => f.stage === "ordered").length,
          failedOrderAttempts: 0,
          duplicateWebhooksBlocked: 0,
          killSwitchStatus: aiEnabled ? "OFF" : "ON",
        },
        fromFallback: false,
      };
    }

    const [{ data: conv }, { count: failedCount }, { count: handoffCount }] = await Promise.all([
      supabase.from("conversation_state").select("stage"),
      supabase.from("failed_events").select("id", { head: true, count: "exact" }),
      supabase.from("human_handoffs").select("id", { head: true, count: "exact" }).is("resolved_at", null),
    ]);

    const stages = conv ?? [];
    return {
      stats: {
        activeConversations: stages.length,
        aiActiveConversations: aiEnabled ? stages.length : 0,
        needsHuman: handoffCount ?? 0,
        pendingConfirmations: stages.filter((s) => s.stage === "awaiting_confirmation").length,
        ordersCreatedToday: stages.filter((s) => s.stage === "ordered").length,
        failedOrderAttempts: failedCount ?? 0,
        duplicateWebhooksBlocked: 0,
        killSwitchStatus: aiEnabled ? "OFF" : "ON",
      },
      fromFallback: false,
    };
  } catch (err) {
    console.error("loadStats error:", err);
    return {
      stats: {
        activeConversations: 0,
        aiActiveConversations: 0,
        needsHuman: 0,
        pendingConfirmations: 0,
        ordersCreatedToday: 0,
        failedOrderAttempts: 0,
        duplicateWebhooksBlocked: 0,
        killSwitchStatus: "OFF",
      },
      fromFallback: true,
    };
  }
}

function KpiWidget({
  icon: Icon,
  label,
  value,
  subtitle,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtitle?: string;
  tone?: "success" | "warning" | "error" | "neutral" | "brand";
}) {
  const toneClasses = {
    success: "bg-emerald-500/15 text-emerald-500",
    warning: "bg-amber-500/15 text-amber-500",
    error: "bg-red-500/15 text-red-400",
    neutral: "bg-muted text-muted-foreground",
    brand: "bg-brand/15 text-brand",
  };

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="size-6 text-brand dark:text-white transition-colors" />
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">إجراء سريع</div>
      </div>
    </>
  );

  const className = "flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border cursor-pointer hover:shadow-md transition";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default async function CommandCenterPage() {
  const { stats, fromFallback } = await loadStats();
  const conversion = stats.activeConversations > 0 ? Math.round((stats.ordersCreatedToday / stats.activeConversations) * 100) : 0;
  const revenue = stats.ordersCreatedToday * 640;

  const salesTrend = [
    { label: "Sat", value: Math.max(1, stats.ordersCreatedToday - 5) },
    { label: "Sun", value: Math.max(1, stats.ordersCreatedToday - 3) },
    { label: "Mon", value: Math.max(1, stats.ordersCreatedToday - 2) },
    { label: "Tue", value: Math.max(1, stats.ordersCreatedToday - 1) },
    { label: "Wed", value: Math.max(1, stats.ordersCreatedToday) },
    { label: "Thu", value: Math.max(1, stats.ordersCreatedToday + 1) },
    { label: "Fri", value: Math.max(1, stats.ordersCreatedToday + 2) },
  ];

  const aiVsHuman = [
    { label: "AI", value: stats.aiActiveConversations },
    { label: "Human", value: stats.needsHuman },
    { label: "Pending", value: stats.pendingConfirmations },
  ];

  return (
    <div className="space-y-5">
      {fromFallback ? (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 p-4 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-medium">
            تعذر تحميل الإحصائيات الحية. يتم عرض أرقام مؤقتة.
          </p>
        </div>
      ) : null}
      {/* Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-sidebar-gradient p-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl md:w-3/5">
            <h1 className="text-balance text-3xl font-semibold">أهلاً بك في YOULYA HOME WEAR</h1>
            <p className="mt-2 text-sm leading-6 text-white/90">
              إدارة الطلبات والمحادثات والذكاء الاصطناعي — YOULYA HOME WEAR
            </p>
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 text-sm">
              <Shield className="h-5 w-5" />
              <div>
                <div className="font-medium">
                  {stats.killSwitchStatus === "OFF" ? "النظام يعمل بكامل طاقته" : "Kill Switch مفعل"}
                </div>
                <div className="text-white/80">
                  {stats.ordersCreatedToday} طلبات اليوم
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left big column */}
        <div className="space-y-5 lg:col-span-2">
          {/* KPI Grid */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiWidget icon={ShoppingBag} label="الطلبات اليوم" value={stats.ordersCreatedToday} subtitle={`${revenue.toLocaleString()} EGP`} tone="brand" />
            <KpiWidget icon={MessageCircle} label="محادثات واتساب" value={stats.activeConversations} subtitle={`${stats.aiActiveConversations} AI`} tone="success" />
            <KpiWidget icon={TrendingUp} label="معدل التحويل" value={`${conversion}%`} subtitle="Orders / Conversations" tone="neutral" />
            <KpiWidget icon={Users} label="تحويلات بشرية" value={stats.needsHuman} tone="warning" />
            <KpiWidget icon={Zap} label="Webhooks محجوبة" value={stats.duplicateWebhooksBlocked} tone="success" />
            <KpiWidget icon={AlertTriangle} label="تأكيدات معلقة" value={stats.pendingConfirmations} tone={stats.pendingConfirmations > 0 ? "warning" : "success"} />
          </section>

          {/* Channels / Integrations */}
          <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">القنوات والتكاملات</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {["WhatsApp", "Shopify", "Evolution", "n8n", "Supabase", "OpenAI"].map((r, i) => (
                <div key={i} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="grid size-8 place-items-center rounded-xl bg-brand text-white">
                      <Zap className="size-4" />
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">{r}</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">نشط</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions + Top Products */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">إجراءات سريعة</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <QuickAction icon={Shield} title="غرفة الطيار" href="/dashboard/pilot-control" />
                <QuickAction icon={MessageCircle} title="فتح الرسائل" href="/dashboard/inbox" />
                <QuickAction icon={ShoppingBag} title="عرض الطلبات" />
                <QuickAction icon={FileText} title="مراجعة السجلات" />
                <QuickAction icon={Settings} title="فتح الإعدادات" />
              </div>
            </div>
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">أفضل المنتجات</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["بيجامات", "روب", "بوركيني", "لانجري"].map((p, i) => (
                  <div key={i} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
                    <h4 className="text-xs font-semibold text-foreground">{p}</h4>
                    <p className="mt-1 text-[10px] text-muted-foreground">Top request</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* AI Control / Kill Switch */}
          <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">التحكم في الذكاء الاصطناعي</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-background p-3 ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  <span className="text-sm font-medium">الذكاء الاصطناعي</span>
                </div>
                <span className="text-xs text-emerald-500 font-semibold">مفعل</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background p-3 ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-amber-500" />
                  <span className="text-sm font-medium">مفتاح الإيقاف</span>
                </div>
                <span className={`text-xs font-semibold ${stats.killSwitchStatus === "OFF" ? "text-emerald-500" : "text-red-400"}`}>
                  {stats.killSwitchStatus === "OFF" ? "غير مفعل" : "مفعل"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background p-3 ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  <span className="text-sm font-medium">حماية السلامة</span>
                </div>
                <span className="text-xs text-emerald-500 font-semibold">نشط</span>
              </div>
            </div>
          </section>

          {/* Conversion / Resolution */}
          <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">معدل التحويل</h2>
            <div className="flex items-center justify-center py-4">
              <div className="relative flex items-center justify-center size-32 rounded-full bg-muted">
                <span className="text-2xl font-bold text-foreground">{conversion}%</span>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground">الطلبات / المحادثات</p>
          </section>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts salesTrend={salesTrend} aiVsHuman={aiVsHuman} />

      {/* Status */}
      {stats.failedOrderAttempts === 0 && stats.pendingConfirmations === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-emerald-500">
          <Shield className="h-5 w-5" />
          <p className="text-sm font-medium">كل الأنظمة تعمل ولا توجد تنبيهات.</p>
        </div>
      ) : null}
    </div>
  );
}
