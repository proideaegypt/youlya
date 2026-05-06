import { describe, expect, test } from "vitest";
import { evaluateHandoffPolicy } from "@/lib/services/handoff-policy-service";

describe("handoff policy service", () => {
  test.each([
    "عايزه حد من خدمة العملاء",
    "عايزة حد من خدمة العملاء يكلمني",
    "ممكن اتواصل مع حد من المديرين",
    "عايزة أكلم مدير",
    "خلي حد مسؤول يكلمني",
    "عايزة خدمة العملاء",
  ])("detects explicit Arabic handoff request: %s", (text) => {
    const result = evaluateHandoffPolicy(text);
    expect(result.shouldHandoff).toBe(true);
    expect(["customer_service", "manager_request"]).toContain(result.handoffType);
    expect(result.reason).toMatch(/explicit_/);
  });

  test.each([
    "هاي",
    "ابعتيلي بيجامة قطن",
    "مش عارفة أختار",
    "غالي شوية",
    "فيه مقاس M؟",
    "عندك لون روز؟",
    "مممم مش عارفة",
  ])("does not handoff for normal shopping messages: %s", (text) => {
    const result = evaluateHandoffPolicy(text);
    expect(result.shouldHandoff).toBe(false);
    expect(result.handoffType).toBeNull();
  });
});
