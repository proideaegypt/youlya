#!/usr/bin/env node
/**
 * assert-shopify-sync-readonly.mjs
 * Scans Shopify sync-related source files and fails if any forbidden
 * Shopify mutation/write patterns are found.
 *
 * Allowed:
 *   - GraphQL POST to Shopify with query-only (e.g., query GetProducts)
 *   - Internal app POST endpoints
 *   - Order creation adapters (outside product sync path)
 *
 * Forbidden in product sync path:
 *   - GraphQL mutation
 *   - productCreate, productUpdate, productDelete
 *   - productVariantUpdate
 *   - inventoryAdjust, inventorySet, inventoryBulk
 *   - metafieldsSet, collectionUpdate
 *   - REST PUT/PATCH/DELETE to Shopify product/variant/inventory endpoints
 */

import { readFileSync, existsSync } from "fs";
import path from "path";

const SYNC_FILES = [
  "lib/adapters/shopify/shopify-product-sync-adapter.ts",
  "lib/services/shopify-product-sync-service.ts",
  "app/api/internal/shopify/sync-products/route.ts",
  "scripts/sync-shopify-products.ts",
  "n8n/workflows/youlya-daily-shopify-product-sync.json",
];

const FORBIDDEN_PATTERNS = [
  { name: "GraphQL mutation", regex: /\bmutation\b/i },
  { name: "productCreate", regex: /\bproductCreate\b/i },
  { name: "productUpdate", regex: /\bproductUpdate\b/i },
  { name: "productDelete", regex: /\bproductDelete\b/i },
  { name: "productVariantUpdate", regex: /\bproductVariantUpdate\b/i },
  { name: "inventoryAdjust", regex: /\binventoryAdjust\w*/i },
  { name: "inventorySet", regex: /\binventorySet\w*/i },
  { name: "inventoryBulk", regex: /\binventoryBulk\w*/i },
  { name: "metafieldsSet", regex: /\bmetafieldsSet\b/i },
  { name: "collectionUpdate", regex: /\bcollectionUpdate\b/i },
  { name: "REST PUT to Shopify", regex: /method:\s*["']PUT["']/i },
  { name: "REST PATCH to Shopify", regex: /method:\s*["']PATCH["']/i },
  { name: "REST DELETE to Shopify", regex: /method:\s*["']DELETE["']/i },
  { name: "REST POST to product/variant JSON", regex: /\/(products|variants|inventory)\/[^\s"']*\.json/i },
];

let exitCode = 0;
const violations = [];

function relative(p) {
  return path.relative(process.cwd(), p);
}

console.log("=".repeat(60));
console.log("SHOPIFY SYNC READ-ONLY ASSERTION");
console.log("=".repeat(60));
console.log("");

for (const filePath of SYNC_FILES) {
  const absPath = path.resolve(process.cwd(), filePath);
  if (!existsSync(absPath)) {
    console.log(`  SKIP  ${filePath} (not found)`);
    continue;
  }

  const content = readFileSync(absPath, "utf-8");
  const rel = relative(absPath);
  let fileViolations = [];

  for (const fp of FORBIDDEN_PATTERNS) {
    if (fp.regex.test(content)) {
      fileViolations.push(fp.name);
    }
  }

  if (fileViolations.length > 0) {
    exitCode = 1;
    violations.push({ file: rel, patterns: fileViolations });
  } else {
    console.log(`  PASS  ${rel}`);
  }
}

console.log("");

if (violations.length > 0) {
  console.log("FAIL — Forbidden Shopify write patterns found:");
  for (const v of violations) {
    console.log(`  ${v.file}`);
    for (const p of v.patterns) {
      console.log(`    - ${p}`);
    }
  }
} else {
  console.log("PASS — No forbidden Shopify mutation/write patterns found in product sync path.");
}

console.log("");
console.log("=".repeat(60));
process.exit(exitCode);
