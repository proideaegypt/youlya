#!/usr/bin/env bash
set -euo pipefail

DATE_UTC="$(date +%F)"
TASK_DIR="qa-artifacts/tasks/${DATE_UTC}/phase-e-deploy-automation-and-build-identity/verify"
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
  npm install
fi

run_step() {
  local name="$1"
  shift
  echo "Running: ${name}" | tee -a "${RESULT_FILE}"
  "$@" >> "${RESULT_FILE}" 2>&1
  echo "PASS: ${name}" | tee -a "${RESULT_FILE}"
}

run_step "typecheck" npm run typecheck
run_step "lint" npm run lint
run_step "unit-tests" npm test
run_step "validate-scenarios" npm run validate:scenarios
if npm run | grep -q "scan:secrets"; then
  run_step "scan-secrets" npm run scan:secrets
fi
run_step "build" npm run build

if [ -f Dockerfile ] && command -v docker >/dev/null 2>&1; then
  run_step "docker-build" docker build -t youlya-app:verify .
fi

echo "" >> "${RESULT_FILE}"
echo "## Summary" >> "${RESULT_FILE}"
echo "- Verification status: PASS" >> "${RESULT_FILE}"

echo "verify-before-deploy completed successfully"
