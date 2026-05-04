import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { assignHandoff } from "@/lib/services/handoff-service";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await _req.json().catch(() => ({}));
  const assignedTo = typeof body.assignedTo === "string" ? body.assignedTo : "staff";

  const ticket = await assignHandoff(id, assignedTo);
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ success: true, ticket });
}
