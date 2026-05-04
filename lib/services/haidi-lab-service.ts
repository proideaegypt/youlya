import { randomUUID } from "node:crypto";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { runMessageTurn } from "@/lib/services/message-turn-service";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type HaidiScenarioInput = {
  storeId: string;
  title: string;
  inputText: string;
  expectedIntent?: string | null;
  expectedTone?: string | null;
  mustInclude?: string[];
  mustNotInclude?: string[];
  createdBy?: string;
};

function maskForSafety(reply: string): string {
  return reply
    .replace(/https?:\/\/\S+/gi, "[link]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(/(?:\+?\d[\d\s().-]{5,}\d)/g, "[phone]");
}

function detectTone(text: string): string {
  const t = text.toLowerCase();
  if (/(sorry|آسف|متفهم|معلش)/i.test(t)) return "empathetic";
  if (/(أكيد|تمام|great|awesome|ممتاز)/i.test(t)) return "friendly";
  return "neutral";
}

function scoreRun(input: {
  expectedIntent?: string | null;
  expectedTone?: string | null;
  mustInclude: string[];
  mustNotInclude: string[];
  actualIntent: string;
  actualReply: string;
  actualTone: string;
}) {
  const mismatches: string[] = [];
  let score = 100;
  if (input.expectedIntent && input.expectedIntent !== input.actualIntent) {
    mismatches.push(`intent:${input.expectedIntent}->${input.actualIntent}`);
    score -= 35;
  }
  if (input.expectedTone && input.expectedTone !== input.actualTone) {
    mismatches.push(`tone:${input.expectedTone}->${input.actualTone}`);
    score -= 20;
  }
  for (const fragment of input.mustInclude) {
    if (!input.actualReply.includes(fragment)) {
      mismatches.push(`missing:${fragment}`);
      score -= 10;
    }
  }
  for (const fragment of input.mustNotInclude) {
    if (input.actualReply.includes(fragment)) {
      mismatches.push(`forbidden:${fragment}`);
      score -= 15;
    }
  }
  return { score: Math.max(0, score), mismatches };
}

export async function listHaidiScenarios(storeId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return getMockState().haidiLabScenarios.filter((s) => s.store_id === storeId);
  }
  const { data } = await supabase.from("haidi_lab_scenarios").select("*").eq("store_id", storeId).order("created_at", { ascending: false });
  return data ?? [];
}

export async function createHaidiScenario(input: HaidiScenarioInput) {
  const supabase = getSupabaseServerClient();
  const payload = {
    store_id: input.storeId,
    title: input.title,
    input_text: input.inputText,
    expected_intent: input.expectedIntent ?? null,
    expected_tone: input.expectedTone ?? null,
    must_include: input.mustInclude ?? [],
    must_not_include: input.mustNotInclude ?? [],
    created_by: input.createdBy ?? "dashboard_user",
    updated_at: new Date().toISOString(),
  };
  if (!supabase) {
    const row = { id: randomUUID(), ...payload, created_at: new Date().toISOString() };
    getMockState().haidiLabScenarios.unshift(row);
    return row;
  }
  const { data } = await supabase.from("haidi_lab_scenarios").insert(payload).select("*").single();
  return data;
}

export async function updateHaidiScenario(id: string, input: HaidiScenarioInput) {
  const supabase = getSupabaseServerClient();
  const patch = {
    title: input.title,
    input_text: input.inputText,
    expected_intent: input.expectedIntent ?? null,
    expected_tone: input.expectedTone ?? null,
    must_include: input.mustInclude ?? [],
    must_not_include: input.mustNotInclude ?? [],
    updated_at: new Date().toISOString(),
  };
  if (!supabase) {
    const idx = getMockState().haidiLabScenarios.findIndex((s) => s.id === id && s.store_id === input.storeId);
    if (idx < 0) return null;
    getMockState().haidiLabScenarios[idx] = { ...getMockState().haidiLabScenarios[idx], ...patch };
    return getMockState().haidiLabScenarios[idx];
  }
  const { data } = await supabase.from("haidi_lab_scenarios").update(patch).eq("id", id).eq("store_id", input.storeId).select("*").maybeSingle();
  return data;
}

export async function deleteHaidiScenario(id: string, storeId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const idx = getMockState().haidiLabScenarios.findIndex((s) => s.id === id && s.store_id === storeId);
    if (idx >= 0) getMockState().haidiLabScenarios.splice(idx, 1);
    return;
  }
  await supabase.from("haidi_lab_scenarios").delete().eq("id", id).eq("store_id", storeId);
}

export async function runHaidiScenario(input: { scenarioId: string; storeId: string; runBy?: string }) {
  const scenarios = await listHaidiScenarios(input.storeId);
  const scenario = scenarios.find((row) => String((row as { id: string }).id) === input.scenarioId) as Record<string, unknown> | undefined;
  if (!scenario) return { ok: false as const, error: "scenario_not_found" };

  const text = String(scenario.input_text ?? "");
  const turn = await runMessageTurn({
    storeSlug: input.storeId,
    channel: "whatsapp_evolution",
    locale: "ar-EG",
    messageType: "text",
    text,
    testMode: true,
  });

  const actualReply = maskForSafety(String(turn.reply ?? ""));
  const actualTone = detectTone(actualReply);
  const scoring = scoreRun({
    expectedIntent: scenario.expected_intent ? String(scenario.expected_intent) : null,
    expectedTone: scenario.expected_tone ? String(scenario.expected_tone) : null,
    mustInclude: Array.isArray(scenario.must_include) ? scenario.must_include.map(String) : [],
    mustNotInclude: Array.isArray(scenario.must_not_include) ? scenario.must_not_include.map(String) : [],
    actualIntent: String(turn.intent ?? "unknown"),
    actualReply,
    actualTone,
  });

  const run = {
    id: randomUUID(),
    store_id: input.storeId,
    scenario_id: input.scenarioId,
    actual_intent: String(turn.intent ?? "unknown"),
    actual_reply: actualReply,
    score: scoring.score,
    mismatches: scoring.mismatches,
    run_by: input.runBy ?? "dashboard_user",
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    getMockState().haidiLabRuns.unshift(run);
  } else {
    await supabase.from("haidi_lab_runs").insert(run);
  }

  return { ok: true as const, run };
}

export async function createLearningSuggestionFromRun(input: {
  storeId: string;
  runId: string;
  title: string;
  suggestionText: string;
  createdBy?: string;
}) {
  const now = new Date().toISOString();
  const payload = {
    id: randomUUID(),
    store_id: input.storeId,
    title: input.title,
    suggestion_text: input.suggestionText,
    source_type: "haidi_lab",
    source_ref: `haidi_run:${input.runId}`,
    status: "pending",
    created_by: input.createdBy ?? "dashboard_user",
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    getMockState().knowledgeSuggestions.unshift(payload);
    return payload;
  }
  const { data } = await supabase.from("knowledge_suggestions").insert(payload).select("*").single();
  return data;
}
