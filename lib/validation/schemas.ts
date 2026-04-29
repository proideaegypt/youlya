import { z } from "zod";

export const messageTurnSchema = z.object({
  scenarioId: z.string().optional(),
  storeSlug: z.string().min(1),
  channel: z.string().min(1),
  locale: z.string().min(1),
  messageType: z.enum(["text", "voice", "image"]),
  text: z.string(),
  preconditions: z.record(z.string(), z.unknown()).optional(),
  testMode: z.boolean().default(false),
});

export const internalMessageTurnSchema = z.object({
  store_id: z.string().min(1),
  conversation_id: z.string().min(1),
  customer_id: z.string().min(1),
  channel: z.literal("whatsapp_evolution"),
  message_type: z.enum(["text", "voice", "image"]),
  text: z.string(),
  language: z.string().min(1),
  tone: z.enum(["neutral", "angry", "urgent", "confused", "ready_to_buy", "browsing"]),
  remote_jid: z.string().min(1),
  instance_name: z.string().min(1),
  provider_message_id: z.string().min(1),
  customer_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  shipping_fee: z.number().optional(),
  total: z.number().optional(),
  cart_id: z.string().optional(),
  testMode: z.boolean().optional().default(false),
  scenarioId: z.string().optional(),
  storeSlug: z.string().optional(),
});

export const productSearchSchema = z.object({
  storeSlug: z.string().min(1),
  conversationId: z.string().min(1),
  customerId: z.string().min(1),
  query: z.string().min(1),
  limit: z.number().int().min(1).max(10).default(10),
  testMode: z.boolean().default(false),
});

export const selectProductSchema = z.object({
  storeSlug: z.string().min(1),
  conversationId: z.string().min(1),
  customerId: z.string().min(1),
  selectionText: z.string().min(1),
  testMode: z.boolean().default(false),
});

export const shippingSchema = z.object({
  storeSlug: z.string().min(1),
  cartId: z.string().min(1),
  city: z.string().min(1),
  testMode: z.boolean().default(false),
});

export const confirmOrderSchema = z.object({
  storeSlug: z.string().min(1),
  conversationId: z.string().min(1),
  cartId: z.string().min(1),
  customerMessage: z.string().min(1),
  lastBotMessageType: z.string().optional(),
  testMode: z.boolean().default(false),
});

export const createOrderSchema = z.object({
  store_id: z.string().min(1),
  conversation_id: z.string().min(1),
  variant_id: z.string().min(1),
  quantity: z.number().int().min(1),
  customer_name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  shipping_fee: z.number(),
  total: z.number(),
  explicit_confirmation_text: z.string().min(1),
  idempotency_key: z.string().optional(),
});

export const handoffSchema = z.object({
  storeSlug: z.string().min(1),
  conversationId: z.string().min(1),
  reason: z.string().min(1),
  locale: z.string().default("ar-EG"),
  testMode: z.boolean().default(false),
});
