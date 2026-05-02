import { AiToggleCard } from "@/app/dashboard/toggle-card";
import { Settings, Shield, Link2, Paintbrush, Info } from "lucide-react";

const integrations = [
  { name: "Supabase", status: "Connected", tone: "success" as const },
  { name: "Evolution", status: "Connected", tone: "success" as const },
  { name: "Shopify", status: "Connected", tone: "success" as const },
  { name: "n8n", status: "Check workflow", tone: "warning" as const },
  { name: "OpenAI", status: "Configured", tone: "success" as const },
];

const toneClasses = {
  success: "bg-emerald-500/15 text-emerald-500",
  warning: "bg-amber-500/15 text-amber-500",
  error: "bg-red-500/15 text-red-400",
};

export default function SettingsPage() {
  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <div className="mb-6">
        <h1 className="text-balance text-2xl font-semibold text-foreground">الإعدادات</h1>
        <p className="mt-2 text-muted-foreground">Settings</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* AI Controls */}
        <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">AI Controls</h2>
          </div>
          <AiToggleCard initialEnabled />
        </div>

        {/* Kill Switch */}
        <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-foreground">Kill Switch</h2>
          </div>
          <p className="text-sm text-muted-foreground">Use with caution. Production safety guard remains active.</p>
          <div className="mt-3 inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-500">
            Guarded control
          </div>
        </div>
      </div>

      {/* Integration Health */}
      <div className="mt-6 rounded-2xl bg-background p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Integration Health</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item) => (
            <div key={item.name} className="rounded-xl border border-border p-3">
              <p className="mb-2 text-sm font-semibold">{item.name}</p>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[item.tone]}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 rounded-2xl bg-background p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">System Status</h2>
        </div>
        <div className="space-y-3">
          {[
            { title: "AI Engine", desc: "Operational and processing requests", status: "Running" },
            { title: "Shopify Sync", desc: "Product and inventory synchronization active", status: "Last sync: 5 min ago" },
            { title: "WhatsApp Bridge", desc: "Evolution API connected and healthy", status: "Connected" },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand & Theme */}
      <div className="mt-6 rounded-2xl bg-background p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Brand & Theme</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-semibold">Primary Brand Color</p>
              <p className="text-xs text-muted-foreground">Blush Pink #EFB6C1</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#EFB6C1] ring-2 ring-border" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-semibold">Dark Charcoal</p>
              <p className="text-xs text-muted-foreground">Text Color #2B2525</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-[#2B2525] ring-2 ring-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
