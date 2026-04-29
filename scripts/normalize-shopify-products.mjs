import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
const output = process.argv[3] ?? path.join(process.cwd(), 'docs/data/shopify_products.csv');

if (!input) {
  console.error('Usage: node scripts/normalize-shopify-products.mjs <shopify_export.csv> [output.csv]');
  process.exit(1);
}
if (!fs.existsSync(input)) {
  console.error(`Input file not found: ${input}`);
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(current);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      current = '';
    } else {
      current += ch;
    }
  }
  row.push(current);
  if (row.some((cell) => cell.length > 0)) rows.push(row);
  return rows;
}

function csvEscape(value) {
  const str = value == null ? '' : String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replaceAll('"', '""')}"`;
  return str;
}

const text = fs.readFileSync(input, 'utf8');
const rows = parseCsv(text);
if (rows.length < 2) {
  console.error('Input CSV has no data rows');
  process.exit(1);
}

const headers = rows[0];
const records = rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));

function pick(record, names) {
  for (const name of names) {
    if (record[name] != null && String(record[name]).trim() !== '') return String(record[name]).trim();
  }
  return '';
}

const outHeaders = [
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

const now = new Date().toISOString();
const normalized = records.map((record) => {
  const title = pick(record, ['Title', 'Product Title', 'shopify_title', 'title']);
  const handle = pick(record, ['Handle', 'shopify_handle', 'handle']);
  const sku = pick(record, ['Variant SKU', 'SKU', 'sku']);
  const size = pick(record, ['Option1 Value', 'Size', 'size']);
  const color = pick(record, ['Option2 Value', 'Color', 'color']);
  const variantTitle = [size, color].filter(Boolean).join(' / ') || pick(record, ['Variant Title', 'variant_title']);
  const productId = pick(record, ['Product ID', 'ID', 'shopify_product_id']);
  const variantId = pick(record, ['Variant ID', 'shopify_variant_id']);
  const image = pick(record, ['Image Src', 'Image URL', 'image_url']);

  return {
    shopify_product_id: productId,
    shopify_product_gid: productId.startsWith('gid://') ? productId : '',
    shopify_title: title,
    shopify_handle: handle,
    shopify_variant_id: variantId,
    shopify_variant_gid: variantId.startsWith('gid://') ? variantId : '',
    sku,
    barcode: pick(record, ['Variant Barcode', 'Barcode', 'barcode']),
    variant_title: variantTitle,
    size,
    color,
    price: pick(record, ['Variant Price', 'Price', 'price']),
    currency: pick(record, ['Currency', 'currency']) || 'EGP',
    inventory_quantity: pick(record, ['Variant Inventory Qty', 'Inventory Quantity', 'inventory_quantity']),
    status: pick(record, ['Status', 'status']) || 'ACTIVE',
    ai_visible: sku ? 'true' : 'false',
    code_missing: sku ? 'false' : 'true',
    image_url: image,
    last_synced_at: now,
  };
});

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(
  output,
  `${outHeaders.join(',')}\n${normalized.map((row) => outHeaders.map((header) => csvEscape(row[header])).join(',')).join('\n')}\n`,
  'utf8',
);

console.log(JSON.stringify({
  status: 'PASS',
  input: path.relative(process.cwd(), input),
  output: path.relative(process.cwd(), output),
  rows: normalized.length,
  note: 'Validate with node scripts/validate-shopify-products.mjs docs/data/shopify_products.csv',
}, null, 2));
