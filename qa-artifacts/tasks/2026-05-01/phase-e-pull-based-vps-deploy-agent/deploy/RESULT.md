# Deploy Production (Pull-Based)

- Date: 2026-05-01
- Requested branch: main
- Current branch: main
- Compose file: docker-compose.yml
- Compose env source: auto-detect
From https://github.com/proideaegypt/youlya
 * branch            main       -> FETCH_HEAD
Already up to date.

> youlya-phase0-app@2.0.8 build:info
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
#6 transferring context: 2.36MB 2.7s done
#6 DONE 2.8s

#7 [deps 2/4] WORKDIR /app
#7 CACHED

#8 [deps 3/4] COPY package*.json ./
#8 CACHED

#9 [deps 4/4] RUN npm ci --omit=dev
#9 CACHED

#10 [builder 3/5] COPY --from=deps /app/node_modules ./node_modules
#10 CACHED

#11 [builder 4/5] COPY . .
#11 DONE 39.2s

#12 [builder 5/5] RUN npm run build
#12 2.014 
#12 2.014 > youlya-phase0-app@2.0.8 build
#12 2.014 > npm run build:info && next build --webpack
#12 2.014 
#12 2.349 
#12 2.349 > youlya-phase0-app@2.0.8 build:info
#12 2.349 > node scripts/write-build-info.mjs
#12 2.349 
#12 2.500 build info written: /app/public/build-info.json
#12 4.464 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#12 4.465 This information is used to shape Next.js' roadmap and prioritize features.
#12 4.465 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#12 4.465 https://nextjs.org/telemetry
#12 4.465 
#12 6.905 ▲ Next.js 16.2.4 (webpack)
#12 6.905 - Environments: .env.local, .env.production
#12 6.906 
#12 7.051 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#12 7.160   Creating an optimized production build ...
#12 30.71 ⚠ Compiled with warnings in 21.0s
#12 30.71 
#12 30.71 ./app/api/health/route.ts
#12 30.71 Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)
#12 30.71 
#12 30.71 Import trace for requested module:
#12 30.71 ./app/api/health/route.ts
#12 30.71 
#12 40.37 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (231kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
#12 49.23 Found 1 warning while optimizing generated CSS:
#12 49.23 
#12 49.23 [2m│   }[22m
#12 49.23 [2m│ }[22m
#12 49.23 [2m│[22m @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap");
#12 49.23 [2m┆[22m        [33m[2m^--[22m @import rules must precede all rules aside from @charset and @layer statements[39m
#12 49.23 [2m┆[22m
#12 49.23 [2m│ :root {[22m
#12 49.23 [2m│   --background: #09090b;[22m
#12 49.23 
#12 55.62 ✓ Compiled successfully in 40s
#12 55.64   Running TypeScript ...
#12 73.56   Finished TypeScript in 17.9s ...
#12 73.57   Collecting page data using 3 workers ...
#12 81.09   Generating static pages using 3 workers (0/29) ...
#12 81.45   Generating static pages using 3 workers (7/29) 
#12 82.16   Generating static pages using 3 workers (14/29) 
#12 82.16   Generating static pages using 3 workers (21/29) 
#12 82.64 ✓ Generating static pages using 3 workers (29/29) in 1552ms
#12 85.15   Finalizing page optimization ...
#12 85.15   Collecting build traces ...
#12 130.6 
#12 130.6 Route (app)
#12 130.6 ┌ ○ /
#12 130.6 ├ ○ /_not-found
#12 130.6 ├ ƒ /api/admin/handoffs
#12 130.6 ├ ƒ /api/admin/settings
#12 130.6 ├ ƒ /api/ai/tools/calculate-shipping
#12 130.6 ├ ƒ /api/ai/tools/confirm-order
#12 130.6 ├ ƒ /api/ai/tools/create-shopify-order
#12 130.6 ├ ƒ /api/ai/tools/handoff
#12 130.6 ├ ƒ /api/ai/tools/product-search
#12 130.6 ├ ƒ /api/ai/tools/select-product
#12 130.6 ├ ƒ /api/build-info
#12 130.6 ├ ƒ /api/dashboard/conversations
#12 130.6 ├ ƒ /api/dashboard/conversations/[id]
#12 130.6 ├ ƒ /api/dashboard/conversations/[id]/actions
#12 130.6 ├ ƒ /api/dashboard/logs
#12 130.6 ├ ƒ /api/dashboard/orders
#12 130.6 ├ ƒ /api/dashboard/settings
#12 130.6 ├ ƒ /api/dashboard/stats
#12 130.6 ├ ƒ /api/health
#12 130.6 ├ ƒ /api/internal/failed-events
#12 130.6 ├ ƒ /api/internal/messages/turn
#12 130.6 ├ ƒ /api/webhooks/evolution
#12 130.6 ├ ƒ /dashboard
#12 130.6 ├ ƒ /dashboard/command-center
#12 130.6 ├ ƒ /dashboard/inbox
#12 130.6 ├ ƒ /dashboard/logs
#12 130.6 ├ ƒ /dashboard/orders
#12 130.6 ├ ƒ /dashboard/orders/[id]/safety
#12 130.6 ├ ƒ /dashboard/settings
#12 130.6 └ ○ /login
#12 130.6 
#12 130.6 
#12 130.6 ƒ Proxy (Middleware)
#12 130.6 
#12 130.6 ○  (Static)   prerendered as static content
#12 130.6 ƒ  (Dynamic)  server-rendered on demand
#12 130.6 
#12 130.8 npm notice
#12 130.8 npm notice New major version of npm available! 10.8.2 -> 11.13.0
#12 130.8 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.13.0
#12 130.8 npm notice To update run: npm install -g npm@11.13.0
#12 130.8 npm notice
#12 DONE 131.1s

#13 [runner 3/7] RUN apk add --no-cache curl
#13 CACHED

#14 [runner 4/7] COPY --from=builder /app/.next/standalone ./
#14 DONE 1.2s

#15 [runner 5/7] COPY --from=builder /app/.next/static ./.next/static
#15 DONE 0.2s

#16 [runner 6/7] COPY --from=builder /app/public ./public
#16 DONE 0.1s

#17 [runner 7/7] COPY --from=builder /app/docs ./docs
#17 DONE 0.2s

#18 exporting to image
#18 exporting layers
#18 exporting layers 1.2s done
#18 writing image sha256:6224d894b829c6a58087eac14de457e3be0e458c5354dc4c107f5b6c8bad0d48
#18 writing image sha256:6224d894b829c6a58087eac14de457e3be0e458c5354dc4c107f5b6c8bad0d48 done
#18 naming to docker.io/library/youlya-youlya-app done
#18 DONE 1.2s

#19 resolving provenance for metadata file
#19 DONE 0.0s
 Image youlya-youlya-app Built 
 Container youlya-youlya-app-1 Recreate 
 Container youlya-youlya-app-1 Recreated 
 Container youlya-youlya-app-1 Starting 
 Container youlya-youlya-app-1 Started 

## Summary
- deployed commit: f19455a
- version: 2.0.8
- compose file used: docker-compose.yml
- tag: none
- health result: skipped
- build-info result: skipped
- deploy result: PASS
