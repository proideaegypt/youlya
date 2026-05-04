# Deploy Production (Pull-Based)

- Date: 2026-05-04
- Requested branch: main
- Current branch: main
- Compose file: docker-compose.yml
- Compose env source: auto-detect
From https://github.com/proideaegypt/youlya
 * branch            main       -> FETCH_HEAD
Already up to date.

> youlya-phase0-app@2.15.1 build:info
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
#6 transferring context: 137.42kB 3.9s done
#6 DONE 4.0s

#7 [builder 2/6] WORKDIR /app
#7 CACHED

#8 [builder 3/6] COPY package*.json ./
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 1.5s

#11 [builder 6/6] RUN npm run build
#11 2.509 
#11 2.509 > youlya-phase0-app@2.15.1 build
#11 2.509 > npm run build:info && next build --webpack
#11 2.509 
#11 2.861 
#11 2.861 > youlya-phase0-app@2.15.1 build:info
#11 2.861 > node scripts/write-build-info.mjs
#11 2.861 
#11 3.008 build info written: /app/public/build-info.json
#11 4.350 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 4.351 This information is used to shape Next.js' roadmap and prioritize features.
#11 4.351 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 4.351 https://nextjs.org/telemetry
#11 4.351 
#11 4.397 ▲ Next.js 16.2.4 (webpack)
#11 4.397 - Environments: .env.local, .env.production
#11 4.398 
#11 4.525 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 4.652   Creating an optimized production build ...
#11 33.96 ⚠ Compiled with warnings in 27.3s
#11 33.96 
#11 33.96 ./app/api/health/route.ts
#11 33.96 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 33.96 
#11 33.96 Import trace for requested module:
#11 33.96 ./app/api/health/route.ts
#11 33.96 
#11 41.16 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 48.28 
#11 48.28 
#11 48.28 Retrying 1/3...
#11 69.30 ✓ Compiled successfully in 58s
#11 69.33   Running TypeScript ...
#11 93.85   Finished TypeScript in 24.5s ...
#11 93.87   Collecting page data using 3 workers ...
#11 103.2   Generating static pages using 3 workers (0/50) ...
#11 104.3   Generating static pages using 3 workers (12/50) 
#11 104.9   Generating static pages using 3 workers (24/50) 
#11 104.9   Generating static pages using 3 workers (37/50) 
#11 105.7 ✓ Generating static pages using 3 workers (50/50) in 2.5s
#11 108.4   Finalizing page optimization ...
#11 108.4   Collecting build traces ...
#11 142.8 
#11 142.9 Route (app)
#11 142.9 ┌ ○ /
#11 142.9 ├ ○ /_not-found
#11 142.9 ├ ƒ /api/admin/handoffs
#11 142.9 ├ ƒ /api/admin/settings
#11 142.9 ├ ƒ /api/ai/tools/calculate-shipping
#11 142.9 ├ ƒ /api/ai/tools/confirm-order
#11 142.9 ├ ƒ /api/ai/tools/create-shopify-order
#11 142.9 ├ ƒ /api/ai/tools/handoff
#11 142.9 ├ ƒ /api/ai/tools/product-search
#11 142.9 ├ ƒ /api/ai/tools/select-product
#11 142.9 ├ ƒ /api/build-info
#11 142.9 ├ ƒ /api/dashboard/conversations
#11 142.9 ├ ƒ /api/dashboard/conversations/[id]
#11 142.9 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 142.9 ├ ƒ /api/dashboard/conversations/[id]/timeline
#11 142.9 ├ ƒ /api/dashboard/handoff
#11 142.9 ├ ƒ /api/dashboard/handoff/[id]/assign
#11 142.9 ├ ƒ /api/dashboard/handoff/[id]/note
#11 142.9 ├ ƒ /api/dashboard/handoff/[id]/resolve
#11 142.9 ├ ƒ /api/dashboard/handoff/[id]/return-to-ai
#11 142.9 ├ ƒ /api/dashboard/logs
#11 142.9 ├ ƒ /api/dashboard/orders
#11 142.9 ├ ƒ /api/dashboard/pilot-control
#11 142.9 ├ ƒ /api/dashboard/products-intelligence/channels
#11 142.9 ├ ƒ /api/dashboard/products-intelligence/overview
#11 142.9 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 142.9 ├ ƒ /api/dashboard/products-intelligence/products
#11 142.9 ├ ƒ /api/dashboard/products/catalog
#11 142.9 ├ ƒ /api/dashboard/products/mapping-inspector
#11 142.9 ├ ƒ /api/dashboard/products/overview
#11 142.9 ├ ƒ /api/dashboard/products/search-qa
#11 142.9 ├ ƒ /api/dashboard/products/sync-health
#11 142.9 ├ ƒ /api/dashboard/products/variants
#11 142.9 ├ ƒ /api/dashboard/settings
#11 142.9 ├ ƒ /api/dashboard/stats
#11 142.9 ├ ƒ /api/health
#11 142.9 ├ ƒ /api/internal/failed-events
#11 142.9 ├ ƒ /api/internal/messages/turn
#11 142.9 ├ ƒ /api/internal/shopify/sync-products
#11 142.9 ├ ƒ /api/webhooks/evolution
#11 142.9 ├ ƒ /dashboard
#11 142.9 ├ ƒ /dashboard/command-center
#11 142.9 ├ ƒ /dashboard/devices
#11 142.9 ├ ƒ /dashboard/handoff
#11 142.9 ├ ƒ /dashboard/inbox
#11 142.9 ├ ƒ /dashboard/logs
#11 142.9 ├ ƒ /dashboard/messages
#11 142.9 ├ ƒ /dashboard/orders
#11 142.9 ├ ƒ /dashboard/orders/[id]/safety
#11 142.9 ├ ƒ /dashboard/pilot-control
#11 142.9 ├ ƒ /dashboard/products
#11 142.9 ├ ƒ /dashboard/products-intelligence
#11 142.9 ├ ƒ /dashboard/profile
#11 142.9 ├ ƒ /dashboard/security
#11 142.9 ├ ƒ /dashboard/settings
#11 142.9 ├ ƒ /dashboard/statistics
#11 142.9 └ ○ /login
#11 142.9 
#11 142.9 
#11 142.9 ƒ Proxy (Middleware)
#11 142.9 
#11 142.9 ○  (Static)   prerendered as static content
#11 142.9 ƒ  (Dynamic)  server-rendered on demand
#11 142.9 
#11 DONE 143.3s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 1.0s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.1s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.1s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers
#17 exporting layers 0.9s done
#17 writing image sha256:7bc4429e00c7275d028ecb0ba5197ca50ea5edab75ee4c2977d6e2d1c6a25d72 done
#17 naming to docker.io/library/youlya-youlya-app 0.0s done
#17 DONE 0.9s

#18 resolving provenance for metadata file
#18 DONE 0.0s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: 834f3f2
- version: 2.15.1
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
