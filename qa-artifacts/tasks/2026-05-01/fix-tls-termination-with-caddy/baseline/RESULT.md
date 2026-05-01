# Baseline — fix-tls-termination-with-caddy

- Date: 2026-05-01
- Host: vmi2942438.contaboserver.net
- User: root
- Branch/Commit: main @ f19455a

## Listener summary
- Port 80: apache2 active listener
- Port 443: apache2 active listener
- Port 3000: Next server process active
- Port 9443: Portainer active
- Port 8080: Evolution API active

## Reverse proxy discovery
- Existing reverse proxy FOUND: Apache (`apache2.service` active/running)
- Nginx: not installed/running
- Caddy: not installed/running

## Docker summary
- Multiple production containers active (Supabase stack, Portainer, n8n, Evolution)
- Existing app compose file: `docker-compose.yml` (service `youlya-app`)

## TLS status summary
- DNS resolves: `admin.youlya365.com -> 109.199.121.20`
- `curl -Iv https://admin.youlya365.com` fails with expired certificate
- `certbot certificates` shows `youlya365.com` cert (includes `admin.youlya365.com`) is expired

## Recommended strategy
- Do NOT add Caddy on 80/443 while Apache is active.
- Repair existing Apache + certbot certificate path for `admin.youlya365.com` safely.
