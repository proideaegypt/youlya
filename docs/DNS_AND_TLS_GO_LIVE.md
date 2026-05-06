# DNS and TLS Go-Live Checklist

## Required DNS record

- `admin.nex-lnk.online` must resolve to the VPS public IPv4.
- Current expected IPv4 for this VPS: `109.199.121.20`.

Example target:

```text
admin.nex-lnk.online -> 109.199.121.20
```

A CNAME/proxy setup is acceptable only if it terminates TLS correctly for `admin.nex-lnk.online` and forwards to this VPS.

## Propagation check

After DNS changes, wait for propagation and verify:

```bash
getent hosts admin.nex-lnk.online
nslookup admin.nex-lnk.online
```

## TLS readiness check

When DNS resolves correctly, run:

```bash
npm run check:tls
```

Do not use `curl -k` for production success checks.

## If TLS still fails

Follow `docs/TLS_CERTIFICATE_RENEWAL.md`.

If your setup uses Apache + certbot on this VPS (current production setup), use:

```bash
certbot certificates
certbot certonly --apache --cert-name admin.nex-lnk.online -d admin.nex-lnk.online --force-renewal
apachectl configtest
systemctl reload apache2
npm run check:tls
```

If your setup uses nginx and certbot on this VPS, typical commands are:

```bash
certbot certificates
certbot renew --dry-run
certbot renew
systemctl reload nginx
```

If issuing a new cert with nginx integration:

```bash
certbot --nginx -d admin.nex-lnk.online
systemctl reload nginx
```

## Current live note (2026-05-01)

- `admin.nex-lnk.online` is terminated by Apache on this VPS.
- Dedicated certificate path: `/etc/letsencrypt/live/admin.nex-lnk.online/`.
- Apache vhost file: `/etc/apache2/sites-available/admin.nex-lnk.online.conf`.
