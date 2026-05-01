# TLS Certificate Renewal (admin.youlya365.com)

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
systemctl reload nginx
```

## Issue a new certificate for admin.youlya365.com

```bash
certbot --nginx -d admin.youlya365.com
systemctl reload nginx
```

## TLS validation rule

- Do not use `curl -k` as production success criteria.
- Production health must pass with valid TLS:

```bash
curl -fsS https://admin.youlya365.com/api/health
curl -fsS https://admin.youlya365.com/api/build-info
```
