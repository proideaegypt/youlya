import { beforeEach, describe, expect, it } from "vitest";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import {
  getHaidiPrompt,
  publishHaidiPrompt,
  rollbackHaidiPrompt,
  saveHaidiPromptDraft,
} from "@/lib/services/haidi-prompt-service";

describe("haidi-prompt-service", () => {
  beforeEach(() => {
    const state = getMockState();
    state.haidiPromptByStore.clear();
    state.haidiLabRuns.length = 0;
  });

  it("returns the repo prompt by default", async () => {
    const prompt = await getHaidiPrompt("youlya");
    expect(prompt.source).toBe("repo");
    expect(prompt.currentPrompt).toContain("Haidi");
    expect(prompt.currentVersion).toContain("docs/HAIDI_AI_SALES_AGENT_PROMPT.md");
    expect(prompt.safetyRulesSummary.length).toBeGreaterThan(0);
  });

  it("saves a draft without publishing", async () => {
    const draft = await saveHaidiPromptDraft({
      storeId: "youlya",
      promptText: "Draft prompt text",
      updatedBy: "test",
    });
    expect(draft.draftPrompt).toBe("Draft prompt text");
    expect(draft.source).toBe("repo");
    const current = await getHaidiPrompt("youlya");
    expect(current.currentPrompt).not.toBe("Draft prompt text");
    expect(current.draftPrompt).toBe("Draft prompt text");
  });

  it("publishes only after a passing lab run exists", async () => {
    const state = getMockState();
    state.haidiLabRuns.push({
      id: "run-1",
      store_id: "youlya",
      scenario_id: "scenario-1",
      actual_intent: "PRODUCT_SEARCH",
      actual_reply: "ok",
      score: 95,
      mismatches: [],
      run_by: "test",
      created_at: new Date().toISOString(),
    });

    await saveHaidiPromptDraft({
      storeId: "youlya",
      promptText: "Published prompt text",
      promptVersion: "draft-v2",
      updatedBy: "test",
    });

    const published = await publishHaidiPrompt({
      storeId: "youlya",
      updatedBy: "test",
      requirePassingLabRun: true,
    });
    expect(published.ok).toBe(true);
    if (published.ok) {
      expect(published.prompt?.source).toBe("db");
      expect(published.prompt?.currentPrompt).toBe("Published prompt text");
      expect(published.prompt?.currentVersion).toContain("draft-v2");
    }
  });

  it("rolls back to the previous published prompt", async () => {
    const state = getMockState();
    state.haidiLabRuns.push({
      id: "run-1",
      store_id: "youlya",
      scenario_id: "scenario-1",
      actual_intent: "PRODUCT_SEARCH",
      actual_reply: "ok",
      score: 95,
      mismatches: [],
      run_by: "test",
      created_at: new Date().toISOString(),
    });

    await saveHaidiPromptDraft({
      storeId: "youlya",
      promptText: "First published prompt",
      promptVersion: "draft-v1",
      updatedBy: "test",
    });
    await publishHaidiPrompt({ storeId: "youlya", updatedBy: "test", requirePassingLabRun: true });

    state.haidiLabRuns.push({
      id: "run-2",
      store_id: "youlya",
      scenario_id: "scenario-2",
      actual_intent: "PRODUCT_SEARCH",
      actual_reply: "ok",
      score: 95,
      mismatches: [],
      run_by: "test",
      created_at: new Date().toISOString(),
    });
    await saveHaidiPromptDraft({
      storeId: "youlya",
      promptText: "Second published prompt",
      promptVersion: "draft-v2",
      updatedBy: "test",
    });
    await publishHaidiPrompt({ storeId: "youlya", updatedBy: "test", requirePassingLabRun: true });

    const rolledBack = await rollbackHaidiPrompt({ storeId: "youlya", updatedBy: "test" });
    expect(rolledBack.ok).toBe(true);
    if (rolledBack.ok) {
      expect(rolledBack.prompt?.currentPrompt).toBe("First published prompt");
      expect(rolledBack.prompt?.source).toBe("db");
    }
  });
});
