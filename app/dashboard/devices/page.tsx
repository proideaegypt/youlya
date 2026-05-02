"use client"

import type React from "react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { MessageCircle, ShoppingBag, Cpu, Workflow, Database, Brain } from "lucide-react"

type Integration = {
  id: number
  name: string
  channel: string
  icon: React.ComponentType<{ className?: string }>
  on: boolean
}

const initial: Integration[] = [
  { id: 1, name: "WhatsApp", channel: "Evolution API", icon: MessageCircle, on: true },
  { id: 2, name: "Shopify", channel: "Store sync", icon: ShoppingBag, on: true },
  { id: 3, name: "n8n", channel: "Workflow engine", icon: Workflow, on: true },
  { id: 4, name: "Supabase", channel: "Database", icon: Database, on: true },
  { id: 5, name: "OpenAI", channel: "AI engine", icon: Brain, on: true },
  { id: 6, name: "Evolution", channel: "WhatsApp gateway", icon: Cpu, on: true },
]

export default function DevicesPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(initial)

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <h1 className="text-balance text-2xl font-semibold text-foreground">القنوات والمنتجات</h1>
      <p className="mt-2 text-muted-foreground">Integrations / Channels / Products</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((d) => (
          <div key={d.id} className="rounded-xl bg-background p-4 ring-1 ring-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <d.icon className={`size-5 ${d.on ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.channel}</p>
                </div>
              </div>
              <Switch
                checked={d.on}
                onCheckedChange={(v) => setIntegrations((prev) => prev.map((x) => (x.id === d.id ? { ...x, on: v } : x)))}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
