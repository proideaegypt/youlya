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
const executionId = "9281";

async function main() {
  const res = await fetch(`${apiUrl}/api/v1/executions/${executionId}`, {
    headers: { "X-N8N-API-KEY": apiKey },
  });
  if (!res.ok) {
    console.error("Failed:", res.status);
    process.exit(1);
  }
  const data = await res.json();
  // Extract node-level results without printing secrets
  const workflow = data.workflow || {};
  const resultData = data.data || {};
  const nodeNames = Object.keys(resultData.resultData?.runData || {});
  const nodeStatuses = nodeNames.map((name) => {
    const runs = resultData.resultData?.runData?.[name] || [];
    return { name, status: runs[0]?.executionStatus || "unknown", error: runs[0]?.error?.message || null };
  });
  console.log(JSON.stringify({
    executionId: data.id,
    workflowId: workflow.id,
    workflowName: workflow.name,
    status: data.status,
    startedAt: data.startedAt,
    stoppedAt: data.stoppedAt,
    nodes: nodeStatuses,
  }, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
