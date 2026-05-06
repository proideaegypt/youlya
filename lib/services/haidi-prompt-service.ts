import fs from "node:fs";
import path from "node:path";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { updateHaidiSettings } from "@/lib/services/haidi-settings-service";

export type HaidiPromptSource = "repo" | "db";

export type HaidiPromptState = {
  storeId: string;
  currentPrompt: string;
  currentVersion: string;
  source: HaidiPromptSource;
  updatedAt: string;
  safetyRulesSummary: string[];
  repoDefaultPrompt: string;
  repoDefaultVersion: string;
  repoDefaultUpdatedAt: string;
  draftPrompt: string | null;
  draftVersion: string | null;
  draftUpdatedAt: string | null;
  draftUpdatedBy: string | null;
  publishedPrompt: string | null;
  publishedVersion: string | null;
  publishedUpdatedAt: string | null;
  publishedUpdatedBy: string | null;
  previousPublishedPrompt: string | null;
  previousPublishedVersion: string | null;
  previousPublishedUpdatedAt: string | null;
  previousPublishedUpdatedBy: string | null;
  lastTestRunId: string | null;
  lastTestScore: number | null;
  lastTestedAt: string | null;
  canPublish: boolean;
};

type PromptRow = Record<string, unknown>;

type CachedPrompt = {
  value: HaidiPromptState;
  expiresAt: number;
};

const CACHE_TTL_MS = 30_000;
const cache = new Map<string, CachedPrompt>();
const DEFAULT_VERSION = "docs/HAIDI_AI_SALES_AGENT_PROMPT.md@v1.0";
const REPO_PROMPT_PATH = path.join(process.cwd(), "docs/HAIDI_AI_SALES_AGENT_PROMPT.md");

function defaultSafetyRulesSummary(): string[] {
  return [
    "App safety gate decides products, variants, stock, prices, cart, confirmation, and orders.",
    "Haidi only changes tone and recommendation language using app-approved facts.",
    "Never invent product data or confirm/create orders.",
    "Never bypass missing confirmation, address, phone, or city.",
    "Use repo prompt as fallback and dashboard-published prompt as override only after tests pass.",
  ];
}

function extractSystemPrompt(markdown: string): string {
  const match = markdown.match(/## System Prompt\s*```text\s*([\s\S]*?)\s*```/i);
  if (match?.[1]) return match[1].trim();
  const fallbackMatch = markdown.match(/```text\s*([\s\S]*?)\s*```/i);
  if (fallbackMatch?.[1]) return fallbackMatch[1].trim();
  return markdown.trim();
}

function readRepoPrompt() {
  const raw = fs.readFileSync(REPO_PROMPT_PATH, "utf8");
  const stat = fs.statSync(REPO_PROMPT_PATH);
  return {
    prompt: extractSystemPrompt(raw),
    version: DEFAULT_VERSION,
    updatedAt: stat.mtime.toISOString(),
  };
}

function rowToState(row: PromptRow | null | undefined, storeId = "youlya"): HaidiPromptState {
  const repo = readRepoPrompt();
  const draftPrompt = typeof row?.draft_prompt === "string" && row.draft_prompt.trim() ? String(row.draft_prompt) : null;
  const draftVersion = typeof row?.draft_version === "string" && row.draft_version.trim() ? String(row.draft_version) : null;
  const publishedPrompt = typeof row?.published_prompt === "string" && row.published_prompt.trim() ? String(row.published_prompt) : null;
  const publishedVersion = typeof row?.published_version === "string" && row.published_version.trim() ? String(row.published_version) : null;
  const previousPublishedPrompt = typeof row?.previous_published_prompt === "string" && row.previous_published_prompt.trim() ? String(row.previous_published_prompt) : null;
  const previousPublishedVersion = typeof row?.previous_published_version === "string" && row.previous_published_version.trim() ? String(row.previous_published_version) : null;
  const lastTestRunId = typeof row?.last_test_run_id === "string" && row.last_test_run_id.trim() ? String(row.last_test_run_id) : null;
  const lastTestScore = typeof row?.last_test_score === "number" ? row.last_test_score : row?.last_test_score != null ? Number(row.last_test_score) : null;
  const source = row?.source === "db" && publishedPrompt ? "db" : "repo";
  const currentPrompt = source === "db" && publishedPrompt ? publishedPrompt : repo.prompt;
  const currentVersion = source === "db" && publishedVersion ? publishedVersion : repo.version;
  const updatedAt = String(row?.updated_at ?? row?.published_updated_at ?? repo.updatedAt);

  return {
    storeId,
    currentPrompt,
    currentVersion,
    source,
    updatedAt,
    safetyRulesSummary: defaultSafetyRulesSummary(),
    repoDefaultPrompt: repo.prompt,
    repoDefaultVersion: repo.version,
    repoDefaultUpdatedAt: repo.updatedAt,
    draftPrompt,
    draftVersion,
    draftUpdatedAt: row?.draft_updated_at ? String(row.draft_updated_at) : null,
    draftUpdatedBy: row?.draft_updated_by ? String(row.draft_updated_by) : null,
    publishedPrompt,
    publishedVersion,
    publishedUpdatedAt: row?.published_updated_at ? String(row.published_updated_at) : null,
    publishedUpdatedBy: row?.published_updated_by ? String(row.published_updated_by) : null,
    previousPublishedPrompt,
    previousPublishedVersion,
    previousPublishedUpdatedAt: row?.previous_published_updated_at ? String(row.previous_published_updated_at) : null,
    previousPublishedUpdatedBy: row?.previous_published_updated_by ? String(row.previous_published_updated_by) : null,
    lastTestRunId,
    lastTestScore,
    lastTestedAt: row?.last_tested_at ? String(row.last_tested_at) : null,
    canPublish: Boolean(lastTestScore != null && Number.isFinite(lastTestScore) && Number(lastTestScore) >= 90),
  };
}

function settingsPromptVersionFromState(state: HaidiPromptState) {
  return state.currentVersion || state.repoDefaultVersion;
}

function cachePrompt(state: HaidiPromptState) {
  cache.set(state.storeId, { value: state, expiresAt: Date.now() + CACHE_TTL_MS });
  return state;
}

async function syncPromptVersionSetting(storeId: string, version: string, updatedBy: string) {
  try {
    await updateHaidiSettings(storeId, { promptVersion: version, updatedBy }, updatedBy);
  } catch (error) {
    console.error("haidi prompt version sync error", error);
  }
}

function normalizePromptVersion(baseVersion: string, suffix: string) {
  return `${baseVersion}-${suffix}-${Date.now()}`;
}

function getMockRow(storeId: string): PromptRow | null {
  return getMockState().haidiPromptByStore?.get(storeId) ?? null;
}

function ensureMockMap() {
  const state = getMockState();
  if (!state.haidiPromptByStore) {
    (state as Record<string, unknown>).haidiPromptByStore = new Map<string, PromptRow>();
  }
  return state.haidiPromptByStore as Map<string, PromptRow>;
}

async function readDbRow(storeId: string): Promise<PromptRow | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getMockRow(storeId);

  const { data, error } = await supabase.from("haidi_prompt_state").select("*").eq("store_id", storeId).maybeSingle();
  if (error) {
    console.error("haidi_prompt_state read error", error);
    return null;
  }
  return data ?? null;
}

async function writeDbRow(storeId: string, patch: Record<string, unknown>): Promise<PromptRow | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const map = ensureMockMap();
    const existing = map.get(storeId) ?? {};
    const next = { ...existing, ...patch, store_id: storeId, updated_at: new Date().toISOString() };
    map.set(storeId, next);
    return next;
  }

  const { data, error } = await supabase
    .from("haidi_prompt_state")
    .upsert({ store_id: storeId, ...patch, updated_at: new Date().toISOString() })
    .select("*")
    .maybeSingle();
  if (error) {
    console.error("haidi_prompt_state write error", error);
    return null;
  }
  return data ?? null;
}

export async function getHaidiPrompt(storeId = "youlya"): Promise<HaidiPromptState> {
  const hit = cache.get(storeId);
  if (hit && hit.expiresAt > Date.now()) return hit.value;

  const row = await readDbRow(storeId);
  const state = rowToState(row, storeId);
  return cachePrompt(state);
}

export async function saveHaidiPromptDraft(input: {
  storeId?: string;
  promptText: string;
  promptVersion?: string;
  updatedBy: string;
}): Promise<HaidiPromptState> {
  const storeId = input.storeId ?? "youlya";
  const current = await getHaidiPrompt(storeId);
  const draftVersion = input.promptVersion?.trim() || normalizePromptVersion(current.currentVersion || current.repoDefaultVersion, "draft");
  const row = await writeDbRow(storeId, {
    draft_prompt: input.promptText,
    draft_version: draftVersion,
    draft_updated_at: new Date().toISOString(),
    draft_updated_by: input.updatedBy,
    source: current.source,
  });

  const next = rowToState(row ?? { ...current, draft_prompt: input.promptText, draft_version: draftVersion, draft_updated_at: new Date().toISOString(), draft_updated_by: input.updatedBy }, storeId);
  cachePrompt(next);
  return next;
}

export async function publishHaidiPrompt(input: {
  storeId?: string;
  updatedBy: string;
  requirePassingLabRun?: boolean;
}): Promise<{ ok: boolean; error?: string; prompt?: HaidiPromptState }> {
  const storeId = input.storeId ?? "youlya";
  const current = await getHaidiPrompt(storeId);

  if (input.requirePassingLabRun) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("haidi_lab_runs")
        .select("id, score, created_at")
        .eq("store_id", storeId)
        .gte("score", 90)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("haidi prompt publish test check error", error);
      }
      if (!data) {
        return { ok: false, error: "publish_requires_passing_lab_run" };
      }
    } else {
      const state = getMockState();
      const hasPassingRun = state.haidiLabRuns.some((run) => run.store_id === storeId && Number(run.score) >= 90);
      if (!hasPassingRun) {
        return { ok: false, error: "publish_requires_passing_lab_run" };
      }
    }
  }

  const promptText = current.draftPrompt?.trim() || current.currentPrompt.trim();
  const promptVersion = current.draftVersion?.trim() || normalizePromptVersion(current.currentVersion || current.repoDefaultVersion, "published");

  const row = await writeDbRow(storeId, {
    previous_published_prompt: current.publishedPrompt ?? current.currentPrompt,
    previous_published_version: current.publishedVersion ?? current.currentVersion,
    previous_published_updated_at: current.publishedUpdatedAt ?? current.updatedAt,
    previous_published_updated_by: current.publishedUpdatedBy ?? current.draftUpdatedBy ?? current.publishedUpdatedBy ?? input.updatedBy,
    published_prompt: promptText,
    published_version: promptVersion,
    published_updated_at: new Date().toISOString(),
    published_updated_by: input.updatedBy,
    source: "db",
    last_test_run_id: current.lastTestRunId,
    last_test_score: current.lastTestScore,
    last_tested_at: current.lastTestedAt,
  });

  if (!row) return { ok: false, error: "prompt_publish_failed" };

  const next = cachePrompt(rowToState(row, storeId));
  await syncPromptVersionSetting(storeId, settingsPromptVersionFromState(next), input.updatedBy);
  return { ok: true, prompt: next };
}

export async function rollbackHaidiPrompt(input: {
  storeId?: string;
  updatedBy: string;
}): Promise<{ ok: boolean; error?: string; prompt?: HaidiPromptState }> {
  const storeId = input.storeId ?? "youlya";
  const current = await getHaidiPrompt(storeId);
  const previousPrompt = current.previousPublishedPrompt?.trim();
  const previousVersion = current.previousPublishedVersion?.trim();

  if (!previousPrompt || !previousVersion) {
    return { ok: false, error: "no_previous_version" };
  }

  const row = await writeDbRow(storeId, {
    draft_prompt: current.currentPrompt,
    draft_version: current.currentVersion,
    draft_updated_at: new Date().toISOString(),
    draft_updated_by: input.updatedBy,
    published_prompt: previousPrompt,
    published_version: previousVersion,
    published_updated_at: current.previousPublishedUpdatedAt ?? new Date().toISOString(),
    published_updated_by: current.previousPublishedUpdatedBy ?? input.updatedBy,
    previous_published_prompt: current.currentPrompt,
    previous_published_version: current.currentVersion,
    previous_published_updated_at: current.updatedAt,
    previous_published_updated_by: input.updatedBy,
    source: "db",
  });

  if (!row) return { ok: false, error: "prompt_rollback_failed" };
  const next = cachePrompt(rowToState(row, storeId));
  await syncPromptVersionSetting(storeId, settingsPromptVersionFromState(next), input.updatedBy);
  return { ok: true, prompt: next };
}

export async function recordHaidiPromptTestResult(input: {
  storeId?: string;
  runId: string;
  score: number;
  updatedBy: string;
}): Promise<HaidiPromptState> {
  const storeId = input.storeId ?? "youlya";
  void input.updatedBy;
  const row = await writeDbRow(storeId, {
    last_test_run_id: input.runId,
    last_test_score: input.score,
    last_tested_at: new Date().toISOString(),
  });
  const next = cachePrompt(rowToState(row ?? null, storeId));
  return next;
}

export async function getHaidiPromptSummary(storeId = "youlya") {
  const prompt = await getHaidiPrompt(storeId);
  return {
    currentPrompt: prompt.currentPrompt,
    promptVersion: prompt.currentVersion,
    source: prompt.source,
    updatedAt: prompt.updatedAt,
    safetyRulesSummary: prompt.safetyRulesSummary,
    draftPrompt: prompt.draftPrompt,
    draftVersion: prompt.draftVersion,
    publishedPrompt: prompt.publishedPrompt,
    publishedVersion: prompt.publishedVersion,
    previousPublishedPrompt: prompt.previousPublishedPrompt,
    previousPublishedVersion: prompt.previousPublishedVersion,
    repoDefaultVersion: prompt.repoDefaultVersion,
    canPublish: prompt.canPublish,
    lastTestScore: prompt.lastTestScore,
    lastTestRunId: prompt.lastTestRunId,
  };
}

export function getRepoHaidiPromptForFallback() {
  return readRepoPrompt();
}
