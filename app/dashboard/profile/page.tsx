"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.profile ?? {});
        setEmail(data.email ?? "");
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/dashboard/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
  };

  if (loading) return <p className="p-6">جاري التحميل...</p>;

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border" dir="rtl">
      <h1 className="text-balance text-2xl font-semibold text-foreground">الملف الشخصي</h1>
      <p className="mt-2 text-muted-foreground">Store Profile / Operator Profile</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="text-lg">
                {String(profile?.display_name ?? "Y").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{String(profile?.display_name ?? "YOULYA HOME WEAR")}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <h3 className="mb-3 font-medium text-foreground">الإعدادات</h3>
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">اسم العرض</span>
              <input
                className="h-9 rounded-md bg-background ring-1 ring-border px-3 text-sm"
                value={String(profile?.display_name ?? "")}
                onChange={(e) => setProfile({ ...(profile ?? {}), display_name: e.target.value })}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">اسم المستخدم</span>
              <input
                className="h-9 rounded-md bg-background ring-1 ring-border px-3 text-sm"
                value={String(profile?.username ?? "")}
                onChange={(e) => setProfile({ ...(profile ?? {}), username: e.target.value })}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">اللغة</span>
              <select
                className="h-9 rounded-md bg-background ring-1 ring-border px-3 text-sm"
                value={String(profile?.preferred_language ?? "ar")}
                onChange={(e) => setProfile({ ...(profile ?? {}), preferred_language: e.target.value })}
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <h3 className="mb-3 font-medium text-foreground">المظهر</h3>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">الوضع الداكن</span>
            <Switch
              checked={String(profile?.preferred_theme ?? "light") === "dark"}
              onCheckedChange={(v) => setProfile({ ...(profile ?? {}), preferred_theme: v ? "dark" : "light" })}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">طي القائمة</span>
            <Switch
              checked={Boolean(profile?.sidebar_collapsed ?? false)}
              onCheckedChange={(v) => setProfile({ ...(profile ?? {}), sidebar_collapsed: v })}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={save}
          disabled={saving}
          className="h-10 rounded-md bg-brand text-white font-semibold hover:opacity-90 disabled:opacity-50 px-6"
        >
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
      </div>
    </section>
  );
}
