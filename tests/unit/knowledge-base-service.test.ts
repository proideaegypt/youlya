import { describe, it, expect } from "vitest";
import { buildApprovedKnowledgePrompt, retrieveApprovedKnowledge, reviewSuggestion } from "@/lib/services/knowledge-base-service";
import { getMockState } from "@/lib/adapters/supabase/mock-store";

describe("knowledge-base-service", () => {
  it("retrieves published snippets only in mock mode", async () => {
    const state = getMockState();
    state.knowledgeBase.length = 0;
    state.knowledgeBase.push(
      { id: "k1", store_id: "youlya", title: "Shipping", content: "Cairo 70 EGP", status: "published", updated_at: new Date().toISOString() },
      { id: "k2", store_id: "youlya", title: "Draft", content: "Internal only", status: "draft", updated_at: new Date().toISOString() },
    );

    const snippets = await retrieveApprovedKnowledge("youlya", "shipping", 5);
    expect(snippets).toHaveLength(1);
    expect(snippets[0]?.id).toBe("k1");
  });

  it("builds prompt context from approved snippets", () => {
    const prompt = buildApprovedKnowledgePrompt([
      { id: "k1", title: "Policy", content: "No order without confirmation.", tags: [], sourceType: "policy", updatedAt: new Date().toISOString() },
    ]);
    expect(prompt).toContain("No order without confirmation.");
  });

  it("publishes only through explicit review action", async () => {
    const state = getMockState();
    state.knowledgeSuggestions.length = 0;
    state.knowledgeBase.length = 0;
    state.knowledgeVersions.length = 0;

    state.knowledgeSuggestions.push({
      id: "s1",
      store_id: "youlya",
      title: "Return policy",
      suggestion_text: "No returns after confirmation.",
      source_type: "learning",
      status: "pending",
      created_at: new Date().toISOString(),
    });

    await reviewSuggestion({ storeId: "youlya", suggestionId: "s1", action: "publish", actor: "tester" });
    expect(state.knowledgeBase.length).toBe(1);
    expect(state.knowledgeVersions.length).toBe(1);
    expect(state.knowledgeSuggestions[0]?.status).toBe("published");
  });
});
