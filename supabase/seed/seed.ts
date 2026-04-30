import { createClient } from "@supabase/supabase-js";

async function runSeed() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey || process.env.TEST_MODE === "true" || url === "mock") {
    console.log("[seed] skipped (mock/test or missing Supabase credentials)");
    return;
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

  const storeId = "youlya-test";

  await supabase.from("stores").upsert({ id: storeId, slug: "youlya-test", name: "Youlya Test Store" }, { onConflict: "id" });

  await supabase.from("users_roles").upsert(
    {
      store_id: storeId,
      user_id: "owner-user",
      role: "owner",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "store_id,user_id" },
  );

  const sample = [1, 2, 3, 4, 5].map((slot) => ({
    conversation_id: "00000000-0000-0000-0000-000000000001",
    slot_number: slot,
    shopify_product_id: `mock-product-${slot}`,
    shopify_variant_id: `mock-variant-${slot}`,
    title: `Sample Product ${slot}`,
    price: 100 + slot * 10,
    image_url: null,
    size_asked: "M",
    updated_at: new Date().toISOString(),
  }));

  await supabase.from("last_product_recommendations").upsert(sample, { onConflict: "conversation_id,slot_number" });
  console.log("[seed] done");
}

void runSeed();
