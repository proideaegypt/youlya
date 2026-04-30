import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isAiEnabled } from "@/lib/services/ai-settings-service";
import { BuildIdentityFooter } from "@/lib/ui/build-identity-footer";

const links = [
  { href: "/dashboard/command-center", label: "لوحة التحكم" },
  { href: "/dashboard/inbox", label: "الرسائل" },
  { href: "/dashboard/orders", label: "الطلبات" },
  { href: "/dashboard/logs", label: "السجلات" },
  { href: "/dashboard/settings", label: "الإعدادات" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((cookie) => cookie.name.startsWith("sb-"));
  if (!hasSession) redirect("/login");

  const aiEnabled = await isAiEnabled("youlya");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 md:grid md:grid-cols-[280px_1fr]">
      <aside className="border-l border-zinc-800 p-4 md:p-6">
        <div className="mb-8 text-xl font-semibold">Youlya</div>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block rounded-lg border border-zinc-800 px-4 py-2 font-medium hover:bg-zinc-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main>
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 md:px-6">
          <div className="font-semibold">متجر Youlya</div>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${aiEnabled ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium">{aiEnabled ? "AI يعمل" : "AI متوقف"}</span>
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
        <footer className="border-t border-zinc-800 px-4 py-3 md:px-6">
          <BuildIdentityFooter />
        </footer>
      </main>
    </div>
  );
}
