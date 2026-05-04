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

const apiUrl = process.env.N8N_API_URL;
const apiKey = process.env.N8N_API_KEY;
const workflowId = "H7l8PiCss9ZeqGug";

async function main() {
  const res = await fetch(`${apiUrl}/api/v1/workflows/${workflowId}/execute`, {
    method: "POST",
    headers: { "X-N8N-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({ error: res.statusText }));
  console.log(JSON.stringify({ status: res.status, data }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
