#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf-8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}

loadEnv("/root/youlya/.env.production");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || url === "mock") {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  // Resolve store UUID
  const { data: storeData } = await client.from("stores").select("id,slug,name").eq("slug", "youlya").maybeSingle();
  console.log("Store lookup:", storeData ? { id: storeData.id, slug: storeData.slug, name: storeData.name } : null);

  const storeId = storeData?.id || "youlya";

  const { count: pc } = await client.from("products").select("*", { count: "exact", head: true }).eq("store_id", storeId);
  const { count: vc } = await client.from("product_variants").select("*", { count: "exact", head: true }).eq("store_id", storeId);
  const { count: mc } = await client.from("product_variants").select("*", { count: "exact", head: true }).eq("store_id", storeId).eq("code_missing", true);
  const { count: uc } = await client.from("product_variants").select("*", { count: "exact", head: true }).eq("store_id", storeId).eq("inventory_quantity", 0);
  const { count: ac } = await client.from("product_variants").select("*", { count: "exact", head: true }).eq("store_id", storeId).eq("available_for_ai", true);
  const { data: lastSync } = await client.from("products").select("last_synced_at").eq("store_id", storeId).order("last_synced_at", { ascending: false }).limit(1).maybeSingle();

  console.log(JSON.stringify({
    store_id_used: storeId,
    products: pc ?? 0,
    product_variants: vc ?? 0,
    missing_skus: mc ?? 0,
    unavailable_variants: uc ?? 0,
    available_variants: (vc ?? 0) - (uc ?? 0),
    available_for_ai: ac ?? 0,
    max_last_synced_at: lastSync?.last_synced_at || null,
  }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
