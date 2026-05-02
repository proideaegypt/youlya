"use client"

import { Lock, Shield, Bell, Zap, Eye } from "lucide-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function SecurityPage() {
  const [aiSafety, setAiSafety] = useState(true)
  const [killSwitch, setKillSwitch] = useState(false)
  const [duplicateGuard, setDuplicateGuard] = useState(true)

  const events = [
    { id: 1, time: "08:32", text: "Order confirmation guard passed" },
    { id: 2, time: "07:15", text: "Duplicate webhook blocked" },
    { id: 3, time: "Yesterday", text: "Kill switch toggled by admin" },
  ]

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <h1 className="text-balance text-2xl font-semibold text-foreground">الأمان</h1>
      <p className="mt-2 text-muted-foreground">AI Safety / Kill Switch / Risk</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <h3 className="font-medium text-foreground">AI Safety</h3>
            </div>
            <Switch checked={aiSafety} onCheckedChange={setAiSafety} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {aiSafety ? "AI safety guards are active." : "AI safety guards disabled."}
          </p>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-amber-500" />
              <h3 className="font-medium text-foreground">Kill Switch</h3>
            </div>
            <Switch checked={killSwitch} onCheckedChange={setKillSwitch} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {killSwitch ? "Kill switch is ON. All AI paused." : "Kill switch is OFF. Normal operation."}
          </p>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="size-5 text-primary" />
              <h3 className="font-medium text-foreground">Duplicate Guard</h3>
            </div>
            <Switch checked={duplicateGuard} onCheckedChange={setDuplicateGuard} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {duplicateGuard ? "Duplicate order protection active." : "Duplicate protection disabled."}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-background p-4 ring-1 ring-border">
        <h3 className="mb-3 font-medium text-foreground">Recent activity</h3>
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{e.text}</span>
              <span className="text-muted-foreground">{e.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
