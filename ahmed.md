You are working inside /root/youlya on the production VPS.

TASK:
products-intelligence-page-with-photos-ai-orders-and-channel-insights

GOAL:
Add a dashboard menu page that shows Shopify-synced products with photos, AI order performance notes, and most ordered channel insights across WhatsApp, Instagram, TikTok, and Facebook.

PRODUCT REQUIREMENT:
This page is not a Shopify editor. Shopify remains the source of truth. The page must be read-only for Shopify and focused on AI Commerce performance and product intelligence.

USER REQUIREMENT:
- Add a page in the dashboard menu.
- Show synced products with product photos.
- Show notes/insights about products most ordered by AI.
- Show the most ordered channel per product:
  WhatsApp / Instagram / TikTok / Facebook.
- Show KPIs and charts useful for CEO/owner/operator.
- No fake data. Use empty states where data is unavailable.

DO NOT:
- Do not edit Shopify products.
- Do not mutate Shopify products.
- Do not create Shopify orders.
- Do not delete/truncate Supabase product data.
- Do not expose Shopify tokens.
- Do not expose Supabase service role key.
- Do not expose customer PII in product intelligence views.
- Do not fake Instagram/TikTok/Facebook data if channels are not connected.
- Do not activate any n8n workflow.
- Do not break existing dashboard theme/layout/auth.

ROUTE:
Add route:
- /dashboard/products-intelligence

Add menu item:
- Arabic: ذكاء المنتجات
- English: Products Intelligence

Place it near:
- Products
- Orders
- Reports
or inside Products section if dashboard architecture supports nested menu.

PAGE SECTIONS:
1. Header
- title: ذكاء المنتجات / Products Intelligence
- subtitle: synced Shopify products, AI selling readiness, and channel performance
- last sync time
- product cache health badge

2. KPI cards
Required:
- Total synced products
- Total synced variants
- AI-visible products
- AI-visible variants
- Most ordered by AI product
- Top ordered channel
- Missing SKU variants
- Out-of-stock variants
- AI-assisted revenue if available
- Product intelligence score if practical

3. Synced Products Gallery
Show product cards with:
- product photo from products.image_url
- product title
- product type/vendor if available
- total variants
- available variants
- AI-visible variants
- missing SKU variants
- out-of-stock variants
- AI orders count
- total orders count
- top ordered channel
- last synced time
- generated product note
- badges:
  Best Seller by AI
  Top WhatsApp
  Top Instagram
  Top TikTok
  Top Facebook
  Low Stock
  Missing SKU
  OOS Demand
  Hidden from AI

4. Most Ordered by AI
Table:
- rank
- product photo
- product title
- AI orders
- AI-assisted revenue
- selected count if available
- shown count if available
- conversion rate if available
- top variant
- top size
- top channel
- stock status
- last order date

5. Channel Performance
Support channel enum:
- whatsapp
- instagram
- tiktok
- facebook
- manual
- unknown

Charts:
- orders by channel
- revenue by channel if available
- top products by channel
- product x channel heatmap if practical

If Instagram/TikTok/Facebook data does not exist, show:
"Channel analytics will appear after this channel is connected and orders are attributed."

6. Product Detail Drawer or Detail Panel
When clicking a product:
Show:
- image
- Shopify product ID
- handle
- variants matrix
- AI visibility reasons
- AI orders
- total orders
- channel split
- mapping history summary
- order performance summary
- generated notes
- manual internal notes if implemented

7. Notes/Insights
Generate safe system notes from data:
- "Most ordered by AI"
- "Top channel is WhatsApp"
- "High demand but low stock"
- "Missing SKU may reduce AI visibility"
- "Frequently shown but low order conversion"
- "Out of stock variants should be reviewed"

No LLM call is required for notes. Generate deterministic notes from metrics.

DATA SOURCES:
Use Supabase read-only queries from:
- products
- product_variants
- orders if available
- order_items if available
- conversations if available
- ai_tool_calls if available
- last_product_recommendations if available

If order_items table does not exist:
- infer only what is safely available
- do not fake AI orders
- show empty state for AI order metrics
- document missing data model

OPTIONAL NEW TABLE:
If safe and needed, add forward-only migration:
product_notes
Fields:
- id uuid primary key
- store_id text not null
- product_id uuid nullable
- shopify_product_id text not null
- note text not null
- note_type text not null default 'manual'
- visible_to_ai boolean not null default false
- created_by uuid nullable
- created_at timestamptz default now()
- updated_at timestamptz default now()

Do not add destructive migration.

API ROUTES:
Create read-only dashboard APIs if needed:
- GET /api/dashboard/products-intelligence/overview
- GET /api/dashboard/products-intelligence/products
- GET /api/dashboard/products-intelligence/channels
- GET /api/dashboard/products-intelligence/product/[id]

Security:
- require dashboard auth/session
- no secrets
- no full customer PII
- mask phone/customer identifiers if any appear
- no Shopify mutation

AGGREGATION RULES:
AI orders:
- count orders where created_by='ai' or ai_assisted=true if fields exist
- otherwise count 0 and mark unavailable
Top channel:
- derive from order.channel/source_channel or conversation.channel if linked
- normalize:
  whatsapp_evolution -> whatsapp
  instagram_dm -> instagram
  tiktok_dm -> tiktok
  facebook_messenger -> facebook
- unknown if missing

Product notes:
- deterministic notes only
- no fake claims
- show "Not enough order data yet" if insufficient data

UI:
- Follow existing Smart Home dashboard style.
- Arabic default with English toggle support.
- Cairo font.
- Responsive cards.
- Product photos should not break layout if missing.
- Use placeholder/monogram only if image_url missing.
- Dark/light mode compatible.

TESTS:
Add unit/API tests for:
- overview aggregation
- channel normalization
- generated notes
- missing image fallback
- no secrets in response
- no PII leakage
- empty state when orders/channels missing

PLAYWRIGHT:
Add /dashboard/products-intelligence to dashboard swarm.
Checks:
- page renders
- h1 exists
- product cards or meaningful empty state exists
- KPIs visible
- no 500s
- no horizontal overflow
- works in mobile/tablet/desktop

RUN:
npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release
npm run verify:deploy
npm run test:e2e:dashboard:swarm
npm run qa:collect

RELEASE:
npm run release:task -- --task "products-intelligence-page-with-photos-ai-orders-and-channel-insights" --type minor
npm run verify:release

Deploy only if all checks pass:
npm run deploy:production

FINAL RESPONSE:
STATUS: PASS / PARTIAL / FAIL
TASK: products-intelligence-page-with-photos-ai-orders-and-channel-insights
VERSION:
ROUTE:
MENU:
KPIS:
PRODUCT GALLERY:
AI ORDER NOTES:
CHANNEL INSIGHTS:
CHARTS:
API ROUTES:
DATA LIMITATIONS:
TESTS RUN:
PLAYWRIGHT:
VERIFY DEPLOY:
DEPLOY RESULT:
HEALTH CHECK:
BUILD INFO CHECK:
BLOCKERS:
RISKS:
NEXT STEP: