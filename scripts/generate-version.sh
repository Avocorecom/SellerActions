#!/usr/bin/env bash
#
# scripts/generate-version.sh
#
# Stamps the version + commit SHA into js/app.js for local testing.
# Mirrors the deploy.yml workflow logic so what you see locally matches
# what GitHub Pages serves.
#
# Format: v{major}.{minor}.{commitCount} · {shortSha}
#   - major.minor come from the VERSION file (single source of truth)
#   - commitCount = `git rev-list --count HEAD` (auto-increments per commit)
#   - shortSha    = `git rev-parse --short HEAD`
#
# Usage:
#   bash scripts/generate-version.sh        # stamp
#   git checkout js/app.js                  # restore placeholders
#
# WARNING: This modifies js/app.js in place. Don't commit those changes —
# the placeholders __VERSION__ / __COMMIT__ are the canonical source-of-truth
# in git, and deploy.yml replaces them at deploy time.

set -e
cd "$(dirname "$0")/.."

if [ ! -f VERSION ]; then
  echo "ERROR: VERSION file missing at repo root." >&2
  exit 1
fi

BASE_VERSION=$(tr -d '[:space:]' < VERSION)
BASE_MAJOR_MINOR=$(echo "$BASE_VERSION" | cut -d. -f1,2)

if git rev-parse --git-dir > /dev/null 2>&1; then
  COMMIT_COUNT=$(git rev-list --count HEAD)
  COMMIT_SHORT=$(git rev-parse --short HEAD)
else
  COMMIT_COUNT="0"
  COMMIT_SHORT="local"
fi

SITE_VERSION="v${BASE_MAJOR_MINOR}.${COMMIT_COUNT}"

# macOS BSD sed needs `-i ''`; GNU sed needs `-i` only. Detect and adapt.
if sed --version 2>/dev/null | grep -q GNU; then
  SED_INPLACE=("sed" "-i")
else
  SED_INPLACE=("sed" "-i" "")
fi

"${SED_INPLACE[@]}" "s/__VERSION__/${SITE_VERSION}/g" js/app.js
"${SED_INPLACE[@]}" "s/__COMMIT__/${COMMIT_SHORT}/g" js/app.js

echo "Stamped: ${SITE_VERSION} · ${COMMIT_SHORT}"
echo "To restore placeholders: git checkout js/app.js"
