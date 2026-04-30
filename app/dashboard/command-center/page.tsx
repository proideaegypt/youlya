import { cookies } from "next/headers";

type Stats = {
  activeConversations: number;
  aiActiveConversations: number;
  needsHuman: number;
  pendingConfirmations: number;
  ordersCreatedToday: number;
  failedOrderAttempts: number;
  duplicateWebhooksBlocked: number;
  killSwitchStatus: "ON" | "OFF";
};

async function loadStats(): Promise<Stats> {
  const cookieHeader = (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const res = await fetch(`${process.env.APP_URL ?? "http://127.0.0.1:3000"}/api/dashboard/stats`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) {
    return {
      activeConversations: 0,
      aiActiveConversations: 0,
      needsHuman: 0,
      pendingConfirmations: 0,
      ordersCreatedToday: 0,
      failedOrderAttempts: 0,
      duplicateWebhooksBlocked: 0,
      killSwitchStatus: "OFF",
    };
  }
  return res.json();
}

export default async function CommandCenterPage() {
  const stats = await loadStats();
  const cards = [
    ["Active conversations", stats.activeConversations],
    ["AI active conversations", stats.aiActiveConversations],
    ["Needs human", stats.needsHuman],
    ["Pending confirmations", stats.pendingConfirmations],
    ["Orders created today", stats.ordersCreatedToday],
    ["Failed order attempts", stats.failedOrderAttempts],
    ["Duplicate webhooks blocked", stats.duplicateWebhooksBlocked],
    ["Kill switch", stats.killSwitchStatus],
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">مركز التحكم</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-xs text-zinc-400">{String(label)}</div>
            <div className="text-xl font-semibold">{String(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
