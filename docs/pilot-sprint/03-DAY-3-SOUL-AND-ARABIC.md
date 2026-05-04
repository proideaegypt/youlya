# Day 3 - Soul and Arabic

## Goal

Restore Haidi as a safe conversational layer that improves tone, warmth, and Arabic quality without taking over commerce decisions.

## Correct architecture

- Haidi = conversation soul, tone, memory, recommendations, upsell language.
- Youlya app = product truth, variant mapping, cart, confirmation, Shopify safety.
- n8n = orchestration and transport.
- Shopify = source of truth.
- Supabase = operational cache.

## Forbidden behavior

- Haidi must not create Shopify orders directly.
- Haidi must not resolve product indexes from memory.
- Haidi must not invent prices, stock, or SKUs.
- Haidi must not bypass the app safety gate.
- Haidi must not become the product catalog, the order system, or the confirmation authority.

## Safe implementation posture

- Keep app-approved facts as the only commerce facts.
- Let Haidi rewrite the reply, not the business decision.
- Keep the validator in place so unsafe order claims are blocked.
- If the app does not know the answer, Haidi should ask for clarification or hand off.

## Current repo notes

- Haidi draft prompt and memory design docs already exist in the repo.
- Draft workflow files exist, but they are not active production paths.
- These drafts should be treated as work-in-progress until safety validation passes.
