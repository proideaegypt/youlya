import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ui/theme-provider";

export const metadata: Metadata = {
  title: "Youlya Dashboard",
  description: "Youlya AI Commerce OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
