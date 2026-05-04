import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Stage = "idle" | "collecting_size" | "collecting_address" | "awaiting_confirmation" | "ordered" | "cancelled";

export type CartItem = {
  slot_number: number;
  title: string;
  price: number;
  size: string;
  variant_id: string;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
};

function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function ensureFlow(conversationId: string) {
  const state = getMockState();
  const current = state.conversationFlow.get(conversationId);
  if (current) return current;
  const init = { stage: "idle", cart: [] as CartItem[], customerInfo: null as CustomerInfo | null };
  state.conversationFlow.set(conversationId, {
    stage: init.stage,
    cart: init.cart as unknown as never[],
    customerInfo: init.customerInfo as unknown as Record<string, unknown> | null,
  });
  return init;
}

function toStage(value: unknown): Stage {
  const valid: Stage[] = ["idle", "collecting_size", "collecting_address", "awaiting_confirmation", "ordered", "cancelled"];
  return valid.includes(value as Stage) ? (value as Stage) : "idle";
}

export async function getStage(conversationId: string): Promise<string> {
  try {
    if (!hasSupabaseEnv()) return ensureFlow(conversationId).stage;
    const client = getSupabaseServerClient();
    if (!client) return "idle";
    const { data, error } = await client.from("conversation_state").select("stage").eq("conversation_id", conversationId).maybeSingle();
    if (error) {
      console.error("getStage failed", error);
      return "idle";
    }
    return toStage(data?.stage);
  } catch (error) {
    console.error("getStage failed", error);
    return "idle";
  }
}

export async function setStage(conversationId: string, stage: string): Promise<void> {
  try {
    const normalized = toStage(stage);
    if (!hasSupabaseEnv()) {
      ensureFlow(conversationId).stage = normalized;
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").upsert(
      { conversation_id: conversationId, stage: normalized, updated_at: new Date().toISOString() },
      { onConflict: "conversation_id" },
    );
    if (error) console.error("setStage failed", error);
  } catch (error) {
    console.error("setStage failed", error);
  }
}

export async function setCart(conversationId: string, cartItems: CartItem[]): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      ensureFlow(conversationId).cart = cartItems;
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").upsert(
      { conversation_id: conversationId, cart_json: cartItems, updated_at: new Date().toISOString() },
      { onConflict: "conversation_id" },
    );
    if (error) console.error("setCart failed", error);
  } catch (error) {
    console.error("setCart failed", error);
  }
}

export async function getCart(conversationId: string): Promise<CartItem[]> {
  try {
    if (!hasSupabaseEnv()) return (ensureFlow(conversationId).cart ?? []) as CartItem[];
    const client = getSupabaseServerClient();
    if (!client) return [];
    const { data, error } = await client.from("conversation_state").select("cart_json").eq("conversation_id", conversationId).maybeSingle();
    if (error) {
      console.error("getCart failed", error);
      return [];
    }
    return Array.isArray(data?.cart_json) ? (data.cart_json as CartItem[]) : [];
  } catch (error) {
    console.error("getCart failed", error);
    return [];
  }
}

export async function setCustomerInfo(conversationId: string, info: { name?: string; phone?: string; address?: string }): Promise<void> {
  try {
    const normalized: CustomerInfo = {
      name: info.name ?? "عميل",
      phone: info.phone ?? conversationId,
      address: info.address ?? "",
    };
    if (!hasSupabaseEnv()) {
      ensureFlow(conversationId).customerInfo = normalized;
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").upsert(
      {
        conversation_id: conversationId,
        customer_name: normalized.name,
        customer_phone: normalized.phone,
        customer_address: normalized.address,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "conversation_id" },
    );
    if (error) console.error("setCustomerInfo failed", error);
  } catch (error) {
    console.error("setCustomerInfo failed", error);
  }
}

export async function getCustomerInfo(conversationId: string): Promise<CustomerInfo | null> {
  try {
    if (!hasSupabaseEnv()) return ensureFlow(conversationId).customerInfo as CustomerInfo | null;
    const client = getSupabaseServerClient();
    if (!client) return null;
    const { data, error } = await client
      .from("conversation_state")
      .select("customer_name,customer_phone,customer_address")
      .eq("conversation_id", conversationId)
      .maybeSingle();
    if (error) {
      console.error("getCustomerInfo failed", error);
      return null;
    }
    if (!data) return null;
    return {
      name: String(data.customer_name ?? "عميل"),
      phone: String(data.customer_phone ?? conversationId),
      address: String(data.customer_address ?? ""),
    };
  } catch (error) {
    console.error("getCustomerInfo failed", error);
    return null;
  }
}

export async function buildOrderSummary(conversationId: string): Promise<string> {
  try {
    const cart = await getCart(conversationId);
    const customer = await getCustomerInfo(conversationId);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const items = cart.map((item) => `- ${item.title} (${item.size}) - ${item.price} جنيه`).join("\n");
    return `طلبك:\n${items}\nالإجمالي: ${total} جنيه\nالاسم: ${customer?.name ?? "عميل"}\nالعنوان: ${customer?.address ?? ""}\nتأكدي؟`;
  } catch (error) {
    console.error("buildOrderSummary failed", error);
    return "طلبك:\nالإجمالي: 0 جنيه\nالاسم: عميل\nالعنوان: \nتأكدي؟";
  }
}

export async function resetConversation(conversationId: string): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      getMockState().conversationFlow.delete(conversationId);
      getMockState().aiPausedConversations.delete(conversationId);
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").delete().eq("conversation_id", conversationId);
    if (error) console.error("resetConversation failed", error);
  } catch (error) {
    console.error("resetConversation failed", error);
  }
}

export async function setAIPaused(conversationId: string, paused: boolean): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      if (paused) getMockState().aiPausedConversations.add(conversationId);
      else getMockState().aiPausedConversations.delete(conversationId);
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").upsert(
      { conversation_id: conversationId, ai_paused: paused, updated_at: new Date().toISOString() },
      { onConflict: "conversation_id" },
    );
    if (error) console.error("setAIPaused failed", error);
  } catch (error) {
    console.error("setAIPaused failed", error);
  }
}

export async function isAIPaused(conversationId: string): Promise<boolean> {
  try {
    if (!hasSupabaseEnv()) {
      return getMockState().aiPausedConversations.has(conversationId);
    }
    const client = getSupabaseServerClient();
    if (!client) return false;
    const { data, error } = await client.from("conversation_state").select("ai_paused").eq("conversation_id", conversationId).maybeSingle();
    if (error) {
      console.error("isAIPaused failed", error);
      return false;
    }
    return data?.ai_paused === true;
  } catch (error) {
    console.error("isAIPaused failed", error);
    return false;
  }
}

export function looksLikeAddress(text: string): boolean {
  const normalized = text.trim();
  return normalized.length > 10 && /[\u0600-\u06FF]/.test(normalized);
}
