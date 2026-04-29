# Package Fix — Root CLAUDE.md Added

Date: 2026-04-28

## Issue

The previous ZIP included the Claude operating contract as `docs/04_CLAUDE.md`, but did not include a root-level `CLAUDE.md`. Some Claude Code workflows and reviewers expect `CLAUDE.md` at the project root.

## Fix

- Added root-level `CLAUDE.md`.
- Kept `docs/04_CLAUDE.md` as the numbered docs copy.
- Updated `START_HERE_FOR_CODEX.md` read order to include `CLAUDE.md` first.
- Updated `MANIFEST.md`.

## Validation

- Confirmed root `CLAUDE.md` exists.
- Confirmed docs mirror `docs/04_CLAUDE.md` exists.
- Re-ran scenario validation and secret scan.
