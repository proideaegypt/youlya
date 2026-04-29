import { describe, expect, test } from "vitest";
import { ProductMappingRepository } from "@/lib/adapters/supabase/product-mapping-repository";

function buildFakeClient() {
  const rows: Array<Record<string, unknown>> = [];
  return {
    from() {
      return {
        async upsert(inputRows: Record<string, unknown>[]) {
          for (const row of inputRows) {
            const existingIdx = rows.findIndex(
              (r) =>
                r.store_id === row.store_id &&
                r.conversation_id === row.conversation_id &&
                r.index === row.index,
            );
            if (existingIdx >= 0) rows[existingIdx] = { ...rows[existingIdx], ...row };
            else rows.push(row);
          }
          return { error: null };
        },
        select() {
          return {
            eq(_c1: string, storeId: unknown) {
              return {
                eq(_c2: string, conversationId: unknown) {
                  return {
                    eq(_c3: string, idx: unknown) {
                      return {
                        gt(_c4: string, nowIso: unknown) {
                          return {
                            async maybeSingle() {
                              const found = rows.find(
                                (r) =>
                                  r.store_id === storeId &&
                                  r.conversation_id === conversationId &&
                                  r.index === idx &&
                                  new Date(String(r.expires_at)).toISOString() > String(nowIso),
                              );
                              return { data: found ?? null, error: null };
                            },
                          };
                        },
                      };
                    },
                  };
                },
              };
            },
          };
        },
        update(payload: Record<string, unknown>) {
          return {
            eq(_c1: string, storeId: unknown) {
              return {
                async eq(_c2: string, conversationId: unknown) {
                  for (const row of rows) {
                    if (row.store_id === storeId && row.conversation_id === conversationId) {
                      Object.assign(row, payload);
                    }
                  }
                  return { error: null };
                },
              };
            },
          };
        },
      };
    },
  };
}

describe("ProductMappingRepository", () => {
  test("save + get happy path", async () => {
    const repo = new ProductMappingRepository(buildFakeClient() as never);
    const expiresAt = new Date(Date.now() + 60_000).toISOString();
    await repo.saveMapping("store-a", "conv-1", "cust-1", [
      { index: 1, productId: "prod-1", variantId: "var-1", displayedTitle: "A", displayedPrice: 100, expiresAt },
    ]);
    const mapped = await repo.getMapping("store-a", "conv-1", 1);
    expect(mapped?.variantId).toBe("var-1");
  });

  test("expired mapping returns null", async () => {
    const repo = new ProductMappingRepository(buildFakeClient() as never);
    const expiresAt = new Date(Date.now() - 60_000).toISOString();
    await repo.saveMapping("store-a", "conv-2", "cust-1", [
      { index: 1, productId: "prod-1", variantId: "var-1", displayedTitle: "A", displayedPrice: 100, expiresAt },
    ]);
    const mapped = await repo.getMapping("store-a", "conv-2", 1);
    expect(mapped).toBeNull();
  });

  test("cross-store isolation", async () => {
    const repo = new ProductMappingRepository(buildFakeClient() as never);
    const expiresAt = new Date(Date.now() + 60_000).toISOString();
    await repo.saveMapping("store-a", "conv-3", "cust-1", [
      { index: 1, productId: "prod-1", variantId: "var-1", displayedTitle: "A", displayedPrice: 100, expiresAt },
    ]);
    const mapped = await repo.getMapping("store-b", "conv-3", 1);
    expect(mapped).toBeNull();
  });

  test("missing store_id throws error", async () => {
    const repo = new ProductMappingRepository(buildFakeClient() as never);
    await expect(repo.getMapping("", "conv-4", 1)).rejects.toThrow("store_id is required");
  });
});

