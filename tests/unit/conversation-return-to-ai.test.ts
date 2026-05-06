import { describe, test, expect } from "vitest";
import { returnToAI } from "@/lib/services/handoff-service";
import { isAIPaused, setAIPaused } from "@/lib/services/conversation-flow-service";

describe("conversation return-to-ai", () => {
  test("returnToAI clears ai_paused and resolves open handoff", async () => {
    const convId = "conv-return-ai-001";
    await setAIPaused(convId, true);
    expect(await isAIPaused(convId)).toBe(true);

    const result = await returnToAI(convId, "test-staff");
    expect(result).toBe(true);
    expect(await isAIPaused(convId)).toBe(false);
  });

  test("returnToAI works even if no open ticket exists (ai_paused only)", async () => {
    const convId = "conv-return-ai-002";
    await setAIPaused(convId, true);
    expect(await isAIPaused(convId)).toBe(true);

    const result = await returnToAI(convId, "test-staff");
    expect(result).toBe(true);
    expect(await isAIPaused(convId)).toBe(false);
  });

  test("returnToAI does not affect other conversations", async () => {
    const convA = "conv-return-ai-003a";
    const convB = "conv-return-ai-003b";
    await setAIPaused(convA, true);
    await setAIPaused(convB, true);

    await returnToAI(convA, "test-staff");
    expect(await isAIPaused(convA)).toBe(false);
    expect(await isAIPaused(convB)).toBe(true);
  });
});
