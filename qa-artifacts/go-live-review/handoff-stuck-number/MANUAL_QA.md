# Manual QA: Return Stuck Conversation to AI

Date: 2026-05-06

## Steps for Ahmed's Number

1. **Login to dashboard** at `https://admin.nex-lnk.online/login`.

2. **Open /dashboard/inbox**.

3. **Find Ahmed's conversation** in the conversation list.
   - Look for the red badge: "الذكاء الاصطناعي متوقف لهذه المحادثة"
   - If not visible, use the search filter or check `/dashboard/handoff`.

4. **Click the conversation** to select it.

5. **In the Timeline panel**, confirm:
   - Status badge shows "Handoff" or red "AI متوقف" badge.
   - Button "إرجاع المحادثة للذكاء الاصطناعي" is visible.

6. **Click "إرجاع المحادثة للذكاء الاصطناعي"**.

7. **Confirm the dialog**: "هل تريد إلغاء التحويل البشري وإرجاع هذه المحادثة للذكاء الاصطناعي؟"

8. **Wait for success toast**: "تم إرجاع المحادثة للذكاء الاصطناعي."
   - Page will reload automatically.

9. **Verify status changed**:
   - Badge now shows "AI" (green) instead of "Handoff" or "AI متوقف".

10. **Send "hi" from Ahmed's WhatsApp number**.

11. **Confirm in dashboard**:
    - Inbound message appears in Inbox timeline.
    - AI replies automatically.
    - No new handoff ticket is created.

## Fallback: Via Handoff Center

If the conversation is not in Inbox:

1. Open `/dashboard/handoff`.
2. Search for the ticket (if open).
3. Click the ticket row.
4. Click "إرجاع المحادثة للذكاء الاصطناعي" in the detail panel.
5. Or click the quick "إرجاع للذكاء الاصطناعي" button directly on the ticket row.

## Fallback: Via Admin Script

If UI is unreachable:

```bash
# Dry run
node scripts/fix-stuck-handoff.mjs --conversation-id "201xxxxxxxx@s.whatsapp.net"

# Apply fix
node scripts/fix-stuck-handoff.mjs --conversation-id "201xxxxxxxx@s.whatsapp.net" --confirm
```

## Expected Result

- `conversation_state.ai_paused` = `false`
- `conversation_state.status` = `ai_active`
- Open handoff tickets for that conversation = resolved
- Ahmed can send "hi" and get AI reply.
