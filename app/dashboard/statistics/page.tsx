"use client"

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { day: "Sat", orders: 4, conversations: 12 },
  { day: "Sun", orders: 6, conversations: 18 },
  { day: "Mon", orders: 8, conversations: 22 },
  { day: "Tue", orders: 5, conversations: 15 },
  { day: "Wed", orders: 7, conversations: 20 },
  { day: "Thu", orders: 9, conversations: 25 },
  { day: "Fri", orders: 3, conversations: 10 },
]

export default function StatisticsPage() {
  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <h1 className="text-balance text-2xl font-semibold text-foreground">الإحصائيات</h1>
      <p className="mt-2 text-muted-foreground">Sales & Conversation Analytics</p>

      <div className="mt-6 h-80 w-full rounded-xl bg-background p-4 ring-1 ring-border">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={18}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Bar dataKey="orders" fill="var(--brand)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="conversations" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
