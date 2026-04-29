name: youlya-dashboard-mvp-builder
description: Limits dashboard implementation/review to minimal operational MVP after commerce core gates pass.
when_to_use: Use only after Phase 0/1 commerce safety gates are passing.
required_reads:
- docs/12_DASHBOARD_SYSTEM_FEATURES_FINAL.md
- docs/16_CLEAN_ROADMAP_TO_PRODUCTION.md
- docs/18_NO_OVERENGINEERING_RULES.md
allowed_actions:
- Build/review minimal operational dashboard pages.
- Prioritize safety visibility and operator workflows.
forbidden_actions:
- Build campaign engine before allowed phase.
- Build RAG knowledge base before allowed phase.
- Build billing/SaaS onboarding early.
- Build agency portal/marketplace/advanced analytics early.
- Expand multi-channel before allowed phase.
checklist:
- Confirm phase gate allows dashboard work.
- Limit scope to MVP pages.
- Preserve safety proof visibility (mapping, confirmation, logs, kill switch).
- Flag overengineering risks.
final_output: |
  STATUS: PASS / FAIL / PARTIAL / OUT_OF_SCOPE
  PAGES_TOUCHED:
  SAFETY_VISIBILITY:
  OVERENGINEERING_RISK:
  BLOCKERS:
  NEXT_STEP:

