name: youlya-docs-progress-updater
description: Updates progress, memory, learnings, and QA artifacts with truthful execution status.
when_to_use: Use at the end of each task.
required_reads:
- PROGRESS-LOG.md
- MEMORY.md
- LEARNINGS.md
- README.md
- qa-artifacts/
allowed_actions:
- Append progress entries with files, commands, and results.
- Update MEMORY only for locked decisions.
- Update LEARNINGS only for real discovered lessons.
- Update README command references when changed.
- Write QA artifacts for baseline/after states.
forbidden_actions:
- Hide failed tests.
- Claim PASS without running checks.
- Delete progress history.
- Fabricate validations.
checklist:
- PROGRESS-LOG updated.
- LEARNINGS updated only when warranted.
- MEMORY updated only for locked decisions.
- QA artifact written.
- README updated if setup commands changed.
final_output: |
  STATUS: UPDATED / PARTIAL / BLOCKED
  FILES_UPDATED:
  QA_ARTIFACT:
  TESTS_RECORDED:
  BLOCKERS:
  NEXT_STEP:
