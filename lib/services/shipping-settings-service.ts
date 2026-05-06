import { getSupabaseServerClient } from "@/lib/adapters/supabase/server";

export type ShippingZone = {
  id: string;
  store_id: string;
  governorate: string;
  district: string | null;
  aliases: string[];
  shipping_fee_egp: number;
  active: boolean;
};

export type StoreShippingSettings = {
  store_id: string;
  free_shipping_threshold_egp: number;
  default_currency: string;
  unknown_area_policy: "ask_clarify" | "use_default" | "reject";
  default_shipping_fee_egp: number;
};

export async function getStoreShippingSettings(storeId: string): Promise<StoreShippingSettings | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("store_shipping_settings")
    .select("store_id, free_shipping_threshold_egp, default_currency, unknown_area_policy, default_shipping_fee_egp")
    .eq("store_id", storeId)
    .maybeSingle();
  if (!data) return null;
  return data as StoreShippingSettings;
}

export async function getShippingZones(storeId: string): Promise<ShippingZone[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("shipping_zones")
    .select("id, store_id, governorate, district, aliases, shipping_fee_egp, active")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("governorate", { ascending: true });
  return (data ?? []) as ShippingZone[];
}

export async function updateStoreShippingSettings(
  storeId: string,
  values: Partial<StoreShippingSettings>,
  actorUserId?: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  const { error } = await supabase
    .from("store_shipping_settings")
    .upsert({ ...values, store_id: storeId, updated_by: actorUserId, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function addShippingZone(
  storeId: string,
  zone: Omit<ShippingZone, "id" | "store_id">,
  actorUserId?: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  const { error } = await supabase
    .from("shipping_zones")
    .insert({ ...zone, store_id: storeId });
  if (error) throw error;
}

export async function updateShippingZone(
  zoneId: string,
  values: Partial<ShippingZone>,
  actorUserId?: string
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  const { error } = await supabase
    .from("shipping_zones")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", zoneId);
  if (error) throw error;
}

export async function deactivateShippingZone(zoneId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("supabase_unavailable");
  const { error } = await supabase
    .from("shipping_zones")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", zoneId);
  if (error) throw error;
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function matchShippingZone(zones: ShippingZone[], addressText: string): ShippingZone | null {
  const normalized = normalizeText(addressText);
  for (const zone of zones) {
    const govMatch = normalizeText(zone.governorate);
    if (normalized.includes(govMatch)) return zone;
    if (zone.district) {
      const districtMatch = normalizeText(zone.district);
      if (normalized.includes(districtMatch)) return zone;
    }
    for (const alias of zone.aliases ?? []) {
      if (normalized.includes(normalizeText(alias))) return zone;
    }
  }
  return null;
}

export function calculateShippingFromSettings(
  settings: StoreShippingSettings,
  zones: ShippingZone[],
  subtotal: number,
  addressText: string
) {
  if (subtotal >= settings.free_shipping_threshold_egp) {
    return {
      subtotal,
      shippingFee: 0,
      total: subtotal,
      freeShippingApplied: true,
      matchedZone: null,
      unknownArea: false,
    };
  }

  const matched = matchShippingZone(zones, addressText);
  if (matched) {
    const fee = matched.shipping_fee_egp;
    return {
      subtotal,
      shippingFee: fee,
      total: subtotal + fee,
      freeShippingApplied: false,
      matchedZone: matched,
      unknownArea: false,
    };
  }

  if (settings.unknown_area_policy === "ask_clarify") {
    return {
      subtotal,
      shippingFee: null,
      total: null,
      freeShippingApplied: false,
      matchedZone: null,
      unknownArea: true,
    };
  }

  const fallbackFee = settings.default_shipping_fee_egp;
  return {
    subtotal,
    shippingFee: fallbackFee,
    total: subtotal + fallbackFee,
    freeShippingApplied: false,
    matchedZone: null,
    unknownArea: true,
  };
}
