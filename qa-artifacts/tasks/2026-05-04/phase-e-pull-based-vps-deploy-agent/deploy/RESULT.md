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
#3 DONE 0.4s

#4 [internal] load .dockerignore
#4 transferring context: 217B done
#4 DONE 0.0s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 113.00kB 1.9s done
#6 DONE 1.9s

#7 [builder 2/6] WORKDIR /app
#7 CACHED

#8 [builder 3/6] COPY package*.json ./
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 0.5s

#11 [builder 6/6] RUN npm run build
#11 0.943 
#11 0.943 > youlya-phase0-app@2.8.3 build
#11 0.943 > npm run build:info && next build --webpack
#11 0.943 
#11 1.241 
#11 1.241 > youlya-phase0-app@2.8.3 build:info
#11 1.241 > node scripts/write-build-info.mjs
#11 1.241 
#11 1.374 build info written: /app/public/build-info.json
#11 2.662 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 2.664 This information is used to shape Next.js' roadmap and prioritize features.
#11 2.664 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 2.664 https://nextjs.org/telemetry
#11 2.664 
#11 2.700 ▲ Next.js 16.2.4 (webpack)
#11 2.701 - Environments: .env.local, .env.production
#11 2.701 
#11 2.847 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 2.985   Creating an optimized production build ...
#11 33.24 ⚠ Compiled with warnings in 27.8s
#11 33.24 
#11 33.24 ./app/api/health/route.ts
#11 33.24 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 33.24 
#11 33.24 Import trace for requested module:
#11 33.24 ./app/api/health/route.ts
#11 33.24 
#11 41.71 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 64.14 ✓ Compiled successfully in 53s
#11 64.16   Running TypeScript ...
#11 85.25   Finished TypeScript in 21.1s ...
#11 85.30   Collecting page data using 3 workers ...
#11 93.78   Generating static pages using 3 workers (0/46) ...
#11 94.18   Generating static pages using 3 workers (11/46) 
#11 94.68   Generating static pages using 3 workers (22/46) 
#11 94.76   Generating static pages using 3 workers (34/46) 
#11 95.58 ✓ Generating static pages using 3 workers (46/46) in 1805ms
#11 97.98   Finalizing page optimization ...
#11 97.98   Collecting build traces ...
#11 141.6 
#11 141.7 Route (app)
#11 141.7 ┌ ○ /
#11 141.7 ├ ○ /_not-found
#11 141.7 ├ ƒ /api/admin/handoffs
#11 141.7 ├ ƒ /api/admin/settings
#11 141.7 ├ ƒ /api/ai/tools/calculate-shipping
#11 141.7 ├ ƒ /api/ai/tools/confirm-order
#11 141.7 ├ ƒ /api/ai/tools/create-shopify-order
#11 141.7 ├ ƒ /api/ai/tools/handoff
#11 141.7 ├ ƒ /api/ai/tools/product-search
#11 141.7 ├ ƒ /api/ai/tools/select-product
#11 141.7 ├ ƒ /api/build-info
#11 141.7 ├ ƒ /api/dashboard/conversations
#11 141.7 ├ ƒ /api/dashboard/conversations/[id]
#11 141.7 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 141.7 ├ ƒ /api/dashboard/logs
#11 141.7 ├ ƒ /api/dashboard/orders
#11 141.7 ├ ƒ /api/dashboard/products-intelligence/channels
#11 141.7 ├ ƒ /api/dashboard/products-intelligence/overview
#11 141.7 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 141.7 ├ ƒ /api/dashboard/products-intelligence/products
#11 141.7 ├ ƒ /api/dashboard/products/catalog
#11 141.7 ├ ƒ /api/dashboard/products/mapping-inspector
#11 141.7 ├ ƒ /api/dashboard/products/overview
#11 141.7 ├ ƒ /api/dashboard/products/search-qa
#11 141.7 ├ ƒ /api/dashboard/products/sync-health
#11 141.7 ├ ƒ /api/dashboard/products/variants
#11 141.7 ├ ƒ /api/dashboard/settings
#11 141.7 ├ ƒ /api/dashboard/stats
#11 141.7 ├ ƒ /api/health
#11 141.7 ├ ƒ /api/internal/failed-events
#11 141.7 ├ ƒ /api/internal/messages/turn
#11 141.7 ├ ƒ /api/internal/shopify/sync-products
#11 141.7 ├ ƒ /api/webhooks/evolution
#11 141.7 ├ ƒ /dashboard
#11 141.7 ├ ƒ /dashboard/command-center
#11 141.7 ├ ƒ /dashboard/devices
#11 141.7 ├ ƒ /dashboard/inbox
#11 141.7 ├ ƒ /dashboard/logs
#11 141.7 ├ ƒ /dashboard/messages
#11 141.7 ├ ƒ /dashboard/orders
#11 141.7 ├ ƒ /dashboard/orders/[id]/safety
#11 141.7 ├ ƒ /dashboard/products
#11 141.7 ├ ƒ /dashboard/products-intelligence
#11 141.7 ├ ƒ /dashboard/profile
#11 141.7 ├ ƒ /dashboard/security
#11 141.7 ├ ƒ /dashboard/settings
#11 141.7 ├ ƒ /dashboard/statistics
#11 141.7 └ ○ /login
#11 141.7 
#11 141.7 
#11 141.7 ƒ Proxy (Middleware)
#11 141.7 
#11 141.7 ○  (Static)   prerendered as static content
#11 141.7 ƒ  (Dynamic)  server-rendered on demand
#11 141.7 
#11 DONE 142.1s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 1.1s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.2s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.1s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers
#17 exporting layers 0.9s done
#17 writing image sha256:56c26f1351a9c809d016a8d1be71ade6be2a1453e06d8e74ab049d8c63473f4e done
#17 naming to docker.io/library/youlya-youlya-app done
#17 DONE 0.9s

#18 resolving provenance for metadata file
#18 DONE 0.0s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: 7344fd4
- version: 2.8.3
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
