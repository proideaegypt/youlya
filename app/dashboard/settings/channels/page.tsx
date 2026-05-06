"use client";

import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";

import { useEffect, useState } from "react";

export default function ChannelsSettingsPage() {
  const [integrations, setIntegrations] = useState<Record<string, unknown>[]>([]);
  const [accounts, setAccounts] = useState<Record<string, unknown>[]>([]);

  function getStr(obj: Record<string, unknown>, key: string): string {
    return String(obj[key] ?? "");
  }
  function getBool(obj: Record<string, unknown>, key: string): boolean {
    return Boolean(obj[key]);
  }
  const [loading, setLoading] = useState(true);

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

  if (loading) return <SettingsSkeleton />;

  return (
    <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border" dir="rtl">
      <h1 className="text-2xl font-semibold">إعدادات القنوات</h1>

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

      <div className="mt-8">
        <h2 className="text-lg font-medium">الحسابات</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-right">الاسم</th>
              <th className="py-2 text-right">الرقم</th>
              <th className="py-2 text-right">الحالة</th>
              <th className="py-2 text-right">افتراضي</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={getStr(a, "id")} className="border-b">
                <td className="py-2">{getStr(a, "account_name")}</td>
                <td className="py-2">{getStr(a, "phone_number_masked") || getStr(a, "phone_number") || "—"}</td>
                <td className="py-2">{getStr(a, "status")}</td>
                <td className="py-2">{getBool(a, "is_default") ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
