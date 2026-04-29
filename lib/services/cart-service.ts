import { getMockState } from "@/lib/adapters/supabase/mock-store";
import type { CartItem } from "@/lib/types/commerce";

export function addCartItems(cartId: string, items: CartItem[]) {
  const state = getMockState();
  const current = state.carts.get(cartId) ?? [];
  state.carts.set(cartId, [...current, ...items]);
}

export function getCartItems(cartId: string): CartItem[] {
  return getMockState().carts.get(cartId) ?? [];
}

export function cartSubtotal(cartId: string): number {
  return getCartItems(cartId).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

