import fs from 'node:fs';
import path from 'node:path';

const defaultFile = path.join(process.cwd(), 'docs/data/shopify_product_import_template.csv');
const file = process.argv[2] ?? path.join(process.cwd(), 'docs/data/shopify_products.csv');
const fallbackFile = fs.existsSync(file) ? file : defaultFile;

const text = fs.readFileSync(fallbackFile, 'utf8').trim();
if (!text) {
  console.error('Shopify product validation failed: file is empty');
  process.exit(1);
}

function parseCsvLine(line) {
  const out = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

const [headerLine, ...rowLines] = text.split(/\r?\n/).filter(Boolean);
const headers = parseCsvLine(headerLine);
const required = [
  'shopify_product_id',
  'shopify_product_gid',
  'shopify_title',
  'shopify_handle',
  'shopify_variant_id',
  'shopify_variant_gid',
  'sku',
  'barcode',
  'variant_title',
  'size',
  'color',
  'price',
  'currency',
  'inventory_quantity',
  'status',
  'ai_visible',
  'code_missing',
  'image_url',
  'last_synced_at',
];

const missingColumns = required.filter((column) => !headers.includes(column));
if (missingColumns.length > 0) {
  console.error('Shopify product validation failed: missing columns:');
  for (const column of missingColumns) console.error(`- ${column}`);
  process.exit(1);
}

if (fallbackFile === defaultFile && !fs.existsSync(file)) {
  console.log(JSON.stringify({
    status: 'TEMPLATE_OK_REAL_EXPORT_MISSING',
    file: path.relative(process.cwd(), fallbackFile),
    message: 'Template columns are valid. Add docs/data/shopify_products.csv after Shopify export/API sync.',
  }, null, 2));
  process.exit(0);
}

const variantIds = new Set();
const skus = new Map();
const errors = [];
const warnings = [];

for (let rowIndex = 0; rowIndex < rowLines.length; rowIndex += 1) {
  const values = parseCsvLine(rowLines[rowIndex]);
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  const lineNo = rowIndex + 2;

  if (!row.shopify_title) errors.push(`Line ${lineNo}: missing shopify_title`);
  if (!row.shopify_product_gid && !row.shopify_product_id) errors.push(`Line ${lineNo}: missing Shopify product identity`);
  if (!row.shopify_variant_gid && !row.shopify_variant_id) errors.push(`Line ${lineNo}: missing Shopify variant identity`);
  if (!row.price || Number.isNaN(Number(row.price))) errors.push(`Line ${lineNo}: price must be numeric`);
  if (!row.currency) errors.push(`Line ${lineNo}: missing currency`);
  if (row.inventory_quantity && Number.isNaN(Number(row.inventory_quantity))) errors.push(`Line ${lineNo}: inventory_quantity must be numeric when present`);

  const variantKey = row.shopify_variant_gid || row.shopify_variant_id;
  if (variantKey) {
    if (variantIds.has(variantKey)) errors.push(`Line ${lineNo}: duplicate Shopify variant identity ${variantKey}`);
    variantIds.add(variantKey);
  }

  if (!row.sku) {
    warnings.push(`Line ${lineNo}: missing SKU/code for ${row.shopify_title}; dashboard must warn and AI visibility depends on settings`);
  } else {
    skus.set(row.sku, (skus.get(row.sku) ?? 0) + 1);
  }

  if (row.ai_visible === 'true' && !row.sku && row.code_missing !== 'true') {
    errors.push(`Line ${lineNo}: ai_visible=true with missing SKU requires code_missing=true`);
  }
}

for (const [sku, count] of skus.entries()) {
  if (count > 1) warnings.push(`Duplicate SKU ${sku} appears ${count} times; verify this is intentional in Shopify`);
}

if (errors.length > 0) {
  console.error('Shopify product validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  for (const warning of warnings) console.error(`WARN: ${warning}`);
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'PASS',
  file: path.relative(process.cwd(), fallbackFile),
  rows: rowLines.length,
  uniqueVariants: variantIds.size,
  warnings,
}, null, 2));
