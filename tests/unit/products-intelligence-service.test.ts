import { describe, expect, test } from "vitest";
import {
  normalizeChannel,
  generateProductNotes,
  generateProductBadges,
  calculateIntelligenceScore,
  computeVariantAggregates,
  generateAiVisibilityReasons,
} from "@/lib/services/products-intelligence-service";

describe("products-intelligence service", () => {
  describe("normalizeChannel", () => {
    test("whatsapp evolution -> whatsapp", () => {
      expect(normalizeChannel("whatsapp_evolution")).toBe("whatsapp");
    });
    test("instagram dm -> instagram", () => {
      expect(normalizeChannel("instagram_dm")).toBe("instagram");
    });
    test("tiktok dm -> tiktok", () => {
      expect(normalizeChannel("tiktok_dm")).toBe("tiktok");
    });
    test("facebook messenger -> facebook", () => {
      expect(normalizeChannel("facebook_messenger")).toBe("facebook");
    });
    test("manual -> manual", () => {
      expect(normalizeChannel("manual")).toBe("manual");
    });
    test("null/undefined -> unknown", () => {
      expect(normalizeChannel(null)).toBe("unknown");
      expect(normalizeChannel(undefined)).toBe("unknown");
    });
    test("empty string -> unknown", () => {
      expect(normalizeChannel("")).toBe("unknown");
    });
    test("random string -> unknown", () => {
      expect(normalizeChannel("something_random")).toBe("unknown");
    });
  });

  describe("generateProductNotes", () => {
    test("all good -> ready for AI", () => {
      const notes = generateProductNotes({ total: 5, available: 5, aiVisible: 5, missingSku: 0, oos: 0 });
      expect(notes).toContain("جاهز للبيع بالذكاء الاصطناعي");
    });
    test("missing SKU -> note present", () => {
      const notes = generateProductNotes({ total: 5, available: 5, aiVisible: 5, missingSku: 2, oos: 0 });
      expect(notes).toContain("SKU مفقود في 2 متغير");
    });
    test("all OOS -> note present", () => {
      const notes = generateProductNotes({ total: 5, available: 0, aiVisible: 0, missingSku: 0, oos: 5 });
      expect(notes).toContain("كل المتغيرات نفذت من المخزون");
    });
    test("partial OOS -> note present", () => {
      const notes = generateProductNotes({ total: 5, available: 3, aiVisible: 3, missingSku: 0, oos: 2 });
      expect(notes).toContain("متغيرات نفذت من المخزون: 2");
    });
    test("no AI visible -> note present", () => {
      const notes = generateProductNotes({ total: 5, available: 5, aiVisible: 0, missingSku: 0, oos: 0 });
      expect(notes).toContain("غير مرئي للذكاء الاصطناعي");
    });
    test("partial AI visible -> note present", () => {
      const notes = generateProductNotes({ total: 5, available: 5, aiVisible: 3, missingSku: 0, oos: 0 });
      expect(notes).toContain("بعض المتغيرات غير مرئية للذكاء الاصطناعي");
    });
    test("does not claim ready when OOS", () => {
      const notes = generateProductNotes({ total: 5, available: 3, aiVisible: 3, missingSku: 0, oos: 2 });
      expect(notes).not.toContain("جاهز للبيع بالذكاء الاصطناعي");
    });
  });

  describe("generateProductBadges", () => {
    test("ai ready badge when all good", () => {
      const badges = generateProductBadges(true, { total: 5, available: 5, aiVisible: 5, missingSku: 0, oos: 0 });
      expect(badges).toContain("ai_ready");
    });
    test("missing_sku badge", () => {
      const badges = generateProductBadges(true, { total: 5, available: 5, aiVisible: 5, missingSku: 1, oos: 0 });
      expect(badges).toContain("missing_sku");
      expect(badges).not.toContain("ai_ready");
    });
    test("oos badge", () => {
      const badges = generateProductBadges(true, { total: 5, available: 3, aiVisible: 3, missingSku: 0, oos: 2 });
      expect(badges).toContain("oos");
    });
    test("low_stock badge when available <= 3", () => {
      const badges = generateProductBadges(true, { total: 5, available: 2, aiVisible: 2, missingSku: 0, oos: 3 });
      expect(badges).toContain("low_stock");
    });
    test("hidden_from_ai badge when aiVisible false", () => {
      const badges = generateProductBadges(false, { total: 5, available: 5, aiVisible: 5, missingSku: 0, oos: 0 });
      expect(badges).toContain("hidden_from_ai");
    });
  });

  describe("calculateIntelligenceScore", () => {
    test("perfect score", () => {
      expect(calculateIntelligenceScore(100, 100, 0, 0)).toBe(100);
    });
    test("zero variants -> 0", () => {
      expect(calculateIntelligenceScore(0, 0, 0, 0)).toBe(0);
    });
    test("half AI visible -> AI score 20/40", () => {
      // AI: 50/100 * 40 = 20, SKU: 100/100 * 30 = 30, Stock: 100/100 * 30 = 30 => 80
      expect(calculateIntelligenceScore(100, 50, 0, 0)).toBe(80);
    });
    test("with missing SKU and OOS", () => {
      // AI: 100/100 * 40 = 40, SKU: 80/100 * 30 = 24, Stock: 90/100 * 30 = 27 => 91
      expect(calculateIntelligenceScore(100, 100, 20, 10)).toBe(91);
    });
  });

  describe("computeVariantAggregates", () => {
    test("empty array -> all zeros", () => {
      expect(computeVariantAggregates([])).toEqual({ total: 0, available: 0, aiVisible: 0, missingSku: 0, oos: 0 });
    });
    test("mixed variants", () => {
      const variants = [
        { inventory_quantity: 5, available_for_ai: true, code_missing: false },
        { inventory_quantity: 0, available_for_ai: false, code_missing: true },
        { inventory_quantity: 3, available_for_ai: true, code_missing: false },
      ];
      expect(computeVariantAggregates(variants)).toEqual({ total: 3, available: 2, aiVisible: 2, missingSku: 1, oos: 1 });
    });
    test("null/undefined fields handled safely", () => {
      const variants = [
        { inventory_quantity: null, available_for_ai: null, code_missing: null },
      ];
      expect(computeVariantAggregates(variants)).toEqual({ total: 1, available: 0, aiVisible: 0, missingSku: 0, oos: 1 });
    });
  });

  describe("generateAiVisibilityReasons", () => {
    test("available for AI -> empty reasons", () => {
      expect(generateAiVisibilityReasons({ available_for_ai: true, inventory_quantity: 0, code_missing: true })).toEqual([]);
    });
    test("OOS -> reason", () => {
      expect(generateAiVisibilityReasons({ available_for_ai: false, inventory_quantity: 0, code_missing: false })).toContain("OOS");
    });
    test("missing SKU -> reason", () => {
      expect(generateAiVisibilityReasons({ available_for_ai: false, inventory_quantity: 5, code_missing: true })).toContain("missing SKU");
    });
    test("missing price -> reason", () => {
      expect(generateAiVisibilityReasons({ available_for_ai: false, inventory_quantity: 5, code_missing: false, price: 0 })).toContain("missing price");
    });
    test("missing variant ID -> reason", () => {
      expect(generateAiVisibilityReasons({ available_for_ai: false, inventory_quantity: 5, code_missing: false, price: 100, shopify_variant_id: null })).toContain("missing variant ID");
    });
    test("no explicit reason -> inactive", () => {
      expect(generateAiVisibilityReasons({ available_for_ai: false, inventory_quantity: 5, code_missing: false, price: 100, shopify_variant_id: "gid://" })).toContain("inactive");
    });
  });
});
