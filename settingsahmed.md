# Settings Pages Report — Ahmed

## Status: COMPLETE

### 1. Users & Roles (`/dashboard/settings/users`)
- Add User modal: centered, clean, responsive (max-w-md, backdrop blur)
- Form fields: Name, Email (disabled on edit), Role dropdown (مدير رئيسي/مشرف/خدمة العملاء), Active checkbox
- Validation: required fields, email format
- Actions: Edit, Deactivate (with confirm), Invite
- All labels in Arabic

### 2. Shipping (`/dashboard/settings/shipping`)
- Egypt 27-governorate dropdown with city sub-dropdown
- Auto-fills default shipping fee per governorate
- Add zone form: governorate + city + cost
- Zones table: governorate, city, aliases, fee
- Shipping test tool: address + subtotal → fee/total/free-shipping indicator
- Free shipping threshold configurable

### 3. Channels (`/dashboard/settings/channels`)
- 4-step wizard: Select Type → Credentials → Test → Activate
- Channel types: Evolution WhatsApp, Meta WhatsApp, Facebook, Instagram
- Evolution QR scan: wizard step 3 + per-account QR in table
- Webhook URL auto-generated with copy button
- Connection test with success/error feedback
- Secrets masked (password fields + server-side encryption)
- Accounts table with status, default, QR action

### 4. Evolution QR (`/dashboard/settings/channels`)
- Wizard QR modal: scan instructions, image display, refresh button
- Account QR modal: per-account QR with loading, error, refresh
- Integration with Evolution API `/api/dashboard/channels/evolution/accounts/[id]/qr`

### 5. Verification
- typecheck: PASS
- lint: 0 errors
- tests: 229/229 PASS
- scenarios: 104 PASS
- secrets: PASS

## Files
- app/dashboard/settings/users/page.tsx
- app/dashboard/settings/shipping/page.tsx
- app/dashboard/settings/channels/page.tsx
- lib/data/egypt-governorates.ts
- lib/ui/channel-identity.tsx
