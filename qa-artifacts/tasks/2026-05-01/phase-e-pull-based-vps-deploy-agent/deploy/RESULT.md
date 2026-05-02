# Deploy Production (Pull-Based)

- Date: 2026-05-01
- Requested branch: main
- Current branch: main
- Compose file: docker-compose.yml
- Compose env source: auto-detect
From https://github.com/proideaegypt/youlya
 * branch            main       -> FETCH_HEAD
Already up to date.

> youlya-phase0-app@2.2.1 build:info
> node scripts/write-build-info.mjs

build info written: /root/youlya/public/build-info.json
 Image youlya-youlya-app Building 
#1 [internal] load local bake definitions
#1 reading from stdin 490B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 556B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.6s

#4 [internal] load .dockerignore
#4 transferring context: 45B done
#4 DONE 0.0s

#5 [deps 1/4] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 78.26MB 3.6s done
#6 DONE 3.8s

#7 [deps 2/4] WORKDIR /app
#7 CACHED

#8 [deps 3/4] COPY package*.json ./
#8 DONE 0.7s

#9 [deps 4/4] RUN npm ci --omit=dev
#9 30.58 
#9 30.58 added 46 packages, and audited 47 packages in 30s
#9 30.58 
#9 30.58 10 packages are looking for funding
#9 30.58   run `npm fund` for details
#9 30.65 
#9 30.65 2 moderate severity vulnerabilities
#9 30.65 
#9 30.65 To address all issues (including breaking changes), run:
#9 30.65   npm audit fix --force
#9 30.65 
#9 30.65 Run `npm audit` for details.
#9 30.66 npm notice
#9 30.66 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#9 30.66 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#9 30.66 npm notice To update run: npm install -g npm@11.13.0
#9 30.66 npm notice
#9 DONE 32.0s

#10 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#10 CACHED

#11 [builder 4/5] COPY . .
#11 DONE 53.9s

#12 [builder 5/5] RUN npm run build
#12 2.408 
#12 2.408 > youlya-phase0-app@2.2.1 build
#12 2.408 > npm run build:info && next build --webpack
#12 2.408 
#12 2.855 
#12 2.855 > youlya-phase0-app@2.2.1 build:info
#12 2.855 > node scripts/write-build-info.mjs
#12 2.855 
#12 3.092 build info written: /app/public/build-info.json
#12 4.480 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#12 4.481 This information is used to shape Next.js' roadmap and prioritize features.
#12 4.481 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#12 4.481 https://nextjs.org/telemetry
#12 4.481 
#12 7.073 ▲ Next.js 16.2.4 (webpack)
#12 7.073 - Environments: .env.local, .env.production
#12 7.075 
#12 7.235 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#12 7.341   Creating an optimized production build ...
#12 29.59 ⚠ Compiled with warnings in 20.0s
#12 29.59 
#12 29.60 ./app/api/health/route.ts
#12 29.60 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#12 29.60 
#12 29.60 Import trace for requested module:
#12 29.60 ./app/api/health/route.ts
#12 29.60 
#12 40.70 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#12 55.55 ✓ Compiled successfully in 40s
#12 55.57   Running TypeScript ...
#12 75.35   Finished TypeScript in 19.8s ...
#12 75.37   Collecting page data using 3 workers ...
#12 82.25   Generating static pages using 3 workers (0/29) ...
#12 82.45   Generating static pages using 3 workers (7/29) 
#12 82.85   Generating static pages using 3 workers (14/29) 
#12 82.85   Generating static pages using 3 workers (21/29) 
#12 83.59 ✓ Generating static pages using 3 workers (29/29) in 1348ms
#12 85.84   Finalizing page optimization ...
#12 85.84   Collecting build traces ...
#12 127.4 
#12 127.4 Route (app)
#12 127.4 ┌ ○ /
#12 127.4 ├ ○ /_not-found
#12 127.4 ├ ƒ /api/admin/handoffs
#12 127.4 ├ ƒ /api/admin/settings
#12 127.4 ├ ƒ /api/ai/tools/calculate-shipping
#12 127.4 ├ ƒ /api/ai/tools/confirm-order
#12 127.4 ├ ƒ /api/ai/tools/create-shopify-order
#12 127.4 ├ ƒ /api/ai/tools/handoff
#12 127.4 ├ ƒ /api/ai/tools/product-search
#12 127.4 ├ ƒ /api/ai/tools/select-product
#12 127.4 ├ ƒ /api/build-info
#12 127.4 ├ ƒ /api/dashboard/conversations
#12 127.4 ├ ƒ /api/dashboard/conversations/[id]
#12 127.4 ├ ƒ /api/dashboard/conversations/[id]/actions
#12 127.4 ├ ƒ /api/dashboard/logs
#12 127.4 ├ ƒ /api/dashboard/orders
#12 127.4 ├ ƒ /api/dashboard/settings
#12 127.4 ├ ƒ /api/dashboard/stats
#12 127.4 ├ ƒ /api/health
#12 127.4 ├ ƒ /api/internal/failed-events
#12 127.4 ├ ƒ /api/internal/messages/turn
#12 127.4 ├ ƒ /api/webhooks/evolution
#12 127.4 ├ ƒ /dashboard
#12 127.4 ├ ƒ /dashboard/command-center
#12 127.4 ├ ƒ /dashboard/inbox
#12 127.4 ├ ƒ /dashboard/logs
#12 127.4 ├ ƒ /dashboard/orders
#12 127.4 ├ ƒ /dashboard/orders/[id]/safety
#12 127.4 ├ ƒ /dashboard/settings
#12 127.4 └ ○ /login
#12 127.4 
#12 127.4 
#12 127.4 ƒ Proxy (Middleware)
#12 127.4 
#12 127.4 ○  (Static)   prerendered as static content
#12 127.4 ƒ  (Dynamic)  server-rendered on demand
#12 127.4 
#12 127.6 npm notice
#12 127.6 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#12 127.6 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#12 127.6 npm notice To update run: npm install -g npm@11.13.0
#12 127.6 npm notice
#12 DONE 127.9s

#13 [runner 3/7] RUN apk add --no-cache curl
#13 CACHED

#14 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#14 DONE 1.2s

#15 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#15 DONE 0.2s

#16 [runner 6/7] COPY --from=builder /app/public ./public
#16 DONE 0.1s

#17 [runner 7/7] COPY --from=builder /app/docs ./docs
#17 DONE 0.1s

#18 exporting to image
#18 exporting layers
#18 exporting layers 1.1s done
#18 writing image sha256:bb664515317f5e4543c55cc503b4186c657e9009ab0f5f36f3b59eb330a449c6 done
#18 naming to docker.io/library/youlya-youlya-app 0.0s done
#18 DONE 1.1s

#19 resolving provenance for metadata file
#19 DONE 0.0s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: b7637ac
- version: 2.2.1
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
