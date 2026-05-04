# Day 4 - Voice and Image Polish

## Goal

Handle voice and image messages safely without turning them into automatic order authority.

## Voice rule

- Voice must go through transcription first.
- If transcription is unclear, ask the customer to type the message.
- No order can be created from raw voice alone.
- Explicit confirmation is still required after the app safety gate.
- Voice is only a transport input; the app still owns the commerce decision.

## Image rule

- Image and caption can help product discovery.
- Do not claim a visual match unless the app has supported facts.
- No order can be created from an image alone.
- If the image is ambiguous, ask for text clarification.
- Image analysis can suggest candidates, but it cannot fabricate a SKU, price, or variant match.

## Safe conversation flow

- Voice/image -> normalize -> app safety gate -> Haidi tone layer -> reply.
- The app still owns product truth, cart state, shipping, and confirmation.
