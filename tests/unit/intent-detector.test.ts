import { describe, expect, test } from "vitest";
import { detectIntent } from "@/lib/services/intent-detector";

describe("intent detector", () => {
  test("Arabic product search detected", () => {
    expect(detectIntent("عايزة بيجامة شتوي", "ar-EG", "browsing")).toBe("PRODUCT_SEARCH");
  });

  test("English product search detected", () => {
    expect(detectIntent("do you have pajamas?", "en", "browsing")).toBe("PRODUCT_SEARCH");
  });

  test("Select product by number + size", () => {
    expect(detectIntent("رقم 2 مقاس XL", "ar-EG", "ready_to_buy")).toBe("SELECT_PRODUCT");
  });

  test("Confirm order Arabic phrases", () => {
    expect(detectIntent("أيوه أكدي", "ar-EG", "ready_to_buy")).toBe("CONFIRM_ORDER");
  });

  test("Cancel request detected", () => {
    expect(detectIntent("cancel my order", "en", "angry")).toBe("CANCEL_REQUEST");
  });

  test("confused tone with no signal -> unclear", () => {
    expect(detectIntent("مش فاهم", "ar-EG", "confused")).toBe("UNCLEAR");
  });
});
