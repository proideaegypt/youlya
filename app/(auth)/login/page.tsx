"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        setError("إعدادات الدخول غير مكتملة.");
        setLoading(false);
        return;
      }
      const supabase = createClient(url, key);
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError("بيانات الدخول غير صحيحة.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("حصل خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold">Youlya</div>
          <div className="text-zinc-400">لوحة التحكم</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium">
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
}
