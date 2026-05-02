"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <h1 className="text-balance text-2xl font-semibold text-foreground">الملف الشخصي</h1>
      <p className="mt-2 text-muted-foreground">Store Profile / Operator Profile</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="text-lg">YH</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">YOULYA HOME WEAR</p>
              <p className="text-sm text-muted-foreground">admin@youlya365.com</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <h3 className="mb-3 font-medium text-foreground">Preferences</h3>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">Notifications</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Toggle notifications" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">Dark mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark mode" />
          </div>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <h3 className="mb-3 font-medium text-foreground">Brand Info</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">App</span>
              <span className="font-medium">YOULYA HOME WEAR</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">2.4.1</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
