# EVOLUTION AUDIT

## Container Status

| Field | Value |
|---|---|
| Container Name | evolution_api |
| Image | evoapicloud/evolution-api:latest |
| Uptime | 15 hours |
| Ports | 0.0.0.0:8080->8080 |
| Version | 2.3.7 |
| WhatsApp Web Version | 2.3000.1038716119 |

## Environment

- `SERVER_PORT=8080`
- `SERVER_URL=http://localhost:8080`
- `AUTHENTICATION_API_KEY` = SET (container internal key)
- `CONFIG_SESSION_PHONE_CLIENT=Evolution API`

## Instance Discovery

| Check | Result |
|---|---|
| `/instance/list` | 404 Not Found |
| `/instance/fetchInstances` | Empty response |
| `/instance/AI/state` | Empty response |
| `/instance/AI/status` | Empty response |
| Container logs instance name | `[AI]` confirmed |

## Instance State from Logs

```
[Evolution API] [AI] v2.3.7 ERROR [ChannelStartupService] [object]
PrismaClientKnownRequestError:
Invalid `a.integrationSession.update()` invocation in
/evolution/dist/main.js:174:12555
```

## n8n → Evolution Configuration

| Field | Value |
|---|---|
| EVOLUTION_API_URL | SET |
| EVOLUTION_API_KEY | SET |
| EVOLUTION_INSTANCE | AI |
| Send Text URL | `={{$env.EVOLUTION_API_URL}}/message/sendText/{{$env.EVOLUTION_INSTANCE}}` |
| Send Text Header | `apikey: {{$env.EVOLUTION_API_KEY}}` |
| Send Text Body | `JSON.stringify({ number, text })` |

## Send Text Error (Execution 9526)

```
Request: POST https://evo.youlya365.com/message/sendText/AI
Body: {"number":"201000000000","text":"مرحبًا! هل ممكن توضحي لي أكثر..."}
Response: 500 - {"status":500,"error":"Internal Server Error","response":{"message":"Connection Closed"}}
```

## Assessment

- **P0 BLOCKER**: Instance "AI" cannot process sendText requests
- The HTTP 500 + "Connection Closed" indicates the WhatsApp Web connection inside Evolution is broken
- The Prisma error in `ChannelStartupService` suggests a database state corruption or connection loss
- The n8n → Evolution configuration is correct; the failure is entirely on the Evolution side

## Recommended Fix

1. Restart Evolution container: `docker restart evolution_api`
2. If restart fails, check Prisma migration state inside container
3. If still failing, recreate instance "AI" via Evolution Manager UI at `https://evo.youlya365.com/manager/`
4. Re-scan QR code if WhatsApp session was lost
5. Verify instance state shows `CONNECTED` before pilot
