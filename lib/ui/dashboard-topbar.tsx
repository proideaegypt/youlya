"use client";

import { Bell, Search, Settings, User, Menu } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/lib/ui/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColorThemePicker } from "@/lib/ui/color-theme";

interface TopbarProps {
  onMenuClick?: () => void;
  aiEnabled?: boolean;
  language: "ar" | "en";
  onLanguageChange: (lang: "ar" | "en") => void;
}

export function Topbar({ onMenuClick, language, onLanguageChange }: TopbarProps) {
  const [q, setQ] = useState("");

  return (
    <header className="lg:-mx-7 sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border mb-6 rounded-xl lg:rounded-none">
      <div className="h-16 px-4 md:px-7 flex items-center justify-between gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <label className="relative block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="size-4" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={language === "ar" ? "بحث في الطلبات والمحادثات..." : "Search orders, conversations..."}
              className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-sm"
              aria-label="Search"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2" aria-label="Open notifications">
              <Bell className="size-5" aria-hidden />
              <span className="sr-only">Open notifications</span>
              <span className="absolute right-1 top-1 inline-flex items-center justify-center text-[10px] bg-red-500 text-white rounded-full h-4 min-w-4 px-1">
                3
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>{language === "ar" ? "الإشعارات" : "Notifications"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{language === "ar" ? "طلب جديد #Y-1025" : "New order #Y-1025"}</DropdownMenuItem>
              <DropdownMenuItem>{language === "ar" ? "محادثة واتساب جديدة" : "New WhatsApp conversation"}</DropdownMenuItem>
              <DropdownMenuItem>{language === "ar" ? "تذكير: تأكيد طلب معلق" : "Reminder: pending confirmation"}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground">{language === "ar" ? "عرض الكل" : "View all"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2" aria-label="Open settings">
              <Settings className="size-5" aria-hidden />
              <span className="sr-only">Open settings</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{language === "ar" ? "الإعدادات" : "Settings"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button className="w-full text-left" onClick={() => onLanguageChange(language === "ar" ? "en" : "ar")}>
                  {language === "ar" ? "English" : "العربية"}
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <ThemeToggle />
              </div>
              <div className="px-2 pb-2">
                <ColorThemePicker />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-muted focus:outline-none focus:ring-2" aria-label="Open user menu">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs font-semibold">YH</AvatarFallback>
              </Avatar>
              <span className="sr-only">Open user menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <User className="size-4" />
                {language === "ar" ? "مسجل الدخول كـ مدير" : "Signed in as Admin"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/profile">{language === "ar" ? "الملف الشخصي" : "Profile"}</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings">{language === "ar" ? "الإعدادات" : "Settings"}</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
