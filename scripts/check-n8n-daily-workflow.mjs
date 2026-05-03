#!/usr/bin/env node
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

const apiUrl = process.env.N8N_API_URL;
const apiKey = process.env.N8N_API_KEY;

async function main() {
  const res = await fetch(`${apiUrl}/api/v1/workflows`, {
    headers: { "X-N8N-API-KEY": apiKey },
  });
  const data = await res.json();
  const workflows = data.data || [];
  const syncWorkflow = workflows.find((w) => w.name === "Youlya Daily Shopify Product Sync");
  if (!syncWorkflow) {
    console.log(JSON.stringify({ exists: false, active: null, id: null }));
    return;
  }
  console.log(JSON.stringify({ exists: true, active: syncWorkflow.active, id: syncWorkflow.id }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
