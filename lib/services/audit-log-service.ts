import { getMockState } from "@/lib/adapters/supabase/mock-store";
import type { AuditLog } from "@/lib/types/commerce";

export function writeAuditLog(entry: AuditLog) {
  getMockState().auditLogs.push({ ...entry, createdAt: new Date().toISOString() });
}

