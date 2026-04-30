#!/usr/bin/env bash
set -euo pipefail

DATE_UTC="$(date +%F)"
TASK_DIR="qa-artifacts/tasks/${DATE_UTC}/phase-e-deploy-automation-and-build-identity/deploy"
RESULT_FILE="${TASK_DIR}/RESULT.md"
mkdir -p "${TASK_DIR}"

BRANCH="${DEPLOY_BRANCH:-main}"
CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || echo unknown)"

{
  echo "# Deploy Production"
  echo
  echo "- Date: ${DATE_UTC}"
  echo "- Requested branch: ${BRANCH}"
  echo "- Current branch: ${CURRENT_BRANCH}"
} > "${RESULT_FILE}"

if [ "${CURRENT_BRANCH}" != "${BRANCH}" ]; then
  echo "Branch mismatch: current=${CURRENT_BRANCH}, required=${BRANCH}" | tee -a "${RESULT_FILE}"
  exit 1
fi

bash scripts/verify-before-deploy.sh

git fetch --all --tags >> "${RESULT_FILE}" 2>&1
git pull --ff-only origin "${BRANCH}" >> "${RESULT_FILE}" 2>&1

npm run build:info >> "${RESULT_FILE}" 2>&1

DEPLOY_STRATEGY="none"

if [ -n "${PORTAINER_WEBHOOK_URL:-}" ]; then
  DEPLOY_STRATEGY="portainer-webhook"
  echo "Deploy strategy: ${DEPLOY_STRATEGY}" | tee -a "${RESULT_FILE}"
  curl -fsS -X POST "${PORTAINER_WEBHOOK_URL}" >/dev/null
  sleep 10
elif [ -f docker-compose.yml ] && command -v docker >/dev/null 2>&1; then
  DEPLOY_STRATEGY="docker-compose"
  echo "Deploy strategy: ${DEPLOY_STRATEGY}" | tee -a "${RESULT_FILE}"
  docker compose pull || true
  docker compose build
  docker compose up -d
elif command -v pm2 >/dev/null 2>&1; then
  DEPLOY_STRATEGY="pm2"
  echo "Deploy strategy: ${DEPLOY_STRATEGY}" | tee -a "${RESULT_FILE}"
  pm2 restart all
else
  echo "No deployment strategy detected (no PORTAINER_WEBHOOK_URL, no docker compose, no pm2)" | tee -a "${RESULT_FILE}"
  exit 1
fi

if [ -n "${APP_URL:-}" ]; then
  curl -fsS "${APP_URL}/api/health" >> "${RESULT_FILE}" 2>&1
  curl -fsS "${APP_URL}/api/build-info" >> "${RESULT_FILE}" 2>&1
  echo "Health/build-info checks: PASS" | tee -a "${RESULT_FILE}"
else
  echo "APP_URL missing; skipped health/build-info checks" | tee -a "${RESULT_FILE}"
fi

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
VERSION="$(node -p "require('./package.json').version" 2>/dev/null || echo unknown)"
TAG="$(git tag --points-at HEAD | head -1 || true)"

{
  echo
  echo "## Summary"
  echo "- commit deployed: ${COMMIT}"
  echo "- version: ${VERSION}"
  echo "- tag: ${TAG:-none}"
  echo "- deploy strategy: ${DEPLOY_STRATEGY}"
  echo "- deploy result: PASS"
} >> "${RESULT_FILE}"

echo "deploy-production completed successfully"
