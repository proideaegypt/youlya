#!/usr/bin/env bash
set -euo pipefail

LOCK_FILE="/tmp/youlya-deploy-watch.lock"
exec 8>"${LOCK_FILE}"
if ! flock -n 8; then
  echo "Watcher already running. Exiting."
  exit 1
fi

DATE_UTC="$(date +%F)"
TASK_DIR="qa-artifacts/tasks/${DATE_UTC}/phase-e-pull-based-vps-deploy-agent/watch"
mkdir -p "${TASK_DIR}"

BRANCH="${DEPLOY_BRANCH:-main}"
LOCAL_HEAD="$(git rev-parse HEAD)"

echo "[$(date -Iseconds)] Local HEAD: ${LOCAL_HEAD}"

git fetch origin "${BRANCH}" --tags
REMOTE_HEAD="$(git rev-parse "origin/${BRANCH}")"

echo "[$(date -Iseconds)] Remote HEAD: ${REMOTE_HEAD}"

if [ "${LOCAL_HEAD}" = "${REMOTE_HEAD}" ]; then
  echo "No new commit"
  exit 0
fi

echo "[$(date -Iseconds)] New commit detected. Pulling and deploying..."
git pull --ff-only origin "${BRANCH}"

if bash ./scripts/deploy-production.sh; then
  mkdir -p .deploy
  echo "${REMOTE_HEAD}" > .deploy/last-successful-commit
  echo "[$(date -Iseconds)] Deploy succeeded at ${REMOTE_HEAD}"
else
  FAIL_FILE="${TASK_DIR}/FAIL-$(date +%H%M%S).md"
  {
    echo "# Watch Deploy Failure"
    echo "- time: $(date -Iseconds)"
    echo "- branch: ${BRANCH}"
    echo "- local_before: ${LOCAL_HEAD}"
    echo "- remote: ${REMOTE_HEAD}"
    echo "- deploy_result: failed"
  } > "${FAIL_FILE}"
  echo "[$(date -Iseconds)] Deploy failed. See ${FAIL_FILE}"
  exit 1
fi
