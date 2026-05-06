"use client";

import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";

import { useEffect, useState } from "react";

export default function ShippingSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [zones, setZones] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [testAddress, setTestAddress] = useState("");
  const [testSubtotal, setTestSubtotal] = useState("");
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);

  function getStr(obj: Record<string, unknown>, key: string): string {
    return String(obj[key] ?? "");
  }
  function getArr(obj: Record<string, unknown>, key: string): unknown[] {
    return Array.isArray(obj[key]) ? (obj[key] as unknown[]) : [];
  }

  useEffect(() => {
    fetch("/api/dashboard/settings/shipping")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setZones(data.zones ?? []);
        setLoading(false);
      });
  }, []);

  const saveSettings = async () => {
    await fetch("/api/dashboard/settings/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: { free_shipping_threshold_egp: Number(settings?.free_shipping_threshold_egp) } }),
    });
  };

  const runTest = async () => {
    const res = await fetch("/api/dashboard/settings/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: testAddress, subtotal: Number(testSubtotal) }),
    });
    const data = await res.json();
    setTestResult(data.result);
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border" dir="rtl">
      <h1 className="text-2xl font-semibold">إعدادات الشحن</h1>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">حد الشحن المجاني (جنيه)</span>
          <input
            type="number"
            className="h-10 rounded-md bg-background ring-1 ring-border px-3"
            value={Number(settings?.free_shipping_threshold_egp ?? 1400)}
            onChange={(e) => setSettings({ ...(settings ?? {}), free_shipping_threshold_egp: e.target.value })}
          />
        </label>
        <button onClick={saveSettings} className="h-10 rounded-md bg-brand text-white font-semibold hover:opacity-90">
          حفظ
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium">مناطق الشحن</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-right">المحافظة</th>
              <th className="py-2 text-right">المنطقة</th>
              <th className="py-2 text-right">الأسماء البديلة</th>
              <th className="py-2 text-right">الرسوم</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={getStr(z, "id")} className="border-b">
                <td className="py-2">{getStr(z, "governorate")}</td>
                <td className="py-2">{getStr(z, "district") || "—"}</td>
                <td className="py-2">{getArr(z, "aliases").join(", ")}</td>
                <td className="py-2">{getStr(z, "shipping_fee_egp")} ج.م</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-xl bg-background p-4 ring-1 ring-border">
        <h2 className="text-lg font-medium">اختبار الشحن</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            placeholder="العنوان"
            className="h-10 rounded-md bg-background ring-1 ring-border px-3"
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
          />
          <input
            placeholder="المجموع الفرعي"
            type="number"
            className="h-10 rounded-md bg-background ring-1 ring-border px-3"
            value={testSubtotal}
            onChange={(e) => setTestSubtotal(e.target.value)}
          />
          <button onClick={runTest} className="h-10 rounded-md bg-brand text-white font-semibold hover:opacity-90">
            اختبار
          </button>
        </div>
        {testResult && (
          <div className="mt-3 text-sm">
            {Boolean(testResult.unknownArea) ? (
              <p className="text-amber-600">منطقة غير معروفة — اطلب توضيح</p>
            ) : (
              <>
                <p>الشحن: {Number(testResult.shippingFee ?? 0)} ج.م</p>
                <p>المجموع: {Number(testResult.total ?? testResult.subtotal ?? 0)} ج.م</p>
                {Boolean(testResult.freeShippingApplied) && <p className="text-emerald-600">✓ شحن مجاني</p>}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
