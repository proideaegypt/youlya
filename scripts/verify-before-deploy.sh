#!/usr/bin/env bash
set -euo pipefail

DATE_UTC="$(date +%F)"
TASK_DIR="qa-artifacts/tasks/${DATE_UTC}/phase-e-pull-based-vps-deploy-agent/verify"
RESULT_FILE="${TASK_DIR}/RESULT.md"
mkdir -p "${TASK_DIR}"

BRANCH="$(git branch --show-current 2>/dev/null || echo unknown)"
COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

{
  echo "# Verify Before Deploy"
  echo
  echo "- Date: ${DATE_UTC}"
  echo "- Branch: ${BRANCH}"
  echo "- Commit: ${COMMIT}"
  echo
} > "${RESULT_FILE}"

if [ ! -d node_modules ]; then
  npm ci
fi

run_step() {
  local name="$1"
  shift
  echo "Running: ${name}" | tee -a "${RESULT_FILE}"
  "$@" >> "${RESULT_FILE}" 2>&1
  echo "PASS: ${name}" | tee -a "${RESULT_FILE}"
}

run_step_no_output() {
  local name="$1"
  shift
  echo "Running: ${name}" | tee -a "${RESULT_FILE}"
  "$@" >/dev/null 2>&1
  echo "PASS: ${name}" | tee -a "${RESULT_FILE}"
}

if npm run | grep -q "check:env:tracking"; then
  run_step "check-env-tracking" npm run check:env:tracking
fi
if npm run | grep -q "check:env:production"; then
  run_step "check-env-production" npm run check:env:production
fi
run_step "typecheck" npm run typecheck
run_step "lint" npm run lint
run_step "unit-tests" npm test
run_step "validate-scenarios" npm run validate:scenarios
if npm run | grep -q "scan:secrets"; then
  run_step "scan-secrets" npm run scan:secrets
fi

if npm run | grep -q "verify:release"; then
  run_step "verify-release" npm run verify:release
fi
run_step "build" npm run build

COMPOSE_PATH="${COMPOSE_FILE:-docker-compose.yml}"
if [ -f "${COMPOSE_PATH}" ] && command -v docker >/dev/null 2>&1; then
  COMPOSE_ENV_ARGS=()
  if [ -n "${COMPOSE_ENV_FILE:-}" ] && [ -f "${COMPOSE_ENV_FILE}" ]; then
    COMPOSE_ENV_ARGS=(--env-file "${COMPOSE_ENV_FILE}")
  elif [ -f ".env" ]; then
    COMPOSE_ENV_ARGS=()
  elif [ -f ".env.production" ]; then
    COMPOSE_ENV_ARGS=(--env-file ".env.production")
  elif [ -f ".env.local" ]; then
    COMPOSE_ENV_ARGS=(--env-file ".env.local")
  fi

  # Avoid leaking resolved env vars into qa artifacts/logs.
  run_step_no_output "docker-compose-config" docker compose "${COMPOSE_ENV_ARGS[@]}" -f "${COMPOSE_PATH}" config
  run_step "docker-compose-build" docker compose "${COMPOSE_ENV_ARGS[@]}" -f "${COMPOSE_PATH}" build
elif [ -f Dockerfile ] && command -v docker >/dev/null 2>&1; then
  run_step "docker-build" docker build -t youlya-app:verify .
fi

echo "" >> "${RESULT_FILE}"
echo "## Summary" >> "${RESULT_FILE}"
echo "- Verification status: PASS" >> "${RESULT_FILE}"

echo "verify-before-deploy completed successfully"
