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
#3 DONE 0.6s

#4 [internal] load .dockerignore
#4 transferring context: 217B 0.0s done
#4 DONE 0.0s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 35.13kB 7.8s
#6 transferring context: 364.06kB 8.0s done
#6 DONE 8.1s

#7 [builder 2/6] WORKDIR /app
#7 CACHED

#8 [builder 3/6] COPY package*.json ./
#8 DONE 0.3s

#9 [builder 4/6] RUN npm ci
#9 84.55 
#9 84.55 added 581 packages, and audited 582 packages in 1m
#9 84.55 
#9 84.55 176 packages are looking for funding
#9 84.55   run `npm fund` for details
#9 84.65 
#9 84.65 2 moderate severity vulnerabilities
#9 84.65 
#9 84.65 To address all issues (including breaking changes), run:
#9 84.65   npm audit fix --force
#9 84.65 
#9 84.65 Run `npm audit` for details.
#9 84.65 npm notice
#9 84.65 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#9 84.65 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#9 84.65 npm notice To update run: npm install -g npm@11.13.0
#9 84.65 npm notice
#9 DONE 87.6s

#10 [builder 5/6] COPY . .
#10 DONE 1.7s

#11 [builder 6/6] RUN npm run build
#11 1.353 
#11 1.353 > youlya-phase0-app@2.9.1 build
#11 1.353 > npm run build:info && next build --webpack
#11 1.353 
#11 1.727 
#11 1.727 > youlya-phase0-app@2.9.1 build:info
#11 1.727 > node scripts/write-build-info.mjs
#11 1.727 
#11 1.874 build info written: /app/public/build-info.json
#11 3.750 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 3.750 This information is used to shape Next.js' roadmap and prioritize features.
#11 3.750 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 3.751 https://nextjs.org/telemetry
#11 3.751 
#11 3.798 ▲ Next.js 16.2.4 (webpack)
#11 3.799 - Environments: .env.local, .env.production
#11 3.799 
#11 3.937 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 4.093   Creating an optimized production build ...
#11 67.53 ⚠ Compiled with warnings in 61s
#11 67.53 
#11 67.53 ./app/api/health/route.ts
#11 67.53 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 67.53 
#11 67.53 Import trace for requested module:
#11 67.53 ./app/api/health/route.ts
#11 67.53 
#11 81.16 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 93.58 
#11 93.58 
#11 93.58 Retrying 1/3...
#11 119.5 ✓ Compiled successfully in 105s
#11 119.5   Running TypeScript ...
#11 161.3   Finished TypeScript in 42s ...
#11 161.4   Collecting page data using 3 workers ...
#11 176.1   Generating static pages using 3 workers (0/46) ...
#11 176.6   Generating static pages using 3 workers (11/46) 
#11 177.1   Generating static pages using 3 workers (22/46) 
#11 177.7   Generating static pages using 3 workers (34/46) 
#11 179.2 ✓ Generating static pages using 3 workers (46/46) in 3.1s
#11 182.7   Finalizing page optimization ...
#11 182.7   Collecting build traces ...
#11 235.2 
#11 235.2 Route (app)
#11 235.2 ┌ ○ /
#11 235.2 ├ ○ /_not-found
#11 235.2 ├ ƒ /api/admin/handoffs
#11 235.2 ├ ƒ /api/admin/settings
#11 235.2 ├ ƒ /api/ai/tools/calculate-shipping
#11 235.2 ├ ƒ /api/ai/tools/confirm-order
#11 235.2 ├ ƒ /api/ai/tools/create-shopify-order
#11 235.2 ├ ƒ /api/ai/tools/handoff
#11 235.2 ├ ƒ /api/ai/tools/product-search
#11 235.2 ├ ƒ /api/ai/tools/select-product
#11 235.2 ├ ƒ /api/build-info
#11 235.2 ├ ƒ /api/dashboard/conversations
#11 235.2 ├ ƒ /api/dashboard/conversations/[id]
#11 235.2 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 235.2 ├ ƒ /api/dashboard/logs
#11 235.2 ├ ƒ /api/dashboard/orders
#11 235.2 ├ ƒ /api/dashboard/products-intelligence/channels
#11 235.2 ├ ƒ /api/dashboard/products-intelligence/overview
#11 235.2 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 235.2 ├ ƒ /api/dashboard/products-intelligence/products
#11 235.2 ├ ƒ /api/dashboard/products/catalog
#11 235.2 ├ ƒ /api/dashboard/products/mapping-inspector
#11 235.2 ├ ƒ /api/dashboard/products/overview
#11 235.2 ├ ƒ /api/dashboard/products/search-qa
#11 235.2 ├ ƒ /api/dashboard/products/sync-health
#11 235.2 ├ ƒ /api/dashboard/products/variants
#11 235.2 ├ ƒ /api/dashboard/settings
#11 235.2 ├ ƒ /api/dashboard/stats
#11 235.2 ├ ƒ /api/health
#11 235.2 ├ ƒ /api/internal/failed-events
#11 235.2 ├ ƒ /api/internal/messages/turn
#11 235.2 ├ ƒ /api/internal/shopify/sync-products
#11 235.2 ├ ƒ /api/webhooks/evolution
#11 235.2 ├ ƒ /dashboard
#11 235.2 ├ ƒ /dashboard/command-center
#11 235.2 ├ ƒ /dashboard/devices
#11 235.2 ├ ƒ /dashboard/inbox
#11 235.2 ├ ƒ /dashboard/logs
#11 235.2 ├ ƒ /dashboard/messages
#11 235.2 ├ ƒ /dashboard/orders
#11 235.2 ├ ƒ /dashboard/orders/[id]/safety
#11 235.2 ├ ƒ /dashboard/products
#11 235.2 ├ ƒ /dashboard/products-intelligence
#11 235.2 ├ ƒ /dashboard/profile
#11 235.2 ├ ƒ /dashboard/security
#11 235.2 ├ ƒ /dashboard/settings
#11 235.2 ├ ƒ /dashboard/statistics
#11 235.2 └ ○ /login
#11 235.2 
#11 235.2 
#11 235.2 ƒ Proxy (Middleware)
#11 235.2 
#11 235.2 ○  (Static)   prerendered as static content
#11 235.2 ƒ  (Dynamic)  server-rendered on demand
#11 235.2 
#11 DONE 235.8s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 1.3s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.1s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.1s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers
#17 exporting layers 0.9s done
#17 writing image sha256:a32f1e4ddea816e099497dc6a126a18b7e4c33dc1fd5b6d3b8513ee67f271984 done
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
- deployed commit: 410d918
- version: 2.9.1
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
