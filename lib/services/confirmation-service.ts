import { getCartItems } from "@/lib/services/cart-service";
import { parseConfirmationMessage } from "@/lib/services/confirmation-parser";
import type { ConfirmationState } from "@/lib/types/commerce";

const explicitPatterns = [/أيوه أكدي/i, /تمام أكدي/i, /اعملي الأوردر/i, /confirm/i, /yes confirm/i];
const ambiguousPatterns = [/^تمام$/i, /^ماشي$/i, /^اوك$/i];
const negativePatterns = [/لسه/i, /هفكر/i, /cancel/i];

export function evaluateConfirmation(input: {
  cartId: string;
  customerMessage: string;
  lastBotMessageType?: string;
  customerDataReady?: boolean;
  shippingReady?: boolean;
}): ConfirmationState {
  const cartItems = getCartItems(input.cartId);
  if (!cartItems.length) return { confirmationStatus: "blocked_missing_data", safeToCreateOrder: false, blockers: ["empty_cart"] };

  if (negativePatterns.some((r) => r.test(input.customerMessage))) {
    return { confirmationStatus: "negative_or_cancelled", safeToCreateOrder: false, blockers: ["customer_not_confirmed"] };
  }
  const parsed = parseConfirmationMessage(input.customerMessage);
  if (explicitPatterns.some((r) => r.test(input.customerMessage)) || parsed.confirmed) {
    const blockers: string[] = [];
    if (!input.customerDataReady) blockers.push("missing_customer_data");
    if (!input.shippingReady) blockers.push("missing_shipping");
    return { confirmationStatus: blockers.length ? "blocked_missing_data" : "explicit_confirmed", safeToCreateOrder: blockers.length === 0, blockers };
  }
  if (ambiguousPatterns.some((r) => r.test(input.customerMessage))) {
    if (input.lastBotMessageType === "final_summary") {
      return { confirmationStatus: "ambiguous_confirm_after_summary", safeToCreateOrder: true, blockers: [] };
    }
    return { confirmationStatus: "ambiguous_needs_clarification", safeToCreateOrder: false, blockers: ["clarification_required"] };
  }

  return { confirmationStatus: "not_confirmation", safeToCreateOrder: false, blockers: ["not_confirmed"] };
}
