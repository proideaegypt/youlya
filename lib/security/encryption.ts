import "server-only";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const raw = process.env.SETTINGS_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) {
    throw new Error("SETTINGS_ENCRYPTION_KEY is missing or too short (min 32 chars)");
  }
  return Buffer.from(raw.slice(0, 32), "utf-8");
}

export function encryptSecret(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag();
  return {
    ciphertext: encrypted,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decryptSecret(payload: { ciphertext: string; iv: string; tag: string }): string {
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  let decrypted = decipher.update(payload.ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function serializeEncrypted(payload: { ciphertext: string; iv: string; tag: string }): string {
  return JSON.stringify(payload);
}

export function deserializeEncrypted(serialized: string): { ciphertext: string; iv: string; tag: string } {
  return JSON.parse(serialized);
}

export function maskSecret(value: string): { masked: string; last4: string } {
  const last4 = value.slice(-4);
  return { masked: "•".repeat(Math.max(value.length - 4, 8)) + last4, last4 };
}

export function isEncryptionAvailable(): boolean {
  const raw = process.env.SETTINGS_ENCRYPTION_KEY;
  return Boolean(raw && raw.length >= 32);
}
