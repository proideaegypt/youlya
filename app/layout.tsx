import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ui/theme-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "YOULYA HOME WEAR Dashboard",
  description: "YOULYA HOME WEAR admin dashboard",
};

const PREF_SCRIPT = `
(function() {
  try {
    // Migrate old keys to new keys
    var oldTheme = localStorage.getItem('youlya-theme');
    if (oldTheme && !localStorage.getItem('youlya.theme')) {
      localStorage.setItem('youlya.theme', oldTheme);
    }
    var oldColor = localStorage.getItem('youlya-brand');
    if (oldColor && !localStorage.getItem('youlya.colorTheme')) {
      localStorage.setItem('youlya.colorTheme', oldColor);
    }
    var oldLang = localStorage.getItem('youlya_lang');
    if (oldLang && !localStorage.getItem('youlya.language')) {
      localStorage.setItem('youlya.language', oldLang);
    }
    var oldSidebar = localStorage.getItem('youlya-sidebar-open');
    if (oldSidebar !== null && localStorage.getItem('youlya.sidebarCollapsed') === null) {
      localStorage.setItem('youlya.sidebarCollapsed', oldSidebar === '1' ? 'false' : 'true');
    }

    // Apply color theme before paint
    var color = localStorage.getItem('youlya.colorTheme');
    if (color && ['pink','purple','blue','teal','orange','rose'].includes(color)) {
      document.documentElement.setAttribute('data-brand', color);
    }

    // Apply language direction before paint
    var lang = localStorage.getItem('youlya.language');
    if (lang === 'ar' || lang === 'en') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`h-full antialiased ${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREF_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
