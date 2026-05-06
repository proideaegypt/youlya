## N8nWorkflow RESULT
Status: FAIL

### Active workflow issues
- The canonical workflow validates cleanly, but it contains business-logic code nodes, not orchestration only.
- The active workflow hardcodes `store_id: "youlya"` in the normalize step.

### Loop guard status
- The `fromMe` guard exists and returns an empty result for outgoing messages.

### Send Text correctness
- `Send Text` uses env refs and JSON body serialization correctly.

### Secret hygiene
- `validate:n8n` reported no hardcoded secrets in the canonical or sync workflows.
- The raw-export quarantine check passed.

### Env var completeness
- Required env references are present in the canonical workflow.

### Findings
- P1: workflow business logic is too heavy for the orchestration layer.
- P1: store scope is hardcoded in the workflow.
