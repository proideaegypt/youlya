# TLS Certificate Renewal (admin.nex-lnk.online)

Production domain: `admin.nex-lnk.online` → VPS `109.199.121.20`
Reverse proxy: Apache2 (not nginx)
Certificate: `/etc/letsencrypt/live/nex-lnk-online-services/` (SAN covers admin, ai, evo, port subdomains)
Cert expires: 2026-08-03

Use these commands on the VPS to inspect and renew certificates safely.

## Check current certificate status

```bash
certbot certificates
```

## Dry-run renewal

```bash
certbot renew --dry-run
```

## Renew active certificates

```bash
certbot renew
systemctl reload apache2
```

## Issue a new certificate (if needed)

```bash
certbot --apache -d admin.nex-lnk.online -d ai.nex-lnk.online -d evo.nex-lnk.online -d port.nex-lnk.online
systemctl reload apache2
```

## TLS validation rule

- Do not use `curl -k` as production success criteria.
- Production health must pass with valid TLS:

```bash
npm run check:tls
curl -fsS https://admin.nex-lnk.online/api/health
curl -fsS https://admin.nex-lnk.online/api/build-info
```
