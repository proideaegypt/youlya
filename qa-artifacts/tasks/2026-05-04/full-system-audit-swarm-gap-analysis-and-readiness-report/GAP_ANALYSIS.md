# Gap Analysis (Swarm Synthesis)

## P0 Blockers (Must close before controlled live pilot)
1. Internal auth bypass risk
- Evidence: `POST /api/internal/messages/turn` returned 200 in production without internal secret using `testMode:true` payload.
- Impact: external actor could trigger internal message-processing surface.
- Owner: App/API security.

2. Release drift between repo and live
- Evidence: repo `2.18.0`, live `2.15.1`.
- Impact: today’s audit findings cannot guarantee behavior of latest audited code in production.
- Owner: Release/deploy.

3. Selection mapping not proven in live data
- Evidence: `last_product_recommendations` table count = 0.
- Impact: core safety contract (selection from persisted recommendations) not evidenced in production traffic.
- Owner: Commerce core + integration QA.

## P1 (Before broader pilot)
1. `verify:deploy` fails due lint errors.
2. Playwright swarm failed at browser launch, reducing UI confidence.
3. n8n unknown webhook noise (legacy/unregistered webhook traffic).
4. Evolution container shows DB connectivity instability events.
5. High SKU-missing ratio in variants (461/1082).

## P2 (After pilot but track)
1. Build metadata missing commit/branch in live build-info.
2. Remove noisy warnings (`middleware` deprecation, health route import warning).

## False positives / accepted findings
- Secret keyword hits in workflow JSON are env references, not hardcoded keys.
- `dangerouslySetInnerHTML` used for deterministic preference script, not user content sink.
