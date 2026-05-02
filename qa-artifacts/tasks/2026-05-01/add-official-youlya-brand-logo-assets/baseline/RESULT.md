# Baseline — add-official-youlya-brand-logo-assets

- Date: 2026-05-01
- Task: add-official-youlya-brand-logo-assets

## Current logo asset status
- Required target files already exist:
  - `public/brand/youlya-logo-light.jpeg`
  - `public/brand/youlya-logo-dark.jpeg`
- File type check:
  - light: JPEG, 225x225
  - dark: JPEG, 225x224

## Matching local image candidates found
- `public/brand/youlya-logo-light.jpeg`
- `public/brand/youlya-logo-dark.jpeg`

## Chosen source files
- Source and target are the same existing official brand paths under `public/brand/`.
- No conversion/upscale required.

## Plan
1. Keep existing official files in place and verify component mapping.
2. Run dashboard swarm + collector to validate no logo request failures.
3. Run full verification pipeline.
4. Execute release governance for patch version and deploy.
5. Update logs/artifacts and return final status.
