import { describe, expect, test } from "vitest";
import { expireRecommendations, persistRecommendations } from "@/lib/services/product-mapping-service";
import { selectProduct } from "@/lib/services/select-product-service";
import { searchProducts } from "@/lib/services/product-search-service";

describe("select product", () => {
  test("select by index + size", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c1",
      customerId: "u1",
      query: "بيجامة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c1", "u1", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c1",
      customerId: "u1",
      selectionText: "رقم 1 مقاس XL",
      testMode: true,
    });
    expect(result.status).toBe("added_to_cart");
    expect(result.items[0]?.size).toBe("XL");
  });

  test("fails safely when mapping expired", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c2",
      customerId: "u2",
      query: "بيجامة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c2", "u2", recs.recommendations);
    await expireRecommendations("youlya", "c2", "u2");
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c2",
      customerId: "u2",
      selectionText: "رقم 1 مقاس M",
      testMode: true,
    });
    expect(result.status).toBe("mapping_expired");
  });

  test("blocks out-of-stock selection", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c3",
      customerId: "u3",
      query: "روب",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c3", "u3", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c3",
      customerId: "u3",
      selectionText: "رقم 1 مقاس L",
      testMode: true,
    });
    expect(result.status).toBe("oos");
  });

  test("supports multi-item selection with one size", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c4",
      customerId: "u4",
      query: "عايزة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c4", "u4", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c4",
      customerId: "u4",
      selectionText: "رقم 1 و رقم 3 مقاس L",
      testMode: true,
    });
    expect(result.status).toBe("added_to_cart");
    expect(result.items.length).toBe(2);
  });
});
