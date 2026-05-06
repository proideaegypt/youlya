## GapAnalysis RESULT
Status: FAIL

### Phase 0 Gate Matrix
| Gate | Criterion | Status | Evidence |
|---|---|---|---|
| P0-1 | Product mapping works | FAIL | Mapping state has store-scoping and schema drift concerns; product search falls back to mock data. |
| P0-2 | Order confirmation works | PARTIAL | Confirmation parsing exists, but live order side effects are not test-safe. |
| P0-3 | Order creation idempotent | FAIL | Idempotency schema mismatch in live path. |
| P0-4 | Error handling works | PASS | Dead-letter and failed-event logging paths exist. |
| P0-5 | No hardcoded secrets | PASS | Secret scan passed; no raw secret exposure confirmed. |
| P0-6 | Handoff works | PASS | Handoff tests and routes exist and passed. |

### Phase 1 Gate Matrix
| Gate | Criterion | Status | Evidence |
|---|---|---|---|
| P1-1 | All core conversation scenarios pass | PASS | Scenario validation passed. |
| P1-2 | 0 duplicate orders | FAIL | Idempotency schema mismatch breaks the guard in production. |
| P1-3 | 0 wrong variant orders | FAIL | Real inventory resolution is not trustworthy because live inventory lookup uses the mock catalog. |
| P1-4 | Stock failure handled | PASS | Stock validation exists and unit tests pass. |
| P1-5 | Dashboard live monitor works | PARTIAL | Dashboard exists, but store-scope/auth drift remains. |

### Phase 2 Gate Matrix
| Gate | Criterion | Status | Evidence |
|---|---|---|---|
| P2-1 | Auth/roles working | FAIL | Cookie-presence checks and hardcoded store scope still exist in some APIs. |
| P2-2 | Command Center | PASS | Present in app and prior QA artifacts. |
| P2-3 | Inbox | PASS | Present in app and prior QA artifacts. |
| P2-4 | Orders | PASS | Present, but not fully safe. |
| P2-5 | Products | PASS | Present. |
| P2-6 | AI Studio (Haidi) | PARTIAL | Prompt safety is decent, but workflow architecture drift remains. |
| P2-7 | Channels | FAIL | Phase-2 channel/admin APIs still show tenant-scope drift. |
| P2-8 | Reports basic | PASS | Basic reporting routes exist. |
| P2-9 | AR/EN + dark/light/auto | PASS | Existing dashboard UI supports this. |

### Missing features vs spec
- Missing app-referenced DB tables for Haidi/knowledge-base features.
- Public product-search write path.
- Test-mode side-effect suppression.
- Production-safe order idempotency path.

### Overfeatured beyond current phase
- Haidi workflow logic embedded in n8n is beyond orchestration-only scope.
- Dashboard scope is already broader than the minimum safe pilot surface.

### Findings
- Phase 0 is not launch-ready.
- Phase 1 is not launch-ready.
- Phase 2 is not cleanly gated because auth/store-scope and workflow boundaries are still drifting.
