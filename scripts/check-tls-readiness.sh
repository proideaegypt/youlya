#!/usr/bin/env bash
set -euo pipefail

APP_URL="${APP_URL:-https://admin.youlya365.com}"

check_endpoint() {
  local endpoint="$1"
  local output
  if ! output="$(curl -fsS "${APP_URL}${endpoint}" 2>&1 >/dev/null)"; then
    if echo "${output}" | grep -qi "SSL certificate problem"; then
      echo "TLS certificate invalid/expired for ${APP_URL}" >&2
    else
      echo "TLS readiness check failed for ${APP_URL}: ${output}" >&2
    fi
    exit 1
  fi
}

check_endpoint "/api/health"
check_endpoint "/api/build-info"

echo "TLS readiness check passed for ${APP_URL}"
