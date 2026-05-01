# Baseline — add-release-governance-versioning-rule

- Current package version: `2.0.1`
- Current README release/version section status:
  - Has release notes and target tag text
  - Missing strict standardized `Current Release` table block near top
- Existing RELEASES files:
  - RELEASES/.gitkeep
  - RELEASES/auth-middleware-and-store-context.md
  - RELEASES/db-product-mapping-repository.md
  - RELEASES/deploy-automation-build-identity.md
  - RELEASES/product-mapping-core.md
  - RELEASES/pull-based-vps-deploy-agent.md
  - RELEASES/shopify-cod-order-creation.md
- Current git branch/commit:
  - branch: `main`
  - commit: `f19455a feat: pull-based VPS deploy agent (no webhook)`

## Missing governance pieces
- No automated release bump/task script enforcing version + versionName + release file.
- No automated release verification script enforcing package/README/release file consistency.
- No mandatory release verification hook in deploy verification script.
- Agent governance docs do not enforce a hard execution sequence for release scripts.
