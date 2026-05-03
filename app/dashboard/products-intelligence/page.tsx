"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Package,
  Boxes,
  Eye,
  ShoppingCart,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Globe,
  Video,
  MessageSquare,
  HelpCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { EmptyState } from "@/lib/ui/empty-state";
import { StatusBadge } from "@/lib/ui/status-badge";

/* ---------- Types ---------- */

type OverviewData = {
  totalProducts: number;
  totalVariants: number;
  aiVisibleProducts: number;
  aiVisibleVariants: number;
  mostOrderedByAiProduct: string | null;
  topOrderedChannel: string | null;
  missingSkuVariants: number;
  outOfStockVariants: number;
  aiAssistedRevenue: number | null;
  productIntelligenceScore: number;
  lastSyncTime: string | null;
  hasOrderData: boolean;
  hasChannelData: boolean;
};

type ProductCard = {
  shopifyProductId: string;
  title: string;
  handle: string;
  productType: string;
  vendor: string;
  imageUrl: string;
  status: string;
  aiVisible: boolean;
  totalVariants: number;
  availableVariants: number;
  aiVisibleVariants: number;
  missingSkuVariants: number;
  outOfStockVariants: number;
  aiOrdersCount: number;
  totalOrdersCount: number;
  topChannel: string | null;
  lastSyncedAt: string;
  notes: string[];
  badges: string[];
};

type ChannelData = {
  hasData: boolean;
  totalOrders: number;
  ordersByChannel: Array<{ channel: string; count: number }>;
  revenueByChannel: Array<{ channel: string; revenue: number }>;
  topProductsByChannel: Array<{ productId: string; channel: string; count: number }>;
  message?: string;
};

type ProductDetail = {
  product: {
    shopifyProductId: string;
    shopifyProductGid: string;
    title: string;
    handle: string;
    productType: string;
    vendor: string;
    imageUrl: string;
    status: string;
    aiVisible: boolean;
    lastSyncedAt: string;
  };
  variants: Array<{
    shopifyVariantId: string;
    shopifyVariantGid: string;
    title: string;
    size: string;
    color: string;
    sku: string;
    price: number;
    inventoryQuantity: number;
    availableForAi: boolean;
    codeMissing: boolean;
    aiVisibilityReasons: string[];
    lastSyncedAt: string;
  }>;
  orderSummary: {
    totalOrders: number;
    totalRevenue: number;
    channelSplit: Array<{ channel: string; count: number }>;
    lastOrderDate: string | null;
  } | null;
  hasOrderData: boolean;
};

/* ---------- Helpers ---------- */
function ChannelIcon({ channel, className = "h-4 w-4" }: { channel: string; className?: string }) {
  switch (channel) {
    case "whatsapp": return <Smartphone className={className} />;
    case "instagram": return <Globe className={className} />;
    case "tiktok": return <Video className={className} />;
    case "facebook": return <MessageSquare className={className} />;
    default: return <HelpCircle className={className} />;
  }
}

function channelLabel(ch: string): string {
  const map: Record<string, string> = { whatsapp: "واتساب", instagram: "إنستغرام", tiktok: "تيك توك", facebook: "فيسبوك", manual: "يدوي", unknown: "غير معروف" };
  return map[ch] ?? ch;
}

function Badge({ code }: { code: string }) {
  const map: Record<string, { label: string; tone: "success" | "warning" | "error" | "neutral" | "brand" }> = {
    ai_ready: { label: "جاهز للذكاء الاصطناعي", tone: "success" },
    missing_sku: { label: "SKU مفقود", tone: "warning" },
    oos: { label: "نفذ المخزون", tone: "error" },
    low_stock: { label: "مخزون منخفض", tone: "warning" },
    hidden_from_ai: { label: "مخفي من الذكاء الاصطناعي", tone: "neutral" },
  };
  const info = map[code] || { label: code, tone: "neutral" as const };
  return <StatusBadge tone={info.tone}>{info.label}</StatusBadge>;
}

function LoadingBlock() {
  return (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="h-6 w-6 animate-spin text-brand" />
      <span className="mr-3 text-sm text-muted-foreground">جاري التحميل...</span>
    </div>
  );
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

/* ---------- Product Detail Drawer ---------- */
function ProductDetailDrawer({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dashboard/products-intelligence/product/${productId}`)
      .then((r) => r.json())
      .then((d) => setDetail(d))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <LoadingBlock />;
  if (!detail || !detail.product) return <EmptyState title="المنتج غير موجود" description="لم يتم العثور على بيانات هذا المنتج" />;

  const p = detail.product;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative h-full w-full max-w-xl overflow-y-auto bg-card p-6 shadow-xl">
        <button onClick={onClose} aria-label="إغلاق" className="absolute left-4 top-4 rounded-lg p-2 hover:bg-muted transition">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.title} className="h-24 w-24 rounded-2xl object-cover ring-1 ring-border" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted ring-1 ring-border">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground">{p.title}</h2>
              <p className="text-sm text-muted-foreground">{p.handle}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge tone={p.status === "active" ? "success" : "neutral"}>{p.status}</StatusBadge>
                <StatusBadge tone={p.aiVisible ? "success" : "error"}>{p.aiVisible ? "AI مرئي" : "AI مخفي"}</StatusBadge>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-muted p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">النوع</span><span className="text-foreground">{p.productType || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">المورد</span><span className="text-foreground">{p.vendor || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shopify ID</span><span className="font-mono text-muted-foreground">{p.shopifyProductId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">آخر مزامنة</span><span className="text-foreground">{p.lastSyncedAt ? new Date(p.lastSyncedAt).toLocaleString("ar-EG") : "—"}</span></div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">المتغيرات</h3>
            {detail.variants.length === 0 ? (
              <EmptyState title="لا توجد متغيرات" description="لم يتم العثور على متغيرات لهذا المنتج" />
            ) : (
              <div className="space-y-2">
                {detail.variants.map((v) => (
                  <div key={v.shopifyVariantId} className="rounded-xl bg-muted p-3 text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{v.title}</span>
                      <StatusBadge tone={v.availableForAi ? "success" : "error"}>{v.availableForAi ? "AI متاح" : "AI غير متاح"}</StatusBadge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      <span>SKU: {v.sku || "—"}</span>
                      <span>المقاس: {v.size || "—"}</span>
                      <span>اللون: {v.color || "—"}</span>
                      <span>السعر: {v.price ? `${v.price} EGP` : "—"}</span>
                      <span className={v.inventoryQuantity <= 0 ? "text-red-400 font-semibold" : ""}>المخزون: {v.inventoryQuantity}</span>
                    </div>
                    {!v.availableForAi && v.aiVisibilityReasons.length > 0 && (
                      <p className="text-xs text-red-400">الأسباب: {v.aiVisibilityReasons.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {detail.hasOrderData && detail.orderSummary ? (
            <div className="rounded-2xl bg-muted p-4 space-y-2 text-sm">
              <h3 className="font-semibold text-foreground">ملخص الطلبات</h3>
              <div className="flex justify-between"><span className="text-muted-foreground">إجمالي الطلبات</span><span className="text-foreground">{detail.orderSummary.totalOrders}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">إجمالي الإيرادات</span><span className="text-foreground">{detail.orderSummary.totalRevenue} EGP</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">آخر طلب</span><span className="text-foreground">{detail.orderSummary.lastOrderDate ? new Date(detail.orderSummary.lastOrderDate).toLocaleString("ar-EG") : "—"}</span></div>
              <div className="mt-2">
                <p className="text-muted-foreground mb-1">توزيع القنوات:</p>
                <div className="flex flex-wrap gap-2">
                  {detail.orderSummary.channelSplit.map((cs) => (
                    <span key={cs.channel} className="inline-flex items-center gap-1 rounded-lg bg-card px-2 py-1 text-xs ring-1 ring-border">
                      <ChannelIcon channel={cs.channel} />
                      {channelLabel(cs.channel)}: {cs.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title="لا توجد بيانات طلبات" description="ستظهر بيانات الطلبات بعد تسجيل أول طلب" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function ProductsIntelligencePage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [products, setProducts] = useState<{ products: ProductCard[]; total: number }>({ products: [], total: 0 });
  const [channels, setChannels] = useState<ChannelData | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productPage, setProductPage] = useState(1);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const productPageSize = 16;

  useEffect(() => {
    fetch("/api/dashboard/products-intelligence/overview")
      .then((r) => r.json())
      .then((d) => setOverview(d))
      .finally(() => setLoadingOverview(false));
  }, []);

  useEffect(() => {
    fetch(`/api/dashboard/products-intelligence/products?page=${productPage}&pageSize=${productPageSize}`)
      .then((r) => r.json())
      .then((d) => setProducts({ products: d.products ?? [], total: d.total ?? 0 }))
      .finally(() => setLoadingProducts(false));
  }, [productPage]);

  useEffect(() => {
    fetch("/api/dashboard/products-intelligence/channels")
      .then((r) => r.json())
      .then((d) => setChannels(d))
      .finally(() => setLoadingChannels(false));
  }, []);

  const productTotalPages = Math.ceil(products.total / productPageSize);
  const lastSyncText = overview?.lastSyncTime ? new Date(overview.lastSyncTime).toLocaleString("ar-EG") : "لم يتم المزامنة بعد";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Brain className="h-7 w-7 text-brand" />
          <h1 className="text-2xl font-bold text-foreground">ذكاء المنتجات</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          منتجات Shopify المتزامنة، جاهزية البيع بالذكاء الاصطناعي، وأداء القنوات
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            آخر مزامنة: {lastSyncText}
          </span>
          {overview && overview.productIntelligenceScore > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 px-2.5 py-1 text-brand font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              درجة الذكاء: {overview.productIntelligenceScore}%
            </span>
          )}
        </div>
      </div>

      {/* KPIs */}
      {loadingOverview ? (
        <LoadingBlock />
      ) : overview ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <KpiWidget icon={Package} label="إجمالي المنتجات" value={overview.totalProducts} tone="brand" />
          <KpiWidget icon={Boxes} label="إجمالي المتغيرات" value={overview.totalVariants} tone="neutral" />
          <KpiWidget icon={Eye} label="منتجات AI مرئية" value={overview.aiVisibleProducts} tone="success" />
          <KpiWidget icon={Eye} label="متغيرات AI مرئية" value={overview.aiVisibleVariants} tone="success" />
          <KpiWidget icon={ShoppingCart} label="الأكثر طلباً بالذكاء الاصطناعي" value={overview.mostOrderedByAiProduct ?? "—"} tone="brand" />
          <KpiWidget icon={Smartphone} label="أعلى قناة" value={overview.topOrderedChannel ? channelLabel(overview.topOrderedChannel) : "—"} tone="neutral" />
          <KpiWidget icon={AlertTriangle} label="SKU مفقود" value={overview.missingSkuVariants} tone="warning" />
          <KpiWidget icon={XCircle} label="نفذ المخزون" value={overview.outOfStockVariants} tone="error" />
          <KpiWidget icon={TrendingUp} label="إيرادات الذكاء الاصطناعي" value={overview.aiAssistedRevenue ? `${overview.aiAssistedRevenue} EGP` : "—"} tone="brand" />
          <KpiWidget icon={Brain} label="درجة الذكاء" value={`${overview.productIntelligenceScore}%`} tone="brand" />
        </section>
      ) : null}

      {/* Product Gallery */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">معرض المنتجات المتزامنة</h2>
          <div className="flex items-center gap-2">
            <button
              disabled={productPage <= 1}
              onClick={() => setProductPage((p) => p - 1)}
              aria-label="الصفحة السابقة"
              className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">{productPage} / {productTotalPages || 1}</span>
            <button
              disabled={productPage >= productTotalPages}
              onClick={() => setProductPage((p) => p + 1)}
              aria-label="الصفحة التالية"
              className="rounded-lg bg-card p-2 shadow-sm ring-1 ring-border disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loadingProducts ? (
          <LoadingBlock />
        ) : products.products.length === 0 ? (
          <EmptyState title="لا توجد منتجات" description="لا توجد منتجات متزامنة في الذاكرة المؤقتة" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.products.map((p) => (
              <button
                key={p.shopifyProductId}
                onClick={() => setSelectedProductId(p.shopifyProductId)}
                className="text-right rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border transition hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="relative">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="h-40 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-xl bg-muted">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    {p.badges.slice(0, 2).map((b) => (
                      <Badge key={b} code={b} />
                    ))}
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground line-clamp-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.productType || p.vendor || "—"}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-muted-foreground">المتغيرات</p>
                    <p className="font-semibold text-foreground">{p.totalVariants}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-muted-foreground">متوفر</p>
                    <p className="font-semibold text-foreground">{p.availableVariants}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-muted-foreground">AI مرئي</p>
                    <p className="font-semibold text-foreground">{p.aiVisibleVariants}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-muted-foreground">OOS</p>
                    <p className={`font-semibold ${p.outOfStockVariants > 0 ? "text-red-400" : "text-foreground"}`}>{p.outOfStockVariants}</p>
                  </div>
                </div>
                {p.notes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {p.notes.slice(0, 2).map((note, i) => (
                      <p key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        {note}
                      </p>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Most Ordered by AI */}
      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">الأكثر طلباً بالذكاء الاصطناعي</h2>
        {overview?.hasOrderData ? (
          <EmptyState title="بيانات الطلبات قيد التحميل" description="ستظهر هنا بيانات الطلبات عند توفرها" />
        ) : (
          <EmptyState
            title="لا توجد بيانات طلبات بالذكاء الاصطناعي"
            description="ستظهر هنا بيانات الطلبات بعد بدء تسجيل الطلبات من المحادثات الذكية"
          />
        )}
      </section>

      {/* Channel Performance */}
      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">أداء القنوات</h2>
        {loadingChannels ? (
          <LoadingBlock />
        ) : channels?.hasData ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {channels.ordersByChannel.map((oc) => (
                <div key={oc.channel} className="rounded-xl bg-muted p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ChannelIcon channel={oc.channel} className="h-5 w-5 text-brand" />
                    <span className="text-sm font-medium text-foreground">{channelLabel(oc.channel)}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{oc.count}</p>
                  <p className="text-xs text-muted-foreground">طلب</p>
                </div>
              ))}
            </div>
            {channels.revenueByChannel.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">الإيرادات بالقناة</h3>
                <div className="space-y-2">
                  {channels.revenueByChannel.map((rc) => (
                    <div key={rc.channel} className="flex items-center justify-between rounded-xl bg-muted p-3">
                      <div className="flex items-center gap-2">
                        <ChannelIcon channel={rc.channel} />
                        <span className="text-sm text-foreground">{channelLabel(rc.channel)}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{rc.revenue} EGP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="لا توجد بيانات قنوات"
            description={channels?.message ?? "ستظهر تحليلات القنوات بعد ربط القنوات وتسجيل الطلبات"}
          />
        )}
      </section>

      {/* Drawer */}
      {selectedProductId && (
        <ProductDetailDrawer productId={selectedProductId} onClose={() => setSelectedProductId(null)} />
      )}
    </div>
  );
}
