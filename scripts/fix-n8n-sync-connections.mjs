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
  // Fetch current workflow
  const getRes = await fetch(`${apiUrl}/api/v1/workflows/${workflowId}`, {
    headers: { "X-N8N-API-KEY": apiKey },
  });
  if (!getRes.ok) {
    console.error("Failed to fetch workflow:", getRes.status);
    process.exit(1);
  }
  const workflow = await getRes.json();

  // Fix connections
  workflow.connections["Check Success"] = {
    main: [
      [],
      [
        {
          node: "Dead Letter",
          type: "main",
          index: 0,
        },
      ],
    ],
  };

  // Build minimal update payload with only allowed fields
  const payload = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings,
    staticData: workflow.staticData,
  };

  const putRes = await fetch(`${apiUrl}/api/v1/workflows/${workflowId}`, {
    method: "PUT",
    headers: { "X-N8N-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!putRes.ok) {
    console.error("Failed to update workflow:", putRes.status, await putRes.text());
    process.exit(1);
  }

  const confirmRes = await fetch(`${apiUrl}/api/v1/workflows/${workflowId}`, {
    headers: { "X-N8N-API-KEY": apiKey },
  });
  const confirm = await confirmRes.json();
  console.log(JSON.stringify({
    updated: true,
    active: confirm.active,
    connections: confirm.connections["Check Success"],
  }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
