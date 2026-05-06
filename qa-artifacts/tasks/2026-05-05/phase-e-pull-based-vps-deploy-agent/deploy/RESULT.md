# Deploy Production (Pull-Based)

- Date: 2026-05-05
- Requested branch: main
- Current branch: main
- Compose file: docker-compose.yml
- Compose env source: auto-detect
From https://github.com/proideaegypt/youlya
 * branch            main       -> FETCH_HEAD
Already up to date.

> youlya-phase0-app@2.20.0 build:info
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
#3 DONE 0.4s

#4 [internal] load .dockerignore
#4 transferring context: 217B done
#4 DONE 0.0s

#5 [builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 161.98kB 1.9s done
#6 DONE 9.7s

#7 [builder 2/6] WORKDIR /app
#7 CACHED

#8 [builder 3/6] COPY package*.json ./
#8 CACHED

#9 [builder 4/6] RUN npm ci
#9 CACHED

#10 [builder 5/6] COPY . .
#10 DONE 1.7s

#11 [builder 6/6] RUN npm run build
#11 1.069 
#11 1.069 > youlya-phase0-app@2.20.0 build
#11 1.069 > npm run build:info && next build --webpack
#11 1.069 
#11 1.400 
#11 1.400 > youlya-phase0-app@2.20.0 build:info
#11 1.400 > node scripts/write-build-info.mjs
#11 1.400 
#11 1.527 build info written: /app/public/build-info.json
#11 3.150 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#11 3.153 This information is used to shape Next.js' roadmap and prioritize features.
#11 3.153 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#11 3.153 https://nextjs.org/telemetry
#11 3.153 
#11 3.194 ▲ Next.js 16.2.4 (webpack)
#11 3.194 - Environments: .env.local, .env.production
#11 3.194 
#11 3.357 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#11 3.526   Creating an optimized production build ...
#11 44.43 ⚠ Compiled with warnings in 38.7s
#11 44.43 
#11 44.43 ./app/api/health/route.ts
#11 44.43 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#11 44.43 
#11 44.43 Import trace for requested module:
#11 44.43 ./app/api/health/route.ts
#11 44.43 
#11 53.87 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#11 62.32 
#11 62.32 
#11 62.32 Retrying 1/3...
#11 62.32 
#11 62.32 
#11 62.32 Retrying 1/3...
#11 62.32 
#11 62.32 
#11 62.32 Retrying 1/3...
#11 79.14 ✓ Compiled successfully in 68s
#11 79.16   Running TypeScript ...
#11 104.3   Finished TypeScript in 25.1s ...
#11 104.3   Collecting page data using 3 workers ...
#11 113.2   Generating static pages using 3 workers (0/66) ...
#11 113.9   Generating static pages using 3 workers (16/66) 
#11 113.9   Generating static pages using 3 workers (32/66) 
#11 114.1   Generating static pages using 3 workers (49/66) 
#11 114.6 ✓ Generating static pages using 3 workers (66/66) in 1357ms
#11 116.8   Finalizing page optimization ...
#11 116.8   Collecting build traces ...
#11 154.6 
#11 154.6 Route (app)
#11 154.6 ┌ ○ /
#11 154.6 ├ ○ /_not-found
#11 154.6 ├ ƒ /api/admin/handoffs
#11 154.6 ├ ƒ /api/admin/settings
#11 154.6 ├ ƒ /api/ai/rag/retrieve
#11 154.6 ├ ƒ /api/ai/tools/calculate-shipping
#11 154.6 ├ ƒ /api/ai/tools/confirm-order
#11 154.6 ├ ƒ /api/ai/tools/create-shopify-order
#11 154.6 ├ ƒ /api/ai/tools/handoff
#11 154.6 ├ ƒ /api/ai/tools/product-search
#11 154.6 ├ ƒ /api/ai/tools/select-product
#11 154.6 ├ ƒ /api/build-info
#11 154.6 ├ ƒ /api/dashboard/conversations
#11 154.6 ├ ƒ /api/dashboard/conversations/[id]
#11 154.6 ├ ƒ /api/dashboard/conversations/[id]/actions
#11 154.6 ├ ƒ /api/dashboard/conversations/[id]/timeline
#11 154.6 ├ ƒ /api/dashboard/haidi-settings
#11 154.6 ├ ƒ /api/dashboard/haidi/lab
#11 154.6 ├ ƒ /api/dashboard/haidi/lab/[id]
#11 154.6 ├ ƒ /api/dashboard/haidi/lab/run
#11 154.6 ├ ƒ /api/dashboard/haidi/learning
#11 154.6 ├ ƒ /api/dashboard/haidi/prompt
#11 154.6 ├ ƒ /api/dashboard/haidi/settings
#11 154.6 ├ ƒ /api/dashboard/handoff
#11 154.6 ├ ƒ /api/dashboard/handoff/[id]/assign
#11 154.6 ├ ƒ /api/dashboard/handoff/[id]/note
#11 154.6 ├ ƒ /api/dashboard/handoff/[id]/resolve
#11 154.6 ├ ƒ /api/dashboard/handoff/[id]/return-to-ai
#11 154.6 ├ ƒ /api/dashboard/knowledge-base
#11 154.6 ├ ƒ /api/dashboard/logs
#11 154.6 ├ ƒ /api/dashboard/notifications
#11 154.6 ├ ƒ /api/dashboard/orders
#11 154.6 ├ ƒ /api/dashboard/pilot-control
#11 154.6 ├ ƒ /api/dashboard/pilot/actions
#11 154.6 ├ ƒ /api/dashboard/products-intelligence/channels
#11 154.6 ├ ƒ /api/dashboard/products-intelligence/overview
#11 154.6 ├ ƒ /api/dashboard/products-intelligence/product/[id]
#11 154.6 ├ ƒ /api/dashboard/products-intelligence/products
#11 154.6 ├ ƒ /api/dashboard/products/catalog
#11 154.6 ├ ƒ /api/dashboard/products/mapping-inspector
#11 154.6 ├ ƒ /api/dashboard/products/overview
#11 154.6 ├ ƒ /api/dashboard/products/search-qa
#11 154.6 ├ ƒ /api/dashboard/products/sync-health
#11 154.6 ├ ƒ /api/dashboard/products/variants
#11 154.6 ├ ƒ /api/dashboard/settings
#11 154.6 ├ ƒ /api/dashboard/stats
#11 154.6 ├ ƒ /api/health
#11 154.6 ├ ƒ /api/internal/failed-events
#11 154.6 ├ ƒ /api/internal/messages/turn
#11 154.6 ├ ƒ /api/internal/shopify/sync-products
#11 154.6 ├ ƒ /api/webhooks/evolution
#11 154.6 ├ ƒ /dashboard
#11 154.6 ├ ƒ /dashboard/command-center
#11 154.6 ├ ƒ /dashboard/conversations
#11 154.6 ├ ƒ /dashboard/devices
#11 154.6 ├ ƒ /dashboard/haidi/lab
#11 154.6 ├ ƒ /dashboard/haidi/learning
#11 154.6 ├ ƒ /dashboard/haidi/settings
#11 154.6 ├ ƒ /dashboard/handoff
#11 154.6 ├ ƒ /dashboard/inbox
#11 154.6 ├ ƒ /dashboard/knowledge-base
#11 154.6 ├ ƒ /dashboard/logs
#11 154.6 ├ ƒ /dashboard/messages
#11 154.6 ├ ƒ /dashboard/orders
#11 154.6 ├ ƒ /dashboard/orders/[id]/safety
#11 154.6 ├ ƒ /dashboard/pilot
#11 154.6 ├ ƒ /dashboard/pilot-control
#11 154.6 ├ ƒ /dashboard/products
#11 154.6 ├ ƒ /dashboard/products-intelligence
#11 154.6 ├ ƒ /dashboard/profile
#11 154.6 ├ ƒ /dashboard/security
#11 154.6 ├ ƒ /dashboard/settings
#11 154.6 ├ ƒ /dashboard/statistics
#11 154.6 └ ○ /login
#11 154.6 
#11 154.6 
#11 154.6 ƒ Proxy (Middleware)
#11 154.6 
#11 154.6 ○  (Static)   prerendered as static content
#11 154.6 ƒ  (Dynamic)  server-rendered on demand
#11 154.6 
#11 DONE 155.1s

#12 [runner 3/7] RUN apk add --no-cache curl
#12 CACHED

#13 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#13 DONE 1.0s

#14 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#14 DONE 0.2s

#15 [runner 6/7] COPY --from=builder /app/public ./public
#15 DONE 0.1s

#16 [runner 7/7] COPY --from=builder /app/docs ./docs
#16 DONE 0.1s

#17 exporting to image
#17 exporting layers
#17 exporting layers 1.0s done
#17 writing image sha256:628f644df0135026b158786ff46d30f9ba6e64cf3f28f77fb82719bbb19a6121
#17 writing image sha256:628f644df0135026b158786ff46d30f9ba6e64cf3f28f77fb82719bbb19a6121 done
#17 naming to docker.io/library/youlya-youlya-app 0.0s done
#17 DONE 1.0s

#18 resolving provenance for metadata file
#18 DONE 0.1s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: b5ac014
- version: 2.20.0
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
