## CodeReview RESULT
Status: FAIL
Test results: 158/158 pass
Lint: 2 errors, 30 warnings
TypeScript: PASS

### File size violations
None confirmed from the current scan.

### Architecture boundary violations
- Internal turn route mutates test preconditions before auth in [`app/api/internal/messages/turn/route.ts`](/root/youlya/app/api/internal/messages/turn/route.ts:47).
- Public AI product-search route writes recommendation state without auth in [`app/api/ai/tools/product-search/route.ts`](/root/youlya/app/api/ai/tools/product-search/route.ts:6).
- n8n workflow contains reply shaping, upsell insertion, internal-detail stripping, and validation logic in [`n8n/workflows/youlya-whatsapp-main.json`](/root/youlya/n8n/workflows/youlya-whatsapp-main.json:170).
- Dashboard APIs still hardcode `store_id = "youlya"` in some paths, including conversations and handoff routes.

### Type safety issues
- Lint errors in `app/dashboard/haidi/lab/page.tsx` and `app/dashboard/haidi/learning/page.tsx` are React hook set-state-in-effect violations.

### Dead code
- Several unused imports/variables remain in dashboard pages and helper scripts, but no dead business logic was confirmed.

### Findings
- P0: live Evolution send path still exists in test-mode flows.
- P0: live Shopify order path still exists in test-mode flows.
- P0: internal turn state mutation occurs before auth.
- P0: public product-search endpoint can persist tenant state.
- P1: store context is not consistently derived from auth/session in dashboard APIs.
