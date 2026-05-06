import { NextResponse } from "next/server";
import { shippingSchema } from "@/lib/validation/schemas";
import { getStoreShippingSettings, getShippingZones, calculateShippingFromSettings } from "@/lib/services/shipping-settings-service";

export async function POST(req: Request) {
  const parsed = shippingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const storeId = parsed.data.storeId ?? "youlya";
    const settings = await getStoreShippingSettings(storeId);
    const zones = await getShippingZones(storeId);
    if (!settings) {
      return NextResponse.json({ error: "shipping_settings_missing" }, { status: 500 });
    }
    const result = calculateShippingFromSettings(settings, zones, parsed.data.subtotal ?? 0, parsed.data.city ?? "");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
