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
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  const storeId = "ef77af08-688d-4354-8096-d89f6046f0c2";

  // Count negative inventory
  const { count: neg } = await client.from("product_variants").select("*", { count: "exact", head: true }).eq("store_id", storeId).lt("inventory_quantity", 0);
  // Count zero inventory
  const { count: zero } = await client.from("product_variants").select("*", { count: "exact", head: true }).eq("store_id", storeId).eq("inventory_quantity", 0);
  // Count <= 0 using filter (approx)
  console.log(JSON.stringify({ negative: neg ?? 0, zero: zero ?? 0, total_unavailable: (neg ?? 0) + (zero ?? 0) }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
