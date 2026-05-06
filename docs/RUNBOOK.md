# Youlya Operations Runbook

Last updated: 2026-05-06

## Emergency Contacts

- **Ahmed (Owner)**: Primary decision maker for deploys, approvals, and kill switch.
- **Claude Code**: Automated agent for code changes, validation, and deployment.

---

## 1. Daily Health Checks

```bash
# 1. App health
curl -fsS https://admin.nex-lnk.online/api/health

# 2. Build info
curl -fsS https://admin.nex-lnk.online/api/build-info

# 3. TLS certificate
certbot certificates

# 4. Container status
docker compose ps

# 5. Disk space
df -h
```

**Expected**: All containers `healthy`, TLS valid, disk < 80%.

---

## 2. How to Deploy

```bash
# Step 1: Pull latest code
git pull origin main

# Step 2: Run full validation
npm run verify:release
npm run verify:deploy

# Step 3: Deploy
npm run deploy:production

# Step 4: Verify live
curl -fsS https://admin.nex-lnk.online/api/health
curl -fsS https://admin.nex-lnk.online/api/build-info
```

**Never deploy if verify:deploy fails.**

---

## 3. How to Rollback

```bash
# Step 1: Find previous working commit
git log --oneline -10

# Step 2: Checkout last known good commit
git checkout <commit-hash>

# Step 3: Rebuild and redeploy
npm run build
SKIP_VERIFY=true npm run deploy:production

# Step 4: Verify health
curl -fsS https://admin.nex-lnk.online/api/health
```

---

## 4. Kill Switch / Emergency Freeze

### Freeze WhatsApp AI immediately:

1. Open dashboard: `https://admin.nex-lnk.online/dashboard/pilot`
2. Click **"إيقاف Haidi"** (Pause Haidi)
3. Click **"إيقاف الطلبات"** (Pause Orders)
4. Confirm: AI will stop replying to new messages.

### Unfreeze:

1. Click **"تشغيل Haidi"** (Resume Haidi)
2. Click **"تشغيل الطلبات"** (Resume Orders)

---

## 5. Evolution WhatsApp Issues

### Problem: WhatsApp messages not sending

```bash
# Check Evolution API health
curl -H "apikey: $EVOLUTION_API_KEY" $EVOLUTION_API_URL/instance/fetchInstances

# Check connection state
curl -H "apikey: $EVOLUTION_API_KEY" $EVOLUTION_API_URL/instance/connectionState/$EVOLUTION_INSTANCE
```

### Problem: Webhook not reaching app

```bash
# Test webhook locally
curl -X POST https://admin.nex-lnk.online/api/webhooks/evolution \
  -H "Content-Type: application/json" \
  -d '{"data":{"key":{"remoteJid":"201000000000@s.whatsapp.net","fromMe":false},"message":{"conversation":"test"}}}'
```

**Must return**: `{"action":"ignored","reason":"not inbound message"}` or processed result.

---

## 6. Order Issues

### Problem: Orders not creating

1. Check kill switch: Is order creation paused?
2. Check Shopify API key: Is `SHOPIFY_ADMIN_API_KEY` valid?
3. Check idempotency: Duplicate requests are ignored.
4. Check owner approval gate: Live orders require `OWNER_APPROVAL_MODE=live`.

### Problem: Too many orders too fast

- Hourly cap: **30 orders per store**.
- If cap hit, orders route to owner approval automatically.
- Check logs for `"order_cap_exceeded"`.

---

## 7. Database / Supabase

### Check table health

```bash
# Connect via pooler
psql $DATABASE_URL -c "SELECT count(*) FROM conversation_state;"
psql $DATABASE_URL -c "SELECT count(*) FROM human_handoffs WHERE resolved_at IS NULL;"
```

### Emergency: Reset conversation state for a customer

```bash
# Use Supabase dashboard or SQL
UPDATE conversation_state SET stage = 'greeting' WHERE conversation_id = '201xxxxxxxx@s.whatsapp.net';
```

---

## 8. Logs

```bash
# App logs
docker logs --tail=200 youlya-youlya-app-1

# Follow logs
docker logs -f youlya-youlya-app-1

# Search for errors
docker logs youlya-youlya-app-1 2>&1 | grep -i error
```

**Log rotation**: Docker logs are capped at 50MB × 5 files (config in `docker-compose.yml`).

---

## 9. Security Incidents

### Suspicious webhook activity

```bash
# Check for repeated failed tokens
docker logs youlya-youlya-app-1 2>&1 | grep "invalid token"
```

### Rotate secrets

1. Update `.env.production` with new secrets.
2. Run `docker compose up -d` to reload.
3. **Do NOT commit `.env.production` to git.**

---

## 10. Contact Escalation

| Issue | First Action | Escalate If |
|-------|-----------|-------------|
| App down | Check `docker compose ps`, restart container | Still down after 10 min |
| Orders failing | Check kill switch + Shopify credentials | >5 customers affected |
| WhatsApp down | Check Evolution API health | Evolution API returns 500 |
| Security breach | Rotate secrets, freeze AI | Evidence of data exfiltration |

---

*This runbook is living documentation. Update it after every incident.*
