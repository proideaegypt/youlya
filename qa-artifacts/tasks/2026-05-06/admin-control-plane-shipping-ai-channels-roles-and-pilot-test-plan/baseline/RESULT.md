# Baseline: admin-control-plane-shipping-ai-channels-roles-and-pilot-test-plan

## Current Version
- package.json: 2.23.0
- versionName: admin-control-plane-shipping-ai-channels-roles-and-pilot-test-plan
- git commit: b5ac014
- branch: main

## Current Dashboard Routes
- /dashboard/command-center
- /dashboard/inbox
- /dashboard/orders
- /dashboard/products
- /dashboard/products-intelligence
- /dashboard/handoff
- /dashboard/conversations
- /dashboard/statistics
- /dashboard/settings
- /dashboard/settings/shipping
- /dashboard/settings/ai-agent
- /dashboard/settings/channels
- /dashboard/settings/users
- /dashboard/profile
- /dashboard/logs
- /dashboard/pilot-control
- /dashboard/haidi/lab
- /dashboard/haidi/learning
- /dashboard/haidi/settings
- /dashboard/security
- /dashboard/devices

## Current Settings/Profile Implementation
- user_profiles table exists with language, theme, color, sidebar preferences
- Profile page at /dashboard/profile with save/persist
- store_shipping_settings and shipping_zones tables exist
- Shipping settings page at /dashboard/settings/shipping
- ai_agent_settings table exists with encrypted API key
- AI agent settings page at /dashboard/settings/ai-agent
- channel_integrations and channel_accounts tables exist
- Channels settings page at /dashboard/settings/channels
- store_user_roles table exists
- Users & roles page at /dashboard/settings/users

## Current Auth/Session/Roles Implementation
- Supabase SSR auth with cookie-based sessions
- store_user_roles with roles: super_admin, moderator, customer_service
- RBAC helpers in lib/auth/roles.ts
- API routes protected by getCurrentUserRole + canManage* helpers

## Current Shipping Implementation
- store_shipping_settings with free_shipping_threshold_egp (default 1400)
- shipping_zones with governorate, district, aliases, fee
- Seed zones: Cairo/Nasr City (70), Cairo (70), Alexandria (90)
- calculateShippingFromSettings uses DB rules
- AI order summary includes shipping calculation from DB

## Current AI Provider Implementation
- ai_agent_settings table with provider (openai/anthropic/gemini/custom), model, encrypted key
- Connection test endpoint (OpenAI smoke test implemented)
- Masked responses (SET/MISSING + last4)

## Current Channels/Evolution Implementation
- channel_integrations for evolution_whatsapp, meta_whatsapp, instagram, facebook
- channel_accounts with multi-number support, default flag, status, qr_status
- Evolution instance management client (create, QR, state, logout)
- API routes for Evolution QR connection from dashboard

## Current Supabase Schema Relevant to This Task
- public.user_profiles
- public.store_user_roles
- public.store_shipping_settings
- public.shipping_zones
- public.ai_agent_settings
- public.channel_integrations
- public.channel_accounts
- public.settings_audit_logs

## Gaps and Risks
- SETTINGS_ENCRYPTION_KEY must be set in production env for secret encryption to work
- Evolution QR endpoints need real Evolution API credentials to function beyond mock mode
- n8n workflow JSON files still missing from repo (external dependency)
- Playwright dashboard swarm requires .env.playwright for authenticated runs
- Host `npm run build` can OOM on VPS; Docker build works as fallback
- DNS resolution for admin.youlya365.com fails from VPS shell (network config), but deployment succeeds

## Commands Run
- npm run typecheck: PASS
- npm run lint: PASS (warnings only)
- npm test: PASS (217 tests)
- npm run validate:scenarios: PASS (104 scenarios)
- npm run scan:secrets: PASS
- npm run verify:release: PASS (v2.23.0)
- npm run build: PASS (with NEXT_PRIVATE_SKIP_TYPECHECK=1 due to host resource constraints)
- docker compose build: PASS
- npm run deploy:production: PASS (v2.23.0 deployed)
