#!/usr/bin/env node
import { readFileSync } from "fs";

function loadEnv(p) {
  try {
    const text = readFileSync(p, "utf-8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}

loadEnv("/root/youlya/.env.production");

const url = process.env.APP_INTERNAL_URL || "http://localhost:3000";
const secret = process.env.INTERNAL_API_SECRET;

async function main() {
  const res = await fetch(`${url}/api/internal/shopify/sync-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": secret,
    },
    body: JSON.stringify({ store_id: "youlya", mode: "full", source: "n8n_daily" }),
  });
  const data = await res.json().catch(() => ({ error: res.statusText }));
  console.log(JSON.stringify({ status: res.status, data }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
