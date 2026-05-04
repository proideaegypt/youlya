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
const workflowId = "H7l8PiCss9ZeqGug";

async function main() {
  const res = await fetch(`${apiUrl}/api/v1/workflows/${workflowId}`, {
    headers: { "X-N8N-API-KEY": apiKey },
  });
  if (!res.ok) {
    console.error("Failed to fetch workflow:", res.status, res.statusText);
    process.exit(1);
  }
  const data = await res.json();

  // Sanitize: only report structural info, not env values
  const nodes = data.nodes || [];
  const nodeNames = nodes.map((n) => n.name);

  const hasSyncEndpoint = JSON.stringify(data).includes("/api/internal/shopify/sync-products");
  const hasInternalSecret = JSON.stringify(data).includes("INTERNAL_API_SECRET");
  const hasShopifyDomain = JSON.stringify(data).includes("SHOPIFY_STORE_DOMAIN");
  const hasShopifyToken = JSON.stringify(data).includes("SHOPIFY_ADMIN_API_TOKEN");
  const hasOrderEndpoint = JSON.stringify(data).includes("/api/ai/tools/create-shopify-order");

  console.log(JSON.stringify({
    id: data.id,
    name: data.name,
    active: data.active,
    nodes: nodeNames,
    hasSyncEndpoint,
    hasInternalSecret,
    hasShopifyDomain,
    hasShopifyToken,
    hasOrderEndpoint,
    connections: Object.keys(data.connections || {}),
  }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
