"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageCircle,
  BarChart3,
  Shield,
  TabletSmartphone,
  UserRound,
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
  ChevronFirst,
  ChevronLast,
  Sparkles,
  Package,
  Brain,
  Activity,
  AlertTriangle,
  BookOpenText,
  Truck,
  Bot,
  Users,
} from "lucide-react";
import { YoulyaLogo } from "@/lib/ui/youlya-logo";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  YOULYA_SIDEBAR_KEY,
  COOKIE_SIDEBAR,
  getStoredPreference,
  setStoredPreference,
  setPreferenceCookie,
} from "@/lib/ui/preferences";

type NavItem = {
  href: string;
  labelAr: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/dashboard/command-center", labelAr: "لوحة التحكم", labelEn: "Command Center", icon: LayoutDashboard },
  { href: "/dashboard/inbox", labelAr: "الرسائل", labelEn: "Inbox", icon: MessageCircle },
  { href: "/dashboard/orders", labelAr: "الطلبات", labelEn: "Orders", icon: ShoppingBag },
  { href: "/dashboard/products", labelAr: "المنتجات والمخزون", labelEn: "Products & Inventory", icon: Package },
  { href: "/dashboard/products-intelligence", labelAr: "ذكاء المنتجات", labelEn: "Products Intelligence", icon: Brain },
  { href: "/dashboard/handoff", labelAr: "التحويل البشري", labelEn: "Handoff Center", icon: AlertTriangle },
  { href: "/dashboard/conversations", labelAr: "المحادثات", labelEn: "Conversations", icon: MessageCircle },
  { href: "/dashboard/statistics", labelAr: "الإحصائيات", labelEn: "Statistics", icon: BarChart3 },
  { href: "/dashboard/settings/channels", labelAr: "القنوات", labelEn: "Channels", icon: TabletSmartphone },
  { href: "/dashboard/settings/ai-agent", labelAr: "AI Agent", labelEn: "AI Agent", icon: Bot },
  { href: "/dashboard/settings/shipping", labelAr: "الشحن", labelEn: "Shipping", icon: Truck },
  { href: "/dashboard/settings/users", labelAr: "المستخدمين والأدوار", labelEn: "Users & Roles", icon: Users },
  { href: "/dashboard/logs", labelAr: "السجلات", labelEn: "Logs", icon: FileText },
  { href: "/dashboard/profile", labelAr: "الملف الشخصي", labelEn: "Profile", icon: UserRound },
  { href: "/dashboard/settings", labelAr: "الإعدادات", labelEn: "Settings", icon: Settings },
  { href: "/dashboard/pilot-control", labelAr: "غرفة التحكم التجريبي", labelEn: "Pilot Control", icon: Activity },
  { href: "/dashboard/haidi/lab", labelAr: "مختبر Haidi", labelEn: "Haidi Lab", icon: BookOpenText },
  { href: "/dashboard/haidi/learning", labelAr: "تعلم Haidi", labelEn: "Haidi Learning", icon: Brain },
  { href: "/dashboard/haidi/settings", labelAr: "إعدادات Haidi", labelEn: "Haidi Settings", icon: Settings },
  { href: "/dashboard/security", labelAr: "الأمان", labelEn: "Security", icon: Shield },
  { href: "/dashboard/devices", labelAr: "الأجهزة", labelEn: "Devices", icon: TabletSmartphone },
];

export function Sidebar({
  language,
  onLogout,
  onClose,
}: {
  language: "ar" | "en";
  onLogout?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = getStoredPreference(YOULYA_SIDEBAR_KEY, "");
    return saved === "true" ? false : true;
  });

  useEffect(() => {
    const collapsed = open ? "false" : "true";
    setStoredPreference(YOULYA_SIDEBAR_KEY, collapsed);
    setPreferenceCookie(COOKIE_SIDEBAR, collapsed);
  }, [open]);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
      window.location.href = "/login";
    }
  };

  return (
    <aside
      className={`bg-sidebar-gradient text-white transition-[width] duration-300 rounded-l-3xl flex flex-col h-full ${
        open ? "w-56" : "w-20"
      }`}
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/20 grid place-items-center">
            <YoulyaLogo compact className="h-full w-full object-contain" />
          </div>
          <span className={`${open ? "block" : "hidden"} text-sm font-semibold truncate`}>
            YOULYA
          </span>
        </div>
        <button
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setOpen((v) => !v)}
          className="hidden shrink-0 rounded-lg bg-white/20 p-1.5 hover:bg-white/30 transition lg:inline-flex"
        >
          {open ? <ChevronFirst className="h-5 w-5" /> : <ChevronLast className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-3">
          {navItems.map(({ href, labelAr, labelEn, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
            const label = language === "ar" ? labelAr : labelEn;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => onClose?.()}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                    active ? "bg-white text-brand" : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? "text-brand" : "text-white"}`} />
                  <span className={`${open ? "block" : "sr-only"} text-sm truncate`}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-2 space-y-2">
        {open && (
          <div className="rounded-2xl bg-white/10 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/80" />
              <p className="text-xs leading-5 text-white/90">
                {language === "ar" ? "متجر ذكي مدعوم بالذكاء الاصطناعي" : "AI-Powered Smart Store"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10 ${open ? "" : "justify-center"}`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={open ? "" : "sr-only"}>{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
