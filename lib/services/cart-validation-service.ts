export type CartValidationInput = {
  variant_id?: string;
  quantity?: number;
  customer_full_name?: string;
  phone?: string;
  address?: string;
  shipping_fee?: number;
  total?: number;
  explicit_confirmation_text?: string;
};

export type CartValidationResult = {
  valid: boolean;
  missing_fields: string[];
};

export function validateCartForOrder(input: CartValidationInput): CartValidationResult {
  const missing: string[] = [];
  if (!input.variant_id) missing.push("variant_id");
  if (!input.quantity || input.quantity <= 0) missing.push("quantity");
  if (!input.customer_full_name) missing.push("customer_full_name");
  if (!input.phone) missing.push("phone");
  if (!input.address) missing.push("address");
  if (typeof input.shipping_fee !== "number") missing.push("shipping_fee");
  if (typeof input.total !== "number") missing.push("total");
  if (!input.explicit_confirmation_text) missing.push("explicit_confirmation_text");
  return { valid: missing.length === 0, missing_fields: missing };
}

