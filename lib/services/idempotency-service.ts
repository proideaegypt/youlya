import { getMockState } from "@/lib/adapters/supabase/mock-store";
import crypto from "node:crypto";

export function getIdempotentResult(key: string) {
  return getMockState().orderByIdempotency.get(key);
}

export function setIdempotentResult(key: string, value: { id: string; name: string }) {
  getMockState().orderByIdempotency.set(key, value);
}

type IdempotencyStatus = "created" | "pending";

type IdempotencyStoreEntry = {
  status: IdempotencyStatus;
  order?: { id: string; name: string };
  createdAt: string;
};

const localKeyStore = new Map<string, IdempotencyStoreEntry>();

export function generateOrderIdempotencyKey(input: {
  store_id: string;
  conversation_id: string;
  variant_id: string;
  quantity: number;
  address: string;
}): string {
  const raw = `${input.store_id}:${input.conversation_id}:${input.variant_id}:${input.quantity}:${input.address.trim().toLowerCase()}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function checkIdempotencyKey(store_id: string, key: string): { exists: boolean; order?: { id: string; name: string } } {
  const entry = localKeyStore.get(`${store_id}:${key}`);
  if (!entry) return { exists: false };
  const ageHours = (Date.now() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60);
  if (ageHours > 24) {
    localKeyStore.delete(`${store_id}:${key}`);
    return { exists: false };
  }
  if (entry.status === "created" && entry.order) return { exists: true, order: entry.order };
  return { exists: false };
}

export function markIdempotencyCreated(store_id: string, key: string, order: { id: string; name: string }) {
  localKeyStore.set(`${store_id}:${key}`, { status: "created", order, createdAt: new Date().toISOString() });
}

