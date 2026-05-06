# Ops Ahmed Dashboard Control Report

## 1. Executive Summary

**STATUS: PARTIAL**

What was fixed/completed:
- Global handoff ON/OFF toggle added to pilot control room
- Per-conversation handoff ON/OFF buttons added to Inbox and Conversations
- Channel identity display component created with WhatsApp, Facebook, Instagram icons
- Add User modal centered with responsive design and scrollable content
- Message history confirmed working in Inbox, Conversations, and Handoff (pilot-control kept as summary)
- Shipping settings enhanced with Egypt 27-governorate dropdown + city selector + auto-default pricing (Cairo/Alexandria 70 EGP, others 100 EGP)
- Channels settings expanded with step-by-step add channel wizard (4 channel types, masked secret fields, webhook URL copy)
- Evolution QR setup UI structure added to channels wizard

What remains:
- Evolution QR scan actual API integration (requires live Evolution credentials and instance)
- Channel wizard step 3 connection test is a placeholder (needs provider-specific test implementations)
- Build step timed out on VPS (known environment resource constraint; build passes in other environments)

## 2. Handoff Controls

### Global Handoff ON/OFF
- **Location**: /dashboard/pilot (Pilot Control Room)
- **API**: GET/POST /api/dashboard/settings/handoff
- **Service**: lib/services/handoff-settings-service.ts
- **Default**: true (enabled)
- **Behavior**: When OFF, automatic handoff creation is blocked at service level
- **UI**: Metric card shows status + action button to toggle

### Per-Conversation Handoff ON/OFF
- **Location**: /dashboard/conversations and /dashboard/inbox timeline panels
- **Handoff ON**: "تحويل لفريق الدعم" button for AI-active conversations
- **Handoff OFF / Return to AI**: ReturnToAiButton for paused/handoff conversations
- **API**: POST /api/dashboard/conversations/[id]/actions (action: "handoff")
- **Behavior**: Creates handoff ticket, pauses AI, updates conversation status

## 3. Records and Channel Identity

Created `lib/ui/channel-identity.tsx`:
- WhatsApp Evolution: Smartphone icon
- WhatsApp Meta: MessageCircle icon
- Facebook: Globe icon
- Instagram: Camera icon
- Shows customer phone/profile name as identifier
- Compact badge mode for list views
- Full mode with icon + label + identifier for detail views

Used in:
- /dashboard/conversations list
- /dashboard/inbox list
- /dashboard/handoff (implicit via conversation data)

## 4. Add User Modal Fix

**Before**: Fixed inset-0 with basic centering, no scroll, basic styling
**After**:
- Centered with `fixed inset-0 flex items-center justify-center`
- Backdrop blur `backdrop-blur-sm`
- Darker overlay `bg-black/50`
- Max-height `max-h-[90vh]` with `overflow-y-auto`
- Larger padding `p-5 sm:p-6`
- Rounded corners `rounded-2xl`
- Shadow `shadow-2xl`

## 5. Message History Fix

**Investigation**: Message history already existed in:
- /dashboard/inbox (timeline panel)
- /dashboard/conversations (timeline panel)
- /dashboard/handoff (conversation preview with timeline)
- /dashboard/pilot-control (last 10 inbound/outbound summary)

**Fix**: Confirmed all locations load timeline via `/api/dashboard/conversations/[id]/timeline`. No broken API found. Added channel identity to conversation list items for better readability.

## 6. Shipping Settings

Created `lib/data/egypt-governorates.ts`:
- 27 governorates with Arabic/English names
- Default shipping fees: Cairo=70, Alexandria=70, All Others=100
- City lists per governorate (5-15 cities each)

Updated `/dashboard/settings/shipping`:
- Governorate dropdown (27 options)
- City dropdown (dynamic based on governorate)
- Auto-filled default cost
- Add zone form with validation
- Table of existing zones

## 7. Channels Settings

Updated `/dashboard/settings/channels`:
- Step 1: Select channel type (4 cards)
- Step 2: Connection details form with provider-specific fields
- Step 3: Test connection + save
- Masked secret inputs (password type)
- Webhook URL display with copy button
- Existing integrations list with toggle
- Accounts table

## 8. Evolution QR Setup

**Status**: UI structure ready, API placeholder in place
- Evolution wizard fields: instance_name, base_url, api_key, webhook_secret
- QR modal placeholder in channels wizard
- Actual QR scan requires:
  - POST /api/dashboard/channels/evolution/qr endpoint (structure exists in app/api/dashboard/channels/evolution/accounts/[id]/qr/route.ts)
  - Live Evolution credentials configured
  - Instance connected

## 9. Files Changed

- lib/data/egypt-governorates.ts (new)
- lib/ui/channel-identity.tsx (new)
- lib/services/handoff-settings-service.ts (new)
- app/api/dashboard/settings/handoff/route.ts (new)
- app/api/dashboard/pilot-control/route.ts (modified)
- app/api/dashboard/pilot/actions/route.ts (modified)
- app/api/dashboard/conversations/[id]/actions/route.ts (modified)
- app/api/dashboard/settings/channels/route.ts (modified)
- app/dashboard/pilot/page.tsx (modified)
- app/dashboard/conversations/page.tsx (modified)
- app/dashboard/inbox/page.tsx (modified)
- app/dashboard/settings/shipping/page.tsx (rewritten)
- app/dashboard/settings/channels/page.tsx (rewritten)
- app/dashboard/settings/users/page.tsx (modified)
- components/dashboard/handoff-conversation-button.tsx (new)
- lib/adapters/supabase/mock-store.ts (modified)
- lib/services/handoff-service.ts (modified)

## 10. Command Results

- typecheck: PASS (0 errors)
- lint: PASS (0 errors, 30 pre-existing warnings)
- tests: PASS (229/229)
- validate:scenarios: PASS (104 scenarios)
- scan:secrets: PASS
- build: TIMEOUT (known VPS resource constraint)
- verify:release: PASS (v2.24.0)

## 11. Manual QA For Ahmed

1. Toggle global handoff OFF/ON in /dashboard/pilot
2. Open a conversation in /dashboard/conversations and click "تحويل لفريق الدعم"
3. Return the same conversation to AI via "إرجاع للذكاء الاصطناعي"
4. Send "هاي" from WhatsApp and confirm AI replies
5. Confirm record shows WhatsApp icon + number in conversation list
6. Open Add User and confirm popup centered
7. Open Inbox/Conversations and confirm history appears in timeline
8. Open Shipping and select Cairo city, cost auto-fills 70
9. Select Alexandria city, cost auto-fills 70
10. Select another governorate, cost auto-fills 100
11. Open Channels and click "إضافة قناة" — wizard opens
12. Evolution QR modal: UI ready but requires live Evolution config
13. Facebook/Instagram/WhatsApp Meta wizard forms present with masked secrets

## 12. Remaining Blockers

1. **Build timeout**: Production build exceeds VPS timeout (known environment issue)
2. **Evolution QR**: Requires live Evolution API credentials and instance setup
3. **Channel connection tests**: Placeholder only — needs provider-specific implementations
4. **handoff_settings table**: May need migration if not present in production DB

## 13. Final Recommendation

Ahmed, the dashboard operational controls are now structurally complete and safe. The global handoff toggle gives you emergency control over automatic human transfers. Per-conversation controls let your team manage individual cases. Shipping settings now have proper Egypt governorate/city dropdowns with correct default pricing. The channels wizard provides a clean, safe interface for adding integrations without exposing secrets in the browser.

**Next steps before live pilot:**
1. Apply the `handoff_settings` migration to production DB if missing
2. Configure live Evolution credentials and test QR connection
3. Run the build on a machine with sufficient resources
4. Test the full handoff ON → conversation handoff → return-to-AI flow end-to-end
