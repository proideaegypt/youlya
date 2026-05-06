# Route Matrix

## Dashboard Pages (app/dashboard)

| Route | File | Auth | Sidebar | Status | Notes |
|-------|------|------|---------|--------|-------|
| /dashboard | page.tsx | Yes | Yes | OK | Redirects to command-center likely |
| /dashboard/command-center | page.tsx | Yes | Yes | OK | Uses APP_URL env for stats API |
| /dashboard/pilot | page.tsx | Yes | Yes | OK | Active pilot control room |
| /dashboard/pilot-control | page.tsx | Yes | Yes | OK | Redirects to /dashboard/pilot |
| /dashboard/inbox | page.tsx | Yes | Yes | OK | Conversations + timeline |
| /dashboard/conversations | page.tsx | Yes | Yes | OK | Conversation list + filters |
| /dashboard/handoff | page.tsx | Yes | Yes | OK | Handoff center with actions |
| /dashboard/orders | page.tsx | Yes | Yes | OK | Orders list |
| /dashboard/orders/[id]/safety | page.tsx | Yes | Yes | OK | Order safety view |
| /dashboard/products | page.tsx | Yes | Yes | OK | Products catalog, variants, search QA, sync health, mapping inspector |
| /dashboard/products-intelligence | page.tsx | Yes | Yes | OK | Product intelligence with channels |
| /dashboard/logs | page.tsx | Yes | Yes | OK | Logs with date filter |
| /dashboard/statistics | page.tsx | Yes | Yes | OK | Statistics |
| /dashboard/security | page.tsx | Yes | Yes | OK | Security |
| /dashboard/devices | page.tsx | Yes | Yes | OK | Devices |
| /dashboard/profile | page.tsx | Yes | Yes | OK | Profile preferences |
| /dashboard/settings | page.tsx | Yes | Yes | OK | Settings |
| /dashboard/settings/ai-agent | page.tsx | Yes | Yes | NEW | AI agent settings |
| /dashboard/settings/channels | page.tsx | Yes | Yes | NEW | Channel integrations |
| /dashboard/settings/shipping | page.tsx | Yes | Yes | NEW | Shipping settings |
| /dashboard/settings/users | page.tsx | Yes | Yes | NEW | Users & roles |
| /dashboard/haidi/settings | page.tsx | Yes | Yes | OK | Haidi settings |
| /dashboard/haidi/lab | page.tsx | Yes | Yes | OK | Haidi lab |
| /dashboard/haidi/learning | page.tsx | Yes | Yes | OK | Haidi learning |
| /dashboard/knowledge-base | page.tsx | Yes | Yes | OK | Knowledge base |
| /dashboard/messages | page.tsx | Yes | Yes | OK | Messages |

## Dashboard APIs (app/api/dashboard)

| Route | Methods | Auth Required | Status |
|-------|---------|---------------|--------|
| /api/dashboard/pilot-control | GET | Yes (401) | OK |
| /api/dashboard/pilot/actions | POST | Yes (401) | OK |
| /api/dashboard/handoff | GET | Yes (401) | OK |
| /api/dashboard/handoff/[id]/assign | POST | Yes | OK |
| /api/dashboard/handoff/[id]/note | POST | Yes | OK |
| /api/dashboard/handoff/[id]/resolve | POST | Yes | OK |
| /api/dashboard/handoff/[id]/return-to-ai | POST | Yes | OK |
| /api/dashboard/conversations | GET | Yes (401) | OK |
| /api/dashboard/conversations/[id] | GET | Yes | OK |
| /api/dashboard/conversations/[id]/actions | POST | Yes | OK |
| /api/dashboard/conversations/[id]/timeline | GET | Yes | OK |
| /api/dashboard/orders | GET | Yes (401) | OK |
| /api/dashboard/logs | GET | Yes (401) | OK |
| /api/dashboard/notifications | GET | Yes (401) | OK |
| /api/dashboard/profile | GET/POST | Yes (401) | OK |
| /api/dashboard/settings/ai-agent | GET/POST/PUT | Yes (403) | OK |
| /api/dashboard/settings/channels | GET/POST | Yes (403) | OK |
| /api/dashboard/settings/shipping | GET/POST/PUT | Yes (403) | OK |
| /api/dashboard/users | GET/POST | Yes (403) | OK |
| /api/dashboard/products/overview | GET | Yes (401) | OK |
| /api/dashboard/products/catalog | GET | Yes | OK |
| /api/dashboard/products/variants | GET | Yes | OK |
| /api/dashboard/products/sync-health | GET | Yes | OK |
| /api/dashboard/products/search-qa | POST | Yes | OK |
| /api/dashboard/products/mapping-inspector | GET | Yes | OK |
| /api/dashboard/products-intelligence/overview | GET | Yes (401) | OK |
| /api/dashboard/products-intelligence/products | GET | Yes | OK |
| /api/dashboard/products-intelligence/channels | GET | Yes | OK |
| /api/dashboard/products-intelligence/product/[id] | GET | Yes | OK |
| /api/dashboard/haidi-settings | GET | Yes (401) | OK |
| /api/dashboard/haidi/settings | GET/POST | Yes | OK |
| /api/dashboard/haidi/prompt | GET/POST | Yes | OK |
| /api/dashboard/haidi/lab | GET/POST | Yes | OK |
| /api/dashboard/haidi/lab/run | POST | Yes | OK |
| /api/dashboard/haidi/learning | GET/POST | Yes | OK |
| /api/dashboard/knowledge-base | GET/POST | Yes (401) | OK |
| /api/dashboard/stats | GET | Yes (401) | OK |
| /api/dashboard/channels/evolution/accounts | GET/POST | Yes | NEW |
| /api/dashboard/channels/evolution/accounts/[id]/connect | POST | Yes | NEW |
| /api/dashboard/channels/evolution/accounts/[id]/disconnect | POST | Yes | NEW |
| /api/dashboard/channels/evolution/accounts/[id]/qr | GET | Yes | NEW |
| /api/dashboard/channels/evolution/accounts/[id]/set-default | POST | Yes | NEW |
| /api/dashboard/channels/evolution/accounts/[id]/status | GET | Yes | NEW |

## Internal APIs

| Route | Methods | Auth | Status |
|-------|---------|------|--------|
| /api/internal/messages/turn | POST | internal-api-secret | OK |
| /api/internal/failed-events | GET/POST | internal | OK |
| /api/internal/shopify/sync-products | POST | internal | OK |
| /api/webhooks/evolution | POST | webhook secret | OK |
| /api/ai/tools/create-shopify-order | POST | internal | OK |
| /api/health | GET | No | OK |
| /api/build-info | GET | No | OK |

## Issues Found

1. **P1**: `/dashboard/pilot` still references `admin.youlya365.com` in Health API link and synthetic webhook example (line 436, 482)
2. **P1**: `/dashboard/command-center` uses `process.env.APP_URL` client-side which will be undefined in browser, falling back to `http://127.0.0.1:3000`
3. **P2**: `/dashboard/toggle-card.tsx` fetches `/api/admin/settings` which does not exist under `app/api/admin/`
