You are Claude Code working inside the Youlya project.

TASK:
dashboard-review-finetune-pages-features-labels

GOAL:
Review the full Youlya dashboard carefully, improve/fine-tune dashboard pages, features, text labels, buttons, empty states, error states, Arabic/English wording, UI/UX consistency, and admin usability.

Create a final markdown report file named:

fineahmed.md

Save it in the project root.

IMPORTANT CONTEXT:
The project is close to go-live but still needs dashboard polish and operational hardening.
Known previous review areas included:
- Dashboard/internal use was mostly ready.
- WhatsApp AI pilot was not ready for real customers.
- Some dashboard pages lacked loading skeletons.
- Some English copy was mixed with Arabic.
- Some old/hardcoded domain references existed.
- User management Add/Edit flow was being improved.
- Kill switch and admin control plane need careful review.

RULES:
- Do not print secrets.
- Do not cat .env, .env.production, .env.local, or secret files.
- Do not deploy.
- Do not run destructive commands.
- Do not reset, revert, clean, stash, or checkout.
- Preserve the dirty worktree.
- If a file is already modified, inspect git diff first and preserve existing changes.
- Keep changes minimal and safe.
- Do not rewrite business logic.
- Do not change payment/order/customer logic unless a clear UI bug requires a tiny safe fix.
- Prefer suggesting larger changes in fineahmed.md instead of applying them.
- Safe changes allowed:
  - text label improvements
  - Arabic wording fixes
  - button label improvements
  - empty/loading/error state copy
  - small layout polish
  - accessibility labels
  - obvious broken links
  - dashboard navigation clarity
  - mobile responsive fixes if minimal
- If unsure, do not apply; suggest in fineahmed.md.

============================================================
PHASE 0 — SAVE STATE
============================================================

Run:

pwd
date -Is
git status --short
mkdir -p qa-artifacts/dashboard-finetune
git status --short > qa-artifacts/dashboard-finetune/pre-change-git-status.txt
cat package.json

Inspect dashboard structure:

find app -maxdepth 6 -type f | sort | grep -Ei "dashboard|admin|settings|users|orders|products|inbox|pilot|haidi|logs|shipping|channels|roles" || true
find components -maxdepth 6 -type f | sort | grep -Ei "dashboard|admin|settings|users|orders|products|inbox|pilot|haidi|logs|shipping|channels|roles|sidebar|nav|button|modal|toast" || true

Do not inspect env values.

============================================================
PHASE 1 — DASHBOARD PAGE INVENTORY
============================================================

Create a complete inventory of dashboard pages/routes.

Find all dashboard routes:

find app/dashboard -maxdepth 8 -type f | sort || true
find app -maxdepth 8 -type f | grep -E "dashboard|admin" | sort || true

For each page, identify:
- route/path
- purpose
- user role
- main actions
- current text labels
- buttons
- empty states
- loading states
- error states
- mobile concerns
- missing features
- confusing UX
- suggested improvements

Create this table for fineahmed.md:

| Route/Page | Purpose | Current Issues | Suggested Improvements | Apply Now? | Priority |
|---|---|---|---|---|---|

Priorities:
- BLOCKER
- HIGH
- MEDIUM
- LOW
- NICE

============================================================
PHASE 2 — TEXT LABELS AND MICROCOPY REVIEW
============================================================

Review all dashboard labels, buttons, titles, descriptions, toasts, empty states, validation messages, and error messages.

Focus especially on:
- Arabic clarity
- English/Arabic consistency
- button labels
- page titles
- table headers
- form placeholders
- confirmation messages
- destructive action wording
- success messages
- failure messages
- empty dashboard states
- loading text
- onboarding/help text
- admin operation instructions

Search text:

grep -R "Add\|Edit\|Update\|Delete\|Save\|Cancel\|Loading\|Error\|Success\|Failed\|User\|Role\|Settings\|Dashboard" -n app components src 2>/dev/null || true
grep -R "إضافة\|تعديل\|حفظ\|حذف\|إلغاء\|خطأ\|نجح\|فشل\|تحميل\|مستخدم\|دور\|إعدادات" -n app components src 2>/dev/null || true

Create a label improvement table:

| File/Page | Current Label/Text | Suggested Label/Text | Reason | Priority | Applied? |
|---|---|---|---|---|---|

Arabic style guidance:
- Use simple operational Arabic.
- Avoid overly technical messages.
- Use polite clear instructions.
- Destructive actions must be explicit.
- User-facing errors should not expose internal technical details.
- Prefer:
  - "إضافة مستخدم"
  - "تعديل"
  - "حفظ التغييرات"
  - "إلغاء"
  - "جاري التحميل..."
  - "لا توجد بيانات حتى الآن"
  - "حدث خطأ. حاول مرة أخرى."
  - "ليس لديك صلاحية لتنفيذ هذا الإجراء."
  - "تم الحفظ بنجاح"
  - "لا يمكن التراجع عن هذا الإجراء"

============================================================
PHASE 3 — FEATURE AND ACTION REVIEW
============================================================

Review every major dashboard feature and action.

Minimum areas:
- dashboard home/overview
- sidebar/navigation
- login/session behavior
- inbox/conversations
- orders
- products/catalog
- product intelligence
- pilot control
- kill switch
- settings
- users and roles
- shipping settings
- channels/WhatsApp/Evolution settings
- AI agent settings
- Haidi settings/lab/learning
- logs
- health/build-info status
- exports/downloads if present

For each feature, answer:
- Is the action discoverable?
- Is the button visible?
- Is the label clear?
- Is there loading feedback?
- Is there success feedback?
- Is there error feedback?
- Is mobile usable?
- Is it protected by correct role?
- Is the UX safe for admin operations?
- What should be improved?

Create feature table:

| Feature | Main Actions | Status | UX Problem | Suggested Edit | Priority | Applied? |
|---|---|---|---|---|---|---|

============================================================
PHASE 4 — USERS & ROLES SPECIAL REVIEW
============================================================

Review the Users & Roles dashboard specifically.

Check:
- Add User button exists.
- Edit/Update button exists per user.
- Role change is clear.
- super_admin protection is clear.
- Normal admin/moderator cannot manage roles if policy is super_admin-only.
- Empty state exists.
- Invalid email error exists.
- Duplicate email error exists.
- Missing role error exists.
- Deactivate/invite actions are either implemented or clearly hidden/documented.
- Mobile view keeps Add/Edit actions visible.
- Dangerous role actions require confirmation.

Suggested labels:
- Page title: "إدارة المستخدمين والصلاحيات"
- Add button: "إضافة مستخدم"
- Edit button: "تعديل"
- Role field: "الدور"
- Status field: "الحالة"
- Active: "نشط"
- Inactive: "معطل"
- Save: "حفظ التغييرات"
- Invite: "إرسال دعوة"
- Deactivate: "تعطيل المستخدم"
- Error unauthorized: "ليس لديك صلاحية لإدارة المستخدمين."
- Error last super admin: "لا يمكن تعديل أو تعطيل آخر مدير رئيسي في النظام."

Create section in fineahmed.md:

## Users & Roles Review

Include:
- Add User status
- Edit User status
- role management status
- labels to improve
- missing actions
- safety risks
- suggested fixes

============================================================
PHASE 5 — RESPONSIVE DASHBOARD REVIEW
============================================================

Review dashboard layout for:

- Mobile: 360px / 390px
- Tablet: 768px
- Desktop: 1280px+

If Playwright is configured, use it.
If not configured, inspect code/CSS and document what could not be tested.

Check:
- sidebar on mobile
- header/nav on mobile
- tables overflow
- action buttons visible
- modals fit screen
- forms usable
- cards wrap correctly
- Arabic text does not overflow
- long labels do not break buttons
- no hidden important CTA
- no horizontal scroll unless intentional
- touch targets large enough
- filters usable on mobile

If screenshots are possible, save them to:

qa-artifacts/dashboard-finetune/screenshots

Create responsive table:

| Viewport | Page | Issue | Suggested Fix | Priority | Screenshot/Artifact |
|---|---|---|---|---|---|

============================================================
PHASE 6 — ACCESSIBILITY AND USABILITY REVIEW
============================================================

Review:
- button accessible names
- icons without labels
- keyboard focus states
- form labels connected to inputs
- contrast/readability
- destructive buttons visually distinct
- disabled button states
- toast readability
- modal focus/close behavior
- table headers
- ARIA labels where needed
- meaningful page headings

Create accessibility table:

| Page/Component | Issue | Suggested Fix | Priority | Applied? |
|---|---|---|---|---|

============================================================
PHASE 7 — LOADING, EMPTY, ERROR, SUCCESS STATES
============================================================

Review all dashboard pages for state handling.

Every important dashboard page should have:
- loading state
- empty state
- error state
- success state for mutations
- disabled button while saving
- retry option where useful

Search:

grep -R "جاري التحميل\|Loading\|loading\|error\|Error\|toast\|empty\|لا توجد" -n app components src 2>/dev/null || true

Create state table:

| Page/Feature | Loading | Empty | Error | Success | Suggested Edit | Priority |
|---|---|---|---|---|---|---|

============================================================
PHASE 8 — SAFE FINE-TUNING CHANGES
============================================================

Apply only small safe improvements.

Allowed safe changes:
- improve unclear labels
- translate obvious English dashboard copy to Arabic
- fix old domain links if obvious
- improve button text
- improve empty/loading/error messages
- add aria-label to icon-only buttons
- add title/help text for confusing controls
- add minor responsive class fixes
- add confirmation text for dangerous actions

Do not apply:
- large redesign
- routing rewrite
- business logic rewrite
- database changes
- auth policy changes
- payment/order logic changes
- broad CSS overhaul

If a change is bigger than small polish, write it as a suggestion only.

For every applied change:
- record file
- before
- after
- reason
- test run

============================================================
PHASE 9 — OPTIONAL PLAYWRIGHT / BROWSER REVIEW
============================================================

Check Playwright:

npx playwright --version || true
test -f playwright.config.ts && sed -n '1,220p' playwright.config.ts || true
test -f playwright.config.js && sed -n '1,220p' playwright.config.js || true

If Playwright env exists safely, run dashboard smoke/responsive tests.

Possible commands:

npm run test:e2e:dashboard:swarm || true
npx playwright test --reporter=list || true

If blocked by missing credentials, document:

- required env vars
- how to run later
- exact pages that should be tested

Do not print credentials.

============================================================
PHASE 10 — RUN VALIDATION
============================================================

Run available checks after any edits:

npm run typecheck
npm run lint
npm test
npm run validate:scenarios
npm run build
npm run scan:secrets

If any command is missing, mark SKIPPED.
If lint fails due to existing repo-wide warnings, identify whether this task caused new warnings.
Do not hide failures.

============================================================
PHASE 11 — CREATE fineahmed.md
============================================================

Create a markdown report file in project root:

fineahmed.md

The file must include:

# Fine Ahmed Dashboard Review

## 1. Executive Summary
- Overall dashboard polish status: PASS / PARTIAL / FAIL
- Launch readiness impact
- Top 5 dashboard improvements recommended

## 2. Dashboard Page Inventory
Table:
| Route/Page | Purpose | Current Issues | Suggested Improvements | Apply Now? | Priority |
|---|---|---|---|---|---|

## 3. Text Labels and Microcopy Review
Table:
| File/Page | Current Label/Text | Suggested Label/Text | Reason | Priority | Applied? |
|---|---|---|---|---|---|

## 4. Feature Review
Table:
| Feature | Main Actions | Status | UX Problem | Suggested Edit | Priority | Applied? |
|---|---|---|---|---|---|---|

## 5. Users & Roles Review
Include:
- Add User button status
- Edit/Update button status
- role management status
- super_admin safety wording
- missing invite/deactivate actions
- suggested labels
- remaining gaps

## 6. Responsive UI Review
Table:
| Viewport | Page | Issue | Suggested Fix | Priority | Screenshot/Artifact |
|---|---|---|---|---|---|

## 7. Accessibility Review
Table:
| Page/Component | Issue | Suggested Fix | Priority | Applied? |
|---|---|---|---|---|

## 8. Loading / Empty / Error / Success States
Table:
| Page/Feature | Loading | Empty | Error | Success | Suggested Edit | Priority |
|---|---|---|---|---|---|---|

## 9. Applied Fine-Tuning Changes
Table:
| File | Change | Reason | Risk | Test |
|---|---|---|---|---|

## 10. Suggested Future Improvements
Group by:
- HIGH
- MEDIUM
- LOW
- NICE

## 11. Manual QA Checklist
Include exact manual checks Ahmed should do:
- open dashboard home
- open inbox
- open users/roles
- open products
- open orders
- open settings
- open pilot control
- check Add/Edit buttons
- check mobile layout
- check Arabic labels
- check loading/error states
- check save/update flows
- check role permissions

Table:
| Check | Status | How Ahmed Verifies |
|---|---|---|

## 12. Command Results
Include:
- typecheck
- lint
- tests
- scenarios
- build
- scan:secrets
- Playwright if run

## 13. Files Changed
List files changed by this task only.

## 14. Final Recommendation
One direct paragraph:
"Ahmed, my recommendation for dashboard fine-tuning is..."

REPORT SAVE REQUIREMENT:
After writing fineahmed.md, verify:

test -f fineahmed.md && sed -n '1,260p' fineahmed.md

Also save detailed artifacts under:

qa-artifacts/dashboard-finetune

============================================================
PHASE 12 — UPDATE EXISTING REPORTS ONLY IF SAFE
============================================================

If present and safe, append a short note to:

claudeahmed.md

Add:

## Dashboard Fine-Tuning Report
A full dashboard polish and label review was saved to fineahmed.md.

Do not rewrite the whole claudeahmed.md file unless needed.

============================================================
PHASE 13 — FINAL RESPONSE
============================================================

Return:

STATUS:
PASS / PARTIAL / FAIL

TASK:
dashboard-review-finetune-pages-features-labels

REPORT FILE:
fineahmed.md created and verified: YES / NO

DASHBOARD POLISH STATUS:
PASS / PARTIAL / FAIL

TOP 5 IMPROVEMENTS:

APPLIED CHANGES:
list files and summary

SUGGESTED CHANGES:
summary by HIGH / MEDIUM / LOW

USERS & ROLES:
summary

RESPONSIVE REVIEW:
summary

TEXT LABELS:
summary

COMMAND RESULTS:
- typecheck:
- lint:
- tests:
- validate:scenarios:
- build:
- scan:secrets:
- playwright:

FILES CHANGED:

REMAINING RISKS:

MANUAL QA FOR AHMED:

FINAL RECOMMENDATION:
One clear paragraph.