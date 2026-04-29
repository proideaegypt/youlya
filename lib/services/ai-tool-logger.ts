import { getMockState } from "@/lib/adapters/supabase/mock-store";

export type ToolCallLog = {
  store_id: string;
  conversation_id: string;
  tool_name: string;
  input_summary: Record<string, unknown>;
  output_summary: Record<string, unknown>;
  status: "ok" | "error";
  latency_ms: number;
  error_code?: string;
};

function sanitizeSummary(obj: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowered = key.toLowerCase();
    if (lowered.includes("phone") || lowered.includes("address")) continue;
    output[key] = value;
  }
  return output;
}

export async function logToolCall(input: ToolCallLog): Promise<void> {
  setImmediate(() => {
    getMockState().toolLogs.push({
      store_id: input.store_id,
      conversation_id: input.conversation_id,
      tool_name: input.tool_name,
      input_summary: sanitizeSummary(input.input_summary),
      output_summary: input.output_summary,
      status: input.status,
      latency_ms: input.latency_ms,
      error_code: input.error_code ?? null,
      created_at: new Date().toISOString(),
    });
  });
}

