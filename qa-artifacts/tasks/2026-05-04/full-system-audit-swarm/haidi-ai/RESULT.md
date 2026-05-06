## HaidiAI RESULT
Status: PARTIAL

### Prompt safety issues
- The prompt/validator pair is broadly aligned with the safety contract.
- Unsafe order confirmation claims are blocked unless the app action is `order_created`.

### Context builder issues
- The context builder keeps internal IDs out of the customer-facing reply path.
- It carries blocked reasons and product facts into the validator path.

### Output validator gaps
- No blocking gap was confirmed in the inspected validator tests.

### Workflow activation status
- The canonical WhatsApp workflow includes the Haidi validator path.
- The draft Haidi workflow remains inactive.

### Test coverage gaps
- The audit did not re-run the Haidi unit suite beyond the existing verified results.

### Findings
- The Haidi safety layer looks substantially better than the core commerce paths.
- The remaining risk is workflow architecture drift, not prompt-output validation.
