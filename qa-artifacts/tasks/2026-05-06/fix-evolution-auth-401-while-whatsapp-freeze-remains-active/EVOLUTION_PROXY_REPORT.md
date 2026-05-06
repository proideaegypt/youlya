# Evolution Proxy Report

## Host routing
- Public Evolution domain: `evo.nex-lnk.online`
- Apache vhost proxies `443 -> http://127.0.0.1:8080` with:
  - `ProxyPass / http://127.0.0.1:8080/`
  - `ProxyPass /socket.io/ ws://127.0.0.1:8080/socket.io/`

## Header/path findings
- No evidence of path-prefix rewriting issue.
- No evidence that Apache strips `apikey` for Evolution API paths.
- Public and local behavior matched after key/instance correction.

## Conclusion
- Proxy not the primary root cause for 401.
- Main cause was runtime key/instance mismatch.
