# Deploy Production (Pull-Based)

- Date: 2026-05-04
- Requested branch: main
- Current branch: main
- Compose file: docker-compose.yml
- Compose env source: auto-detect
From https://github.com/proideaegypt/youlya
 * branch            main       -> FETCH_HEAD
Already up to date.

> youlya-phase0-app@2.9.1 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
 Image youlya-youlya-app Building 
#1 [internal] load local bake definitions
#1 reading from stdin 490B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 539B 0.0s done
#2 DONE 0.1s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.8s

#4 [internal] load .dockerignore
#4 transferring context: 217B 0.0s done
#4 DONE 0.0s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 17.26kB 7.6s
#6 transferring context: 170.72kB 7.9s done
#6 DONE 8.0s

#7 [builder 2/6] WORKDIR /app
#7 CACHED

#8 [builder 3/6] COPY package*.json ./
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 2.9s

#11 [builder 6/6] RUN npm run build
#11 1.567 
#11 1.567 > youlya-phase0-app@2.9.1 build
#11 1.567 > npm run build:info && next build --webpack
#11 1.567 
#11 1.924 
#11 1.924 > youlya-phase0-app@2.9.1 build:info
#11 1.924 > node scripts/write-build-info.mjs
#11 1.924 
#11 2.068 build info written: /app/public/build-info.json
#11 4.926 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 4.927 This information is used to shape Next.js' roadmap and prioritize features.
#11 4.929 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 4.929 https://nextjs.org/telemetry
#11 4.929 
#11 4.993 ▲ Next.js 16.2.4 (webpack)
#11 4.993 - Environments: .env.local, .env.production
#11 4.993 
#11 5.210 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 5.345   Creating an optimized production build ...
#11 27.04 
#11 27.04 
#11 27.04 Retrying 1/3...
#11 27.09 
#11 27.09 
#11 27.09 Retrying 1/3...
#11 27.63 
#11 27.63 
#11 27.63 Retrying 2/3...
#11 60.66 ⚠ Compiled with warnings in 52s
#11 60.66 
#11 60.66 ./app/api/health/route.ts
#11 60.66 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 60.66 
#11 60.66 Import trace for requested module:
#11 60.66 ./app/api/health/route.ts
#11 60.66 
#11 72.05 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 105.2 ✓ Compiled successfully in 91s
#11 105.2   Running TypeScript ...
#11 131.3   Finished TypeScript in 26.1s ...
#11 131.3   Collecting page data using 3 workers ...
#11 140.9   Generating static pages using 3 workers (0/46) ...
#11 142.1   Generating static pages using 3 workers (11/46) 
#11 142.5   Generating static pages using 3 workers (22/46) 
#11 143.3   Generating static pages using 3 workers (34/46) 
#11 144.7 ✓ Generating static pages using 3 workers (46/46) in 3.8s
#11 146.8   Finalizing page optimization ...
#11 146.8   Collecting build traces ...
#11 203.5 
#11 203.5 Route (app)
#11 203.5 ┌ ○ /
#11 203.5 ├ ○ /_not-found
#11 203.5 ├ ƒ /api/admin/handoffs
#11 203.5 ├ ƒ /api/admin/settings
#11 203.5 ├ ƒ /api/ai/tools/calculate-shipping
#11 203.5 ├ ƒ /api/ai/tools/confirm-order
#11 203.5 ├ ƒ /api/ai/tools/create-shopify-order
#11 203.5 ├ ƒ /api/ai/tools/handoff
#11 203.5 ├ ƒ /api/ai/tools/product-search
#11 203.5 ├ ƒ /api/ai/tools/select-product
#11 203.5 ├ ƒ /api/build-info
#11 203.5 ├ ƒ /api/dashboard/conversations
#11 203.5 ├ ƒ /api/dashboard/conversations/[id]
#11 203.5 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 203.5 ├ ƒ /api/dashboard/logs
#11 203.5 ├ ƒ /api/dashboard/orders
#11 203.5 ├ ƒ /api/dashboard/products-intelligence/channels
#11 203.5 ├ ƒ /api/dashboard/products-intelligence/overview
#11 203.5 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 203.5 ├ ƒ /api/dashboard/products-intelligence/products
#11 203.5 ├ ƒ /api/dashboard/products/catalog
#11 203.5 ├ ƒ /api/dashboard/products/mapping-inspector
#11 203.5 ├ ƒ /api/dashboard/products/overview
#11 203.5 ├ ƒ /api/dashboard/products/search-qa
#11 203.5 ├ ƒ /api/dashboard/products/sync-health
#11 203.5 ├ ƒ /api/dashboard/products/variants
#11 203.5 ├ ƒ /api/dashboard/settings
#11 203.5 ├ ƒ /api/dashboard/stats
#11 203.5 ├ ƒ /api/health
#11 203.5 ├ ƒ /api/internal/failed-events
#11 203.5 ├ ƒ /api/internal/messages/turn
#11 203.5 ├ ƒ /api/internal/shopify/sync-products
#11 203.5 ├ ƒ /api/webhooks/evolution
#11 203.5 ├ ƒ /dashboard
#11 203.5 ├ ƒ /dashboard/command-center
#11 203.5 ├ ƒ /dashboard/devices
#11 203.5 ├ ƒ /dashboard/inbox
#11 203.5 ├ ƒ /dashboard/logs
#11 203.5 ├ ƒ /dashboard/messages
#11 203.5 ├ ƒ /dashboard/orders
#11 203.5 ├ ƒ /dashboard/orders/[id]/safety
#11 203.5 ├ ƒ /dashboard/products
#11 203.5 ├ ƒ /dashboard/products-intelligence
#11 203.5 ├ ƒ /dashboard/profile
#11 203.5 ├ ƒ /dashboard/security
#11 203.5 ├ ƒ /dashboard/settings
#11 203.5 ├ ƒ /dashboard/statistics
#11 203.5 └ ○ /login
#11 203.5 
#11 203.5 
#11 203.5 ƒ Proxy (Middleware)
#11 203.5 
#11 203.5 ○  (Static)   prerendered as static content
#11 203.5 ƒ  (Dynamic)  server-rendered on demand
#11 203.5 
#11 DONE 204.3s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 2.3s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.4s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.2s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.2s

#17 exporting to image
#17 exporting layers
#17 exporting layers 1.1s done
#17 writing image sha256:1c84ce1b03aca103127dc3b60c41a591e42e5e005086be63ad71460a2140829b done
#17 naming to docker.io/library/youlya-youlya-app 0.0s done
#17 DONE 1.1s

#18 resolving provenance for metadata file
#18 DONE 0.2s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: 98ce7d1
- version: 2.9.1
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
