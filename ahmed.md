




TASK:
stabilize-whatsapp-products-dashboard-handoff-after-failed-pilot

GOAL:
Fix the failed pilot foundations: product media output, duplicate replies, dashboard message visibility, handoff ticket visibility, and pilot quick buttons. The system must pass real acceptance tests before pilot resumes.

P0 ACCEPTANCE:
1. "هاي" returns one normal reply only.
2. "عايز اشوف بيجامه قطن" returns product results in clean WhatsApp format.
3. Product images are sent as actual media or clean link previews, not raw markdown/CDN image text.
4. No duplicate repeated replies.
5. Inbound and outbound messages show in /dashboard/pilot-control and /dashboard/inbox with readable body.
6. Handoff request creates visible ticket in /dashboard/handoff.
7. Return to AI works.
8. Pilot quick buttons work and show success/error.
9. No Shopify order is created.
10. No secrets or internal IDs leak.

DO NOT:
- Do not create Shopify orders.
- Do not mutate Shopify products.
- Do not print secrets.
- Do not fake rows.
- Do not hide failing tests.
- Do not continue pilot automatically.

STEP 1 — PRODUCT OUTPUT CONTRACT
Define a strict product result contract from app to n8n:

app response may include:
{
  "action": "product_results",
  "reply": "اختاري رقم الموديل + المقاس 💜",
  "products": [
    {
      "index": 1,
      "title": "...",
      "price": 1450,
      "currency": "EGP",
      "imageUrl": "https://...",
      "productUrl": "https://...",
      "availableSizes": ["M", "L"],
      "availableColors": ["Blue"],
      "sku": "...",
      "shopifyProductId": "...",
      "shopifyVariantId": "internal only"
    }
  ],
  "send_mode": "media_cards"
}

Rules:
- no markdown image syntax
- no raw CDN URL in plain text if send_mode=media_cards
- max 5 products for WhatsApp media
- product IDs/variant IDs not customer-facing

STEP 2 — N8N MEDIA SENDING
Update n8n workflow:

If action=product_results and products[].imageUrl exists:
- send product images using Evolution media endpoint, not sendText only.
- one media message per product with caption.
- after all products, send one short text:
  "اختاري رقم الموديل + المقاس ونكمل الأوردر 💜"

If Evolution media endpoint is not reliable:
- fallback to clean productUrl link preview only.
- never send markdown/CDN image URL text.

Use correct Evolution endpoint for media/image in your installed version.
Do not guess; verify with Evolution docs or existing working legacy workflow.

STEP 3 — DEDUPLICATION
Fix duplicate replies:

- Ensure provider_message_id is required for real webhooks.
- Mark inbound provider_message_id as processing before side effects.
- Store outbound response key.
- If duplicate webhook arrives, return duplicate_ignored and do not Send Text.
- In n8n, if action=duplicate_ignored or shouldSend=false, return [] before Send Text or Send Media.
- Add execution guard against repeated product follow-up.

STEP 4 — MESSAGE HISTORY
Fix message persistence:

Every inbound:
- log direction=inbound
- body/text populated
- channel=whatsapp_evolution
- conversation_id
- provider_message_id
- created_at

Every outbound:
- log direction=outbound
- body/final sent text populated
- channel=whatsapp_evolution
- evolution_message_id if available
- n8n_execution_id if available

Dashboard APIs must read the same fields:
- body should map from body OR text OR final_reply OR message
- no dash unless truly empty
- default Today should include current messages by server timezone correctly

STEP 5 — DASHBOARD PILOT/INBOX
Fix:
- /api/dashboard/pilot-control inboundMessages/outboundMessages
- /dashboard/pilot-control display
- /dashboard/inbox display
- /dashboard/conversations timeline

Acceptance:
- latest real test message appears with readable body within 10 seconds.
- outbound reply appears with readable body.

STEP 6 — HANDOFF VISIBILITY
Fix:
- explicit customer service request creates handoff ticket
- ticket appears in /dashboard/handoff today filter
- notification bell count increments
- ticket has problem_summary, last_customer_message, conversation_id
- Return to AI clears ai_paused and active ticket state

STEP 7 — PILOT QUICK BUTTONS
Fix dashboard quick buttons:
- pause/resume Haidi
- pause/resume orders
- open products search QA
- open handoff center
- refresh
- show toast success/error
- persist setting state
- Playwright verifies action effect

STEP 8 — TESTS
Add tests:
- product results contain media contract
- n8n media branch sends images or safe fallback
- no markdown image URL in customer reply
- duplicate webhook does not send duplicate reply
- dashboard API maps message body correctly
- handoff ticket visible with today filter
- quick actions persist state

STEP 9 — REALISTIC SMOKE TEST
Only to owner test number:

1. "هاي"
Expected: one reply only.

2. "عايز اشوف بيجامه قطن"
Expected:
- product media/cards clean
- one final instruction
- no raw CDN markdown text
- dashboard shows inbound/outbound

3. Send same provider_message_id again synthetically.
Expected:
- duplicate_ignored
- no outbound

4. "عايزة حد من خدمة العملاء يكلمني"
Expected:
- handoff ticket visible
- notification visible
- AI paused

5. Return to AI.
Expected:
- "هاي" works normally again

STEP 10 — RUN VERIFICATION
npm run validate:n8n
npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release
npm run verify:deploy
npm run test:e2e:dashboard:swarm
npm run qa:collect

STEP 11 — DEPLOY ONLY IF PASS
npm run release:task -- --task "stabilize-whatsapp-products-dashboard-handoff-after-failed-pilot" --type minor
npm run verify:release
npm run deploy:production

FINAL RESPONSE:
STATUS:
TASK:
VERSION:
PRODUCT_MEDIA_OUTPUT:
DUPLICATE_PROTECTION:
MESSAGE_HISTORY:
DASHBOARD_VISIBILITY:
HANDOFF_VISIBILITY:
QUICK_BUTTONS:
TESTS_RUN:
PLAYWRIGHT:
LIVE_SMOKE:
DEPLOY_RESULT:
GO_NO_GO:
READY_TO_RESUME_PILOT:
BLOCKERS:
NEXT_STEP:





































CODEX



TASK:
dashboard-total-audit-and-bug-discovery

GOAL:
Audit every dashboard route, page, button, function, API, filter, export, notification, and UI state. Discover all broken, fake, incomplete, misleading, or error-producing dashboard features. This task is audit-first; do not make large fixes. Produce a full bug backlog and feature inventory.

CONTEXT:
The owner reported:
- handoff not visible in dashboard
- messages not visible in dashboard/handoff/pilot-control correctly
- quick buttons not working
- some WhatsApp failures are not observable in dashboard
- dashboard may contain broken/fake/incomplete functions
- confidence is low; we need proof, not promises

Existing repo already has:
- dashboard pages under app/dashboard/*
- dashboard APIs under app/api/dashboard/*
- Playwright dashboard swarms
- pilot-control, handoff, conversations, products, products-intelligence, Haidi settings/lab/learning
- health/build-info endpoints
- release/deploy verification scripts

DO NOT:
- Do not deploy.
- Do not create Shopify orders.
- Do not mutate Shopify products.
- Do not print secrets.
- Do not delete data.
- Do not fake rows.
- Do not hide failures.
- Do not mark placeholders as pass.
- Do not skip auth/security/PII checks.
- Do not make broad code changes in this audit task.
- Tiny safe instrumentation/test additions are allowed if needed.

STEP 0 — FREEZE PILOT ASSUMPTION
Do not continue pilot.
This task is only dashboard audit and bug discovery.

STEP 1 — CREATE ARTIFACTS
Create:
qa-artifacts/tasks/YYYY-MM-DD/dashboard-total-audit-and-bug-discovery/

Files:
- RESULT.md
- FEATURE_INVENTORY.md
- ROUTE_MATRIX.md
- API_MATRIX.md
- BUTTON_ACTION_MATRIX.md
- FORMS_FILTERS_EXPORTS_MATRIX.md
- BUG_BACKLOG.md
- P0_BLOCKERS.md
- RESPONSIVE_A11Y_REPORT.md
- SECURITY_PII_REPORT.md
- PERFORMANCE_REPORT.md
- DASHBOARD_GO_NO_GO.md

STEP 2 — BASELINE
Run:

cd /root/youlya
pwd
git status --short
git log -1 --oneline
cat package.json | grep -E '"version"|youlyaVersionName' || true
curl -fsS https://admin.nex-lnk.online/api/health || true
curl -fsS https://admin.nex-lnk.online/api/build-info || true
curl -fsS https://admin.youlya365.com/api/health || true
curl -fsS https://admin.youlya365.com/api/build-info || true

Record:
- repo version
- live version(s)
- active domain being tested
- health status
- dirty files
- branch/commit

STEP 3 — DISCOVER ALL DASHBOARD ROUTES
Inventory all routes from:
- app/dashboard/**
- app/api/dashboard/**
- lib/ui/dashboard-sidebar.tsx
- command center quick actions
- topbar links
- any redirects from /dashboard/pilot-control to /dashboard/pilot

Commands:
find app/dashboard -maxdepth 5 -type f | sort
find app/api/dashboard -maxdepth 6 -type f | sort
grep -RniE "href=|router\\.push|window\\.location|/dashboard/|/api/dashboard/" app lib components --exclude-dir=node_modules --exclude-dir=.next || true

Create ROUTE_MATRIX.md:
route | title/h1 | auth required | expected page | status | notes

STEP 4 — DISCOVER ALL BUTTONS/ACTIONS/FORMS
Static scan:
grep -RniE "<button|Button|onClick|form|select|input|textarea|Export|Apply|Reset|Refresh|Return to AI|Resolve|Assign|Pause|Resume|Save|Delete|Run|Approve|Reject|Open|Download" app/dashboard components lib/ui --exclude-dir=node_modules --exclude-dir=.next || true

Create BUTTON_ACTION_MATRIX.md:
page | control label | selector | expected action | API/route | persisted? | toast/error? | status

STEP 5 — API AUDIT
Test every dashboard API.

Required API categories:
- stats
- conversations
- conversation timeline/actions
- handoff
- notifications
- orders
- logs
- settings
- haidi settings
- haidi lab
- haidi learning
- knowledge base
- pilot-control
- pilot actions
- products overview/catalog/variants/sync-health/mapping-inspector/search-qa
- products-intelligence overview/products/channels/product detail
- export APIs if present

For each:
- unauthenticated response should be 401/403/redirect or safe
- authenticated response should be 200 or meaningful 404 if feature not implemented
- never 500
- no secrets
- no full PII unless role permits
- response shape matches UI expectation

Create API_MATRIX.md:
method | endpoint | auth status | expected | actual | response shape | PII/secrets | status

STEP 6 — LIVE UI WALKTHROUGH WITH PLAYWRIGHT
Use authenticated admin state.

Run:
npm run test:e2e:dashboard:swarm || true
npm run qa:collect || true

Then add a deeper exploratory Playwright script if needed:
tests/playwright/dashboard-deep-audit.spec.ts

It must visit every dashboard route and capture:
- screenshot
- console errors
- network 4xx/5xx
- broken images
- missing h1/main
- loading skeleton stuck
- empty state
- horizontal overflow
- mobile/tablet/desktop

Routes to include at minimum:
- /dashboard/command-center
- /dashboard/pilot
- /dashboard/pilot-control
- /dashboard/inbox
- /dashboard/conversations
- /dashboard/handoff
- /dashboard/orders
- /dashboard/logs
- /dashboard/products
- /dashboard/products-intelligence
- /dashboard/haidi/settings
- /dashboard/haidi/lab
- /dashboard/haidi/learning
- /dashboard/knowledge-base
- /dashboard/settings
- /dashboard/statistics
- /dashboard/security
- /dashboard/devices
- /dashboard/profile

Create screenshots under:
qa-artifacts/tasks/YYYY-MM-DD/dashboard-total-audit-and-bug-discovery/screenshots/

STEP 7 — FUNCTIONAL TEST EACH PAGE

For each route, test all visible controls.

Command Center:
- quick actions route correctly
- cards not broken
- charts render
- search input does not break
- sidebar links correct

Pilot Control:
- health cards load
- inbound/outbound messages display readable text
- quick actions work:
  pause Haidi
  resume Haidi
  pause orders
  resume orders
  refresh
  open handoff
  open products search QA
- actions show success/error
- state persists after reload

Inbox:
- conversations visible if data exists
- empty state meaningful
- open conversation works
- date filter works
- export works
- search/filter works

Conversations:
- list loads
- timeline opens
- inbound/outbound body readable
- events visible
- PII masked
- actions work if present

Handoff:
- tickets visible
- today filter does not hide active tickets incorrectly
- assign works
- note works
- mark contacted works if present
- Return to AI works
- Resolve works
- notification count updates
- filters work
- export works

Orders:
- list loads
- filters work
- order safety view opens
- no unauthorized Shopify mutation
- export works

Logs:
- filters work
- search works
- details open if present
- export works

Products:
- overview loads
- catalog table/cards load
- images load
- variants filters work
- search QA runs
- mapping inspector works
- sync health loads
- Shopify links safe
- export works

Products Intelligence:
- product cards with photos load
- channel insights load or show correct empty state
- top ordered by AI not fake
- most ordered channel not fake
- product detail opens
- export works

Haidi Settings:
- all toggles load current values
- save works
- reload persists
- handoff on/off works
- AI pause/order pause works
- prompt source/version visible
- no secrets exposed

Haidi Lab:
- scenario list loads
- create scenario
- run scenario
- scoring visible
- delete/update if present
- learning suggestion generated only when expected
- no real orders

Haidi Learning:
- suggestions list
- approve/reject works
- publish placeholder not fake
- no automatic RAG publish
- export/filter works

Knowledge Base:
- list/load
- add/edit/approve/publish if present
- no raw PII
- no automatic self-learning

Settings/Profile/Security/Devices/Statistics:
- no broken buttons
- no placeholder passed as finished feature unless labeled
- exports/date filters only where records exist
- navigation and empty states correct

STEP 8 — DATE FILTERS AND EXPORTS
For every record page:
- default date range today
- this week works
- custom from/to works
- reset works
- query params preserved
- export uses current filters

Test export options:
- PDF
- JPG
- DOCX
- CSV if present

If any export button is fake or errors:
mark P1/P0 depending page.

Export must:
- include title/date/generatedAt/version
- mask PII
- not leak secrets
- not export raw internal IDs unless safe

STEP 9 — SECURITY AND PII
Check:
- unauthenticated dashboard redirects to login
- dashboard APIs require auth
- internal endpoints not exposed
- no service role/secrets in responses
- customer phones masked where needed
- exports mask PII
- browser localStorage does not store secrets
- Playwright auth state ignored by git
- no debug logs with secrets

Run:
npm run scan:secrets

STEP 10 — RESPONSIVE/A11Y
For each dashboard page:
- desktop 1440
- tablet 768
- mobile 390

Check:
- no horizontal overflow
- mobile drawer works
- active link visible
- h1/main exists
- buttons have accessible names
- inputs have labels
- modals/drawers focus usable
- Arabic RTL correct
- English toggle correct
- dark/light/color theme persists

STEP 11 — PERFORMANCE
Measure:
- page load rough time
- API response rough time
- huge data list performance
- broken images
- console errors
- memory leak symptoms from repeated route navigation

Use:
curl -w timings for APIs
Playwright network timings
docker logs last 200 lines

STEP 12 — BUG BACKLOG
For every issue, write BUG_BACKLOG.md:

Fields:
- Bug ID
- Title
- Page
- Feature/control
- Steps to reproduce
- Expected
- Actual
- Evidence screenshot/trace
- API/log evidence
- Severity P0/P1/P2
- Owner recommendation
- Fix estimate
- Blocks pilot? yes/no

STEP 13 — DASHBOARD GO/NO-GO
Create DASHBOARD_GO_NO_GO.md:

Decision categories:
- Navigation
- Auth
- Pilot control
- Inbox/history
- Handoff
- Products
- Products intelligence
- Haidi settings
- Haidi lab/learning
- Orders
- Logs
- Exports
- Date filters
- Notifications
- Quick actions
- Mobile/tablet
- Security/PII

Return:
DASHBOARD_READY_FOR_PILOT: YES/NO
DASHBOARD_READY_FOR_TEAM_USE: YES/NO

STEP 14 — RUN STANDARD CHECKS
Run:
npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release
npm run verify:deploy

Do not deploy.

STEP 15 — FINAL RESPONSE
Return:

STATUS: PASS / PARTIAL / FAIL
TASK: dashboard-total-audit-and-bug-discovery
LIVE_VERSION:
ROUTES_AUDITED:
APIS_AUDITED:
BUTTONS_AUDITED:
FORMS_FILTERS_EXPORTS_AUDITED:
PLAYWRIGHT:
P0_BUGS:
P1_BUGS:
P2_BUGS:
SECURITY_PII:
RESPONSIVE_A11Y:
PERFORMANCE:
DASHBOARD_READY_FOR_PILOT:
DASHBOARD_READY_FOR_TEAM_USE:
REPORT_PATH:
TOP_10_BUGS:
NEXT_FIX_PROMPT:















TASK:
fix-dashboard-p0-p1-bugs-from-total-audit

GOAL:
Fix only the P0 and P1 dashboard bugs discovered in dashboard-total-audit-and-bug-discovery. Do not add new features. Do not hide failures. The dashboard must become reliable enough for pilot monitoring and team use.

INPUT:
Read:
qa-artifacts/tasks/YYYY-MM-DD/dashboard-total-audit-and-bug-discovery/BUG_BACKLOG.md
qa-artifacts/tasks/YYYY-MM-DD/dashboard-total-audit-and-bug-discovery/P0_BLOCKERS.md
qa-artifacts/tasks/YYYY-MM-DD/dashboard-total-audit-and-bug-discovery/DASHBOARD_GO_NO_GO.md
qa-artifacts/tasks/YYYY-MM-DD/dashboard-total-audit-and-bug-discovery/BUTTON_ACTION_MATRIX.md
qa-artifacts/tasks/YYYY-MM-DD/dashboard-total-audit-and-bug-discovery/API_MATRIX.md

DO NOT:
- Do not fix P2 polish unless trivial.
- Do not create Shopify orders.
- Do not mutate Shopify products.
- Do not print secrets.
- Do not fake data.
- Do not remove tests to pass.
- Do not deploy unless all verification passes.

REQUIRED FIX CLASSES:
1. Broken quick buttons
2. Message body not visible in dashboard
3. Handoff ticket not visible
4. Return to AI broken/sticky pause
5. Notification count wrong
6. API 500s
7. Fake export buttons
8. Date filters hiding current records incorrectly
9. Broken navigation links
10. Mobile/tablet unusable
11. Auth/security/PII leaks

STEPS:
1. Read audit.
2. Create P0_P1_FIX_PLAN.md.
3. Fix bugs in priority order.
4. Add regression tests for every fixed bug.
5. Run targeted Playwright for affected pages.
6. Run full dashboard swarm.
7. Run full verification.
8. Release and deploy only if green.

RUN:
npm run test:e2e:dashboard:swarm
npm run qa:collect
npm run validate:n8n
npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release
npm run verify:deploy

RELEASE:
npm run release:task -- --task "fix-dashboard-p0-p1-bugs-from-total-audit" --type patch
npm run verify:release
npm run deploy:production

FINAL RESPONSE:
STATUS:
TASK:
FIXED_P0:
FIXED_P1:
REGRESSION_TESTS:
PLAYWRIGHT:
FULL_VERIFICATION:
DEPLOY_RESULT:
LIVE_VERSION:
REMAINING_P2:
DASHBOARD_READY_FOR_PILOT:
DASHBOARD_READY_FOR_TEAM_USE:
NEXT_STEP:





KIMI 



TASK:
repair-production-schema-and-restore-safe-whatsapp-pipeline-after-emergency-freeze

GOAL:
Repair the production schema drift and restore a safe, observable WhatsApp pipeline after the emergency freeze. Do not resume pilot. Do not reactivate n8n until all P0 blockers pass.

CURRENT INCIDENT STATE:
- Emergency freeze completed.
- stores.ai_enabled=false for youlya.
- haidi_settings.global_ai_paused=true.
- Active n8n workflow Youlya WhatsApp Main was exported and deactivated.
- Pilot GO/NO-GO is NO-GO.
- Evidence artifact:
  qa-artifacts/tasks/2026-05-06/emergency-freeze-whatsapp-ai-and-capture-failure-evidence/RESULT.md
- Incident report:
  qa-artifacts/tasks/2026-05-06/emergency-freeze-whatsapp-ai-and-capture-failure-evidence/INCIDENT_REPORT.md

KNOWN P0 BLOCKERS:
1. Production schema drift:
   - handoff_tickets.problem_summary missing
   - handoff_tickets.handoff_type missing
   - haidi_settings.customer_service_reply_template_ar missing
   - possible other handoff/settings fields missing
2. Supabase/PostgREST schema cache mismatch.
3. Evolution outbound HTTP 401.
4. messages rows have blank/null body, so dashboard shows dashes.
5. Duplicate outbound behavior: same reply text sent repeatedly across different inbound IDs.
6. Product results sent as text/raw URL/markdown instead of media card or clean safe fallback.
7. Dashboard quick buttons unreliable due schema drift and server action mismatch.

DO NOT:
- Do not resume pilot.
- Do not activate n8n workflow until final explicit GO.
- Do not set stores.ai_enabled=true.
- Do not set haidi_settings.global_ai_paused=false.
- Do not send WhatsApp messages to customers.
- Do not create Shopify orders.
- Do not mutate Shopify products.
- Do not print secrets.
- Do not print API keys.
- Do not use destructive SQL.
- Do not use drop table.
- Do not use drop column.
- Do not use truncate.
- Do not use delete from.
- Do not use cascade.
- Do not use alter column type.
- Do not fake dashboard rows.
- Do not hide errors.

STEP 0 — CREATE ARTIFACTS
Create:
qa-artifacts/tasks/YYYY-MM-DD/repair-production-schema-and-restore-safe-whatsapp-pipeline-after-emergency-freeze/

Files:
- RESULT.md
- SCHEMA_DRIFT_REPORT.md
- MIGRATION_PLAN.md
- EVOLUTION_AUTH_REPORT.md
- MESSAGE_HISTORY_REPAIR_REPORT.md
- DUPLICATE_CONTROL_REPORT.md
- DASHBOARD_ACTIONS_REPORT.md
- GO_NO_GO.md

STEP 1 — BASELINE
Run:

cd /root/youlya
pwd
git status --short
git log -1 --oneline
cat package.json | grep -E '"version"|youlyaVersionName' || true
curl -fsS https://admin.nex-lnk.online/api/health || true
curl -fsS https://admin.nex-lnk.online/api/build-info || true
curl -fsS https://admin.youlya365.com/api/health || true
curl -fsS https://admin.youlya365.com/api/build-info || true

Confirm freeze state:
- stores.ai_enabled=false
- haidi_settings.global_ai_paused=true
- n8n workflow joqfame4HXG775JO inactive

Do not unfreeze.

STEP 2 — PRODUCTION SCHEMA INVENTORY
Inspect actual production DB schema safely using information_schema or existing schema inventory script.

Tables to inspect:
- haidi_settings
- handoff_tickets
- handoff_notifications or notifications
- conversations
- messages
- conversation_events
- processed_messages
- dead_letter_log
- ai_tool_calls
- products
- product_variants
- last_product_recommendations
- stores

Output only:
- table exists yes/no
- columns
- column types
- nullable/default
- indexes
- row counts only
- no PII row data

Compare actual schema vs current code expectations.

Search code expectations:
grep -RniE "problem_summary|handoff_type|customer_service_reply_template_ar|manager_request_reply_template_ar|handoff_final_ack_template_ar|global_ai_paused|ai_paused|returned_to_ai|handoff_notifications|messages\\.body|body:" app lib components tests supabase --exclude-dir=node_modules --exclude-dir=.next || true

Create SCHEMA_DRIFT_REPORT.md:
- missing columns
- missing tables
- type mismatches
- code locations using them
- severity

STEP 3 — CREATE SAFE FORWARD-ONLY MIGRATION
If columns/tables are missing, create a new migration:
supabase/migrations/YYYYMMDDHHMMSS_repair_handoff_settings_message_history_schema.sql

Rules:
- Only CREATE TABLE IF NOT EXISTS
- Only ALTER TABLE ADD COLUMN IF NOT EXISTS
- Only CREATE INDEX IF NOT EXISTS
- Only COMMENT ON
- No destructive SQL
- No drop
- No truncate
- No delete from
- No cascade
- No alter column type

Expected additions if missing:

haidi_settings:
- global_ai_paused boolean default false
- human_handoff_enabled boolean default true
- handoff_customer_service_enabled boolean default true
- handoff_manager_request_enabled boolean default true
- pause_ai_after_handoff boolean default true
- send_handoff_acknowledgement boolean default true
- notify_human_team boolean default true
- default_handoff_assignee text nullable
- customer_service_reply_template_ar text default 'تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.'
- manager_request_reply_template_ar text default 'تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.'
- handoff_final_ack_template_ar text default 'تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.'

handoff_tickets:
- handoff_type text default 'customer_service'
- problem_summary text
- last_customer_message text
- ai_paused boolean default false
- returned_to_ai_at timestamptz
- contacted_at timestamptz
- resolved_at timestamptz
- priority text default 'normal'
- assigned_to text nullable
- notes text nullable

messages:
- body text
- text text
- final_reply text
- direction text
- channel text
- provider_message_id text
- n8n_execution_id text
- evolution_message_id text
- conversation_id text or compatible existing type
- status text

Only add missing columns, do not overwrite.

Run:
npm run check:migration:safe -- supabase/migrations/<new_migration>.sql

If checker flags forbidden SQL:
STOP and fix migration.

STEP 4 — APPLY MIGRATION SAFELY
Apply migration to production only using approved project migration path.

Before apply:
- create DB schema snapshot artifact
- record counts only

After apply:
- verify columns exist
- refresh Supabase/PostgREST schema cache if needed

Possible cache refresh:
- call NOTIFY pgrst, 'reload schema' if available and safe
- or restart app/PostgREST/Supabase stack component if this deployment uses self-hosted gateway
- document exact method

Do not delete data.

STEP 5 — MESSAGE HISTORY REPAIR
Fix code so every new inbound/outbound message stores readable body.

Rules:
Inbound:
- direction='inbound'
- body = customer text
- text = customer text if column exists
- channel='whatsapp_evolution'
- provider_message_id populated
- conversation_id populated
- created_at

Outbound:
- direction='outbound'
- body = actual final sent text/caption
- final_reply = actual final sent text if column exists
- channel='whatsapp_evolution'
- n8n_execution_id/evolution_message_id if available
- created_at

Dashboard mapping:
- displayBody = body || text || final_reply || message || app_reply
- show '—' only if truly empty
- include channel/time/conversation masked identifier

Do not attempt risky historical bulk backfill unless safe.
If old rows are blank, leave them but show a clear empty marker.
New rows must not be blank.

Add regression tests:
- app message-turn logs inbound body
- outbound final reply body saved
- pilot-control API returns readable body
- inbox/conversations display readable body
- no PII/secrets leak

STEP 6 — HANDOFF VISIBILITY REPAIR
Fix handoff service/API after schema repair.

Requirements:
- explicit customer service request creates ticket
- explicit manager request creates ticket with high priority
- ticket has handoff_type
- ticket has problem_summary
- ticket has last_customer_message
- notification created
- dashboard /handoff today filter shows ticket
- Return to AI sets ai_paused=false and status=returned_to_ai
- no sticky handoff after return_to_ai

Add regression tests:
- customer service trigger
- manager trigger
- normal product message does not trigger handoff
- ticket visible through dashboard API
- Return to AI resumes AI

STEP 7 — EVOLUTION OUTBOUND AUTH 401
Investigate Evolution HTTP 401 without printing keys.

Check:
- EVOLUTION_API_URL
- EVOLUTION_INSTANCE
- EVOLUTION_API_KEY presence only SET/MISSING
- n8n runtime env
- active workflow Send Text/Media header name
- Evolution API expected header for this version
- whether API key was rotated
- whether n8n has stale env and needs container restart
- whether Apache/proxy strips apikey header
- whether URL points to correct Evolution service

Do not print key.

Run direct safe auth test to API endpoint without sending message first if possible.

Fix:
- correct header name/value source
- restart n8n if env changed
- restart proxy only if needed
- update workflow header if wrong

Do not send real messages yet.

STEP 8 — DUPLICATE CONTROL
Implement repeat-reply control beyond provider_message_id.

Keep provider ID idempotency, but add a short-window outbound guard:

If same conversation_id + same normalized final text + same action was sent within last N seconds/minutes:
- do not send again
- return action='duplicate_outbound_suppressed'
- log event
- dashboard shows suppressed duplicate count

Suggested window:
- 120 seconds for identical static replies
- 300 seconds for product follow-up instructions

Do not suppress legitimate different product results or customer-requested repeat after time window.

Add tests:
- duplicate provider_message_id ignored
- different provider ID but same text within window suppressed
- different text allowed
- after window allowed if appropriate

n8n:
- if app returns shouldSend=false or action=duplicate_outbound_suppressed, stop before Send Text/Media.

STEP 9 — PRODUCT MEDIA OUTPUT FOUNDATION
Do not fully resume product media to customers yet, but implement safe contract/foundation.

App product_results response should not put markdown image syntax in final text.

Rules:
- no "![...](https://...)" in final_reply
- no raw CDN image URL in plain text customer reply if products array exists
- return structured products array:
  index, title, price, currency, imageUrl, productUrl, availableSizes, availableColors, sku
- n8n should later send media cards from products array
- until media endpoint is verified, fallback text should be clean and short:
  "لقيتلك شوية اختيارات مناسبة. هبعتلك الصور والتفاصيل دلوقتي 💜"

Add tests:
- product_results final text has no markdown image URLs
- products array contains imageUrl
- customer-facing reply no internal IDs

STEP 10 — DASHBOARD QUICK BUTTONS
Fix dashboard actions after schema repair.

Pilot/Haidi quick buttons:
- Pause Haidi
- Resume Haidi
- Pause orders
- Resume orders
- Refresh
- Open Handoff
- Open Inbox
- Open Product Search QA

Each must:
- call an API route
- persist actual state
- show toast success/error
- reload UI state
- never silently fail
- write audit/conversation/system event if relevant

Fix server-action version mismatch by converting unstable server actions to API routes if necessary.

Add Playwright:
- click action
- expect API success or visible error
- reload
- state persists

STEP 11 — KEEP SYSTEM FROZEN
After fixes, do not unfreeze automatically.

Keep:
- stores.ai_enabled=false
- haidi_settings.global_ai_paused=true
- n8n workflow inactive

Only run local/API tests and synthetic app tests.
No live WhatsApp outbound unless explicitly approved in later task.

STEP 12 — RUN VERIFICATION
Run:
npm run check:migration:safe -- supabase/migrations/<new_migration>.sql
npm run validate:n8n
npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release
npm run verify:deploy
npm run test:e2e:dashboard:swarm
npm run qa:collect

STEP 13 — RELEASE AND DEPLOY
If all checks pass:
npm run release:task -- --task "repair-production-schema-and-restore-safe-whatsapp-pipeline-after-emergency-freeze" --type patch
npm run verify:release
npm run deploy:production

Then verify:
curl -fsS https://admin.nex-lnk.online/api/health || true
curl -fsS https://admin.nex-lnk.online/api/build-info || true
curl -fsS https://admin.youlya365.com/api/health || true
curl -fsS https://admin.youlya365.com/api/build-info || true

STEP 14 — POST-DEPLOY SAFE VALIDATION
Do not activate n8n.

Validate via app/internal synthetic testMode only:
- "هاي" -> no handoff, readable message body logged
- "عايز اشتري بيجامه" -> no handoff, product/search action, no raw markdown image URL in reply
- "عايزة حد من خدمة العملاء يكلمني" -> handoff ticket created, dashboard visible, notification created
- Return to AI -> ai_paused=false
- duplicate repeated text -> suppressed

Validate dashboard:
- pilot-control shows readable inbound/outbound from synthetic/internal logs
- handoff shows ticket
- quick buttons persist state
- notifications count works

STEP 15 — GO/NO-GO
Create GO_NO_GO.md.

Only mark READY_FOR_CONTROLLED_WHATSAPP_REACTIVATION=YES if:
- schema drift fixed
- Supabase schema cache refreshed
- Evolution auth 401 fixed
- new messages body not blank
- handoff ticket visible
- quick buttons work
- duplicate outbound suppression works
- product output no raw markdown URL
- full verification PASS

Do not reactivate workflow.

STEP 16 — FINAL RESPONSE
Return:

STATUS: PASS / PARTIAL / FAIL
TASK: repair-production-schema-and-restore-safe-whatsapp-pipeline-after-emergency-freeze
FREEZE_STILL_ACTIVE:
SCHEMA_DRIFT:
MIGRATION:
SCHEMA_CACHE:
EVOLUTION_AUTH:
MESSAGE_HISTORY:
HANDOFF_VISIBILITY:
DUPLICATE_CONTROL:
PRODUCT_OUTPUT_CONTRACT:
QUICK_BUTTONS:
TESTS_RUN:
PLAYWRIGHT:
DEPLOY_RESULT:
HEALTH:
BUILD_INFO:
GO_NO_GO:
READY_FOR_CONTROLLED_WHATSAPP_REACTIVATION:
BLOCKERS:
NEXT_STEP:



















TASK:
run-full-dashboard-and-synthetic-validation-while-frozen

GOAL:
While WhatsApp automation remains frozen, run full dashboard, quick-button, message-history, handoff, duplicate-control, and synthetic message validation. Do not reactivate n8n. Do not send live WhatsApp messages.

DO NOT:
- Do not activate n8n workflow.
- Do not unpause AI.
- Do not send WhatsApp messages.
- Do not create Shopify orders.
- Do not print secrets.

REQUIRED CHECKS:
1. Message history:
   - synthetic inbound "هاي" logs readable body
   - synthetic outbound logs readable body
   - dashboard pilot-control shows readable body
   - inbox/conversations show readable body

2. Handoff:
   - "عايزة حد من خدمة العملاء يكلمني" creates visible ticket
   - manager request creates high-priority ticket
   - /dashboard/handoff shows ticket with Today filter
   - notification bell increments
   - Return to AI sets ai_paused=false

3. Duplicate:
   - duplicate provider_message_id ignored
   - different provider_message_id but same reply text within short window suppressed
   - dashboard logs suppression event

4. Quick buttons:
   - Pause Haidi persists
   - Resume Haidi persists
   - Pause orders persists
   - Resume orders persists
   - Refresh works
   - Open Handoff works
   - Open Inbox works
   - Open Product Search QA works
   - every action shows success/error

5. Product output:
   - product search response has no markdown image URL in final reply
   - products array includes imageUrl/productUrl
   - no internal IDs in customer-facing reply
   - no Shopify order

6. Dashboard:
   - npm run test:e2e:dashboard:swarm PASS
   - npm run qa:collect PASS
   - no 500s
   - mobile/tablet usable

RUN:
npm run validate:n8n
npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release
npm run verify:deploy
npm run test:e2e:dashboard:swarm
npm run qa:collect

FINAL RESPONSE:
STATUS:
TASK:
FREEZE_STILL_ACTIVE:
MESSAGE_HISTORY:
HANDOFF:
DUPLICATE_CONTROL:
QUICK_BUTTONS:
PRODUCT_OUTPUT:
DASHBOARD_PLAYWRIGHT:
TESTS_RUN:
GO_NO_GO:
READY_FOR_OWNER_ONLY_REACTIVATION_TEST:
BLOCKERS:
NEXT_STEP:





TASK:
run-full-dashboard-and-synthetic-validation-while-frozen

GOAL:
While WhatsApp automation remains frozen, run full dashboard, quick-button, message-history, handoff, duplicate-control, and synthetic message validation. Do not reactivate n8n. Do not send live WhatsApp messages.

DO NOT:
- Do not activate n8n workflow.
- Do not unpause AI.
- Do not send WhatsApp messages.
- Do not create Shopify orders.
- Do not print secrets.

REQUIRED CHECKS:
1. Message history:
   - synthetic inbound "هاي" logs readable body
   - synthetic outbound logs readable body
   - dashboard pilot-control shows readable body
   - inbox/conversations show readable body

2. Handoff:
   - "عايزة حد من خدمة العملاء يكلمني" creates visible ticket
   - manager request creates high-priority ticket
   - /dashboard/handoff shows ticket with Today filter
   - notification bell increments
   - Return to AI sets ai_paused=false

3. Duplicate:
   - duplicate provider_message_id ignored
   - different provider_message_id but same reply text within short window suppressed
   - dashboard logs suppression event

4. Quick buttons:
   - Pause Haidi persists
   - Resume Haidi persists
   - Pause orders persists
   - Resume orders persists
   - Refresh works
   - Open Handoff works
   - Open Inbox works
   - Open Product Search QA works
   - every action shows success/error

5. Product output:
   - product search response has no markdown image URL in final reply
   - products array includes imageUrl/productUrl
   - no internal IDs in customer-facing reply
   - no Shopify order

6. Dashboard:
   - npm run test:e2e:dashboard:swarm PASS
   - npm run qa:collect PASS
   - no 500s
   - mobile/tablet usable

RUN:
npm run validate:n8n
npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release
npm run verify:deploy
npm run test:e2e:dashboard:swarm
npm run qa:collect

FINAL RESPONSE:
STATUS:
TASK:
FREEZE_STILL_ACTIVE:
MESSAGE_HISTORY:
HANDOFF:
DUPLICATE_CONTROL:
QUICK_BUTTONS:
PRODUCT_OUTPUT:
DASHBOARD_PLAYWRIGHT:
TESTS_RUN:
GO_NO_GO:
READY_FOR_OWNER_ONLY_REACTIVATION_TEST:
BLOCKERS:
NEXT_STEP: