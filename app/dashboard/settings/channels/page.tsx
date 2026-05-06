"use client";

import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";
import { useEffect, useState } from "react";
import { Smartphone, MessageCircle, Share2, Camera, Copy, Check, Loader2, QrCode, RefreshCw } from "lucide-react";

type ChannelType = "evolution_whatsapp" | "meta_whatsapp" | "facebook" | "instagram";

const channelTypes: { id: ChannelType; labelAr: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "evolution_whatsapp", labelAr: "واتساب Evolution", labelEn: "WhatsApp Evolution", icon: Smartphone },
  { id: "meta_whatsapp", labelAr: "واتساب Meta", labelEn: "WhatsApp Meta", icon: MessageCircle },
  { id: "facebook", labelAr: "فيسبوك", labelEn: "Facebook", icon: Share2 },
  { id: "instagram", labelAr: "إنستغرام", labelEn: "Instagram", icon: Camera },
];

type FieldDef = { key: string; label: string; placeholder?: string; type?: string; required?: boolean; secret?: boolean; readonly?: boolean };

function getFieldsForType(type: ChannelType): FieldDef[] {
  switch (type) {
    case "evolution_whatsapp":
      return [
        { key: "instance_name", label: "اسم الـ Instance", placeholder: "AI", required: true },
        { key: "base_url", label: "عنوان Evolution", placeholder: "https://evo.youlya365.com", required: true },
        { key: "api_key", label: "API Key", placeholder: "••••••••", type: "password", required: true, secret: true },
        { key: "webhook_secret", label: "Webhook Secret", placeholder: "••••••••", type: "password", secret: true },
        { key: "webhook_url", label: "Webhook URL", placeholder: "", readonly: true },
      ];
    case "meta_whatsapp":
      return [
        { key: "phone_number", label: "رقم الهاتف", placeholder: "201000000000", required: true },
        { key: "phone_number_id", label: "Phone Number ID", placeholder: "", required: true },
        { key: "waba_id", label: "WhatsApp Business Account ID", placeholder: "", required: true },
        { key: "access_token", label: "Permanent Access Token", placeholder: "••••••••", type: "password", required: true, secret: true },
        { key: "verify_token", label: "Verify Token", placeholder: "", required: false },
        { key: "webhook_url", label: "Webhook URL", placeholder: "", readonly: true },
      ];
    case "facebook":
      return [
        { key: "page_name", label: "اسم الصفحة", placeholder: "Youlya", required: true },
        { key: "page_id", label: "Page ID", placeholder: "", required: true },
        { key: "app_id", label: "App ID", placeholder: "", required: true },
        { key: "page_access_token", label: "Page Access Token", placeholder: "••••••••", type: "password", required: true, secret: true },
        { key: "verify_token", label: "Verify Token", placeholder: "", required: false },
        { key: "webhook_url", label: "Webhook URL", placeholder: "", readonly: true },
      ];
    case "instagram":
      return [
        { key: "account_name", label: "اسم حساب Instagram", placeholder: "@youlya", required: true },
        { key: "account_id", label: "Instagram Business Account ID", placeholder: "", required: true },
        { key: "connected_page", label: "الصفحة المرتبطة", placeholder: "", required: true },
        { key: "access_token", label: "Access Token", placeholder: "••••••••", type: "password", required: true, secret: true },
        { key: "webhook_url", label: "Webhook URL", placeholder: "", readonly: true },
      ];
  }
}

function defaultWebhookUrl(type: ChannelType): string {
  const base = typeof window !== "undefined" ? window.location.origin : "https://admin.nex-lnk.online";
  switch (type) {
    case "evolution_whatsapp":
      return `${base}/webhooks/evolution`;
    case "meta_whatsapp":
      return `${base}/webhooks/meta-whatsapp`;
    case "facebook":
      return `${base}/webhooks/facebook`;
    case "instagram":
      return `${base}/webhooks/instagram`;
  }
}

export default function ChannelsSettingsPage() {
  const [integrations, setIntegrations] = useState<Record<string, unknown>[]>([]);
  const [accounts, setAccounts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ChannelType | null>(null);
  const [wizardForm, setWizardForm] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [saveError, setSaveError] = useState("");
  const [copied, setCopied] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [savingChannel, setSavingChannel] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [accountQrId, setAccountQrId] = useState<string | null>(null);
  const [accountQrImage, setAccountQrImage] = useState<string | null>(null);
  const [accountQrLoading, setAccountQrLoading] = useState(false);
  const [accountQrModalOpen, setAccountQrModalOpen] = useState(false);
  const [accountQrError, setAccountQrError] = useState<string>("");

  function getStr(obj: Record<string, unknown>, key: string): string {
    return String(obj[key] ?? "");
  }
  function getBool(obj: Record<string, unknown>, key: string): boolean {
    return Boolean(obj[key]);
  }

  useEffect(() => {
    fetch("/api/dashboard/settings/channels")
      .then((r) => r.json())
      .then((data) => {
        setIntegrations(data.integrations ?? []);
        setAccounts(data.accounts ?? []);
        setLoading(false);
      });
  }, []);

  const toggleChannel = async (id: string, active: boolean) => {
    await fetch("/api/dashboard/settings/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ integration: { id, values: { active } } }),
    });
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, active } : i)));
  };

  const copyWebhook = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startWizard = (type: ChannelType) => {
    setSelectedType(type);
    setWizardStep(2);
    const form: Record<string, string> = {};
    getFieldsForType(type).forEach((f) => {
      if (f.key === "webhook_url") form[f.key] = defaultWebhookUrl(type);
      else form[f.key] = "";
    });
    setWizardForm(form);
    setTestResult(null);
    setSaveError("");
  };

  const resetWizard = () => {
    setWizardOpen(false);
    setWizardStep(1);
    setSelectedType(null);
    setWizardForm({});
    setTestResult(null);
    setSaveError("");
    setQrImage(null);
    setQrModalOpen(false);
  };

  const testConnection = async () => {
    if (!selectedType) return;
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/dashboard/settings/channels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, type: selectedType, form: wizardForm }),
      });
      const data = await res.json();
      setTestResult({ ok: res.ok, ...data });
    } catch {
      setTestResult({ ok: false, error: "فشل الاتصال بالخادم" });
    } finally {
      setTestingConnection(false);
    }
  };

  const testEvolutionConnection = async () => {
    if (!selectedType || selectedType !== "evolution_whatsapp") return;
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/dashboard/settings/channels/evolution/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: wizardForm }),
      });
      const data = await res.json();
      setTestResult({ ok: res.ok, ...data });
    } catch {
      setTestResult({ ok: false, error: "فشل الاتصال بالخادم" });
    } finally {
      setTestingConnection(false);
    }
  };

  const fetchQR = async () => {
    if (!selectedType || selectedType !== "evolution_whatsapp") return;
    setQrLoading(true);
    try {
      const res = await fetch("/api/dashboard/settings/channels/evolution/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: wizardForm }),
      });
      const data = await res.json();
      if (res.ok && data.qr) {
        setQrImage(data.qr);
        setQrModalOpen(true);
      } else {
        setTestResult({ ok: false, error: data.error || "تعذر جلب QR Code" });
      }
    } catch {
      setTestResult({ ok: false, error: "تعذر جلب QR Code" });
    } finally {
      setQrLoading(false);
    }
  };

  const saveChannel = async () => {
    setSaveError("");
    setSavingChannel(true);
    try {
      const res = await fetch("/api/dashboard/settings/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integration: { type: selectedType, values: wizardForm } }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "فشل الحفظ");
        setSavingChannel(false);
        return;
      }
      setIntegrations(data.integrations ?? []);
      setAccounts(data.accounts ?? []);
      resetWizard();
    } catch {
      setSaveError("فشل الاتصال بالخادم");
    } finally {
      setSavingChannel(false);
    }
  };

  const fetchAccountQR = async (accountId: string) => {
    setAccountQrId(accountId);
    setAccountQrImage(null);
    setAccountQrError("");
    setAccountQrLoading(true);
    setAccountQrModalOpen(true);
    try {
      const res = await fetch(`/api/dashboard/channels/evolution/accounts/${encodeURIComponent(accountId)}/qr`);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.qr) {
        setAccountQrImage(data.qr);
      } else {
        setAccountQrError(data.error || "تعذر جلب QR Code");
      }
    } catch {
      setAccountQrError("تعذر الاتصال بالخادم");
    } finally {
      setAccountQrLoading(false);
    }
  };

  const stepLabels = ["", "اختر نوع القناة", "بيانات الربط", "اختبار الاتصال", "تفعيل القناة"];

  const renderWizardHeader = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{stepLabels[wizardStep]}</h2>
        <button onClick={resetWizard} className="text-muted-foreground hover:text-foreground" aria-label="إغلاق">
          ✕
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {[1, 2, 3, 4].map((s) => (
          <span key={s} className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${s === wizardStep ? "bg-primary text-primary-foreground" : s < wizardStep ? "bg-emerald-100 text-emerald-700" : "bg-muted"}`}>
            {s < wizardStep ? "✓" : s}
          </span>
        ))}
      </div>
    </div>
  );

  if (loading) return <SettingsSkeleton />;

  return (
    <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border" dir="rtl">
      <h1 className="text-2xl font-semibold">إعدادات القنوات</h1>
      <p className="mt-1 text-sm text-muted-foreground">اربط قنوات التواصل التي يستقبل منها Youlya رسائل العملاء.</p>

      <div className="mt-6 space-y-4">
        {integrations.map((integration) => (
          <div key={getStr(integration, "id")} className="rounded-xl bg-background p-4 ring-1 ring-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{getStr(integration, "display_name") || getStr(integration, "provider")}</p>
                <p className="text-xs text-muted-foreground">
                  الحالة: {getBool(integration, "active") ? "مفعل" : "معطل"} · {getStr(integration, "connection_status")}
                </p>
              </div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={getBool(integration, "active")}
                  onChange={(e) => toggleChannel(getStr(integration, "id"), e.target.checked)}
                  className="h-5 w-5"
                />
                <span className="text-sm">تشغيل</span>
              </label>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              بيانات الاعتماد: {getStr(integration, "credentials_status") === "SET" ? `••••${getStr(integration, "credential_last4")}` : "غير مضبوط"}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => { setWizardOpen(true); setWizardStep(1); setSelectedType(null); }}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        إضافة قناة
      </button>

      {/* Wizard Modal */}
      {wizardOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.currentTarget === e.target) resetWizard(); }}
          role="presentation"
        >
          <div className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-2xl max-h-[92vh] overflow-y-auto" role="dialog" aria-modal="true">
            {renderWizardHeader()}

            {wizardStep === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {channelTypes.map((ct) => {
                  const Icon = ct.icon;
                  return (
                    <button
                      key={ct.id}
                      onClick={() => startWizard(ct.id)}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 hover:border-primary/50 transition"
                    >
                      <Icon className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">{ct.labelAr}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {wizardStep === 2 && selectedType && (
              <div className="space-y-4">
                {getFieldsForType(selectedType).map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium">
                      {field.label}
                      {field.required ? <span className="text-red-600 mr-1">*</span> : null}
                    </label>
                    {field.readonly ? (
                      <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2">
                        <code className="flex-1 text-xs break-all text-muted-foreground">{wizardForm[field.key] ?? ""}</code>
                        <button
                          onClick={() => copyWebhook(wizardForm[field.key] ?? "")}
                          className="text-primary"
                          aria-label="نسخ"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={field.type || "text"}
                        className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 disabled:opacity-50"
                        placeholder={field.placeholder}
                        value={wizardForm[field.key] ?? ""}
                        onChange={(e) => setWizardForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    )}
                    {field.secret ? (
                      <p className="mt-1 text-xs text-muted-foreground">يتم تخزينه مشفراً على الخادم ولا يُعرض مرة أخرى.</p>
                    ) : null}
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <button onClick={() => setWizardStep(1)} className="text-sm text-muted-foreground hover:text-foreground">رجوع</button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}

            {wizardStep === 3 && selectedType && (
              <div className="space-y-4">
                <button
                  onClick={selectedType === "evolution_whatsapp" ? testEvolutionConnection : testConnection}
                  disabled={testingConnection}
                  className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {testingConnection ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  اختبار الاتصال
                </button>

                {selectedType === "evolution_whatsapp" && (
                  <div className="flex gap-2">
                    <button
                      onClick={fetchQR}
                      disabled={qrLoading}
                      className="flex-1 rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    >
                      {qrLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      عرض QR Code
                    </button>
                  </div>
                )}

                {testResult && (
                  <div className={`rounded-xl p-3 text-sm ${testResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {testResult.ok ? "✓ الاتصال ناجح" : `✗ فشل الاتصال: ${String(testResult.error || "")}`}
                  </div>
                )}

                {saveError && <p className="text-sm text-red-600">{saveError}</p>}

                <div className="flex justify-between pt-2">
                  <button onClick={() => setWizardStep(2)} className="text-sm text-muted-foreground hover:text-foreground">رجوع</button>
                  <button
                    onClick={() => setWizardStep(4)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}

            {wizardStep === 4 && selectedType && (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 p-4 text-emerald-800">
                  <p className="font-semibold">تفعيل القناة</p>
                  <p className="text-sm mt-1">سيتم حفظ بيانات الربط وتفعيل القناة. تأكد من صحة البيانات قبل المتابعة.</p>
                </div>

                <div className="rounded-xl bg-muted p-3 text-sm space-y-1">
                  <p><span className="text-muted-foreground">نوع القناة:</span> {channelTypes.find((c) => c.id === selectedType)?.labelAr}</p>
                  {getFieldsForType(selectedType).filter((f) => !f.secret && !f.readonly).map((f) => (
                    <p key={f.key}><span className="text-muted-foreground">{f.label}:</span> {wizardForm[f.key] || "—"}</p>
                  ))}
                </div>

                {saveError && <p className="text-sm text-red-600">{saveError}</p>}

                <div className="flex justify-between pt-2">
                  <button onClick={() => setWizardStep(3)} className="text-sm text-muted-foreground hover:text-foreground">رجوع</button>
                  <button
                    onClick={saveChannel}
                    disabled={savingChannel}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {savingChannel ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    حفظ وتفعيل
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.currentTarget === e.target) setQrModalOpen(false); }}
          role="presentation"
        >
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl text-center" role="dialog" aria-modal="true">
            <h3 className="text-lg font-semibold">ربط واتساب</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              افتح واتساب على الموبايل &gt; الأجهزة المرتبطة &gt; ربط جهاز &gt; امسح الكود.
            </p>
            {qrImage ? (
              <img src={qrImage} alt="QR Code" className="mx-auto mt-4 rounded-xl border border-border" />
            ) : (
              <div className="mx-auto mt-4 h-48 w-48 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                لا يوجد QR
              </div>
            )}
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={fetchQR}
                disabled={qrLoading}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 inline-flex items-center gap-2"
              >
                {qrLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                تحديث QR Code
              </button>
              <button
                onClick={() => setQrModalOpen(false)}
                className="rounded-md px-4 py-2 text-sm ring-1 ring-border hover:bg-muted"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium">الحسابات</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-right">الاسم</th>
                <th className="py-2 text-right">الرقم</th>
                <th className="py-2 text-right">الحالة</th>
                <th className="py-2 text-right">افتراضي</th>
                <th className="py-2 text-right">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => {
                const isEvolution = getStr(a, "channel_type") === "evolution_whatsapp" || getStr(a, "provider") === "evolution";
                return (
                  <tr key={getStr(a, "id")} className="border-b">
                    <td className="py-2">{getStr(a, "account_name")}</td>
                    <td className="py-2">{getStr(a, "phone_number_masked") || getStr(a, "phone_number") || "—"}</td>
                    <td className="py-2">{getStr(a, "status")}</td>
                    <td className="py-2">{getBool(a, "is_default") ? "✓" : "—"}</td>
                    <td className="py-2">
                      {isEvolution ? (
                        <button
                          onClick={() => fetchAccountQR(getStr(a, "id"))}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          QR
                        </button>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground text-sm">لا توجد حسابات مضافة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account QR Modal */}
      {accountQrModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.currentTarget === e.target) setAccountQrModalOpen(false); }}
          role="presentation"
        >
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl text-center" role="dialog" aria-modal="true">
            <h3 className="text-lg font-semibold">ربط واتساب</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              افتح واتساب على الموبايل &gt; الأجهزة المرتبطة &gt; ربط جهاز &gt; امسح الكود.
            </p>
            {accountQrLoading ? (
              <div className="mx-auto mt-4 h-48 w-48 rounded-xl bg-muted flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : accountQrError ? (
              <div className="mx-auto mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{accountQrError}</div>
            ) : accountQrImage ? (
              <img src={accountQrImage} alt="QR Code" className="mx-auto mt-4 rounded-xl border border-border" />
            ) : (
              <div className="mx-auto mt-4 h-48 w-48 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                لا يوجد QR
              </div>
            )}
            <div className="mt-4 flex justify-center gap-2">
              {accountQrId && (
                <button
                  onClick={() => fetchAccountQR(accountQrId)}
                  disabled={accountQrLoading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 inline-flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${accountQrLoading ? "animate-spin" : ""}`} />
                  تحديث
                </button>
              )}
              <button
                onClick={() => setAccountQrModalOpen(false)}
                className="rounded-md px-4 py-2 text-sm ring-1 ring-border hover:bg-muted"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
