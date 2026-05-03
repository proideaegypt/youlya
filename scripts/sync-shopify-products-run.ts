#!/usr/bin/env tsx
/**
 * sync-shopify-products-run.ts
 * Temporary runner for Shopify product sync dry-run.
 */
import { syncShopifyProducts } from "../lib/services/shopify-product-sync-service";

const args = process.argv.slice(2);
let mode: "full" | "inventory" = "full";
let dryRun = false;
let storeId = "youlya";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--mode" && args[i + 1]) mode = args[i + 1] as "full" | "inventory";
  if (args[i] === "--dry-run") dryRun = true;
  if (args[i] === "--store-id" && args[i + 1]) storeId = args[i + 1];
}

console.log("=".repeat(50));
console.log("SHOPIFY PRODUCT SYNC");
console.log("=".repeat(50));
console.log(`Store: ${storeId}`);
console.log(`Mode: ${mode}`);
console.log(`Dry run: ${dryRun}`);
console.log("");

(async () => {
  const result = await syncShopifyProducts({ storeId, mode, source: "manual", dryRun });

  console.log("=".repeat(50));
  if (result.ok) {
    console.log("STATUS: SUCCESS");
    console.log(`Products synced: ${result.syncedProducts}`);
    console.log(`Variants synced: ${result.syncedVariants}`);
    console.log(`Missing SKUs: ${result.missingSkuCount}`);
    console.log(`Unavailable variants: ${result.unavailableCount}`);
    console.log(`Duration: ${result.durationMs}ms`);
    if (result.dryRun) {
      console.log("(Dry run — no data written)");
    }
  } else {
    console.log("STATUS: FAILED");
    console.log(`Error code: ${result.errorCode}`);
    console.log(`Message: ${result.safeMessage}`);
  }
  console.log("=".repeat(50));

  process.exit(result.ok ? 0 : 1);
})();
