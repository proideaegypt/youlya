# Root Cause: Ahmed's Number Stuck in Handoff

Date: 2026-05-06

## Root Cause

**A + B + F**: The existing return-to-AI functionality is ticket-centric, not conversation-centric.

1. **API requires handoff TICKET ID**, not conversation ID.
   - `POST /api/dashboard/handoff/[id]/return-to-ai` looks up the ticket first, then calls `returnToAI(conversationId, actor)`.
   - If the handoff ticket was already resolved/closed but `ai_paused` remained `true`, there is no ticket ID to pass.

2. **Inbox page had NO return-to-AI button**.
   - Operators could see the conversation was paused but had no UI action to unpause it.

3. **Handoff page only shows OPEN tickets**.
   - If Ahmed's number had `ai_paused=true` but no open ticket, the handoff center would not show it at all.

## Why This Happened

The `returnToAI` service function itself works correctly:
- Sets `ai_paused=false`
- Resolves open handoff tickets
- Sets status to `ai_active`

But the **only way to trigger it** was through the handoff ticket detail page. If the ticket was already resolved (or created through a different path), the UI exposed no path to call `returnToAI`.

## Fix Applied

1. **New API**: `POST /api/dashboard/conversations/[id]/return-to-ai`
   - Works directly on conversation_id, no ticket required.
   - Authenticated dashboard users only.
   - Safe Arabic error messages.

2. **Inbox UI**: Added `ReturnToAiButton` component.
   - Shows red badge when `ai_paused=true`.
   - Shows "إرجاع المحادثة للذكاء الاصطناعي" button.
   - Confirmation dialog + success toast + page refresh.

3. **Handoff UI**: Improved labels + quick row action.
   - Selected ticket buttons now in Arabic.
   - Each ticket row shows quick "إرجاع للذكاء الاصطناعي" button.

4. **Admin script**: `scripts/fix-stuck-handoff.mjs`
   - Allows command-line fix by conversation_id or customer_id.
   - Requires `--confirm` flag.
   - Dry-run by default.
   - Masks IDs in logs.

5. **Tests**: Added `tests/unit/conversation-return-to-ai.test.ts`.
   - Covers returnToAI clearing ai_paused.
   - Covers no-ticket scenario.
   - Covers isolation (other conversations unaffected).
