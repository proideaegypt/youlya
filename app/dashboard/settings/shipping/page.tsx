"use client";

import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";
import { EGYPT_GOVERNORATES, getCitiesForGovernorate, getDefaultShippingFee } from "@/lib/data/egypt-governorates";
import { useEffect, useMemo, useState } from "react";

export default function ShippingSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [zones, setZones] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [testAddress, setTestAddress] = useState("");
  const [testSubtotal, setTestSubtotal] = useState("");
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);

  // Add zone form
  const [addMode, setAddMode] = useState(false);
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [zoneCost, setZoneCost] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const cities = useMemo(() => getCitiesForGovernorate(selectedGov), [selectedGov]);

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
    setSaveSuccess("تم حفظ الإعدادات");
    setTimeout(() => setSaveSuccess(""), 3000);
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

  const addZone = async () => {
    setSaveError("");
    setSaveSuccess("");
    if (!selectedGov) {
      setSaveError("اختر المحافظة");
      return;
    }
    if (!selectedCity) {
      setSaveError("اختر المدينة");
      return;
    }
    const cost = Number(zoneCost);
    if (!cost || cost < 0 || !Number.isFinite(cost)) {
      setSaveError("أدخل تكلفة شحن صحيحة");
      return;
    }

    const gov = EGYPT_GOVERNORATES.find((g) => g.id === selectedGov);
    const res = await fetch("/api/dashboard/settings/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addZone: {
          governorate: gov?.nameAr ?? selectedGov,
          district: selectedCity,
          aliases: [gov?.nameEn ?? ""],
          shipping_fee_egp: cost,
          active: true,
        },
      }),
    });
    const data = await res.json();
    if (data.error) {
      setSaveError(data.error);
      return;
    }
    setZones(data.zones ?? []);
    setSettings(data.settings);
    setAddMode(false);
    setSelectedGov("");
    setSelectedCity("");
    setZoneCost("");
    setSaveSuccess("تمت إضافة المنطقة");
    setTimeout(() => setSaveSuccess(""), 3000);
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border" dir="rtl">
      <h1 className="text-2xl font-semibold">إعدادات الشحن</h1>
      <p className="mt-1 text-sm text-muted-foreground">إدارة مناطق الشحن وتكاليف التوصيل داخل مصر</p>

      {saveSuccess ? <p className="mt-3 rounded-md bg-emerald-50 p-2 text-sm text-emerald-700">{saveSuccess}</p> : null}
      {saveError ? <p className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{saveError}</p> : null}

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
          حفظ التغييرات
        </button>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">مناطق الشحن</h2>
          <button
            onClick={() => setAddMode(!addMode)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
          >
            {addMode ? "إلغاء" : "إضافة منطقة"}
          </button>
        </div>

        {addMode && (
          <div className="mt-4 rounded-xl bg-background p-4 ring-1 ring-border space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1 text-sm">
                المحافظة
                <select
                  className="h-10 rounded-md bg-background ring-1 ring-border px-2"
                  value={selectedGov}
                  onChange={(e) => {
                    setSelectedGov(e.target.value);
                    setSelectedCity("");
                    setZoneCost(String(getDefaultShippingFee(e.target.value)));
                  }}
                >
                  <option value="">اختر المحافظة</option>
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nameAr}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                المدينة
                <select
                  className="h-10 rounded-md bg-background ring-1 ring-border px-2"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedGov}
                >
                  <option value="">اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                تكلفة الشحن (جنيه)
                <input
                  type="number"
                  className="h-10 rounded-md bg-background ring-1 ring-border px-3"
                  value={zoneCost}
                  onChange={(e) => setZoneCost(e.target.value)}
                  min={0}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button onClick={addZone} className="h-10 rounded-md bg-brand px-4 text-white font-semibold hover:opacity-90">
                حفظ المنطقة
              </button>
            </div>
          </div>
        )}

        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-right">المحافظة</th>
              <th className="py-2 text-right">المدينة</th>
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
