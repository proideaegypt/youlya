import { BuildIdentityFooter } from "@/lib/ui/build-identity-footer";
import { YoulyaLogo } from "@/lib/ui/youlya-logo";
import { LoginForm } from "./login-form";
import fs from "node:fs";
import path from "node:path";

export default function LoginPage() {
  const hasBrandAssets =
    fs.existsSync(path.join(process.cwd(), "public", "brand", "youlya-logo-light.jpeg")) &&
    fs.existsSync(path.join(process.cwd(), "public", "brand", "youlya-logo-dark.jpeg"));

  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 ring-1 ring-border shadow-xl">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-brand/15 flex items-center justify-center">
              <YoulyaLogo preferImage={hasBrandAssets} className="h-full w-full object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2 text-balance">تسجيل الدخول</h1>
          <p className="text-sm text-muted-foreground">YOULYA HOME WEAR Dashboard</p>
        </div>
        <LoginForm />
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <BuildIdentityFooter />
      </div>
    </main>
  );
}
