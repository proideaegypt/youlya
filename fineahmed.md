# Fine Ahmed Dashboard UI/UX Review
**Date:** 2026-05-06  
**Task:** dashboard-ui-ux-finetune-review-and-safe-polish  
**Reviewer:** Claude Code

---

## 1. Executive Summary

**STATUS: PARTIAL**

The dashboard is functionally complete and operational. Many Arabic labels, UI structures, and admin workflows are solid. This review applied safe polish changes and documents a clear roadmap for the remaining improvements needed before full launch confidence.

### What Was Applied (This Task)
- Fixed Arabic role labels in Add User modal (Super Admin → مدير رئيسي, Moderator → مشرف)
- Fixed Arabic role display in users table
- Fixed "Resolve" button → "إغلاق التذكرة" in Handoff Center
- Fixed "Problem Summary" → "ملخص المشكلة" in Handoff Center
- Fixed "Conversation Preview" → "معاينة المحادثة" in Handoff Center
- Fixed "Assignee" placeholder → "بحث بالمعين" in Handoff Center
- Fixed "returned_to_ai" status label → "عاد للذكاء الاصطناعي"
- Fixed "Type:" and "Summary:" ticket row labels → Arabic
- Fixed inbox page title "طلبات التحويل للبشر" → "صندوق الوارد"
- Fixed "Timeline" header → "الجدول الزمني" in inbox
- Fixed "pending handoffs" → "تحويل بشري معلق" in inbox
- Fixed "Resolved" status badge → "مغلق" in conversations and inbox
- Fixed "AI Enabled" → "الذكاء الاصطناعي مفعل" in command center
- Fixed "Safety Guard" → "حماية السلامة" in command center
- Fixed "Active" → "نشط" in command center integrations
- Fixed "Conversion" section → "معدل التحويل" in command center
- Fixed kill switch label → "غير مفعل / مفعل"
- Fixed "Orders / Conversations" → "الطلبات / المحادثات"
- Integrated `ChannelBadge` component in conversations list view (shows channel icon + Arabic name)
- Integrated `ChannelBadge` component in inbox list view
- Fixed pre-existing TypeScript error: `globalHandoffEnabled` → `global_handoff_enabled` in handoff settings API
- Fixed pre-existing TypeScript error: `Facebook` / `Instagram` missing from lucide-react → replaced with `Share2` / `Camera`

### Top 10 Remaining Improvements
1. **Channels Settings page** — needs step-by-step add wizard (Facebook, Instagram, WhatsApp Meta, WhatsApp Evolution)
2. **Evolution QR scan page** — no UI for QR scan, instance status, or reconnect in dashboard
3. **Global handoff toggle visibility** — buried in pilot-control, should be visible from handoff page header
4. **Shipping settings governorate/city dropdown** — data exists in `lib/data/egypt-governorates.ts` but not wired into the UI form yet
5. **Channels settings — test connection UI** — no test connection button per channel
6. **Mobile layout sidebar** — sidebar behavior on mobile needs overlay/drawer pattern
7. **Tables on mobile** — orders, users, products tables need responsive card view on small screens
8. **Add User modal — max-height on small screens** — needs `max-h-[90vh] overflow-y-auto` on small viewports
9. **Direction badge localization** — "IN" / "OUT" / "SYS" labels in timeline still English
10. **Channels settings — Evolution masked credentials display** — API key and webhook secret not visible/masked in UI

---

## 2. Dashboard Page Inventory

| Page | Purpose | Current Issue | Suggested Improvement | Priority | Applied? |
|---|---|---|---|---|---|
| `/dashboard` | Redirect → command center | None | — | — | — |
| `/dashboard/command-center` | KPI, quick actions, AI status | English labels: "AI Enabled", "Safety Guard", "Active", "Conversion" | Arabic labels, live kill switch toggle | HIGH | ✓ Applied |
| `/dashboard/inbox` | Conversation list + timeline | Title was "طلبات التحويل للبشر" (wrong), "pending handoffs" English, "Timeline" English, no channel badge, "Resolved" English | Fixed title, fixed labels, added ChannelBadge | HIGH | ✓ Applied |
| `/dashboard/conversations` | All conversations + timeline filter | "Resolved" English, no channel badge | Added ChannelBadge, fixed Resolved badge | HIGH | ✓ Applied |
| `/dashboard/handoff` | Handoff ticket management | "Problem Summary", "Conversation Preview", "Resolve", "Type:", "Summary:" English; assignee placeholder English; no global handoff toggle here | Fixed labels; suggest adding global handoff toggle to header | HIGH | ✓ Applied (labels only) |
| `/dashboard/pilot-control` | System health + AI actions | Global handoff toggle here (correct) but not linked from handoff page; messages visible only here | Good page — add link from handoff header | MEDIUM | — |
| `/dashboard/settings/users` | User management | Role options in English (Super Admin, Moderator, Customer Service); role display in table English | Fixed to Arabic labels | HIGH | ✓ Applied |
| `/dashboard/settings/shipping` | Shipping zones + test calculator | Governorate dropdown missing — UI shows raw zones from DB, not editable per-governorate | Add governorate/city dropdown using `lib/data/egypt-governorates.ts` | HIGH | Not applied |
| `/dashboard/settings/channels` | Channel integrations toggle | Very minimal — only toggle + accounts table; no add wizard, no QR, no test connection, no masked secrets view | Full channel wizard needed | HIGH | Not applied |
| `/dashboard/settings/ai-agent` | AI settings | Need to review | Medium review | MEDIUM | Not applied |
| `/dashboard/products` | Product catalog | Need to verify | — | MEDIUM | Not applied |
| `/dashboard/orders` | Order management | Need to verify | — | MEDIUM | Not applied |
| `/dashboard/logs` | System logs | Need to verify | — | LOW | Not applied |
| `/dashboard/haidi/lab` | AI prompt testing | Need to verify | — | LOW | Not applied |
| `/dashboard/haidi/settings` | Haidi configuration | Need to verify | — | LOW | Not applied |
| `/dashboard/statistics` | Analytics | Need to verify | — | LOW | Not applied |

---

## 3. Arabic Labels and Microcopy

| Area/File | Current Text | Suggested Text | Reason | Priority | Applied? |
|---|---|---|---|---|---|
| users/page.tsx — role select | "Super Admin", "Moderator", "Customer Service" | "مدير رئيسي", "مشرف", "خدمة العملاء" | Consistency with Arabic UI | HIGH | ✓ |
| users/page.tsx — table role cell | raw role string | mapped Arabic | Same | HIGH | ✓ |
| handoff/page.tsx — resolve button | "Resolve" | "إغلاق التذكرة" | Arabic UI | HIGH | ✓ |
| handoff/page.tsx — problem summary | "Problem Summary" | "ملخص المشكلة" | Arabic UI | HIGH | ✓ |
| handoff/page.tsx — conversation preview | "Conversation Preview" | "معاينة المحادثة" | Arabic UI | HIGH | ✓ |
| handoff/page.tsx — assignee placeholder | "Assignee" | "بحث بالمعين" | Arabic UI | MEDIUM | ✓ |
| handoff/page.tsx — ticket row | "Type: ... · Summary: ..." | "النوع: ... · الملخص: ..." | Arabic UI | MEDIUM | ✓ |
| handoff/page.tsx — returned_to_ai badge | "رجع للـ AI" | "عاد للذكاء الاصطناعي" | Cleaner Arabic | MEDIUM | ✓ |
| inbox/page.tsx — page title | "طلبات التحويل للبشر" | "صندوق الوارد" | Page is general inbox, not just handoff | HIGH | ✓ |
| inbox/page.tsx — Timeline header | "Timeline" | "الجدول الزمني" | Arabic UI | HIGH | ✓ |
| inbox/page.tsx — handoff count badge | "pending handoffs" | "تحويل بشري معلق" | Arabic UI | HIGH | ✓ |
| inbox/page.tsx, conversations/page.tsx — Resolved badge | "Resolved" | "مغلق" | Arabic UI | MEDIUM | ✓ |
| command-center — AI status | "AI Enabled", "Safety Guard", "Active" | "الذكاء الاصطناعي مفعل", "حماية السلامة", "نشط" | Arabic UI | HIGH | ✓ |
| command-center — Conversion | "Conversion", "Orders / Conversations" | "معدل التحويل", "الطلبات / المحادثات" | Arabic UI | MEDIUM | ✓ |
| command-center — kill switch | "OFF" / "ON" | "غير مفعل" / "مفعل" | Arabic UI | MEDIUM | ✓ |
| handoff/page.tsx — direction badge IN/OUT | "IN", "OUT", "SYS" | "وارد", "صادر", "نظام" | Arabic UI | LOW | Not applied |
| conversations/page.tsx — direction badge | "IN", "OUT", "SYS" | "وارد", "صادر", "نظام" | Arabic UI | LOW | Not applied |
| channels/page.tsx — accounts table | all English headers | Arabic headers | Arabic UI | MEDIUM | Not applied |
| pilot-control — Pilot control room badge | "Pilot control room" | "غرفة التحكم التجريبي" | Arabic UI | LOW | Not applied |
| pilot-control — Build Identity | "Build Identity", "Version", "Version Name" | "هوية البناء", "الإصدار", "اسم الإصدار" | Arabic UI | LOW | Not applied |

---

## 4. Handoff UX Review

### Current Status
**PARTIAL** — The handoff system is functionally implemented. The key flows work:
- Per-conversation return-to-AI button: ✓ exists in conversations, inbox, and handoff pages
- Handoff ticket management (assign, note, resolve, return-to-AI): ✓ in handoff/page.tsx
- AI paused badge: ✓ visible in conversation list and ticket details
- Search in handoff tickets: ✓ by conversation content
- Timeline visible in handoff selected ticket: ✓

### Missing: Global Handoff Toggle Visibility
- The global handoff ON/OFF toggle **exists** in `/dashboard/pilot-control` (ActionButton: "تفعيل/إيقاف التحويل البشري")
- But it is **not linked** from the handoff page header — operators may not know to go to pilot-control to toggle it
- **Recommendation:** Add a small global handoff status indicator + link in the handoff page header section

### Missing: Per-Conversation ON/OFF from Inbox
- Inbox shows ReturnToAiButton when `ai_paused || status === "handoff"` ✓
- But there is no "Pause AI for this conversation" button when AI is active — operators cannot proactively pause AI for one conversation without creating a handoff ticket

### Recommended Implementation (Future)
```
Handoff page header → Add:
  <GlobalHandoffStatusWidget />
  Shows: "التحويل البشري: مفعل ✓ | تغيير الإعداد → غرفة الطيار"

Per-conversation controls:
  When AI active: "إيقاف الذكاء الاصطناعي" button → calls PATCH /api/dashboard/conversations/[id]/actions {action: "pause_ai"}
  When paused: "إرجاع للذكاء الاصطناعي" button (already exists via ReturnToAiButton)
```

### Recommended Labels
- Global handoff ON: "التحويل البشري: مفعل"
- Global handoff OFF: "التحويل البشري: متوقف"
- Per-conversation AI paused: "الذكاء الاصطناعي متوقف لهذه المحادثة"
- Return to AI button: "إرجاع المحادثة للذكاء الاصطناعي"
- Transfer to support: "تحويل لفريق الدعم"
- Take over conversation: "تولى المحادثة"

---

## 5. Channel Identity Display

### Current Status
**PASS** — `lib/ui/channel-identity.tsx` component exists and is comprehensive:
- WhatsApp Evolution: Smartphone icon + "واتساب Evolution"
- WhatsApp Meta: MessageCircle icon + "واتساب Meta"
- Facebook: Share2 icon + "فيسبوك"
- Instagram: Camera icon + "إنستغرام"

Component is now integrated in:
- `/dashboard/conversations` list view ✓ (ChannelBadge applied)
- `/dashboard/inbox` list view ✓ (ChannelBadge applied)

### Not Yet Integrated
- `/dashboard/handoff` ticket list — shows raw `conversationIdDisplay`, no channel badge
- `/dashboard/products-intelligence/channels` — unknown state

### Suggested Format (for future handoff ticket integration)
```tsx
// In handoff ticket row (recommended future change):
import { ChannelBadge } from "@/lib/ui/channel-identity";
// Add after conversationIdDisplay:
{t.channel && <ChannelBadge channel={t.channel} />}
```

### Icon Note
Facebook and Instagram icons (`Facebook`, `Instagram`) do not exist in the current `lucide-react@1.14.0`. This was a pre-existing bug. Fixed by using `Share2` (Facebook) and `Camera` (Instagram) as stand-ins. For best branding, use actual SVG brand icons or upgrade to a version with social icons.

---

## 6. Add User Modal Review

### Current Status
**PASS (partially)** — Modal is functionally solid.

**What's Good:**
- `fixed inset-0 z-50 flex items-center justify-center` — centered vertically and horizontally ✓
- `role="dialog" aria-modal="true"` — accessibility ✓
- `disabled={saving}` on submit button — prevents double submit ✓
- Arabic labels for all fields ✓
- Error/success messages ✓
- `p-4` padding with `bg-black/40` backdrop ✓

**Applied Changes:**
- Role options now Arabic (مدير رئيسي, مشرف, خدمة العملاء) ✓
- Role display in table now Arabic ✓

**Remaining Improvements:**
- No max-height on the modal — on small screens with virtual keyboard open, modal may overflow
- No email format validation feedback (client-side)
- "نشط" checkbox lacks explicit label element wrapping (accessibility)

**Recommended Fix (safe, future):**
```tsx
// Add to modal div:
className="w-full max-w-md rounded-xl bg-card p-4 shadow-lg sm:p-5 max-h-[90vh] overflow-y-auto"

// Add to email input for validation hint:
<p className="mt-1 text-xs text-muted-foreground">أدخل بريد إلكتروني صحيح</p>
```

---

## 7. Message History Review

### Current Status
**PASS** — Message history / timeline is visible in operational pages.

Contrary to the initial problem report, timeline is **already implemented** in:
- `/dashboard/inbox` — conversation selected → right panel shows full timeline ✓
- `/dashboard/conversations` — conversation selected → right panel shows "الجدول الزمني" ✓
- `/dashboard/handoff` — ticket selected → "معاينة المحادثة" panel with timeline ✓
- `/dashboard/pilot-control` — also shows recent inbound/outbound messages (monitoring view)

### API
`GET /api/dashboard/conversations/[id]/timeline` — returns chronological timeline items (messages + events)

### Remaining UX Issues
- Direction labels "IN" / "OUT" / "SYS" still English in conversations/inbox timeline — should be "وارد" / "صادر" / "نظام"
- No lazy-load/pagination for very long timelines (max 100 items currently)
- No media message preview (images, audio) — shows text only

### Recommended Future Change
```tsx
// In directionBadge():
if (direction === "inbound") return <span className="...">وارد</span>;
if (direction === "outbound") return <span className="...">صادر</span>;
return <span className="...">نظام</span>;
```

---

## 8. Shipping Settings Review

### Current Status
**PARTIAL** — Data layer is complete, UI is incomplete.

**What Exists:**
- `lib/data/egypt-governorates.ts` — 27 governorates with cities and default fees ✓
- Cairo = 70 EGP, Alexandria = 70 EGP, all others = 100 EGP ✓
- Shipping service (`lib/services/shipping-service.ts`) ✓
- Shipping API (`/api/dashboard/settings/shipping`) ✓
- Current UI: shows raw zones table + free shipping threshold field + test calculator

**What's Missing from UI:**
- Governorate dropdown to select and view/override shipping fee per governorate
- City dropdown dependent on governorate selection
- Ability to add custom zones from the UI
- Clear visual: Cairo (70 جنيه) | Alexandria (70 جنيه) | باقي المحافظات (100 جنيه)

**Recommended UI Addition (future, medium effort):**
```tsx
// In shipping/page.tsx — add a governorate selector section:
<section className="mt-8">
  <h2 className="text-lg font-medium">إعداد تكاليف الشحن بالمحافظة</h2>
  <div className="grid gap-3 mt-3">
    <label>
      المحافظة
      <select onChange={handleGovernorateChange}>
        {EGYPT_GOVERNORATES.map(g => (
          <option key={g.id} value={g.id}>{g.nameAr}</option>
        ))}
      </select>
    </label>
    <label>
      تكلفة الشحن (جنيه)
      <input type="number" value={selectedGovFee} onChange={...} />
    </label>
    <label>
      المدينة (اختياري)
      <select>{cities.map(c => <option key={c}>{c}</option>)}</select>
    </label>
    <button>حفظ التغييرات</button>
  </div>
</section>
```

**API:**
`POST /api/dashboard/settings/shipping` with `{ zone: { governorate, district, shipping_fee_egp } }`

---

## 9. Channels Settings Review

### Current Status
**FAIL** — Channels settings page is minimal and missing core features.

**What Exists:**
- List of integrations with name, status, and active toggle
- Accounts table (name, phone masked, status, default)
- Toggle per channel ✓

**What's Missing:**
- Step-by-step add channel wizard
- Per-channel configuration form (credentials, webhook URL, QR)
- Masked credential display
- Test connection button per channel
- Webhook URL copy button
- QR scan for Evolution accounts

**Evolution API endpoints exist:**
- `GET /api/dashboard/channels/evolution/accounts/[id]/status` ✓
- `POST /api/dashboard/channels/evolution/accounts/[id]/connect` ✓
- `GET /api/dashboard/channels/evolution/accounts/[id]/qr` ✓
- `POST /api/dashboard/channels/evolution/accounts/[id]/disconnect` ✓

**Recommended Future Channel Wizard:**
```
Step 1: اختر نوع القناة
  [WhatsApp Evolution] [WhatsApp Meta] [Facebook] [Instagram]

Step 2: بيانات الربط
  - Evolution: Instance Name, Base URL, API Key (masked input), Webhook Secret
  - Meta: App ID, App Secret, Phone Number ID, Access Token
  - Facebook: Page ID, Page Access Token
  - Instagram: Business Account ID, Access Token

Step 3: اختبار الاتصال
  [اختبار الاتصال] → shows SUCCESS / FAIL + error detail

Step 4: تفعيل القناة
  [تفعيل] → calls activate endpoint
  Shows: Webhook URL to copy into provider settings
```

---

## 10. Evolution QR Review

### Current Status
**FAIL** — No QR scan UI in dashboard settings.

**What Exists in API:**
- `GET /api/dashboard/channels/evolution/accounts/[id]/qr` — returns QR data ✓
- `GET /api/dashboard/channels/evolution/accounts/[id]/status` — returns connection status ✓
- `POST /api/dashboard/channels/evolution/accounts/[id]/connect` — trigger connect ✓

**What's Missing in UI:**
- Instance status display (connected / disconnected / scanning)
- Show QR Code button
- QR image/base64 display modal
- Refresh QR Code button (QR expires)
- Reconnect button
- Masked API key display
- Masked webhook secret display
- Webhook URL display + copy button

**Recommended Evolution Settings Section (in channels or new /dashboard/devices page):**
```
Evolution WhatsApp Setup
├── Instance: [instance_name]
├── Status: [CONNECTED ✓] / [DISCONNECTED ✗] / [QR_NEEDED 📷]
├── API Key: ••••••••••••[last4]  [عرض] [نسخ]
├── Webhook Secret: ••••••••[last4]  [عرض]
├── Webhook URL: https://admin.nex-lnk.online/webhook/...  [نسخ]
├── [اختبار الاتصال]  [إعادة الاتصال]
└── [عرض QR Code] → Modal:
    <img src="data:image/png;base64,..." />
    "افتح واتساب على الموبايل > الأجهزة المرتبطة > ربط جهاز > امسح الكود."
    [تحديث QR Code]
```

**Security Notes:**
- Never expose full API key — show only last 4 characters + masked
- Require super_admin role to view credentials section
- QR code expires quickly — add countdown or auto-refresh every 30s

---

## 11. Responsive and Accessibility Review

| Page/Component | Issue | Suggested Fix | Priority | Applied? |
|---|---|---|---|---|
| Users page table | `overflow-x-auto` exists but rows can be hard to read on mobile | Add card layout below `sm:` breakpoint | MEDIUM | Not applied |
| Handoff page filter bar | Filters wrap but may overflow on small mobile | Add `flex-wrap` gap adjustment | LOW | — |
| Add User modal | No max-height set — virtual keyboard may push modal off screen | Add `max-h-[90vh] overflow-y-auto` | MEDIUM | Not applied |
| Sidebar | `hidden lg:block` — mobile uses topbar only | Mobile sidebar needs slide-out drawer overlay | HIGH | Not applied |
| Conversations + Inbox | `xl:grid-cols-[380px_1fr]` — on tablet/mobile, only list shows | Good — list is full width on small screens | ✓ Already good | — |
| Pilot Control | Long pre-formatted webhook command | `overflow-x-auto` on pre — already applied | ✓ Already good | — |
| Shipping settings test row | `md:grid-cols-3` for 3 inputs | Good | ✓ Already good | — |
| Command Center KPI grid | `sm:grid-cols-2 lg:grid-cols-3` | Good | ✓ Already good | — |
| Icon-only sidebar items | Sidebar in collapsed mode shows only icons with `sr-only` label | Good — accessible | ✓ Already good | — |
| Timeline direction badges | "IN" "OUT" "SYS" — no aria-label | Add aria-label="وارد" etc. | LOW | Not applied |
| Destructive buttons | "تعطيل" is red-styled but no aria-label | Add `aria-label="تعطيل المستخدم"` | LOW | Not applied |

---

## 12. Applied Changes

| File | Change | Reason | Risk |
|---|---|---|---|
| `app/dashboard/settings/users/page.tsx` | Role options → Arabic | UI consistency | Low |
| `app/dashboard/settings/users/page.tsx` | Role display in table → Arabic | UI consistency | Low |
| `app/dashboard/handoff/page.tsx` | "Resolve" → "إغلاق التذكرة" | Arabic UI | Low |
| `app/dashboard/handoff/page.tsx` | "Problem Summary" → "ملخص المشكلة" | Arabic UI | Low |
| `app/dashboard/handoff/page.tsx` | "Conversation Preview" → "معاينة المحادثة" | Arabic UI | Low |
| `app/dashboard/handoff/page.tsx` | "Assignee" placeholder → "بحث بالمعين" | Arabic UI | Low |
| `app/dashboard/handoff/page.tsx` | "Type:" + "Summary:" row → Arabic | Arabic UI | Low |
| `app/dashboard/handoff/page.tsx` | "رجع للـ AI" → "عاد للذكاء الاصطناعي" | Cleaner Arabic | Low |
| `app/dashboard/inbox/page.tsx` | Page title → "صندوق الوارد" | Correct labeling | Low |
| `app/dashboard/inbox/page.tsx` | "Timeline" → "الجدول الزمني" | Arabic UI | Low |
| `app/dashboard/inbox/page.tsx` | "pending handoffs" → "تحويل بشري معلق" | Arabic UI | Low |
| `app/dashboard/inbox/page.tsx` | "Resolved" badge → "مغلق" | Arabic UI | Low |
| `app/dashboard/inbox/page.tsx` | Added `ChannelBadge` to conversation list | Channel identity | Low |
| `app/dashboard/conversations/page.tsx` | "Resolved" badge → "مغلق" | Arabic UI | Low |
| `app/dashboard/conversations/page.tsx` | Added `ChannelBadge` to conversation list | Channel identity | Low |
| `app/dashboard/command-center/page.tsx` | Fixed English AI/Safety/Conversion labels | Arabic UI | Low |
| `app/api/dashboard/settings/handoff/route.ts` | Fixed `globalHandoffEnabled` → `global_handoff_enabled` (pre-existing TS error) | Type correctness | Low |
| `lib/ui/channel-identity.tsx` | Fixed `Facebook`/`Instagram` missing imports from lucide-react (pre-existing TS error) | Type correctness | Low |

---

## 13. Recommended Roadmap

### Must Fix Now (Before Launch)

1. **Evolution QR scan UI** — operators cannot connect WhatsApp without QR scan UI in dashboard
   - File: `app/dashboard/settings/channels/page.tsx` + new Evolution details section
   - Use existing API: `/api/dashboard/channels/evolution/accounts/[id]/qr`

2. **Global handoff toggle — visibility from handoff page**
   - Add status badge + link to pilot-control at top of handoff page
   - Or add a small toggle widget in handoff page header

3. **Per-conversation AI pause button**
   - Add "إيقاف AI لهذه المحادثة" button in conversations/inbox when AI is active
   - Calls `POST /api/dashboard/conversations/[id]/actions { action: "pause_ai" }`

### High Priority

4. **Shipping settings — governorate/city dropdown**
   - Wire `EGYPT_GOVERNORATES` from `lib/data/egypt-governorates.ts` into shipping UI
   - Allow admin to edit per-governorate fee

5. **Channels settings — step-by-step add wizard**
   - Add a basic "ربط قناة جديدة" flow with form + test + activate steps

6. **Mobile sidebar — slide-out drawer**
   - The sidebar is hidden on mobile — add hamburger menu + slide-out overlay

7. **Add User modal max-height**
   - Add `max-h-[90vh] overflow-y-auto` to modal container

### Medium Priority

8. **Direction badge localization** in timeline ("IN"/"OUT"/"SYS" → Arabic)

9. **Handoff ticket list — add ChannelBadge** to show channel per ticket

10. **Channels settings — masked credentials display** for Evolution

### Nice to Have

11. **Facebook/Instagram proper brand icons** — upgrade lucide-react or embed custom SVGs

12. **Mobile responsive tables** — card layout for users/orders/products on small screens

13. **aria-labels** on icon-only and destructive buttons

14. **Timeline pagination** for conversations with > 100 messages

---

## 14. Manual QA Checklist for Ahmed

1. **Open dashboard on desktop (Chrome/Safari)**
   - [ ] Command center loads with Arabic labels only
   - [ ] AI status shows "مفعل" / "غير مفعل" correctly
   - [ ] معدل التحويل section shows Arabic labels
   - [ ] Integrations show "نشط" not "Active"

2. **Open dashboard on mobile (iPhone/Android)**
   - [ ] Sidebar hidden — only topbar visible
   - [ ] Can navigate to all pages via topbar
   - [ ] Tables don't overflow horizontally without scroll

3. **Test Add User modal**
   - [ ] Click "إضافة مستخدم"
   - [ ] Modal is centered, visible, not cut off
   - [ ] Role dropdown shows: مدير رئيسي / مشرف / خدمة العملاء
   - [ ] Try submitting empty form — error shows
   - [ ] Try invalid email — error shows
   - [ ] Successfully add user — success message shows

4. **Test handoff return to AI**
   - [ ] Go to `/dashboard/handoff`
   - [ ] Open a ticket in handoff status
   - [ ] See "إرجاع المحادثة للذكاء الاصطناعي" button in both list and detail view
   - [ ] Click it — conversation should return to AI
   - [ ] Status badge should update to "عاد للذكاء الاصطناعي"

5. **Check channel icon + identifier in inbox/conversations**
   - [ ] Go to `/dashboard/inbox`
   - [ ] Conversation list shows channel badge (واتساب Evolution / واتساب Meta / فيسبوك / إنستغرام)
   - [ ] Go to `/dashboard/conversations`
   - [ ] Same channel badge visible

6. **Check inbox message history**
   - [ ] Select a conversation in inbox
   - [ ] Right panel shows "الجدول الزمني" header
   - [ ] Messages load in chronological order
   - [ ] Empty state shows if no messages

7. **Check shipping settings**
   - [ ] Go to `/dashboard/settings/shipping`
   - [ ] Zones table shows governorates with fees
   - [ ] Test calculator: enter "القاهرة" + subtotal → see 70 EGP
   - [ ] Test calculator: enter "أسيوط" + subtotal → see 100 EGP

8. **Check channels settings**
   - [ ] Go to `/dashboard/settings/channels`
   - [ ] See current integrations list with toggle
   - [ ] Note: QR scan + test connection are NOT yet available (future work)

9. **Check Evolution connection**
   - [ ] Go to `/dashboard/pilot-control`
   - [ ] Check "Evolution connected" status badge
   - [ ] Note: QR scan modal is NOT in dashboard yet — must use Evolution dashboard directly

10. **Check Arabic labels throughout**
    - [ ] No visible English-only labels in main user flows
    - [ ] Handoff page: "ملخص المشكلة", "معاينة المحادثة", "إغلاق التذكرة"
    - [ ] Users page: Arabic role names in table and modal

---

## 15. Command Results

| Command | Result |
|---|---|
| `npm run typecheck` | ✓ PASS — 0 errors (2 pre-existing fixed: handoff route type, lucide-react icons) |
| `npm run lint` | ✓ PASS — 0 errors, 28 warnings (all pre-existing, unrelated to this task) |
| `npm test` | ✓ PASS — 229/229 tests passed |
| `npm run validate:scenarios` | ✓ PASS — 104 scenarios (94 CONV, 10 DASH) |
| `npm run scan:secrets` | ✓ PASS — no obvious live secrets found |
| `npm run verify:release` | ✓ PASS — v2.23.6 ahmed-number-stuck-in-handoff-now |
| `npm run build` | Not run (build takes too long for polish task) |
| Playwright | Not run (credentials/setup not available in this environment) |

---

## 16. Final Recommendation

يا أحمد، الداشبورد يعمل بشكل جيد وجميع التدفقات الأساسية سليمة. تم تطبيق تحسينات اللغة العربية والأزرار والشارات الأكثر إلحاحاً في هذا التاسك. الأولويات الحرجة قبل الإطلاق الكامل هي ثلاثة: (1) إضافة واجهة مسح QR لـ Evolution حتى تتمكن من توصيل WhatsApp من الداشبورد مباشرةً بدلاً من واجهة Evolution الخارجية، (2) إظهار زر تشغيل/إيقاف التحويل البشري في صفحة الهاندأوف مباشرةً بدلاً من إخفائه في غرفة الطيار، و(3) ربط قائمة المحافظات/المدن الموجودة في `lib/data/egypt-governorates.ts` بواجهة إعدادات الشحن حتى يتمكن الأوبريتور من رؤية وتعديل تكلفة الشحن لكل محافظة بسهولة. كل هذه التغييرات لها API موجود بالفعل — تحتاج فقط واجهة مستخدم.
