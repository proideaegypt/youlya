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
  const res = await fetch(`${apiUrl}/api/v1/executions?workflowId=${workflowId}&limit=5`, {
    headers: { "X-N8N-API-KEY": apiKey },
  });
  if (!res.ok) {
    console.error("Failed:", res.status);
    process.exit(1);
  }
  const data = await res.json();
  const executions = (data.data || []).map((e) => ({
    id: e.id,
    status: e.status,
    startedAt: e.startedAt,
    finishedAt: e.stoppedAt,
  }));
  console.log(JSON.stringify({ executions }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
