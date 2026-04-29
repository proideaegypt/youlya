export type CustomerIdentity = {
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
};

export type CanonicalMessageEvent = {
  scenarioId?: string;
  storeSlug: string;
  channel: string;
  locale: string;
  messageType: "text" | "voice" | "image";
  text: string;
  preconditions?: Record<string, unknown>;
  testMode: boolean;
};

export type InternalMessageTurnInput = {
  store_id: string;
  conversation_id: string;
  customer_id: string;
  channel: "whatsapp_evolution";
  message_type: "text" | "voice" | "image";
  text: string;
  language: string;
  tone: "neutral" | "angry" | "urgent" | "confused" | "ready_to_buy" | "browsing";
  remote_jid: string;
  instance_name: string;
  provider_message_id?: string;
  customer_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  shipping_fee?: number;
  total?: number;
  cart_id?: string;
  testMode?: boolean;
  scenarioId?: string;
  storeSlug?: string;
  _preconditions?: Record<string, unknown>;
};

export type MessageTurnResponse = {
  intent: string;
  toolsCalled: string[];
  reply: string;
  handoff: boolean;
  action: "ai_reply" | "product_results" | "order_created" | "handoff" | "error" | "duplicate_ignored";
  data?: unknown;
};
