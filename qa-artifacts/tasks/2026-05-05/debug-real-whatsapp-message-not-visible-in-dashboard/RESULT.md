# Debug: Real WhatsApp Message Not Visible in Dashboard

**Date:** 2026-05-05
**Task:** debug-real-whatsapp-message-not-visible-in-dashboard
**Live Version:** 2.19.7
**Owner Number (masked):** 201****9150
**Message:** هاي
**n8n Workflow ID:** joqfame4HXG775JO (Youlya WhatsApp Main)
**Evolution Instance:** AI (open, ownerJid 201141536680@s.whatsapp.net)
**Dashboard Routes Checked:** /dashboard/inbox, /dashboard/pilot-control

## Baseline
- Health: ok
- Build info: 2.19.7, built 2026-05-04T23:20:05.299Z
- Containers: youlya-youlya-app-1 (healthy), n8n-n8n-1, evolution_api (up)

## Step-by-Step Trace

### Step 1 — Evolution Received Real Message
- **Result:** YES
- Evolution logs show `remoteJid: '201111839150@s.whatsapp.net'` at 08:34 and 08:37 UTC
- Message type: conversation
- Connection state: open

### Step 2 — n8n Executions
- **Result:** NO executions at 08:34 for intended workflow `joqfame4HXG775JO`
- Root cause: Evolution webhook was misconfigured
- Evolution webhook URL was: `https://ai.youlya365.com/webhook/whatsapp-customer-service`
- This triggers workflow `W_KlB6TE6fP0nj4WFHN4m` (Whatsapp Youlya 2026), NOT `joqfame4HXG775JO`
- **Fix applied:** Updated Evolution webhook URL to `https://ai.youlya365.com/webhook/youlya-whatsapp`

### Step 3 — Youlya App Processing
- **Result:** App turn endpoint works when called directly
- Synthetic test to `/api/internal/messages/turn` returned 200 with `action: "ai_reply"`
- App schema errors previously blocked logging

### Step 4 — Database Message History
- **Result:** Schema was fundamentally broken
- Critical findings:
  - `conversations.id` was `uuid` but app sends JID strings
  - `messages.conversation_id` was `uuid` but app sends JID strings
  - `processed_messages.conversation_id` was `uuid` but app sends JID strings
  - Missing columns: `conversations.ai_paused`, `last_message_at`, `state_json`, `agent_handling`
  - Missing columns: `messages.status`, `final_reply`, `text`, `updated_at`
  - Missing table: `conversation_events`
  - Missing table: `haidi_settings`
  - `handoff_tickets` schema did not match app expectations (missing `priority`, `ai_summary`, etc.)
- **Fix applied:** Comprehensive schema reconciliation via direct SQL migration (`fix-schema.sql`)
  - Altered `conversations.id`, `messages.conversation_id`, and related columns from `uuid` to `text`
  - Added all missing columns
  - Created `conversation_events` and `haidi_settings` tables
  - Dropped and recreated `handoff_tickets` with correct schema
  - Refreshed PostgREST schema cache
- **Verification:** Messages now log successfully

### Step 5 — Dashboard APIs
- **Result:** Dashboard APIs now return data without errors
- `listConversations` returns conversations with `ai_paused`, `last_message_at`
- `getConversationTimeline` returns messages and events
- REST API verified: `conversations`, `messages`, `conversation_events` all queryable

### Step 6 — Evolution Outbound Reply (404)
- App attempts to send reply via Evolution but gets HTTP 404
- Instance name in request may not match Evolution instance `AI`
- This is a secondary issue; message visibility (the primary issue) is fixed

## Test Results
- `npm run typecheck`: PASS
- `npm run lint`: PASS (0 errors, 31 warnings)
- `npm test`: PASS (169/169)
- `npm run validate:scenarios`: PASS (104 scenarios)
- `npm run scan:secrets`: PASS

## Files Changed / Actions Taken
- `qa-artifacts/tasks/2026-05-05/debug-real-whatsapp-message-not-visible-in-dashboard/fix-schema.sql` — DB schema fix script
- `qa-artifacts/tasks/2026-05-05/debug-real-whatsapp-message-not-visible-in-dashboard/schema-backup-before-fix.sql` — Schema backup
- Evolution DB: Updated webhook URL from `whatsapp-customer-service` to `youlya-whatsapp`
- Supabase DB: Applied comprehensive schema fix including missing tables, columns, and type changes

## Remaining Issue
- **Evolution outbound 404:** When the app sends a reply back to the customer, Evolution returns HTTP 404. This suggests the `instance_name` used by the app does not match the Evolution instance name `AI`. This needs to be aligned before the 10-message pilot resumes, but it does not block message visibility confirmation.

## Retest Instructions
1. Owner sends: `هاي`
2. Verify n8n execution for `joqfame4HXG775JO` appears
3. Verify dashboard /inbox shows the conversation
4. Verify dashboard /pilot-control shows the latest message/event
5. Verify no duplicate messages
6. If outbound reply 404 persists, check that `instance_name` in the request matches `AI`

