You are Claude Code working inside the Youlya project.

TASK:
fix-number-stuck-in-handoff-and-add-clear-return-to-ai-control

PROBLEM:
Ahmed's own WhatsApp number is stuck in handoff / human mode.
There is no clear visible dashboard option to turn handoff off for that number.
This blocks testing because AI will not reply while conversation_state.ai_paused=true or an open handoff ticket exists.

EXPECTED:
Dashboard must let an authorized admin/support user:
1. Search/find a conversation by phone/customer id.
2. See clearly if it is in handoff / AI paused.
3. Click a clear button:
   - Arabic: "إرجاع المحادثة للذكاء الاصطناعي"
   - English fallback: "Return to AI"
4. Confirm action.
5. System must:
   - close/resolve open handoff tickets for that conversation
   - set conversation_state.ai_paused=false
   - set conversation status back to ai_active if appropriate
   - add audit/event note
   - refresh UI
6. Ahmed should then be able to send "hi" and get AI response again.

CURRENT CODE CONTEXT:
- Handoff service already has returnToAI.
- Existing API likely exists:
  POST /api/dashboard/handoff/[id]/return-to-ai
- Existing handoff page has a return-to-AI button only after selecting a handoff ticket.
- This is not enough if the operator is in Inbox, Conversations, or only knows the phone number.
- Need a clear per-conversation / per-number off-handoff control.

RULES:
- Do not print secrets.
- Do not cat .env, .env.production, .env.local, or secret files.
- Do not reset, revert, clean, stash, or checkout.
- Preserve dirty worktree.
- Do not deploy unless checks pass.
- Do not use curl -k.
- Keep changes minimal and safe.
- Do not rewrite business logic.
- Do not remove handoff feature.
- Do not hide failures.
- Do not fake PASS.

============================================================
PHASE 0 — SAVE STATE
============================================================

Run:

pwd
date -Is
git status --short
mkdir -p qa-artifacts/go-live-review/handoff-stuck-number
git status --short > qa-artifacts/go-live-review/handoff-stuck-number/pre-change-git-status.txt
cat package.json

============================================================
PHASE 1 — DISCOVER HANDOFF IMPLEMENTATION
============================================================

Run:

grep -R "returnToAI" -n app lib src tests supabase || true
grep -R "ai_paused" -n app lib src tests supabase || true
grep -R "setAIPaused" -n app lib src tests supabase || true
grep -R "handoff" -n app/dashboard app/api/dashboard lib/services tests supabase | sed -n '1,260p' || true
grep -R "conversation_state" -n app lib src tests supabase || true

Inspect:

sed -n '1,320p' lib/services/handoff-service.ts
sed -n '1,260p' lib/services/conversation-flow-service.ts
sed -n '1,260p' app/api/dashboard/handoff/[id]/return-to-ai/route.ts
sed -n '1,320p' app/dashboard/handoff/page.tsx
sed -n '1,360p' app/dashboard/inbox/page.tsx
sed -n '1,360p' app/api/dashboard/conversations/[id]/route.ts || true
sed -n '1,360p' app/api/dashboard/conversations/[id]/actions/route.ts || true

============================================================
PHASE 2 — ROOT CAUSE WHY AHMED CANNOT TURN HANDOFF OFF
============================================================

Determine which case is true:

A. Return-to-AI button exists only inside /dashboard/handoff after selecting a ticket, but not in Inbox/Conversations.
B. Ahmed's number has conversation_state.ai_paused=true but no open handoff ticket, so handoff center does not show it.
C. There is an open handoff ticket, but filters/status hide it.
D. API return-to-ai fails due to auth/RBAC.
E. UI does not show success/error feedback.
F. Conversation id used by dashboard differs from phone/customer id.
G. Production DB has stale handoff state not cleared by existing returnToAI.

Save analysis to:

qa-artifacts/go-live-review/handoff-stuck-number/ROOT_CAUSE.md

============================================================
PHASE 3 — ADD CONVERSATION-LEVEL RETURN TO AI API
============================================================

Add or update a safe dashboard API endpoint:

Recommended:

POST /api/dashboard/conversations/[id]/return-to-ai

Behavior:
- require authenticated dashboard user
- require allowed role/permission
- accept conversation id from route
- optional body:
  {
    "actor": "dashboard",
    "reason": "manual_return_to_ai"
  }
- call service that:
  - resolves any open/assigned handoff tickets for that conversation
  - sets conversation_state.ai_paused=false
  - sets conversation status to ai_active if appropriate
  - writes safe audit/conversation event
- return:
  {
    "ok": true,
    "conversationId": "...",
    "aiPaused": false,
    "status": "ai_active"
  }

Security:
- Do not allow unauthenticated users.
- Do not expose full phone if masking is standard.
- Do not expose secrets.
- Use safe errors only.

Arabic errors:
- "ليس لديك صلاحية لتنفيذ هذا الإجراء."
- "المحادثة غير موجودة."
- "تعذر إرجاع المحادثة للذكاء الاصطناعي. حاول مرة أخرى."

============================================================
PHASE 4 — ADD PHONE / CUSTOMER LOOKUP IF MISSING
============================================================

Ahmed knows his phone number, not necessarily conversation id.

Add safe search/find support if missing:

Option A:
Enhance /api/dashboard/conversations to support query:
GET /api/dashboard/conversations?q=<masked-or-phone-fragment>

Option B:
Add dashboard UI search box on Inbox/Conversations:
- placeholder: "ابحث برقم العميل أو المحادثة..."
- Search should find Ahmed's number/conversation.
- Keep masking in display if current policy requires.

Do not expose full customer phone to unauthorized roles.

============================================================
PHASE 5 — ADD CLEAR UI BUTTONS
============================================================

Add visible "Return to AI" controls in all practical places:

1. /dashboard/inbox selected conversation panel
If selected conversation status is handoff or aiPaused:
- show badge:
  "الذكاء الاصطناعي متوقف لهذه المحادثة"
- show button:
  "إرجاع المحادثة للذكاء الاصطناعي"

2. /dashboard/conversations if page exists
- show same action on selected conversation.

3. /dashboard/handoff
Improve existing button label:
- current: "إرجاع للـ AI"
- better: "إرجاع المحادثة للذكاء الاصطناعي"

4. If ticket list row is visible
- add quick action button on row:
  "إرجاع للذكاء الاصطناعي"
- prevent accidental click by confirm dialog.

UX requirements:
- confirmation dialog:
  "هل تريد إلغاء التحويل البشري وإرجاع هذه المحادثة للذكاء الاصطناعي؟"
- success toast:
  "تم إرجاع المحادثة للذكاء الاصطناعي."
- error toast:
  "تعذر إرجاع المحادثة. حاول مرة أخرى."
- loading state
- disabled while saving
- refresh conversation/ticket list after success

============================================================
PHASE 6 — ADD FORCE UNPAUSE SAFETY TOOL FOR ADMIN
============================================================

Create a safe diagnostic/admin script if useful:

scripts/fix-stuck-handoff.mjs

Purpose:
Allow Ahmed to unpause one specific conversation/customer only when given a conversation id or phone/customer id.

Behavior:
- requires explicit argument:
  --conversation-id <id>
  or --customer-id <id>
- refuses to run with no argument
- never prints secrets
- masks customer id in logs
- shows current status:
  ai_paused, open handoff count, status
- asks for --confirm to mutate
- with --confirm:
  - calls returnToAI / service method
  - verifies ai_paused=false
  - prints PASS/FAIL

Add package script if safe:
"admin:fix-stuck-handoff": "node scripts/fix-stuck-handoff.mjs"

Do not run destructive broad update.
Do not unpause all conversations.

============================================================
PHASE 7 — TESTS
============================================================

Add/update tests for:

Service:
- returnToAI clears ai_paused
- returnToAI resolves open handoff
- returnToAI works if ai_paused=true but ticket missing, if supported
- no unrelated conversation is changed

API:
- unauthenticated return-to-ai rejected
- authorized role can return conversation to AI
- invalid conversation id returns safe error
- response contains aiPaused=false

UI:
- Inbox selected handoff conversation shows "إرجاع المحادثة للذكاء الاصطناعي"
- clicking button calls API
- success refreshes status
- error shows clear message

Existing tests already prove return-to-AI resumes and resolves handoff. Keep them passing.

Run:

npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run scan:secrets
npm run build
npm run verify:release

If Playwright credentials exist:
npm run test:e2e:dashboard:swarm || true

============================================================
PHASE 8 — MANUAL QA FOR AHMED'S NUMBER
============================================================

Create:

qa-artifacts/go-live-review/handoff-stuck-number/MANUAL_QA.md

Include exact steps:

1. Login to dashboard.
2. Open /dashboard/inbox.
3. Search Ahmed's phone/customer id.
4. Select the conversation.
5. Confirm badge shows handoff / AI paused.
6. Click "إرجاع المحادثة للذكاء الاصطناعي".
7. Confirm action.
8. Verify status changes to AI active.
9. Send "hi" from Ahmed's WhatsApp number.
10. Confirm inbound message appears in dashboard.
11. Confirm AI replies.
12. Confirm no open handoff ticket remains for that number.

Also include fallback:
- open /dashboard/handoff
- search/select ticket
- click "إرجاع المحادثة للذكاء الاصطناعي"

============================================================
PHASE 9 — REPORT UPDATE
============================================================

Update:

claudeahmed.md

Add section:

## Stuck Handoff / Return to AI Fix

Include:
- root cause
- files changed
- UI buttons added
- API endpoint added
- service behavior
- tests run
- manual QA steps
- remaining risks

Create:

qa-artifacts/go-live-review/handoff-stuck-number/RESULT.md

If code changed, run release task:

npm run release:task -- --task "fix-number-stuck-in-handoff-and-add-clear-return-to-ai-control" --type patch

Then:

npm run verify:release

============================================================
PHASE 10 — DO NOT DEPLOY UNLESS SAFE
============================================================

Deploy only if:
- build passes
- scan:secrets passes
- verify:release passes
- verify:deploy passes
- handoff return-to-ai tests pass

After deploy, Ahmed must manually test his number.

============================================================
PHASE 11 — FINAL RESPONSE
============================================================

Return:

STATUS:
PASS / PARTIAL / FAIL

TASK:
fix-number-stuck-in-handoff-and-add-clear-return-to-ai-control

ROOT CAUSE:

HANDOFF OFF / RETURN TO AI:
PASS / FAIL

INBOX BUTTON:
PASS / FAIL

HANDOFF PAGE BUTTON:
PASS / FAIL

CONVERSATION API:
PASS / FAIL

ADMIN FIX SCRIPT:
PASS / PARTIAL / NOT ADDED

FILES CHANGED:

COMMAND RESULTS:
- typecheck:
- lint:
- tests:
- validate:scenarios:
- scan:secrets:
- build:
- verify:release:
- verify:deploy:

MANUAL QA FOR AHMED'S NUMBER:

REMAINING BLOCKERS:

NEXT STEPS:

FINAL RECOMMENDATION:
One direct paragraph.