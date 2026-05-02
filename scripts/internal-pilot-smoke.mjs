#!/usr/bin/env node
/**
 * Internal Pilot Smoke Test
 *
 * Verifies internal endpoints are reachable and responding correctly
 * without creating real orders or side effects.
 *
 * Run: node scripts/internal-pilot-smoke.mjs
 */

const BASE_URL = process.env.APP_URL || "https://admin.youlya365.com";

async function smoke(name, method, path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(opts.headers || {}),
      },
      ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
    });
    const duration = Date.now() - start;
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return {
      name,
      url,
      status: res.status,
      ok: res.ok,
      duration,
      json,
      text: text.length > 500 ? text.slice(0, 500) + "..." : text,
    };
  } catch (err) {
    return {
      name,
      url,
      status: 0,
      ok: false,
      duration: Date.now() - start,
      error: err.message,
    };
  }
}

function print(result) {
  const icon = result.ok ? "✓" : "✗";
  const status = result.status || "ERR";
  console.log(`${icon} ${result.name} [${status}] ${result.duration}ms`);
  if (!result.ok) {
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    } else {
      console.log(`  Response: ${result.text}`);
    }
  }
}

async function main() {
  console.log(`Internal Pilot Smoke Test`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log("");

  const results = [];

  // Public health endpoints
  results.push(await smoke("Health", "GET", "/api/health"));
  results.push(await smoke("Build Info", "GET", "/api/build-info"));

  // Dashboard APIs (should return 401 without auth)
  results.push(await smoke("Dashboard Stats (no auth)", "GET", "/api/dashboard/stats"));
  results.push(await smoke("Dashboard Logs (no auth)", "GET", "/api/dashboard/logs"));
  results.push(await smoke("Dashboard Orders (no auth)", "GET", "/api/dashboard/orders"));
  results.push(await smoke("Dashboard Settings (no auth)", "GET", "/api/dashboard/settings"));

  // Internal APIs (should return 401 without secret)
  results.push(await smoke("Internal Messages Turn (no secret)", "POST", "/api/internal/messages/turn", {
    body: { message: "test", store_id: "youlya" },
    headers: { "Content-Type": "application/json" },
  }));

  results.push(await smoke("Internal Failed Events (no secret)", "GET", "/api/internal/failed-events"));

  // Evolution webhook (should return 401 without auth)
 results.push(await smoke("Evolution Webhook (no auth)", "POST", "/api/webhooks/evolution", {
    body: { event: "messages.upsert", data: { message: { conversation: "test", messageTimestamp: Date.now() } } },
    headers: { "Content-Type": "application/json" },
  }));

  // AI Tools (should return 401 without auth)
  results.push(await smoke("AI Product Search (no auth)", "POST", "/api/ai/tools/product-search", {
    body: { query: "بيجامة" },
    headers: { "Content-Type": "application/json" },
  }));

  console.log("");
  console.log("Results:");
  console.log("--------");
  for (const r of results) {
    print(r);
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  console.log("");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  // Expect public endpoints to pass, auth-required endpoints to return 401
  const unexpectedFailures = results.filter((r) => {
    if (r.name.includes("(no auth)") || r.name.includes("(no secret)")) {
      return r.status !== 401 && r.status !== 403;
    }
    return !r.ok;
  });

  if (unexpectedFailures.length > 0) {
    console.log("");
    console.log("Unexpected failures (not 401/403 for auth endpoints):");
    for (const r of unexpectedFailures) {
      console.log(`  - ${r.name}: ${r.status}`);
    }
    process.exit(1);
  }

  console.log("");
  console.log("All checks passed.");
  process.exit(0);
}

main();
