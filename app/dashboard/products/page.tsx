"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Boxes,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  ShoppingCart,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { EmptyState } from "@/lib/ui/empty-state";
import { StatusBadge } from "@/lib/ui/status-badge";

type TabKey = "overview" | "catalog" | "variants" | "sync" | "search" | "mapping";

const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
  { key: "overview", labelAr: "نظرة عامة", labelEn: "Overview" },
  { key: "catalog", labelAr: "المنتجات", labelEn: "Catalog Cache" },
  { key: "variants", labelAr: "المتغيرات", labelEn: "Variants" },
  { key: "sync", labelAr: "صحة المزامنة", labelEn: "Sync Health" },
  { key: "search", labelAr: "اختبار البحث", labelEn: "Search QA" },
  { key: "mapping", labelAr: "فاحص الربط", labelEn: "Mapping Inspector" },
];

/* ---------- Overview ---------- */

type OverviewData = {
  totalProducts: number;
  totalVariants: number;
  aiVisibleVariants: number;
  availableVariants: number;
  outOfStockVariants: number;
  missingSkuVariants: number;
  lastSyncTime: string | null;
  cacheHealthScore: number;
  aiSellableScore: number;
};

function OverviewTab() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/products/overview")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingBlock />;
  if (!data) return <EmptyState title="لا توجد بيانات" description="تعذر تحميل نظرة عامة على المنتجات" />;

  const kpis = [
    { label: "إجمالي المنتجات", value: data.totalProducts, icon: Package, tone: "brand" as const },
    { label: "إجمالي المتغيرات", value: data.totalVariants, icon: Boxes, tone: "neutral" as const },
    { label: "متاح للذكاء الاصطناعي", value: data.aiVisibleVariants, icon: Eye, tone: "success" as const },
    { label: "متوفر في المخزن", value: data.availableVariants, icon: CheckCircle2, tone: "success" as const },
    { label: "نفذ من المخزن", value: data.outOfStockVariants, icon: XCircle, tone: "error" as const },
    { label: "SKU مفقود", value: data.missingSkuVariants, icon: AlertTriangle, tone: "warning" as const },
  ];

  const lastSyncText = data.lastSyncTime
    ? new Date(data.lastSyncTime).toLocaleString("ar-EG")
    : "لم يتم المزامنة بعد";

  return (
    <div className="space-y-5">
      {/* KPI Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{kpi.value.toLocaleString()}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  kpi.tone === "brand"
                    ? "bg-brand/15 text-brand"
                    : kpi.tone === "success"
                    ? "bg-emerald-500/15 text-emerald-500"
                    : kpi.tone === "error"
                    ? "bg-red-500/15 text-red-400"
                    : kpi.tone === "warning"
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Scores + Last Sync */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold text-foreground">صحة الذاكرة المؤقتة</h3>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative flex items-center justify-center size-28 rounded-full bg-muted">
              <span className="text-3xl font-bold text-foreground">{data.cacheHealthScore}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-foreground">المخزون القابل للبيع بالذكاء الاصطناعي</h3>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative flex items-center justify-center size-28 rounded-full bg-muted">
              <span className="text-3xl font-bold text-foreground">{data.aiSellableScore}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">آخر مزامنة</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <p className="text-lg font-semibold text-foreground">{lastSyncText}</p>
            <p className="text-xs text-muted-foreground">مزامنة Shopify فقط للقراءة</p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">توزيع المتغيرات</h3>
          <MiniPie
            segments={[
              { label: "متوفر", value: data.availableVariants, color: "bg-emerald-500" },
              { label: "نفذ", value: data.outOfStockVariants, color: "bg-red-400" },
            ]}
            total={data.totalVariants}
          />
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">قمع الرؤية بالذكاء الاصطناعي</h3>
          <Funnel
            steps={[
              { label: "الكل", value: data.totalVariants },
              { label: "متوفر", value: data.availableVariants },
              { label: "AI مرئي", value: data.aiVisibleVariants },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function MiniPie({ segments, total }: { segments: { label: string; value: number; color: string }[]; total: number }) {
  if (total === 0) return <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات</p>;
  return (
    <div className="flex items-center gap-6">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
        <span className="text-xl font-bold">{total}</span>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${s.color}`} />
            <span className="text-sm text-muted-foreground">
              {s.label}: <strong className="text-foreground">{s.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(...steps.map((s) => s.value), 1);
  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const pct = Math.round((s.value / max) * 100);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-semibold text-foreground">{s.value.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-muted to-brand transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Catalog ---------- */

type CatalogProduct = {
  shopifyProductId: string;
  shopifyProductGid: string;
  title: string;
  handle: string;
  status: string;
  productType: string;
  vendor: string;
  imageUrl: string;
  aiVisible: boolean;
  totalVariants: number;
  availableVariants: number;
  aiVisibleVariants: number;
  missingSkuCount: number;
  lastSyncedAt: string;
};

function CatalogTab() {
  const [data, setData] = useState<{ products: CatalogProduct[]; total: number }>({ products: [], total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    fetch(`/api/dashboard/products/catalog?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.json())
      .then((d) => setData({ products: d.products ?? [], total: d.total ?? 0 }))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          إجمالي: <strong className="text-foreground">{data.total}</strong> منتج
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages || 1}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : data.products.length === 0 ? (
        <EmptyState title="لا توجد منتجات" description="لا توجد منتجات متزامنة في الذاكرة المؤقتة" />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-sm ring-1 ring-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-3 text-right font-medium">المنتج</th>
                <th className="px-4 py-3 text-right font-medium">النوع</th>
                <th className="px-4 py-3 text-right font-medium">المتغيرات</th>
                <th className="px-4 py-3 text-right font-medium">متوفر</th>
                <th className="px-4 py-3 text-right font-medium">AI</th>
                <th className="px-4 py-3 text-right font-medium">SKU مفقود</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">Shopify</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p.shopifyProductId} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.productType || "—"}</td>
                  <td className="px-4 py-3">{p.totalVariants}</td>
                  <td className="px-4 py-3">{p.availableVariants}</td>
                  <td className="px-4 py-3">{p.aiVisibleVariants}</td>
                  <td className="px-4 py-3">
                    {p.missingSkuCount > 0 ? (
                      <StatusBadge tone="warning">{p.missingSkuCount}</StatusBadge>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={p.status === "active" ? "success" : "neutral"}>
                      {p.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://admin.shopify.com/store/${p.shopifyProductId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      عرض
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Variants ---------- */

type VariantItem = {
  shopifyVariantId: string;
  shopifyVariantGid: string;
  productTitle: string;
  variantTitle: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  inventoryQuantity: number;
  availableForAi: boolean;
  codeMissing: boolean;
  hiddenReason: string;
};

function VariantsTab() {
  const [data, setData] = useState<{ variants: VariantItem[]; total: number }>({ variants: [], total: 0 });
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const pageSize = 50;

  useEffect(() => {
    fetch(`/api/dashboard/products/variants?page=${page}&pageSize=${pageSize}&filter=${filter}`)
      .then((r) => r.json())
      .then((d) => setData({ variants: d.variants ?? [], total: d.total ?? 0 }))
      .finally(() => setLoading(false));
  }, [page, filter]);

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "الكل" },
            { key: "oos", label: "نفذ" },
            { key: "missing_sku", label: "SKU مفقود" },
            { key: "ai_visible", label: "AI مرئي" },
            { key: "low_stock", label: "مخزون منخفض" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === f.key
                  ? "bg-brand text-white"
                  : "bg-card text-muted-foreground shadow-sm ring-1 ring-border hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages || 1}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : data.variants.length === 0 ? (
        <EmptyState title="لا توجد متغيرات" description="لا توجد متغيرات تطابق الفلتر المحدد" />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-sm ring-1 ring-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-3 text-right font-medium">المنتج</th>
                <th className="px-4 py-3 text-right font-medium">المتغير</th>
                <th className="px-4 py-3 text-right font-medium">المقاس</th>
                <th className="px-4 py-3 text-right font-medium">اللون</th>
                <th className="px-4 py-3 text-right font-medium">SKU</th>
                <th className="px-4 py-3 text-right font-medium">السعر</th>
                <th className="px-4 py-3 text-right font-medium">المخزون</th>
                <th className="px-4 py-3 text-right font-medium">AI</th>
                <th className="px-4 py-3 text-right font-medium">السبب</th>
              </tr>
            </thead>
            <tbody>
              {data.variants.map((v) => (
                <tr key={v.shopifyVariantId} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-foreground">{v.productTitle}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.variantTitle}</td>
                  <td className="px-4 py-3">{v.size || "—"}</td>
                  <td className="px-4 py-3">{v.color || "—"}</td>
                  <td className="px-4 py-3">
                    {v.codeMissing ? <StatusBadge tone="warning">مفقود</StatusBadge> : v.sku || "—"}
                  </td>
                  <td className="px-4 py-3">{v.price ? `${v.price} EGP` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={v.inventoryQuantity <= 0 ? "text-red-400 font-semibold" : ""}>
                      {v.inventoryQuantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={v.availableForAi ? "success" : "error"}>
                      {v.availableForAi ? "نعم" : "لا"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{v.hiddenReason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Sync Health ---------- */

type SyncHealthData = {
  lastSyncStatus: string;
  lastSyncTime: string | null;
  productsSynced: number;
  variantsSynced: number;
  missingSkuCount: number;
  unavailableCount: number;
  durationMs: number;
  source: string;
  n8nDailyWorkflowActive: boolean;
};

function SyncHealthTab() {
  const [data, setData] = useState<SyncHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/products/sync-health")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingBlock />;
  if (!data) return <EmptyState title="لا توجد بيانات" description="تعذر تحميل بيانات صحة المزامنة" />;

  const statusTone = data.lastSyncStatus === "success" ? "success" : data.lastSyncStatus === "error" ? "error" : "warning";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard label="حالة المزامنة" value={data.lastSyncStatus} tone={statusTone} />
        <InfoCard
          label="آخر مزامنة"
          value={data.lastSyncTime ? new Date(data.lastSyncTime).toLocaleString("ar-EG") : "—"}
          tone="neutral"
        />
        <InfoCard label="المنتجات المتزامنة" value={data.productsSynced.toLocaleString()} tone="brand" />
        <InfoCard label="المتغيرات المتزامنة" value={data.variantsSynced.toLocaleString()} tone="brand" />
        <InfoCard label="SKU مفقود" value={data.missingSkuCount.toLocaleString()} tone="warning" />
        <InfoCard label="غير متوفر" value={data.unavailableCount.toLocaleString()} tone="error" />
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">سير عمل n8n اليومي</h3>
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${data.n8nDailyWorkflowActive ? "bg-emerald-500" : "bg-red-400"}`}
          />
          <span className="text-sm text-foreground">
            {data.n8nDailyWorkflowActive ? "مفعل" : "غير مفعل"} — سير العمل اليومي للمزامنة
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          لا تقم بتفعيل سير العمل اليومي إلا بعد التحقق من صحة المزامنة.
        </p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">تعليمات المزامنة اليدوية</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• التحقق من القراءة فقط: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run shopify:assert-readonly</code></p>
          <p>• التشغيل الجاف (بدون كتابة): <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run shopify:sync:dry-run</code></p>
          <p>• المزامنة الكاملة: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run shopify:sync</code></p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  const toneClasses: Record<string, string> = {
    success: "text-emerald-500",
    error: "text-red-400",
    warning: "text-amber-500",
    brand: "text-brand",
    neutral: "text-foreground",
  };
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={`mt-2 text-xl font-bold ${toneClasses[tone] ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}

/* ---------- Search QA ---------- */

type SearchResult = {
  index: number;
  productId: string;
  shopifyProductId: string;
  shopifyProductTitle: string;
  variantOptions: Array<{
    shopifyVariantId: string;
    sku: string;
    codeMissing: boolean;
    title: string;
    size: string;
    color: string;
    price: number;
    inventoryQuantity: number;
    available: boolean;
  }>;
};

function SearchQaTab() {
  const [query, setQuery] = useState("بيجامة");
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/products/search-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit }),
      });
      const data = await res.json();
      setResults(data.recommendations ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-muted-foreground mb-1">نص البحث</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-muted-foreground mb-1">الحد الأقصى</label>
            <input
              type="number"
              value={limit}
              min={1}
              max={20}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <button
            onClick={runSearch}
            disabled={loading}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand/90 disabled:opacity-60 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {loading ? "جاري البحث..." : "بحث"}
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState title="لا توجد نتائج" description="جرّب تغيير نص البحث" />
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <div key={r.index} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-brand text-xs font-bold">
                      {r.index}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">{r.shopifyProductTitle}</h4>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>productId: {r.productId}</span>
                    <span>shopifyProductId: {r.shopifyProductId}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {r.variantOptions.map((v) => (
                  <div
                    key={v.shopifyVariantId}
                    className="flex flex-wrap items-center gap-3 rounded-xl bg-muted p-3 text-xs"
                  >
                    <span className="font-medium text-foreground">{v.title}</span>
                    <span className="text-muted-foreground">{v.price} EGP</span>
                    <span className={v.inventoryQuantity > 0 ? "text-emerald-500" : "text-red-400"}>
                      مخزون: {v.inventoryQuantity}
                    </span>
                    <span className={v.available ? "text-emerald-500" : "text-red-400"}>
                      {v.available ? "متاح للذكاء الاصطناعي" : "غير متاح"}
                    </span>
                    {v.codeMissing && <StatusBadge tone="warning">SKU مفقود</StatusBadge>}
                    <span className="text-muted-foreground font-mono">{v.shopifyVariantId}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Mapping Inspector ---------- */

type MappingItem = {
  conversationId: string;
  customerId: string;
  index: number;
  productTitle: string;
  productId: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  inventoryAtShowTime: number;
  expiresAt: string;
  isExpired: boolean;
  createdAt: string;
};

function MappingInspectorTab() {
  const [data, setData] = useState<{ mappings: MappingItem[]; total: number }>({ mappings: [], total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    fetch(`/api/dashboard/products/mapping-inspector?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.json())
      .then((d) => setData({ mappings: d.mappings ?? [], total: d.total ?? 0 }))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          إجمالي: <strong className="text-foreground">{data.total}</strong> mapping
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages || 1}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : data.mappings.length === 0 ? (
        <EmptyState
          title="لا توجد بيانات ربط"
          description="ستظهر بيانات الربط بعد إجراء محادثات بحث عن منتجات"
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-sm ring-1 ring-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-3 text-right font-medium">المحادثة</th>
                <th className="px-4 py-3 text-right font-medium">العميل</th>
                <th className="px-4 py-3 text-right font-medium">#</th>
                <th className="px-4 py-3 text-right font-medium">المنتج</th>
                <th className="px-4 py-3 text-right font-medium">SKU</th>
                <th className="px-4 py-3 text-right font-medium">المقاس</th>
                <th className="px-4 py-3 text-right font-medium">اللون</th>
                <th className="px-4 py-3 text-right font-medium">السعر</th>
                <th className="px-4 py-3 text-right font-medium">المخزون وقت العرض</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {data.mappings.map((m) => (
                <tr key={`${m.conversationId}-${m.index}`} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{m.conversationId.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{m.customerId}</td>
                  <td className="px-4 py-3 font-semibold">{m.index}</td>
                  <td className="px-4 py-3 text-foreground">{m.productTitle}</td>
                  <td className="px-4 py-3">{m.sku || "—"}</td>
                  <td className="px-4 py-3">{m.size || "—"}</td>
                  <td className="px-4 py-3">{m.color || "—"}</td>
                  <td className="px-4 py-3">{m.price ? `${m.price} EGP` : "—"}</td>
                  <td className="px-4 py-3">{m.inventoryAtShowTime ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={m.isExpired ? "error" : "success"}>
                      {m.isExpired ? "منتهي" : "فعّال"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Main Page ---------- */

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">المنتجات والمخزون</h1>
        <p className="text-sm text-muted-foreground">
          مراقبة ذاكرة المنتجات المؤقتة من Shopify — للقراءة فقط
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-brand text-white shadow-sm"
                : "bg-card text-muted-foreground shadow-sm ring-1 ring-border hover:text-foreground"
            }`}
          >
            {tab.labelAr}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "catalog" && <CatalogTab />}
        {activeTab === "variants" && <VariantsTab />}
        {activeTab === "sync" && <SyncHealthTab />}
        {activeTab === "search" && <SearchQaTab />}
        {activeTab === "mapping" && <MappingInspectorTab />}
      </div>
    </div>
  );
}

/* ---------- Shared ---------- */

function LoadingBlock() {
  return (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="h-6 w-6 animate-spin text-brand" />
      <span className="mr-3 text-sm text-muted-foreground">جاري التحميل...</span>
    </div>
  );
}
