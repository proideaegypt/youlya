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

  test("select by Arabic ordinal: اول واحد", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c-ord-1",
      customerId: "u-ord-1",
      query: "بيجامة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c-ord-1", "u-ord-1", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c-ord-1",
      customerId: "u-ord-1",
      selectionText: "عايزة اول واحد مقاس M",
      testMode: true,
    });
    expect(result.status).toBe("added_to_cart");
    expect(result.items[0]?.index).toBe(1);
    expect(result.items[0]?.size).toBe("M");
  });

  test("select by Arabic ordinal: التاني", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c-ord-2",
      customerId: "u-ord-2",
      query: "عايزة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c-ord-2", "u-ord-2", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c-ord-2",
      customerId: "u-ord-2",
      selectionText: "التاني اكس لارج",
      testMode: true,
    });
    expect(result.status).toBe("added_to_cart");
    expect(result.items[0]?.index).toBe(2);
    expect(result.items[0]?.size).toBe("XL");
  });

  test("select by نمرة with Arabic digit", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c-num-1",
      customerId: "u-num-1",
      query: "عايزة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c-num-1", "u-num-1", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c-num-1",
      customerId: "u-num-1",
      selectionText: "نمرة ٣ لارج",
      testMode: true,
    });
    expect(result.status).toBe("added_to_cart");
    expect(result.items[0]?.index).toBe(3);
    expect(result.items[0]?.size).toBe("L");
  });

  test("select by اكس لارج Arabic size", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c-xl",
      customerId: "u-xl",
      query: "بيجامة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c-xl", "u-xl", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c-xl",
      customerId: "u-xl",
      selectionText: "رقم ١ اكس لارج",
      testMode: true,
    });
    expect(result.status).toBe("added_to_cart");
    expect(result.items[0]?.size).toBe("XL");
  });

  test("select by ميديم Arabic size", async () => {
    const recs = await searchProducts({
      storeSlug: "youlya",
      conversationId: "c-m",
      customerId: "u-m",
      query: "عايزة",
      limit: 10,
      testMode: true,
    });
    await persistRecommendations("youlya", "c-m", "u-m", recs.recommendations);
    const result = await selectProduct({
      storeSlug: "youlya",
      conversationId: "c-m",
      customerId: "u-m",
      selectionText: "اول واحد ميديم",
      testMode: true,
    });
    expect(result.status).toBe("added_to_cart");
    expect(result.items[0]?.index).toBe(1);
    expect(result.items[0]?.size).toBe("M");
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

describe("product search validation", () => {
  test("search returns max 10 results", async () => {
    const result = await searchProducts({
      storeSlug: "youlya",
      conversationId: "cs1",
      customerId: "us1",
      query: "بيجامة",
      limit: 10,
      testMode: true,
    });
    expect(result.recommendations.length).toBeLessThanOrEqual(10);
  });

  test("search results include shopifyProductId", async () => {
    const result = await searchProducts({
      storeSlug: "youlya",
      conversationId: "cs2",
      customerId: "us2",
      query: "بيجامة",
      limit: 10,
      testMode: true,
    });
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.shopifyProductId).toBeTruthy();
    }
  });

  test("search results include shopifyVariantId internally", async () => {
    const result = await searchProducts({
      storeSlug: "youlya",
      conversationId: "cs3",
      customerId: "us3",
      query: "بيجامة",
      limit: 10,
      testMode: true,
    });
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.variantOptions.length).toBeGreaterThan(0);
      for (const v of rec.variantOptions) {
        expect(v.shopifyVariantId).toBeTruthy();
      }
    }
  });

  test("OOS variant not marked available", async () => {
    const result = await searchProducts({
      storeSlug: "youlya",
      conversationId: "cs4",
      customerId: "us4",
      query: "روب",
      limit: 10,
      testMode: true,
    });
    const robe = result.recommendations.find((r) => r.shopifyProductTitle.includes("روب"));
    expect(robe).toBeDefined();
    const oosVariant = robe!.variantOptions.find((v) => v.inventoryQuantity === 0);
    expect(oosVariant).toBeDefined();
    expect(oosVariant!.available).toBe(false);
  });
});
