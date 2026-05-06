import { z } from "./node_modules/zod/lib/index.mjs";

const internalMessageTurnSchema = z.object({
  store_id: z.string().min(1),
  conversation_id: z.string().min(1).optional(),
  customer_id: z.string().min(1),
  channel: z.literal("whatsapp_evolution"),
  message_type: z.enum(["text", "voice", "image"]),
  text: z.string(),
  language: z.string().min(1),
  tone: z.enum(["neutral", "angry", "urgent", "confused", "ready_to_buy", "browsing"]),
  remote_jid: z.string().min(1),
  instance_name: z.string().min(1),
  provider_message_id: z.string().min(1).optional(),
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
  _preconditions: z.record(z.string(), z.unknown()).optional(),
});

const body = {
  store_id: "youlya",
  channel: "whatsapp_evolution",
  locale: "ar-EG",
  message_type: "text",
  text: "هاي",
  provider_message_id: "tone-001",
  customer_id: "201111839150",
  conversation_id: "tone-conv-001",
  remote_jid: "201111839150@s.whatsapp.net",
  instance_name: "AI",
  tone: "neutral",
  testMode: true
};

const result = internalMessageTurnSchema.safeParse(body);
console.log("success:", result.success);
if (!result.success) {
  console.log("errors:", result.error.flatten());
} else {
  console.log("data conversation_id:", result.data.conversation_id);
}
