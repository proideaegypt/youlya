# LEARNINGS.md — Youlya AI Commerce OS

Codex/Claude must update this only when a real mistake, blocker, or design lesson is discovered.

## 2026-04-28 — Scenario header bug

Problem: `docs/data/youlya_human_test_scenarios.jsonl` contained one fake scenario copied from CSV headers with `id == "id"`.

Fix: final pack removes that row and treats the real scenario count as 90: 80 conversation scenarios and 10 dashboard scenarios.

Rule: validation must reject any scenario where `id` is missing, duplicated, or equals `id`.

## 2026-04-28 — Dashboard scenarios must not run in Phase 0

Problem: dashboard scenarios are useful but should not hit `/api/internal/messages/turn`.

Fix: Playwright defaults to `SCENARIO_PREFIX=CONV`; `DASH` and `ALL` must be explicit.

Rule: Phase 0 E2E acceptance is CONV only.

## 2026-04-28 — Product code cannot be invented

Problem: user asked for products by Shopify name and code. The system cannot safely invent codes.

Fix: define Shopify product title as name and variant SKU as code. Missing SKU is flagged, not invented.

Rule: live product data must come from Shopify API/export only.

## 2026-04-29 — Env template secret hygiene blocker

Problem: `.env.example` contained sensitive-looking real values (keys/passwords/host details), and `.gitignore` was missing.

Fix: replaced `.env.example` with placeholders only and added `.gitignore` entries for `.env.local`, `.env.production`, and Portainer stack env files.

Rule: environment templates must contain placeholders only; no real credentials or PII-like values in committed templates.

## 2026-04-30 — Version source drift

Problem: `README.md` release version moved to `v2.0.1` while `package.json` stayed at `0.1.0`, causing inconsistent build/runtime identity.

Fix: treat `package.json` as runtime version source, align it to release version, and generate build identity from package + git metadata via `scripts/write-build-info.mjs`.

Rule: every release tag/version update must update `package.json` first, then docs.
