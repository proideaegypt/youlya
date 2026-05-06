"use client";

import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";

import { useEffect, useMemo, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "moderator" | "customer_service";
  is_active: boolean;
};

type UserFormState = {
  name: string;
  email: string;
  role: UserRow["role"];
  is_active: boolean;
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  role: "customer_service",
  is_active: true,
};

export default function UsersRolesPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);

  const editingUser = useMemo(() => users.find((u) => u.id === editingUserId) ?? null, [users, editingUserId]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/dashboard/users");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "حدث خطأ أثناء تحميل المستخدمين.");
      setLoading(false);
      return;
    }
    setUsers((data.users ?? []) as UserRow[]);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/dashboard/users")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "حدث خطأ أثناء تحميل المستخدمين.");
          setLoading(false);
          return;
        }
        setUsers((data.users ?? []) as UserRow[]);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("حدث خطأ أثناء تحميل المستخدمين.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => setForm(emptyForm);

  const openAdd = () => {
    setSuccess("");
    setError("");
    setEditingUserId(null);
    resetForm();
    setShowAdd(true);
  };

  const openEdit = (user: UserRow) => {
    setSuccess("");
    setError("");
    setShowAdd(false);
    setEditingUserId(user.id);
    setForm({ name: user.name ?? "", email: user.email, role: user.role, is_active: user.is_active });
  };

  const closeModal = () => {
    setShowAdd(false);
    setEditingUserId(null);
    resetForm();
  };

  const submitAdd = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/dashboard/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "حدث خطأ أثناء حفظ المستخدم. حاول مرة أخرى.");
      return;
    }
    setSuccess("تمت إضافة المستخدم بنجاح.");
    closeModal();
    await loadUsers();
  };

  const submitEdit = async () => {
    if (!editingUserId) return;
    if (editingUser?.role === "super_admin" && form.role !== "super_admin") {
      const ok = confirm("تأكيد تغيير دور مدير رئيسي؟");
      if (!ok) return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/dashboard/users/${editingUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, role: form.role, is_active: form.is_active }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "حدث خطأ أثناء حفظ المستخدم. حاول مرة أخرى.");
      return;
    }
    setSuccess("تم تحديث المستخدم بنجاح.");
    closeModal();
    await loadUsers();
  };

  const deactivateUser = async (userId: string) => {
    const ok = confirm("هل تريد تعطيل هذا المستخدم؟");
    if (!ok) return;
    setSaving(true);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/dashboard/users/${userId}/deactivate`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "حدث خطأ أثناء تحديث المستخدم. حاول مرة أخرى.");
      return;
    }
    setSuccess("تم تعطيل المستخدم بنجاح.");
    await loadUsers();
  };

  const inviteUser = async (userId: string) => {
    setSaving(true);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/dashboard/users/${userId}/invite`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "تعذر إرسال الدعوة. تحقق من إعدادات البريد.");
      return;
    }
    setSuccess(data.message || "تم إرسال الدعوة بنجاح.");
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-6" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold sm:text-2xl">المستخدمين والأدوار</h1>
        <button
          onClick={openAdd}
          className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground sm:text-sm"
        >
          إضافة مستخدم
        </button>
      </div>

      {success ? <p className="mt-4 rounded-md bg-green-50 p-2 text-sm text-green-700">{success}</p> : null}
      {error ? <p className="mt-4 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

      {users.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">لا يوجد مستخدمون بعد.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-right">البريد</th>
                <th className="py-2 text-right">الاسم</th>
                <th className="py-2 text-right">الدور</th>
                <th className="py-2 text-right">الحالة</th>
                <th className="py-2 text-right">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.name || "-"}</td>
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">{u.is_active ? "نشط" : "غير نشط"}</td>
                  <td className="py-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="rounded-md bg-background px-2 py-1 text-xs ring-1 ring-border sm:text-sm"
                    >
                      تعديل
                    </button>
                    {u.is_active ? (
                      <button
                        onClick={() => deactivateUser(u.id)}
                        className="mr-2 rounded-md bg-red-50 px-2 py-1 text-xs text-red-700 ring-1 ring-red-200 sm:text-sm"
                        disabled={saving}
                      >
                        تعطيل
                      </button>
                    ) : null}
                    <button
                      onClick={() => inviteUser(u.id)}
                      className="mr-2 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-blue-200 sm:text-sm"
                      disabled={saving}
                    >
                      إرسال دعوة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAdd || editingUserId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-4 shadow-lg sm:p-5" role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold">{showAdd ? "إضافة مستخدم" : "تعديل المستخدم"}</h2>

            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                الاسم
                <input
                  className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>

              <label className="block text-sm">
                البريد الإلكتروني
                <input
                  type="email"
                  className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={!showAdd}
                />
              </label>

              <label className="block text-sm">
                الدور
                <select
                  className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3"
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRow["role"] }))}
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="customer_service">Customer Service</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                />
                نشط
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={closeModal} className="rounded-md px-3 py-2 text-sm ring-1 ring-border" disabled={saving}>
                إلغاء
              </button>
              <button
                onClick={showAdd ? submitAdd : submitEdit}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "جاري الحفظ..." : showAdd ? "إضافة" : "حفظ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
