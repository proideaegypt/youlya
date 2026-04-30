import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ orders: [] });
}
