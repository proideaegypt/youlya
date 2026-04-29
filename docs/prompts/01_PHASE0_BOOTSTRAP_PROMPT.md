# Phase 0 Bootstrap Prompt

Use after the master prompt.

Task: make the starter pack executable and safe for Phase 0.

Do:

1. Run baseline validators:
   ```bash
   node scripts/validate-scenarios.mjs
   node scripts/scan-secrets.mjs
   node scripts/validate-n8n-workflows.mjs
   ```
2. Create baseline QA artifact.
3. Scaffold Next.js App Router if missing.
4. Add TypeScript strict, ESLint, Vitest, Playwright.
5. Add env validation and `/api/health`.
6. Add package scripts.
7. Keep docs/tests/data intact.
8. Do not implement full dashboard.

Acceptance:

```text
package.json exists
npm install works
npm run typecheck works
npm run lint works
npm run build works
node scripts/validate-scenarios.mjs passes
/api/health returns safe non-secret status
QA artifact written
PROGRESS-LOG updated
```

Return PASS/PARTIAL/FAIL with blockers.
