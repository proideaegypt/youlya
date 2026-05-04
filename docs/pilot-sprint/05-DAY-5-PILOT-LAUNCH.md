# Day 5 - Pilot Launch

## Goal

Run a limited internal pilot with safe conversation flows and no hidden live commerce side effects.

## Launch order

1. Keep the `Send Text` JSON body fix under regression watch.
2. Restore Haidi safely as a conversation layer.
3. Validate Haidi outputs against the app gate.
4. Verify Shopify cache/search behavior.
5. Run the real WhatsApp loop test manually.
6. Add safe audio transcription handling.
7. Pilot with a small internal tester set.

## Internal tester rules

- Start with 5 internal testers only.
- Keep `testMode` on for non-live smoke checks.
- Do not auto-create Shopify orders during script runs.
- Escalate ambiguous or risky cases to handoff.
- Use explicit confirmation before any live commerce side effect.

## Pilot success criteria

- No reply loops.
- No duplicate orders.
- No order without explicit confirmation.
- No unsafe product invention.
- No secret exposure.
