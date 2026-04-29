import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types/commerce";

export type Stage = "idle" | "collecting_size" | "collecting_address" | "awaiting_confirmation" | "ordered" | "cancelled";

type CustomerInfo = {
  name?: string;
  phone?: string;
  address?: string;
};

function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function ensureFlow(conversationId: string) {
  const state = getMockState();
  const current = state.conversationFlow.get(conversationId);
  if (current) return current;
  const init = { stage: "idle", cart: [] as CartItem[], customerInfo: null as CustomerInfo | null };
  state.conversationFlow.set(conversationId, init);
  return init;
}

export async function getStage(conversationId: string): Promise<Stage> {
  try {
    if (!hasSupabaseEnv()) return ensureFlow(conversationId).stage as Stage;
    const client = getSupabaseServerClient();
    if (!client) return "idle";
    const { data, error } = await client
      .from("conversation_state")
      .select("stage")
      .eq("conversation_id", conversationId)
      .maybeSingle();
    if (error || !data?.stage) return "idle";
    return String(data.stage) as Stage;
  } catch (error) {
    console.error("getStage failed", error);
    return "idle";
  }
}

export async function setStage(conversationId: string, stage: Stage): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      ensureFlow(conversationId).stage = stage;
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").upsert({
      conversation_id: conversationId,
      stage,
      updated_at: new Date().toISOString(),
    }, { onConflict: "conversation_id" });
    if (error) console.error("setStage failed", error.message);
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
    const { error } = await client.from("conversation_state").upsert({
      conversation_id: conversationId,
      cart_json: cartItems,
      updated_at: new Date().toISOString(),
    }, { onConflict: "conversation_id" });
    if (error) console.error("setCart failed", error.message);
  } catch (error) {
    console.error("setCart failed", error);
  }
}

export async function getCart(conversationId: string): Promise<CartItem[]> {
  try {
    if (!hasSupabaseEnv()) return ensureFlow(conversationId).cart;
    const client = getSupabaseServerClient();
    if (!client) return [];
    const { data, error } = await client
      .from("conversation_state")
      .select("cart_json")
      .eq("conversation_id", conversationId)
      .maybeSingle();
    if (error || !Array.isArray(data?.cart_json)) return [];
    return data.cart_json as CartItem[];
  } catch (error) {
    console.error("getCart failed", error);
    return [];
  }
}

export async function setCustomerInfo(conversationId: string, info: CustomerInfo): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      const flow = ensureFlow(conversationId);
      flow.customerInfo = { ...(flow.customerInfo ?? {}), ...info };
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").upsert({
      conversation_id: conversationId,
      customer_name: info.name ?? null,
      customer_phone: info.phone ?? null,
      customer_address: info.address ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "conversation_id" });
    if (error) console.error("setCustomerInfo failed", error.message);
  } catch (error) {
    console.error("setCustomerInfo failed", error);
  }
}

export async function getCustomerInfo(conversationId: string): Promise<CustomerInfo | null> {
  try {
    if (!hasSupabaseEnv()) return ensureFlow(conversationId).customerInfo;
    const client = getSupabaseServerClient();
    if (!client) return null;
    const { data, error } = await client
      .from("conversation_state")
      .select("customer_name,customer_phone,customer_address")
      .eq("conversation_id", conversationId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      name: data.customer_name ? String(data.customer_name) : undefined,
      phone: data.customer_phone ? String(data.customer_phone) : undefined,
      address: data.customer_address ? String(data.customer_address) : undefined,
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
    if (!cart.length) return "السلة فاضية حالياً. ابعتي رقم المنتج والمقاس الأول.";
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsText = cart
      .map((item) => `- ${item.shopifyProductTitle} / ${item.size ?? "N/A"} / ${item.quantity} × ${item.price}`)
      .join("\n");

    return [
      "ملخص الطلب:",
      itemsText,
      `- الإجمالي: ${subtotal} EGP`,
      `- الاسم: ${customer?.name ?? "غير مكتمل"}`,
      `- الموبايل: ${customer?.phone ?? "غير مكتمل"}`,
      `- العنوان: ${customer?.address ?? "غير مكتمل"}`,
    ].join("\n");
  } catch (error) {
    console.error("buildOrderSummary failed", error);
    return "حصلت مشكلة في تجهيز الملخص. ممكن نعيد المحاولة؟";
  }
}

export async function resetConversation(conversationId: string): Promise<void> {
  try {
    if (!hasSupabaseEnv()) {
      getMockState().conversationFlow.delete(conversationId);
      return;
    }
    const client = getSupabaseServerClient();
    if (!client) return;
    const { error } = await client.from("conversation_state").delete().eq("conversation_id", conversationId);
    if (error) console.error("resetConversation failed", error.message);
  } catch (error) {
    console.error("resetConversation failed", error);
  }
}

export function looksLikeAddress(text: string): boolean {
  const normalized = text.toLowerCase();
  return /شارع|العنوان|عنوان|القاهرة|اسكندرية|alex|cairo|address|street|مدينة/.test(normalized) || normalized.length >= 14;
}
