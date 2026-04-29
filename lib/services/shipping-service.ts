import { getServerEnv } from "@/lib/config/env";
import { cartSubtotal } from "@/lib/services/cart-service";
import type { ShippingQuote } from "@/lib/types/commerce";

export function calculateShipping(cartId: string, city: string): ShippingQuote {
  const env = getServerEnv();
  const subtotal = cartSubtotal(cartId);
  const normalized = city.trim().toLowerCase();

  let shippingFee = 0;
  if (subtotal >= env.FREE_SHIPPING_THRESHOLD_EGP) {
    shippingFee = 0;
  } else if (normalized.includes("القاهرة") || normalized.includes("cairo")) {
    shippingFee = env.SHIPPING_CAIRO_EGP;
  } else if (normalized.includes("اسكندرية") || normalized.includes("alex")) {
    shippingFee = env.SHIPPING_ALEXANDRIA_EGP;
  } else {
    throw new Error("UNKNOWN_CITY_SHIPPING");
  }

  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    freeShippingApplied: shippingFee === 0,
    cityNormalized: normalized,
    currency: "EGP",
  };
}

