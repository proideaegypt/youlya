import { getMockState, mappingKey } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { resolveStoreUuid } from "@/lib/adapters/supabase/store-resolver";
import type { ProductRecommendation } from "@/lib/types/commerce";
type ProductRecommendationLegacy = ProductRecommendation & { productId?: string };

export type ProductSlot = {
  slot_number: number;
  shopify_product_id?: string;
  shopify_variant_id?: string;
  title: string;
  price: number;
  image_url?: string;
  size_asked?: string;
};

type ResolvedVariant = {
  variant_id: string;
  title: string;
  price: number;
};

function hasSupabaseEnv(): boolean {
  return Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function toLegacyRecommendations(items: ProductSlot[]): ProductRecommendation[] {
  return items.map((item) => ({
    index: item.slot_number,
    productId: item.shopify_product_id ?? "",
    shopifyProductId: item.shopify_product_id ?? "",
    shopifyProductTitle: item.title,
    shopifyHandle: "persisted-recommendation",
    imageUrl: item.image_url,
    variantOptions: [
      {
        shopifyVariantId: item.shopify_variant_id ?? "",
        sku: null,
        codeMissing: false,
        title: item.title,
        size: item.size_asked,
        color: undefined,
        price: item.price,
        currency: "EGP",
        inventoryQuantity: 1,
        available: true,
      },
    ],
  }));
}

function saveToMockState(conversationId: string, items: ProductSlot[]) {
  const mockItems = toLegacyRecommendations(items);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  getMockState().mappings.set(mappingKey("youlya", conversationId, conversationId), {
    recommendations: mockItems,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });
}

export async function saveRecommendations(conversationId: string, items: ProductSlot[]): Promise<void> {
  try {
    saveToMockState(conversationId, items);
    if (!hasSupabaseEnv()) {
      return;
    }

    const client = getSupabaseServerClient();
    if (!client) return;
    await client.from("last_product_recommendations").delete().eq("conversation_id", conversationId);
    if (!items.length) return;

    const rows = items.map((item) => ({
      conversation_id: conversationId,
      slot_number: item.slot_number,
      shopify_product_id: item.shopify_product_id ?? null,
      shopify_variant_id: item.shopify_variant_id ?? null,
      title: item.title,
      price: item.price,
      image_url: item.image_url ?? null,
      size_asked: item.size_asked ?? null,
    }));

    const { error } = await client.from("last_product_recommendations").insert(rows);
    if (error) console.error("saveRecommendations failed", error.message);
  } catch (error) {
    console.error("saveRecommendations failed", error);
  }
}

function readMockState(conversationId: string): ProductSlot[] {
  const entry =
    getMockState().mappings.get(mappingKey("youlya", conversationId, conversationId)) ??
    getMockState().mappings.get(mappingKey("youlya", conversationId, "u1"));
  if (!entry) return [];
  type MockRec = {
    index?: number;
    slot_number?: number;
    productId?: string;
    shopifyProductId?: string;
    shopify_variant_id?: string;
    shopifyVariantId?: string;
    shopifyProductTitle?: string;
    title?: string;
    price?: number;
    imageUrl?: string;
    image_url?: string;
    size_asked?: string;
    size?: string;
    variantOptions?: Array<{ id?: string; shopifyVariantId?: string; price?: number; size?: string }>;
  };
  const mockRecs = entry.recommendations as unknown as MockRec[];
  return (mockRecs ?? []).map((r) => ({
    slot_number: r.index ?? r.slot_number ?? 0,
    shopify_product_id: r.productId ?? r.shopifyProductId,
    shopify_variant_id: r.variantOptions?.[0]?.shopifyVariantId ?? r.variantOptions?.[0]?.id ?? r.shopify_variant_id,
    title: r.shopifyProductTitle ?? r.title ?? "",
    price: Number(r.variantOptions?.[0]?.price ?? r.price ?? 0),
    image_url: r.imageUrl ?? r.image_url,
    size_asked: r.size_asked ?? r.variantOptions?.[0]?.size,
  })) as ProductSlot[];
}

export async function getRecommendations(conversationId: string): Promise<ProductSlot[]> {
  try {
    if (!hasSupabaseEnv()) {
      return readMockState(conversationId);
    }

    const client = getSupabaseServerClient();
    if (!client) return readMockState(conversationId);
    const { data, error } = await client
      .from("last_product_recommendations")
      .select("slot_number,shopify_product_id,shopify_variant_id,title,price,image_url,size_asked")
      .eq("conversation_id", conversationId)
      .order("slot_number", { ascending: true });
    if (error || !data) {
      if (error) console.error("getRecommendations failed", error.message);
      return readMockState(conversationId);
    }

    const dbResults = data.map((row) => ({
      slot_number: Number(row.slot_number),
      shopify_product_id: row.shopify_product_id ? String(row.shopify_product_id) : undefined,
      shopify_variant_id: row.shopify_variant_id ? String(row.shopify_variant_id) : undefined,
      title: String(row.title),
      price: Number(row.price),
      image_url: row.image_url ? String(row.image_url) : undefined,
      size_asked: row.size_asked ? String(row.size_asked) : undefined,
    }));
    return dbResults.length > 0 ? dbResults : readMockState(conversationId);
  } catch (error) {
    console.error("getRecommendations failed", error);
    return readMockState(conversationId);
  }
}

export async function resolveVariant(
  conversationId: string,
  slotNumber: number,
  size?: string,
): Promise<ResolvedVariant | null> {
  try {
    const recs = await getRecommendations(conversationId);
    const found = recs.find((item) => item.slot_number === slotNumber);
    if (!found) return null;
    if (size && found.size_asked && found.size_asked.toLowerCase() !== size.toLowerCase()) {
      return null;
    }
    return {
      variant_id: found.shopify_variant_id ?? "",
      title: found.title,
      price: found.price,
    };
  } catch (error) {
    console.error("resolveVariant failed", error);
    return null;
  }
}

export async function clearRecommendations(conversationId: string): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      getMockState().mappings.delete(mappingKey("youlya", conversationId, conversationId));
      getMockState().mappings.delete(mappingKey("youlya", conversationId, "u1"));
      return;
    }

    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("last_product_recommendations").delete().eq("conversation_id", conversationId);
    if (error) console.error("clearRecommendations failed", error.message);
  } catch (error) {
    console.error("clearRecommendations failed", error);
  }
}

// Backward-compatible wrappers used by existing routes/tests.
export async function persistRecommendations(
  storeSlug: string,
  conversationId: string,
  customerId: string,
  recs: ProductRecommendationLegacy[],
): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      getMockState().mappings.set(mappingKey(storeSlug, conversationId, customerId), {
        recommendations: recs,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;

    const storeUuid = await resolveStoreUuid(storeSlug);
    if (!storeUuid) {
      console.error("persistRecommendations failed: store not found", storeSlug);
      return;
    }

    await client.from("last_product_recommendations").delete().eq("conversation_id", conversationId);
    if (!recs.length) return;

    const rows = recs.map((rec) => {
      const firstVariant = rec.variantOptions[0];
      const price = Number(firstVariant?.price ?? 0);
      const inventoryAtShowTime = Number(firstVariant?.inventoryQuantity ?? 0);
      const shopifyProductId = rec.shopifyProductId || rec.productId || "";
      const shopifyVariantId = firstVariant?.shopifyVariantId ?? "";
      return {
        store_id: storeUuid,
        conversation_id: conversationId,
        customer_id: customerId,
        recommendation_index: rec.index,
        product_id: rec.productId || shopifyProductId || null,
        variant_id: shopifyVariantId || null,
        shopify_product_id: shopifyProductId || null,
        shopify_product_title: rec.shopifyProductTitle,
        shopify_handle: rec.shopifyHandle || null,
        shopify_variant_id: shopifyVariantId || null,
        sku: firstVariant?.sku ?? null,
        code_missing: firstVariant?.codeMissing ?? false,
        size: firstVariant?.size ?? null,
        color: firstVariant?.color ?? null,
        price,
        currency: firstVariant?.currency ?? "EGP",
        inventory_at_show_time: inventoryAtShowTime,
        image_url: rec.imageUrl ?? null,
        slot_number: rec.index,
        title: rec.shopifyProductTitle,
        size_asked: firstVariant?.size ?? null,
      };
    });

    const { error } = await client.from("last_product_recommendations").insert(rows);
    if (error) console.error("persistRecommendations failed", error.message);
  } catch (error) {
    console.error("persistRecommendations failed", error);
  }
}

export async function getLegacyRecommendations(
  storeSlug: string,
  conversationId: string,
  customerId: string,
): Promise<ProductRecommendationLegacy[]> {
  try {
    if (!hasSupabaseEnv()) {
      const entry = getMockState().mappings.get(mappingKey(storeSlug, conversationId, customerId));
      if (!entry) return [];
      if (new Date(entry.expiresAt).getTime() < Date.now()) return [];
      return entry.recommendations;
    }
    return toLegacyRecommendations(await getRecommendations(conversationId));
  } catch (error) {
    console.error("getLegacyRecommendations failed", error);
    return [];
  }
}

export async function expireRecommendations(
  storeSlug: string,
  conversationId: string,
  customerId: string,
): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      const entry = getMockState().mappings.get(mappingKey(storeSlug, conversationId, customerId));
      if (!entry) return;
      entry.expiresAt = new Date(Date.now() - 1000).toISOString();
      getMockState().mappings.set(mappingKey(storeSlug, conversationId, customerId), entry);
      return;
    }
    await clearRecommendations(conversationId);
  } catch (error) {
    console.error("expireRecommendations failed", error);
  }
}
