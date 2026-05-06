import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isAiEnabled } from "@/lib/services/ai-settings-service";
import { DashboardShell } from "@/lib/ui/dashboard-shell";
import { TestModeBanner } from "@/components/dashboard/test-mode-banner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) redirect("/login");

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only in Server Components. Middleware handles refresh writes.
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const aiEnabled = await isAiEnabled("youlya");

  return (
    <>
      <TestModeBanner />
      <DashboardShell aiEnabled={aiEnabled}>{children}</DashboardShell>
    </>
  );
}
