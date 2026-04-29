import { NextResponse } from "next/server";
import { internalMessageTurnSchema, messageTurnSchema } from "@/lib/validation/schemas";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { requireInternalAuth } from "@/lib/middleware/internal-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const internalParsed = internalMessageTurnSchema.safeParse(body);
  const parsed = internalParsed.success ? internalParsed : messageTurnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const auth = requireInternalAuth(req);
  if ("error" in auth && !parsed.data.testMode) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runMessageTurn(parsed.data);
  return NextResponse.json(result);
}
