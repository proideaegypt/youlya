# Message History Repair Report

## Implemented
- `logInboundMessage` now persists `messages.body` and `messages.text` from inbound customer text.
- `logOutboundMessage` now persists `messages.body` with actual final reply and persists `final_reply` consistently.
- Pilot-control API now uses fallback:
  - `displayBody = body || text || final_reply`
  - `—` only when all are empty.

## Risk policy
- No destructive historical backfill was run.
- Old blank rows remain as-is.
- New rows are now expected to be non-blank when reply text exists.
