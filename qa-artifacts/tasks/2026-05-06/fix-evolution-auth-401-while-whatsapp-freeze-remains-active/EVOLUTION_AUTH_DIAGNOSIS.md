# Evolution Auth Diagnosis

## Initial failure
- `GET /instance/fetchInstances` returned `401 Unauthorized` on public/local when using app runtime key.

## Safe probe matrix (non-send endpoints)
- Tested base URLs:
  - `http://127.0.0.1:8080`
  - `https://evo.nex-lnk.online`
- Tested headers:
  - none
  - `apikey`
  - `Authorization: Bearer ...`
  - `x-api-key`

## Verified auth contract
- Working header: `apikey`
- Rejected headers: `x-api-key`, `Authorization: Bearer`
- Working endpoints after fix:
  - `GET /instance/fetchInstances` => `200`
  - `GET /instance/connectionState/AI` => `200`

## Root cause
- App runtime used mismatched API key and wrong instance name.
- Evolution auth key and n8n key were aligned; app was out-of-sync.

## Remediation
- Updated app runtime env source to aligned key and `EVOLUTION_INSTANCE=AI`.
- Restarted app container only.
- Re-tested safe endpoints: PASS.
