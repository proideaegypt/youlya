import { describe, expect, test } from "vitest";
import { calculateShippingFromSettings } from "@/lib/services/shipping-settings-service";
import type { ShippingZone, StoreShippingSettings } from "@/lib/services/shipping-settings-service";
import { canManageSecrets, canManageChannels, canManageShipping, canManageRoles } from "@/lib/auth/roles";
import { encryptSecret, decryptSecret, serializeEncrypted, deserializeEncrypted, maskSecret } from "@/lib/security/encryption";

describe("shipping settings db rules", () => {
  const settings: StoreShippingSettings = {
    store_id: "youlya",
    free_shipping_threshold_egp: 1400,
    default_currency: "EGP",
    unknown_area_policy: "ask_clarify",
    default_shipping_fee_egp: 70,
  };

  const zones: ShippingZone[] = [
    { id: "1", store_id: "youlya", governorate: "Cairo", district: "Nasr City", aliases: ["مدينة نصر", "Nasr City", "Madinet Nasr"], shipping_fee_egp: 70, active: true },
    { id: "2", store_id: "youlya", governorate: "Cairo", district: null, aliases: ["القاهرة", "Cairo"], shipping_fee_egp: 70, active: true },
    { id: "3", store_id: "youlya", governorate: "Alexandria", district: null, aliases: ["الإسكندرية", "Alexandria", "Alex"], shipping_fee_egp: 90, active: true },
  ];

  test("Nasr City maps to Cairo/Nasr City fee 70", () => {
    const result = calculateShippingFromSettings(settings, zones, 1000, "مدينة نصر");
    expect(result.shippingFee).toBe(70);
    expect(result.total).toBe(1070);
    expect(result.freeShippingApplied).toBe(false);
  });

  test("Arabic alias مدينة نصر works", () => {
    const result = calculateShippingFromSettings(settings, zones, 500, "أحمد، ١٢ شارع عباس العقاد، مدينة نصر");
    expect(result.shippingFee).toBe(70);
    expect(result.matchedZone).not.toBeNull();
    expect(result.matchedZone?.district).toBe("Nasr City");
  });

  test("free shipping threshold 1400 applies", () => {
    const result = calculateShippingFromSettings(settings, zones, 1500, "Cairo");
    expect(result.freeShippingApplied).toBe(true);
    expect(result.shippingFee).toBe(0);
    expect(result.total).toBe(1500);
  });

  test("unknown area asks clarify", () => {
    const result = calculateShippingFromSettings(settings, zones, 1000, "some unknown place");
    expect(result.unknownArea).toBe(true);
    expect(result.shippingFee).toBeNull();
    expect(result.total).toBeNull();
  });
});

describe("RBAC role checks", () => {
  test("super_admin can manage everything", () => {
    expect(canManageSecrets("super_admin")).toBe(true);
    expect(canManageChannels("super_admin")).toBe(true);
    expect(canManageShipping("super_admin")).toBe(true);
    expect(canManageRoles("super_admin")).toBe(true);
  });

  test("moderator cannot manage secrets", () => {
    expect(canManageSecrets("moderator")).toBe(false);
    expect(canManageChannels("moderator")).toBe(false);
    expect(canManageShipping("moderator")).toBe(true);
    expect(canManageRoles("moderator")).toBe(false);
  });

  test("customer_service cannot manage channels or secrets", () => {
    expect(canManageSecrets("customer_service")).toBe(false);
    expect(canManageChannels("customer_service")).toBe(false);
    expect(canManageShipping("customer_service")).toBe(false);
    expect(canManageRoles("customer_service")).toBe(false);
  });
});

describe("encryption and masking", () => {
  test("encrypt and decrypt roundtrip", () => {
    process.env.SETTINGS_ENCRYPTION_KEY = "a".repeat(32);
    const plaintext = "sk-test-1234";
    const encrypted = encryptSecret(plaintext);
    const decrypted = decryptSecret(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  test("maskSecret shows last4 only", () => {
    const { masked, last4 } = maskSecret("sk-test-1234");
    expect(last4).toBe("1234");
    expect(masked.includes("1234")).toBe(true);
    expect(masked.startsWith("•")).toBe(true);
  });

  test("serialize and deserialize encrypted payload", () => {
    process.env.SETTINGS_ENCRYPTION_KEY = "b".repeat(32);
    const encrypted = encryptSecret("secret");
    const serialized = serializeEncrypted(encrypted);
    const deserialized = deserializeEncrypted(serialized);
    expect(deserialized.ciphertext).toBe(encrypted.ciphertext);
    expect(deserialized.iv).toBe(encrypted.iv);
    expect(deserialized.tag).toBe(encrypted.tag);
  });
});
