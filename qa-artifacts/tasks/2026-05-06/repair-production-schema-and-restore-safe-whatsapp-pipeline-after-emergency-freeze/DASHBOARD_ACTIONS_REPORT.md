# Dashboard Actions Report

## Completed in this task
- Repaired message preview fallback in pilot-control to avoid false dash rendering when `body` is empty but `text/final_reply` exists.
- Restored schema compatibility for handoff/settings columns required by dashboard APIs.

## Still pending (P0/P1 follow-up)
- Full quick-button reliability sweep + Playwright persistence checks for:
  - Pause/Resume Haidi
  - Pause/Resume Orders
  - Refresh
  - Open Handoff/Inbox/Product QA
- This task did not complete full dashboard quick-button E2E scope.
