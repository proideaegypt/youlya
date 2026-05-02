"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/lib/ui/dashboard-sidebar";
import { Topbar } from "@/lib/ui/dashboard-topbar";
import { BuildIdentityFooter } from "@/lib/ui/build-identity-footer";

export function DashboardShell({
  children,
  aiEnabled,
}: {
  children: React.ReactNode;
  aiEnabled: boolean;
  hasBrandAssets?: boolean;
}) {
  const [language, setLanguage] = useState<"ar" | "en">(() => {
    if (typeof window === "undefined") return "ar";
    const saved = window.localStorage.getItem("youlya_lang");
    return saved === "en" ? "en" : "ar";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("youlya_lang", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language === "ar" ? "ar" : "en";
  }, [language]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-2 py-3 sm:px-4 sm:py-6">
        <div className="rounded-3xl bg-card shadow-sm ring-1 ring-border overflow-hidden">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex h-[95vh]">
            <div
              className={`
                fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              `}
            >
              <Sidebar
                language={language}
                onLogout={handleLogout}
                onClose={() => setSidebarOpen(false)}
              />
            </div>

            <main className="flex-1 w-full lg:w-auto rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none bg-muted p-3 sm:p-5 md:px-7 md:py-7 xl:pb-7 xl:pt-0 overflow-auto">
              <Topbar
                onMenuClick={() => setSidebarOpen(true)}
                aiEnabled={aiEnabled}
                language={language}
                onLanguageChange={setLanguage}
              />
              <div className="animate-enter">
                {children}
              </div>
              <div className="mt-8 pt-4 border-t border-border">
                <BuildIdentityFooter />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
