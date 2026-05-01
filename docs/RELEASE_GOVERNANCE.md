# Release Governance

## Mandatory rules

1. Every Codex task that changes code/docs must create a release.
2. `package.json` version is the version source of truth.
3. Version bump type:
- `patch`: fixes, docs, deploy scripts, hardening, tests
- `minor`: new user-visible feature or dashboard/API feature
- `major`: breaking production behavior, requires explicit user approval
4. Version name generation:
- from task slug
- remove prefixes: `phase-e-`, `phase-0-`, `phase-a-`, `phase-b-`, `phase-c-`, `phase-d-`, `fix-`, `feat-`
- convert to lowercase kebab-case
- example: `phase-e-pull-based-vps-deploy-agent` -> `pull-based-vps-deploy-agent`
5. Release file path format:
- `RELEASES/vX.Y.Z-version-name.md`
6. `README.md` must contain a **Current Release** section near the top.
7. `PROGRESS-LOG.md` and `worktime.md` must be updated.
8. Release verification must pass before push/deploy.

## Required flow per task

1. `npm run release:task -- --task "<task-slug>" --type patch|minor|major`
2. Fill generated release file with actual details.
3. `npm run verify:release`
4. If deployment is involved: `npm run verify:deploy`

If `verify:release` fails, task result is `PARTIAL` and push/deploy is blocked.
