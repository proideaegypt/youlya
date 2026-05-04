# Master Playbook

## Purpose

This playbook describes the safe pilot sprint path for Youlya in its current production state.

It is an operational guide, not a product reset.

## Current architecture

- `https://admin.youlya365.com` is the app/operator surface.
- `https://ai.youlya365.com` is the n8n orchestration surface.
- `https://evo.youlya365.com` is the Evolution transport surface.
- Shopify is the source of truth for products, variants, inventory, and orders.
- Supabase is the operational cache and state layer.
- n8n orchestrates only.
- Haidi is the conversational layer, not the commerce authority.

## Non-negotiable safety rules

- No order without explicit customer confirmation.
- No order without exact Shopify variant ID.
- No order from AI memory.
- No direct Shopify mutation from Haidi or n8n conversation logic.
- No live side effects in `testMode`.
- No duplicate order from duplicate webhook or repeated confirmation.
- Every mutation writes audit logs.
- Every AI/tool call writes AI tool logs.
- Every tenant query includes `store_id`.
- No secrets in docs, scripts, screenshots, or logs.

## What is already true

- Dashboard exists.
- Products dashboard exists.
- Shopify sync read-only proof passed.
- n8n runtime env exists.
- Product sync dry-run passed.
- Active WhatsApp workflow exists and is guarded against loop replies.
- `Send Text` JSON body handling has already been hardened and synthetic-tested.

## Current blockers

- Haidi safe conversation layer still needs final app-side integration.
- Real WhatsApp loop test still needs a manual pilot run.
- Evolution `sendText` must continue to be validated against live numbers.
- Audio and image support still need the safe pilot path.

## What this playbook is allowed to do

- Document the pilot flow.
- Provide safe scripts.
- Define launch gates.
- Define rollback order.
- Keep the architecture aligned with the current app and workflow split.

## What this playbook must not do

- It must not invent a new architecture.
- It must not pretend the repo is starting from zero.
- It must not authorize live Shopify order creation from a conversation layer.
- It must not introduce destructive rollback steps as the default.
- It must not re-open the outgoing reply loop guard or bypass the app safety gate.
