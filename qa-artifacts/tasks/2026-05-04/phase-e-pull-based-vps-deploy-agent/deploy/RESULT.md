# Deploy Production (Pull-Based)

- Date: 2026-05-04
- Requested branch: main
- Current branch: main
- Compose file: docker-compose.yml
- Compose env source: auto-detect
From https://github.com/proideaegypt/youlya
 * branch            main       -> FETCH_HEAD
Already up to date.

> youlya-phase0-app@2.8.3 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
 Image youlya-youlya-app Building 
#1 [internal] load local bake definitions
#1 reading from stdin 490B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 539B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.6s

#4 [internal] load .dockerignore
#4 transferring context: 217B done
#4 DONE 0.0s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 98.75kB 1.9s done
#6 DONE 2.0s

#7 [builder 3/6] COPY package*.json ./
#7 CACHED

#8 [builder 2/6] WORKDIR /app
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 0.6s

#11 [builder 6/6] RUN npm run build
#11 1.178 
#11 1.178 > youlya-phase0-app@2.8.3 build
#11 1.178 > npm run build:info && next build --webpack
#11 1.178 
#11 1.552 
#11 1.552 > youlya-phase0-app@2.8.3 build:info
#11 1.552 > node scripts/write-build-info.mjs
#11 1.552 
#11 1.716 build info written: /app/public/build-info.json
#11 3.091 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 3.093 This information is used to shape Next.js' roadmap and prioritize features.
#11 3.093 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 3.093 https://nextjs.org/telemetry
#11 3.093 
#11 3.133 ▲ Next.js 16.2.4 (webpack)
#11 3.133 - Environments: .env.local, .env.production
#11 3.135 
#11 3.271 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 3.405   Creating an optimized production build ...
#11 34.67 ⚠ Compiled with warnings in 28.8s
#11 34.67 
#11 34.67 ./app/api/health/route.ts
#11 34.67 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 34.67 
#11 34.67 Import trace for requested module:
#11 34.67 ./app/api/health/route.ts
#11 34.67 
#11 44.54 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 69.27 ✓ Compiled successfully in 58s
#11 69.29   Running TypeScript ...
#11 93.65   Finished TypeScript in 24.4s ...
#11 93.67   Collecting page data using 3 workers ...
#11 103.8   Generating static pages using 3 workers (0/46) ...
#11 104.5   Generating static pages using 3 workers (11/46) 
#11 105.1   Generating static pages using 3 workers (22/46) 
#11 105.4   Generating static pages using 3 workers (34/46) 
#11 107.1 ✓ Generating static pages using 3 workers (46/46) in 3.2s
#11 109.9   Finalizing page optimization ...
#11 109.9   Collecting build traces ...
#11 152.4 
#11 152.4 Route (app)
#11 152.4 ┌ ○ /
#11 152.4 ├ ○ /_not-found
#11 152.4 ├ ƒ /api/admin/handoffs
#11 152.4 ├ ƒ /api/admin/settings
#11 152.4 ├ ƒ /api/ai/tools/calculate-shipping
#11 152.4 ├ ƒ /api/ai/tools/confirm-order
#11 152.4 ├ ƒ /api/ai/tools/create-shopify-order
#11 152.4 ├ ƒ /api/ai/tools/handoff
#11 152.4 ├ ƒ /api/ai/tools/product-search
#11 152.4 ├ ƒ /api/ai/tools/select-product
#11 152.4 ├ ƒ /api/build-info
#11 152.4 ├ ƒ /api/dashboard/conversations
#11 152.4 ├ ƒ /api/dashboard/conversations/[id]
#11 152.4 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 152.4 ├ ƒ /api/dashboard/logs
#11 152.4 ├ ƒ /api/dashboard/orders
#11 152.4 ├ ƒ /api/dashboard/products-intelligence/channels
#11 152.4 ├ ƒ /api/dashboard/products-intelligence/overview
#11 152.4 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 152.4 ├ ƒ /api/dashboard/products-intelligence/products
#11 152.4 ├ ƒ /api/dashboard/products/catalog
#11 152.4 ├ ƒ /api/dashboard/products/mapping-inspector
#11 152.4 ├ ƒ /api/dashboard/products/overview
#11 152.4 ├ ƒ /api/dashboard/products/search-qa
#11 152.4 ├ ƒ /api/dashboard/products/sync-health
#11 152.4 ├ ƒ /api/dashboard/products/variants
#11 152.4 ├ ƒ /api/dashboard/settings
#11 152.4 ├ ƒ /api/dashboard/stats
#11 152.4 ├ ƒ /api/health
#11 152.4 ├ ƒ /api/internal/failed-events
#11 152.4 ├ ƒ /api/internal/messages/turn
#11 152.4 ├ ƒ /api/internal/shopify/sync-products
#11 152.4 ├ ƒ /api/webhooks/evolution
#11 152.4 ├ ƒ /dashboard
#11 152.4 ├ ƒ /dashboard/command-center
#11 152.4 ├ ƒ /dashboard/devices
#11 152.4 ├ ƒ /dashboard/inbox
#11 152.4 ├ ƒ /dashboard/logs
#11 152.4 ├ ƒ /dashboard/messages
#11 152.4 ├ ƒ /dashboard/orders
#11 152.4 ├ ƒ /dashboard/orders/[id]/safety
#11 152.4 ├ ƒ /dashboard/products
#11 152.4 ├ ƒ /dashboard/products-intelligence
#11 152.4 ├ ƒ /dashboard/profile
#11 152.4 ├ ƒ /dashboard/security
#11 152.4 ├ ƒ /dashboard/settings
#11 152.4 ├ ƒ /dashboard/statistics
#11 152.4 └ ○ /login
#11 152.4 
#11 152.4 
#11 152.4 ƒ Proxy (Middleware)
#11 152.4 
#11 152.4 ○  (Static)   prerendered as static content
#11 152.4 ƒ  (Dynamic)  server-rendered on demand
#11 152.4 
#11 DONE 152.8s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 1.2s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.1s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.1s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers
#17 exporting layers 0.8s done
#17 writing image sha256:1761c46217ca1a716ea75dcb6d0f1af45865328617f2efd54f672dfbfa63e7f4 done
#17 naming to docker.io/library/youlya-youlya-app done
#17 DONE 0.8s

#18 resolving provenance for metadata file
#18 DONE 0.0s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: c734ecc
- version: 2.8.3
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
