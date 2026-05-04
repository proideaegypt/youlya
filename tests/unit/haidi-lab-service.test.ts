import { describe, it, expect } from "vitest";
import {
  createHaidiScenario,
  createLearningSuggestionFromRun,
  deleteHaidiScenario,
  listHaidiScenarios,
  runHaidiScenario,
  updateHaidiScenario,
} from "@/lib/services/haidi-lab-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { reviewSuggestion } from "@/lib/services/knowledge-base-service";

describe("haidi-lab-service", () => {
  it("supports scenario CRUD", async () => {
    const state = getMockState();
    state.haidiLabScenarios.length = 0;
    const created = await createHaidiScenario({
      storeId: "youlya",
      title: "shipping scenario",
      inputText: "عايزة اعرف الشحن",
      expectedIntent: "shipping",
    });
    expect(created.id).toBeTruthy();

    const updated = await updateHaidiScenario(String(created.id), {
      storeId: "youlya",
      title: "shipping updated",
      inputText: "الشحن للقاهرة كام؟",
      expectedIntent: "shipping",
      mustInclude: ["الشحن"],
      mustNotInclude: ["variant_id"],
    });
    expect(updated).toBeTruthy();

    const rows = await listHaidiScenarios("youlya");
    expect(rows.length).toBe(1);

    await deleteHaidiScenario(String(created.id), "youlya");
    const afterDelete = await listHaidiScenarios("youlya");
    expect(afterDelete.length).toBe(0);
  });

  it("runs scenario in safe test mode and returns score", async () => {
    const state = getMockState();
    state.haidiLabScenarios.length = 0;
    const scenario = await createHaidiScenario({
      storeId: "youlya",
      title: "product prompt",
      inputText: "عايزة بيجامة",
      expectedIntent: "product_search",
      mustNotInclude: ["store_id", "provider_message_id"],
    });

    const result = await runHaidiScenario({ storeId: "youlya", scenarioId: String(scenario.id) });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.run.score).toBeGreaterThanOrEqual(0);
    expect(result.run.score).toBeLessThanOrEqual(100);
    expect(result.run.actual_reply).not.toMatch(/store_id|provider_message_id|http/i);
  });

  it("creates learning suggestion and passes approval queue actions", async () => {
    const state = getMockState();
    state.knowledgeSuggestions.length = 0;
    const suggestion = await createLearningSuggestionFromRun({
      storeId: "youlya",
      runId: "run-1",
      title: "Improve reply clarity",
      suggestionText: "Use shorter confirmation prompts.",
    });
    expect(suggestion.status).toBe("pending");

    const approve = await reviewSuggestion({
      storeId: "youlya",
      suggestionId: String(suggestion.id),
      action: "approve",
      actor: "tester",
    });
    expect(approve.ok).toBe(true);

    const publish = await reviewSuggestion({
      storeId: "youlya",
      suggestionId: String(suggestion.id),
      action: "publish",
      actor: "tester",
    });
    expect(publish.ok).toBe(true);
  });
});
