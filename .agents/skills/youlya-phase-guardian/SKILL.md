name: youlya-phase-guardian
description: Enforces current phase scope and blocks premature feature expansion.
when_to_use: Use at the start of any task to confirm the active phase and allowed scope.
required_reads:
- START_HERE_FOR_CODEX.md
- AGENTS.md
- CLAUDE.md
- MEMORY.md
- PROGRESS-LOG.md
- LEARNINGS.md
- docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md
- docs/18_NO_OVERENGINEERING_RULES.md
allowed_actions:
- Identify current phase from roadmap and recent progress logs.
- Approve only work allowed in current phase gates.
- Route to the next required skill.
- Document scope decisions in QA artifacts.
forbidden_actions:
- Build Phase 2+ features during Phase 0/1.
- Build full SaaS before Youlya live stabilizes.
- Build RAG/campaign engine before allowed phase.
- Call live production APIs during setup tasks.
checklist:
- Confirm current phase.
- Confirm task is inside allowed phase scope.
- List blocked out-of-scope items.
- Select required next skill.
- Write decision to artifact.
final_output: |
  STATUS: READY / BLOCKED / OUT_OF_SCOPE
  CURRENT_PHASE:
  ALLOWED_SCOPE:
  BLOCKED_SCOPE:
  REQUIRED_NEXT_SKILL:
  QA_ARTIFACT:

