# Pilot Sprint Playbook

This folder is the safe operational version of the pilot sprint playbook for the current Youlya repo.

## Current state

- The app is live at `https://admin.nex-lnk.online`.
- `Youlya WhatsApp Main` is active in n8n.
- Shopify remains the source of truth.
- Supabase is operational cache and app state.
- n8n is orchestration and conversation transport only.
- Haidi is being restored as a conversation layer, not as commerce authority.

## What this playbook is for

- Keep pilot work aligned with the current production state.
- Prevent unsafe assumptions from the original sprint notes.
- Provide scripts and rollback notes that do not expose secrets.

## What changed from the original draft

- Removed zero-state assumptions.
- Replaced real host/IP/secret references with placeholders where needed.
- Marked current blockers instead of pretending the pilot is ready for all customers.
- Kept the useful launch, voice, image, and rollback structure.
- Aligned the playbook with the current live state, including the existing dashboard, workflow guard, and hardened `Send Text` path.

## Folder map

- `00-MASTER-PLAYBOOK.md`
- `01-DAY-1-INFRASTRUCTURE.md`
- `02-DAY-2-DATA-INTEGRITY.md`
- `03-DAY-3-SOUL-AND-ARABIC.md`
- `04-DAY-4-VOICE-IMAGE-POLISH.md`
- `05-DAY-5-PILOT-LAUNCH.md`
- `06-SUPPORTING-MATERIALS.md`
- `08-EMERGENCY-ROLLBACK.md`
- `CURRENT-NEXT-ACTIONS.md`
