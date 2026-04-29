export type ProductVariantOption = {
  shopifyVariantId: string;
  sku: string | null;
  codeMissing: boolean;
  title: string;
  size?: string;
  color?: string;
  price: number;
  currency: "EGP";
  inventoryQuantity: number;
  available: boolean;
};

export type ProductRecommendation = {
  index: number;
  productId: string;
  shopifyProductId: string;
  shopifyProductTitle: string;
  shopifyHandle: string;
  imageUrl?: string;
  variantOptions: ProductVariantOption[];
};

export type ProductSearchInput = {
  storeSlug: string;
  conversationId: string;
  customerId: string;
  query: string;
  limit?: number;
  testMode: boolean;
};

export type ProductSearchOutput = {
  recommendations: ProductRecommendation[];
  mappingPersisted: boolean;
};

export type SelectProductInput = {
  storeSlug: string;
  conversationId: string;
  customerId: string;
  selectionText: string;
  testMode: boolean;
};

export type CartItem = {
  index: number;
  shopifyProductTitle: string;
  shopifyVariantId: string;
  sku: string | null;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  inStock: boolean;
};

export type SelectProductOutput = {
  status: "added_to_cart" | "needs_size" | "mapping_expired" | "oos" | "not_found";
  items: CartItem[];
  missing: string[];
  blocked: string[];
};

export type ShippingQuote = {
  subtotal: number;
  shippingFee: number;
  total: number;
  freeShippingApplied: boolean;
  cityNormalized: string;
  currency: "EGP";
};

export type ConfirmationState = {
  confirmationStatus:
    | "explicit_confirmed"
    | "ambiguous_confirm_after_summary"
    | "ambiguous_needs_clarification"
    | "negative_or_cancelled"
    | "not_confirmation"
    | "blocked_missing_data";
  safeToCreateOrder: boolean;
  blockers: string[];
};

export type CreateShopifyOrderInput = {
  storeSlug: string;
  conversationId: string;
  cartId: string;
  idempotencyKey: string;
  testMode: boolean;
};

export type CreateShopifyOrderOutput = {
  status: "created" | "idempotent_return" | "failed";
  testMode: boolean;
  shopifyOrderId?: string;
  shopifyOrderName?: string;
  duplicate: boolean;
  error?: string;
};

export type ToolCallLog = {
  toolName: string;
  inputSummary: Record<string, unknown>;
  outputSummary: Record<string, unknown>;
  status: "ok" | "error";
  latencyMs: number;
  errorCode?: string;
  errorMessage?: string;
};

export type AuditLog = {
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};

export type HandoffTicket = {
  id: string;
  reason: string;
  locale: string;
  createdAt: string;
};

