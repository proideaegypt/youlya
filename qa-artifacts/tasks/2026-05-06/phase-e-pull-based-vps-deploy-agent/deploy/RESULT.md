# Deploy Production (Pull-Based)

- Date: 2026-05-06
- Requested branch: main
- Current branch: main
- Compose file: docker-compose.yml
- Compose env source: auto-detect
From https://github.com/proideaegypt/youlya
 * branch            main       -> FETCH_HEAD
Already up to date.

> youlya-phase0-app@2.23.3 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
 Image youlya-youlya-app Building 
#1 [internal] load local bake definitions
#1 reading from stdin 490B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 30B 0.0s
#2 transferring dockerfile: 539B 0.0s done
#2 DONE 0.2s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 1.0s

#4 [internal] load .dockerignore
#4 transferring context:
#4 transferring context: 217B 0.0s done
#4 DONE 0.2s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 63.57kB 14.0s
#6 transferring context: 2.19MB 19.5s done
#6 DONE 20.3s

#7 [builder 2/6] WORKDIR /app
#7 CACHED

#8 [builder 3/6] COPY package*.json ./
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 8.6s

#11 [builder 6/6] RUN npm run build
#11 7.185 
#11 7.185 > youlya-phase0-app@2.23.3 build
#11 7.185 > npm run build:info && next build --webpack
#11 7.185 
#11 8.285 
#11 8.285 > youlya-phase0-app@2.23.3 build:info
#11 8.285 > node scripts/write-build-info.mjs
#11 8.285 
#11 8.639 build info written: /app/public/build-info.json
#11 15.82 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 15.82 This information is used to shape Next.js' roadmap and prioritize features.
#11 15.82 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 15.82 https://nextjs.org/telemetry
#11 15.82 
#11 16.00 ▲ Next.js 16.2.4 (webpack)
#11 16.00 - Environments: .env.local, .env.production
#11 16.00 
#11 16.42 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 16.91   Creating an optimized production build ...
#11 132.4 ⚠ Compiled with warnings in 107s
#11 132.4 
#11 132.4 ./app/api/health/route.ts
#11 132.4 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 132.4 
#11 132.4 Import trace for requested module:
#11 132.4 ./app/api/health/route.ts
#11 132.4 
#11 148.9 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 196.9 ✓ Compiled successfully in 2.7min
#11 196.9   Running TypeScript ...
#11 248.8   Finished TypeScript in 52s ...
#11 248.9   Collecting page data using 3 workers ...
#11 261.6   Generating static pages using 3 workers (0/76) ...
#11 263.4   Generating static pages using 3 workers (19/76) 
#11 263.8 loadStats error: Error: Dynamic server usage: Route /dashboard/command-center couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
#11 263.8     at y (.next/server/chunks/3445.js:8:9979)
#11 263.8     at n (.next/server/chunks/5573.js:1:7236)
#11 263.8     at s (.next/server/app/dashboard/command-center/page.js:2:63948)
#11 263.8     at v (.next/server/app/dashboard/command-center/page.js:2:66013)
#11 263.8     at stringify (<anonymous>) {
#11 263.8   description: "Route /dashboard/command-center couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
#11 263.8   digest: 'DYNAMIC_SERVER_USAGE'
#11 263.8 }
#11 263.9   Generating static pages using 3 workers (38/76) 
#11 263.9   Generating static pages using 3 workers (57/76) 
#11 264.7 ✓ Generating static pages using 3 workers (76/76) in 3.2s
#11 267.6   Finalizing page optimization ...
#11 267.6   Collecting build traces ...
#11 313.9 
#11 314.0 Route (app)
#11 314.0 ┌ ○ /
#11 314.0 ├ ○ /_not-found
#11 314.0 ├ ƒ /api/admin/handoffs
#11 314.0 ├ ƒ /api/admin/settings
#11 314.0 ├ ƒ /api/ai/rag/retrieve
#11 314.0 ├ ƒ /api/ai/tools/calculate-shipping
#11 314.0 ├ ƒ /api/ai/tools/confirm-order
#11 314.0 ├ ƒ /api/ai/tools/create-shopify-order
#11 314.0 ├ ƒ /api/ai/tools/handoff
#11 314.0 ├ ƒ /api/ai/tools/product-search
#11 314.0 ├ ƒ /api/ai/tools/select-product
#11 314.0 ├ ƒ /api/build-info
#11 314.0 ├ ƒ /api/dashboard/channels/evolution/accounts
#11 314.0 ├ ƒ /api/dashboard/channels/evolution/accounts/[id]/connect
#11 314.0 ├ ƒ /api/dashboard/channels/evolution/accounts/[id]/disconnect
#11 314.0 ├ ƒ /api/dashboard/channels/evolution/accounts/[id]/qr
#11 314.0 ├ ƒ /api/dashboard/channels/evolution/accounts/[id]/set-default
#11 314.0 ├ ƒ /api/dashboard/channels/evolution/accounts/[id]/status
#11 314.0 ├ ƒ /api/dashboard/conversations
#11 314.0 ├ ƒ /api/dashboard/conversations/[id]
#11 314.0 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 314.0 ├ ƒ /api/dashboard/conversations/[id]/return-to-ai
#11 314.0 ├ ƒ /api/dashboard/conversations/[id]/timeline
#11 314.0 ├ ƒ /api/dashboard/haidi-settings
#11 314.0 ├ ƒ /api/dashboard/haidi/lab
#11 314.0 ├ ƒ /api/dashboard/haidi/lab/[id]
#11 314.0 ├ ƒ /api/dashboard/haidi/lab/run
#11 314.0 ├ ƒ /api/dashboard/haidi/learning
#11 314.0 ├ ƒ /api/dashboard/haidi/prompt
#11 314.0 ├ ƒ /api/dashboard/haidi/settings
#11 314.0 ├ ƒ /api/dashboard/handoff
#11 314.0 ├ ƒ /api/dashboard/handoff/[id]/assign
#11 314.0 ├ ƒ /api/dashboard/handoff/[id]/note
#11 314.0 ├ ƒ /api/dashboard/handoff/[id]/resolve
#11 314.0 ├ ƒ /api/dashboard/handoff/[id]/return-to-ai
#11 314.0 ├ ƒ /api/dashboard/knowledge-base
#11 314.0 ├ ƒ /api/dashboard/logs
#11 314.0 ├ ƒ /api/dashboard/notifications
#11 314.0 ├ ƒ /api/dashboard/orders
#11 314.0 ├ ƒ /api/dashboard/pilot-control
#11 314.0 ├ ƒ /api/dashboard/pilot/actions
#11 314.0 ├ ƒ /api/dashboard/products-intelligence/channels
#11 314.0 ├ ƒ /api/dashboard/products-intelligence/overview
#11 314.0 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 314.0 ├ ƒ /api/dashboard/products-intelligence/products
#11 314.0 ├ ƒ /api/dashboard/products/catalog
#11 314.0 ├ ƒ /api/dashboard/products/mapping-inspector
#11 314.0 ├ ƒ /api/dashboard/products/overview
#11 314.0 ├ ƒ /api/dashboard/products/search-qa
#11 314.0 ├ ƒ /api/dashboard/products/sync-health
#11 314.0 ├ ƒ /api/dashboard/products/variants
#11 314.0 ├ ƒ /api/dashboard/profile
#11 314.0 ├ ƒ /api/dashboard/settings
#11 314.0 ├ ƒ /api/dashboard/settings/ai-agent
#11 314.0 ├ ƒ /api/dashboard/settings/channels
#11 314.0 ├ ƒ /api/dashboard/settings/shipping
#11 314.0 ├ ƒ /api/dashboard/stats
#11 314.0 ├ ƒ /api/dashboard/users
#11 314.0 ├ ƒ /api/dashboard/users/[id]
#11 314.0 ├ ƒ /api/dashboard/users/[id]/deactivate
#11 314.0 ├ ƒ /api/dashboard/users/[id]/invite
#11 314.0 ├ ƒ /api/health
#11 314.0 ├ ƒ /api/internal/failed-events
#11 314.0 ├ ƒ /api/internal/messages/turn
#11 314.0 ├ ƒ /api/internal/shopify/sync-products
#11 314.0 ├ ƒ /api/webhooks/evolution
#11 314.0 ├ ƒ /dashboard
#11 314.0 ├ ƒ /dashboard/command-center
#11 314.0 ├ ƒ /dashboard/conversations
#11 314.0 ├ ƒ /dashboard/devices
#11 314.0 ├ ƒ /dashboard/haidi/lab
#11 314.0 ├ ƒ /dashboard/haidi/learning
#11 314.0 ├ ƒ /dashboard/haidi/settings
#11 314.0 ├ ƒ /dashboard/handoff
#11 314.0 ├ ƒ /dashboard/inbox
#11 314.0 ├ ƒ /dashboard/knowledge-base
#11 314.0 ├ ƒ /dashboard/logs
#11 314.0 ├ ƒ /dashboard/messages
#11 314.0 ├ ƒ /dashboard/orders
#11 314.0 ├ ƒ /dashboard/orders/[id]/safety
#11 314.0 ├ ƒ /dashboard/pilot
#11 314.0 ├ ƒ /dashboard/pilot-control
#11 314.0 ├ ƒ /dashboard/products
#11 314.0 ├ ƒ /dashboard/products-intelligence
#11 314.0 ├ ƒ /dashboard/profile
#11 314.0 ├ ƒ /dashboard/security
#11 314.0 ├ ƒ /dashboard/settings
#11 314.0 ├ ƒ /dashboard/settings/ai-agent
#11 314.0 ├ ƒ /dashboard/settings/channels
#11 314.0 ├ ƒ /dashboard/settings/shipping
#11 314.0 ├ ƒ /dashboard/settings/users
#11 314.0 ├ ƒ /dashboard/statistics
#11 314.0 └ ○ /login
#11 314.0 
#11 314.0 
#11 314.0 ƒ Proxy (Middleware)
#11 314.0 
#11 314.0 ○  (Static)   prerendered as static content
#11 314.0 ƒ  (Dynamic)  server-rendered on demand
#11 314.0 
#11 DONE 314.8s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 3.8s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.5s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.2s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.3s

#17 exporting to image
#17 exporting layers
#17 exporting layers 2.7s done
#17 writing image sha256:3aa1a12d597f917268967a8f7fdc48a7966aaf1d76b07d963bb6732bfd48ae1a done
#17 naming to docker.io/library/youlya-youlya-app 0.0s done
#17 DONE 2.8s

#18 resolving provenance for metadata file
#18 DONE 0.1s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: b5ac014
- version: 2.23.4
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
