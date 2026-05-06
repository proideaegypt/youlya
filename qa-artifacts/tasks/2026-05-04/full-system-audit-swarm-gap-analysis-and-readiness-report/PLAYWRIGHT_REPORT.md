# Playwright Report

## Commands
- `npm run test:e2e:dashboard:swarm` -> FAIL
- `npm run qa:collect` -> PASS (report generated from available artifacts)

## Failure
- Failed at auth setup before dashboard suite execution.
- Chromium launch crash in this environment:
  - `sandbox_host_linux.cc:41 Check failed ... Operation not permitted`
  - 1 failed, 64 not run

## Coverage implication
- No fresh pass evidence for login, command center, products, inbox, orders, logs, settings, handoff, pilot-control, Haidi settings in this run.
- Accessibility/RTL/responsive checks were not completed in this execution.

## Classification
- P1 before pilot if UI regression risk must be controlled by automated browser checks on VPS.
