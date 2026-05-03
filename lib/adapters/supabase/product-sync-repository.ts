import type { ShopifyProduct, ShopifyProductVariant } from "@/lib/adapters/shopify/shopify-product-sync-adapter";

export type ProductSyncRow = {
  store_id: string;
  shopify_product_id: string;
  shopify_product_gid?: string;
  shopify_title: string;
  shopify_handle?: string;
  vendor?: string;
  product_type?: string;
  status: string;
  tags?: string[];
  image_url?: string;
  ai_visible: boolean;
  last_synced_at: string;
};

export type VariantSyncRow = {
  store_id: string;
  product_id?: string;
  shopify_variant_id: string;
  shopify_variant_gid?: string;
  sku?: string;
  barcode?: string;
  variant_title?: string;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  size?: string;
  color?: string;
  price?: number;
  currency: string;
  inventory_quantity: number;
  inventory_policy?: string;
  available_for_ai: boolean;
  code_missing: boolean;
  last_inventory_checked_at?: string;
  last_synced_at: string;
};

export type GenericSupabaseClient = {
  from: (table: string) => {
    upsert: (values: Record<string, unknown>[], options?: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    select: (columns: string, options?: Record<string, unknown>) => {
      eq: (column: string, value: unknown) => {
        eq: (column: string, value: unknown) => {
          eq: (column: string, value: unknown) => {
            gt: (column: string, value: unknown) => {
              maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
            };
          };
        };
        in: (column: string, values: unknown[]) => {
          eq: (column: string, value: unknown) => {
            order: (column: string, options?: Record<string, unknown>) => {
              limit: (n: number) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
            };
          };
        };
        order: (column: string, options?: Record<string, unknown>) => {
          limit: (n: number) => {
            maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
          };
        };
        limit: (n: number) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
      };
    };
    delete: () => {
      eq: (column: string, value: unknown) => Promise<{ error: { message: string } | null }>;
    };
  };
};

type ProductLookupClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: unknown) => {
        in: (column: string, values: unknown[]) => Promise<{ data: Array<{ shopify_product_id: unknown; id: unknown }> | null; error: { message: string } | null }>;
      };
    };
  };
};

type CountSingleEqClient = {
  from: (table: string) => {
    select: (columns: string, options?: Record<string, unknown>) => {
      eq: (column: string, value: unknown) => Promise<{ count: number | null; error: { message: string } | null }>;
    };
  };
};

type CountDoubleEqClient = {
  from: (table: string) => {
    select: (columns: string, options?: Record<string, unknown>) => {
      eq: (column: string, value: unknown) => {
        eq: (column: string, value: unknown) => Promise<{ count: number | null; error: { message: string } | null }>;
      };
    };
  };
};

type SyncTimeClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: unknown) => {
        order: (column: string, options?: Record<string, unknown>) => {
          limit: (n: number) => {
            maybeSingle: () => Promise<{ data: { last_synced_at: string } | null; error: { message: string } | null }>;
          };
        };
      };
    };
  };
};

export class ProductSyncRepository {
  constructor(private readonly client: GenericSupabaseClient | null) {}

  async upsertProducts(storeId: string, products: ShopifyProduct[]): Promise<{ upserted: number; errors: string[] }> {
    if (!this.client) return { upserted: 0, errors: ["Supabase client unavailable"] };

    const rows: ProductSyncRow[] = products.map((p) => ({
      store_id: storeId,
      shopify_product_id: p.shopifyProductId,
      shopify_product_gid: p.shopifyProductGid,
      shopify_title: p.title,
      shopify_handle: p.handle,
      vendor: p.vendor,
      product_type: p.productType,
      status: p.status?.toLowerCase() || "active",
      tags: p.tags,
      image_url: p.imageUrl,
      ai_visible: p.status?.toLowerCase() === "active",
      last_synced_at: new Date().toISOString(),
    }));

    const { error } = await this.client.from("products").upsert(rows as unknown as Record<string, unknown>[], {
      onConflict: "store_id,shopify_product_id",
      ignoreDuplicates: false,
    });

    if (error) {
      return { upserted: 0, errors: [error.message] };
    }
    return { upserted: rows.length, errors: [] };
  }

  async upsertVariants(
    storeId: string,
    productIdMap: Map<string, string>,
    variants: ShopifyProductVariant[],
  ): Promise<{ upserted: number; errors: string[] }> {
    if (!this.client) return { upserted: 0, errors: ["Supabase client unavailable"] };

    const rows: VariantSyncRow[] = variants.map((v) => {
      const hasSku = Boolean(v.sku && v.sku.trim());
      const isActive = true; // product status check done at product level
      const hasInventory = v.inventoryQuantity > 0;
      const hasPrice = v.price > 0;
      const hasVariantId = Boolean(v.shopifyVariantId);

      const availableForAi = isActive && hasVariantId && hasPrice && hasInventory && hasSku;

      return {
        store_id: storeId,
        product_id: productIdMap.get(v.shopifyProductId),
        shopify_variant_id: v.shopifyVariantId,
        shopify_variant_gid: v.shopifyVariantGid,
        sku: v.sku,
        barcode: v.barcode,
        variant_title: v.title,
        option1_name: v.selectedOptions[0]?.name,
        option1_value: v.selectedOptions[0]?.value,
        option2_name: v.selectedOptions[1]?.name,
        option2_value: v.selectedOptions[1]?.value,
        option3_name: v.selectedOptions[2]?.name,
        option3_value: v.selectedOptions[2]?.value,
        size: v.size,
        color: v.color,
        price: v.price,
        currency: "EGP",
        inventory_quantity: v.inventoryQuantity,
        inventory_policy: v.inventoryPolicy,
        available_for_ai: availableForAi,
        code_missing: !hasSku,
        last_inventory_checked_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
      };
    });

    const { error } = await this.client.from("product_variants").upsert(rows as unknown as Record<string, unknown>[], {
      onConflict: "store_id,shopify_variant_id",
      ignoreDuplicates: false,
    });

    if (error) {
      return { upserted: 0, errors: [error.message] };
    }
    return { upserted: rows.length, errors: [] };
  }

  async getProductIdMap(storeId: string, shopifyProductIds: string[]): Promise<Map<string, string>> {
    if (!this.client || shopifyProductIds.length === 0) return new Map();

    const client = this.client as unknown as ProductLookupClient;
    const { data, error } = await client
      .from("products")
      .select("id,shopify_product_id")
      .eq("store_id", storeId)
      .in("shopify_product_id", shopifyProductIds);

    if (error || !data) return new Map();

    const map = new Map<string, string>();
    for (const row of data as Array<{ shopify_product_id: unknown; id: unknown }>) {
      map.set(String(row.shopify_product_id), String(row.id));
    }
    return map;
  }

  async countProducts(storeId: string): Promise<number> {
    if (!this.client) return 0;
    const client = this.client as unknown as CountSingleEqClient;
    const { count, error } = await client
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId);
    if (error) return 0;
    return count ?? 0;
  }

  async countVariants(storeId: string): Promise<number> {
    if (!this.client) return 0;
    const client = this.client as unknown as CountSingleEqClient;
    const { count, error } = await client
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId);
    if (error) return 0;
    return count ?? 0;
  }

  async countMissingSkus(storeId: string): Promise<number> {
    if (!this.client) return 0;
    const client = this.client as unknown as CountDoubleEqClient;
    const { count, error } = await client
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId)
      .eq("code_missing", true);
    if (error) return 0;
    return count ?? 0;
  }

  async getLastSyncTime(storeId: string): Promise<string | null> {
    if (!this.client) return null;
    const client = this.client as unknown as SyncTimeClient;
    const { data, error } = await client
      .from("products")
      .select("last_synced_at")
      .eq("store_id", storeId)
      .order("last_synced_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return (data as { last_synced_at: string }).last_synced_at;
  }
}
