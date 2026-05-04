# Emergency Rollback

## Default rollback order

1. Trigger the kill switch.
2. Roll back deploy to the last known good tag or image.
3. Revert the commit if needed.
4. Use force-push only with explicit owner approval and documentation.
5. Keep the current live workflow inactive only if the owner explicitly requests that state.

## What to avoid

- Do not use force-push as the normal rollback procedure.
- Do not use destructive cleanup commands on production state.
- Do not delete workflow history unless the owner explicitly approves it.
- Do not skip the kill switch when a production commerce path is implicated.

## Rollback goal

Return to a safe, known-good production state with the least possible side effects.
