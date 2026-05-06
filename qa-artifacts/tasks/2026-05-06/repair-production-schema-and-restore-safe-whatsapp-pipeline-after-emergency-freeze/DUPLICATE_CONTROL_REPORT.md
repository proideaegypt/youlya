# Duplicate Control Report

## Existing guard kept
- `provider_message_id` idempotency via `processed_messages` remains active.

## Added guard
- App-side duplicate outbound suppression by short time window:
  - 120 seconds for general static replies.
  - 300 seconds for `product_results` action.
- Match key:
  - same `store_id`
  - same `conversation_id`
  - same normalized final reply text
  - within action window

## Suppression behavior
- Return payload includes:
  - `action = duplicate_outbound_suppressed`
  - `shouldSend = false`
- System event logged: `Duplicate outbound suppressed`.

## Impact
- Reduces repeated identical outbound text across different inbound IDs.
