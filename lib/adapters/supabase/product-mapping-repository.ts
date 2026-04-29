import type { ProductRecommendation } from "@/lib/types/commerce";

export type MappingItem = {
  index: number;
  productId: string;
  variantId: string;
  displayedTitle?: string;
  displayedSizeOptions?: unknown;
  displayedPrice?: number;
  inventoryAtShowTime?: number;
  imageUrl?: string;
  expiresAt: string;
};

type SupabaseLike = {
  from: (table: string) => {
    upsert: (rows: Record<string, unknown>[], options?: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    select: (columns: string) => {
      eq: (column: string, value: unknown) => {
        eq: (column: string, value: unknown) => {
          eq: (column: string, value: unknown) => {
            gt: (column: string, value: unknown) => {
              maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
            };
          };
        };
      };
    };
    update: (payload: Record<string, unknown>) => {
      eq: (column: string, value: unknown) => {
        eq: (column: string, value: unknown) => Promise<{ error: { message: string } | null }>;
      };
    };
  };
};

export class ProductMappingRepository {
  constructor(private readonly client: SupabaseLike | null = null) {}

  private requireStoreId(storeId: string) {
    if (!storeId) throw new Error("store_id is required");
  }

  private requireClient() {
    if (!this.client) throw new Error("supabase server client unavailable");
    return this.client;
  }

  async saveMapping(storeId: string, conversationId: string, customerId: string, items: MappingItem[]): Promise<void> {
    this.requireStoreId(storeId);
    const client = this.requireClient();
    const rows = items.map((item) => ({
      store_id: storeId,
      conversation_id: conversationId,
      customer_id: customerId,
      index: item.index,
      product_id: item.productId,
      variant_id: item.variantId,
      displayed_title: item.displayedTitle ?? null,
      displayed_size_options: item.displayedSizeOptions ?? null,
      displayed_price: item.displayedPrice ?? null,
      inventory_at_show_time: item.inventoryAtShowTime ?? null,
      image_url: item.imageUrl ?? null,
      expires_at: item.expiresAt,
    }));
    const { error } = await client.from("last_product_recommendations").upsert(rows, {
      onConflict: "store_id,conversation_id,index",
    });
    if (error) throw new Error(error.message);
  }

  async getMapping(storeId: string, conversationId: string, index: number): Promise<MappingItem | null> {
    this.requireStoreId(storeId);
    const client = this.requireClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await client
      .from("last_product_recommendations")
      .select("index, product_id, variant_id, displayed_title, displayed_size_options, displayed_price, inventory_at_show_time, image_url, expires_at")
      .eq("store_id", storeId)
      .eq("conversation_id", conversationId)
      .eq("index", index)
      .gt("expires_at", nowIso)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      index: Number(data.index),
      productId: String(data.product_id),
      variantId: String(data.variant_id),
      displayedTitle: data.displayed_title ? String(data.displayed_title) : undefined,
      displayedSizeOptions: data.displayed_size_options ?? undefined,
      displayedPrice: data.displayed_price ? Number(data.displayed_price) : undefined,
      inventoryAtShowTime: data.inventory_at_show_time ? Number(data.inventory_at_show_time) : undefined,
      imageUrl: data.image_url ? String(data.image_url) : undefined,
      expiresAt: String(data.expires_at),
    };
  }

  async expireMapping(storeId: string, conversationId: string): Promise<void> {
    this.requireStoreId(storeId);
    const client = this.requireClient();
    const { error } = await client
      .from("last_product_recommendations")
      .update({ expires_at: new Date(Date.now() - 1000).toISOString() })
      .eq("store_id", storeId)
      .eq("conversation_id", conversationId);
    if (error) throw new Error(error.message);
  }
}
