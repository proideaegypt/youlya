#!/usr/bin/env bash
set -euo pipefail

LOCK_FILE="/tmp/youlya-deploy.lock"
exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "Deploy already running. Exiting."
  exit 1
fi

DATE_UTC="$(date +%F)"
TASK_DIR="qa-artifacts/tasks/${DATE_UTC}/phase-e-pull-based-vps-deploy-agent/deploy"
RESULT_FILE="${TASK_DIR}/RESULT.md"
mkdir -p "${TASK_DIR}"

BRANCH="${DEPLOY_BRANCH:-main}"
CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || echo unknown)"
COMPOSE_PATH="${COMPOSE_FILE:-docker-compose.yml}"
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

{
  echo "# Deploy Production (Pull-Based)"
  echo
  echo "- Date: ${DATE_UTC}"
  echo "- Requested branch: ${BRANCH}"
  echo "- Current branch: ${CURRENT_BRANCH}"
  echo "- Compose file: ${COMPOSE_PATH}"
  echo "- Compose env source: ${COMPOSE_ENV_FILE:-auto-detect}"
} > "${RESULT_FILE}"

if [ "${CURRENT_BRANCH}" != "${BRANCH}" ]; then
  echo "Branch mismatch: current=${CURRENT_BRANCH}, required=${BRANCH}" | tee -a "${RESULT_FILE}"
  exit 1
fi

if [ "${SKIP_VERIFY:-false}" != "true" ]; then
  bash scripts/verify-before-deploy.sh
fi

git fetch --all --tags >> "${RESULT_FILE}" 2>&1
git pull --ff-only origin "${BRANCH}" >> "${RESULT_FILE}" 2>&1

npm run build:info >> "${RESULT_FILE}" 2>&1

if [ ! -f "${COMPOSE_PATH}" ]; then
  echo "Compose file not found: ${COMPOSE_PATH}" | tee -a "${RESULT_FILE}"
  exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "docker command not available" | tee -a "${RESULT_FILE}"
  exit 1
fi

docker compose "${COMPOSE_ENV_ARGS[@]}" -f "${COMPOSE_PATH}" build >> "${RESULT_FILE}" 2>&1
docker compose "${COMPOSE_ENV_ARGS[@]}" -f "${COMPOSE_PATH}" up -d >> "${RESULT_FILE}" 2>&1

HEALTH_RESULT="skipped"
BUILD_INFO_RESULT="skipped"
if [ -n "${APP_URL:-}" ]; then
  curl -fsS "${APP_URL}/api/health" >> "${RESULT_FILE}" 2>&1
  HEALTH_RESULT="pass"
  curl -fsS "${APP_URL}/api/build-info" >> "${RESULT_FILE}" 2>&1
  BUILD_INFO_RESULT="pass"
fi

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
VERSION="$(node -p "require('./package.json').version" 2>/dev/null || echo unknown)"
TAG="$(git tag --points-at HEAD | head -1 || true)"

{
  echo
  echo "## Summary"
  echo "- deployed commit: ${COMMIT}"
  echo "- version: ${VERSION}"
  echo "- compose file used: ${COMPOSE_PATH}"
  echo "- tag: ${TAG:-none}"
  echo "- health result: ${HEALTH_RESULT}"
  echo "- build-info result: ${BUILD_INFO_RESULT}"
  echo "- deploy result: PASS"
} >> "${RESULT_FILE}"

echo "deploy-production completed successfully"
