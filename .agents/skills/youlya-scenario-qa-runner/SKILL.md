name: youlya-scenario-qa-runner
description: Validates scenario packs and runs safe Playwright Test/Playwright Agent CLI checks.
when_to_use: Use during Phase 0 validation, QA runs, and regression checks.
required_reads:
- docs/07_TEST_STRATEGY_AND_SWARMS.md
- tests/playwright-youlya-scenarios.spec.ts
- docs/data/youlya_human_test_scenarios.jsonl
- AGENTS.md
allowed_actions:
- Validate JSONL parsing, IDs, uniqueness, and expected counts.
- Run Playwright Test commands and capture results.
- Run Playwright Agent CLI help/install-browser checks.
- Save screenshots/traces only in qa-artifacts.
forbidden_actions:
- Capture screenshots with secrets or full private customer data.
- Run production Shopify/admin browser login without approval.
- Trigger live order mutation via browser.
- Send real WhatsApp messages.
checklist:
- JSONL parses.
- No id == "id".
- IDs unique.
- Total count expected 90 (unless file proves different).
- CONV expected 80.
- DASH expected 10.
- Default prefix CONV.
- DASH not run against /api/internal/messages/turn by default.
- testMode true in scenario runner.
final_output: |
  STATUS: PASS / FAIL / PARTIAL
  SCENARIO_COUNTS:
  PLAYWRIGHT_TEST_STATUS:
  PLAYWRIGHT_AGENT_CLI_STATUS:
  COMMANDS_RUN:
  TEST_RESULTS:
  FAILURES:
  NEXT_FIX:

