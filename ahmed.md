MANDATORY RELEASE FOOTER:
Before final response, you MUST:
1. Run:
   npm run release:task -- --task "<this-task-slug>" --type patch
   Use minor only if this task adds a user-visible feature.
2. Fill the generated RELEASES/vX.Y.Z-version-name.md with actual changes.
3. Run:
   npm run verify:release
4. Run:
   npm run typecheck
   npm run lint
   npm test
   npm run validate:scenarios
   npm run scan:secrets
   npm run build
5. If deployment is involved:
   npm run verify:deploy
   npm run deploy:production only if verify passes.
6. If release verification fails, return PARTIAL and do not push/deploy.