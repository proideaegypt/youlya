import { getMockState } from "@/lib/adapters/supabase/mock-store";
import type { ToolCallLog } from "@/lib/types/commerce";

export function writeToolLog(log: ToolCallLog) {
  getMockState().toolLogs.push({ ...log, createdAt: new Date().toISOString() });
}

