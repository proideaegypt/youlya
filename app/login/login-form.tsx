"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const publicSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!publicSupabaseConfigured) {
        setError("إعدادات تسجيل الدخول غير مكتملة.");
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError("بيانات الدخول غير صحيحة.");
        return;
      }

      setSuccess(true);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" dir="rtl">
      <label className="grid gap-2">
        <span className="text-sm text-muted-foreground">البريد الإلكتروني</span>
        <input
          type="email"
          className="h-10 rounded-md bg-background ring-1 ring-border px-3 outline-none transition focus:ring-2 focus:ring-primary/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm text-muted-foreground">كلمة المرور</span>
        <input
          type="password"
          className="h-10 rounded-md bg-background ring-1 ring-border px-3 outline-none transition focus:ring-2 focus:ring-primary/50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? (
        <p className="text-sm text-emerald-600">
          تم تسجيل الدخول بنجاح. <Link href="/dashboard" className="underline">الانتقال إلى لوحة التحكم</Link>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="h-10 rounded-md bg-brand text-primary-foreground font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
