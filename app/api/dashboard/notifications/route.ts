import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUnreadHandoffNotificationCount, listRecentHandoffNotifications } from "@/lib/services/handoff-notification-service";

async function hasSession() {
  const cookieStore = await cookies();
  return cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
}

export async function GET() {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const unreadCount = await getUnreadHandoffNotificationCount("youlya");
  const notifications = await listRecentHandoffNotifications("youlya", 8);

  return NextResponse.json({
    unreadCount,
    handoffQueueCount: notifications.filter((notification) => notification.status === "unread").length,
    notifications,
  });
}
