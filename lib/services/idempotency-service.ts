import crypto from "node:crypto";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export function getIdempotentResult(key: string) {
  return getMockState().orderByIdempotency.get(key);
}

export function setIdempotentResult(key: string, value: { id: string; name: string }) {
  getMockState().orderByIdempotency.set(key, value);
}

type IdempotencyStatus = "created" | "pending";

type IdempotencyStoreEntry = {
  status: IdempotencyStatus;
  order?: { id: string; name: string };
  createdAt: string;
};

const localKeyStore = new Map<string, IdempotencyStoreEntry>();

export function generateOrderIdempotencyKey(input: {
  store_id: string;
  conversation_id: string;
  variant_id: string;
  quantity: number;
  address: string;
}): string {
  const raw = `${input.store_id}:${input.conversation_id}:${input.variant_id}:${input.quantity}:${input.address.trim().toLowerCase()}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function checkIdempotencyKey(store_id: string, key: string): { exists: boolean; order?: { id: string; name: string } } {
  const entry = localKeyStore.get(`${store_id}:${key}`);
  if (!entry) return { exists: false };
  const ageHours = (Date.now() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60);
  if (ageHours > 24) {
    localKeyStore.delete(`${store_id}:${key}`);
    return { exists: false };
  }
  if (entry.status === "created" && entry.order) return { exists: true, order: entry.order };
  return { exists: false };
}

export function markIdempotencyCreated(store_id: string, key: string, order: { id: string; name: string }) {
  localKeyStore.set(`${store_id}:${key}`, { status: "created", order, createdAt: new Date().toISOString() });
}

export async function checkOrderIdempotencyKey(
  store_id: string,
  key: string,
): Promise<{ exists: boolean; order?: { id: string; name: string } }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return checkIdempotencyKey(store_id, key);
  }

  try {
    const { data, error } = await supabase
      .from("order_idempotency_keys")
      .select("shopify_order_id, shopify_order_name")
      .eq("store_id", store_id)
      .eq("idempotency_key", key)
      .maybeSingle();

    if (error || !data?.shopify_order_id) {
      if (error) console.error("checkOrderIdempotencyKey error", error);
      return { exists: false };
    }

    return {
      exists: true,
      order: { id: String(data.shopify_order_id), name: String(data.shopify_order_name ?? data.shopify_order_id) },
    };
  } catch (error) {
    console.error("checkOrderIdempotencyKey exception", error);
    return { exists: false };
  }
}

export async function markOrderIdempotencyCreated(
  store_id: string,
  key: string,
  order: { id: string; name: string },
): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    markIdempotencyCreated(store_id, key, order);
    return;
  }

  try {
    const { error } = await supabase.from("order_idempotency_keys").upsert(
      {
        store_id,
        idempotency_key: key,
        shopify_order_id: order.id,
        shopify_order_name: order.name,
        status: "created",
      },
      { onConflict: "store_id,idempotency_key" },
    );
    if (error) console.error("markOrderIdempotencyCreated error", error);
  } catch (error) {
    console.error("markOrderIdempotencyCreated exception", error);
  }
}
