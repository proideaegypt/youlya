#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

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
  const res = await fetch(`${apiUrl}/api/v1/workflows/${workflowId}`, {
    headers: { "X-N8N-API-KEY": apiKey },
  });
  if (!res.ok) {
    console.error("Failed to fetch workflow:", res.status);
    process.exit(1);
  }
  const data = await res.json();

  // Sanitize: remove sensitive values but keep structure
  function sanitize(obj) {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(sanitize);
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string" && v.length > 20 && /[A-Za-z0-9+/=]{20,}/.test(v)) {
        out[k] = "<REDACTED>";
      } else if (typeof v === "object" && v !== null) {
        out[k] = sanitize(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  const sanitized = sanitize(data);
  const dateStr = new Date().toISOString().slice(0, 10);
  const dir = `/root/youlya/qa-artifacts/tasks/${dateStr}/activate-n8n-daily-shopify-product-sync`;
  mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, "backup-youlya-daily-shopify-product-sync.json");
  writeFileSync(filePath, JSON.stringify(sanitized, null, 2));
  console.log("Backup saved to:", filePath);
  console.log("Nodes:", (data.nodes || []).map((n) => n.name).join(", "));
  console.log("Active before:", data.active);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
