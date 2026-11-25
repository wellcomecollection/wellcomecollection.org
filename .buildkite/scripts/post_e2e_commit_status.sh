#!/usr/bin/env bash
# Posts the combined desktop + mobile e2e outcome as a GitHub commit status.
set -euo pipefail

DESKTOP=$(buildkite-agent step get "outcome" --step "e2e-desktop")
MOBILE=$(buildkite-agent step get "outcome" --step "e2e-mobile")

if [[ "$DESKTOP" == "passed" && "$MOBILE" == "passed" ]]; then
  STATE="success"
else
  STATE="failure"
fi

# Pinned so a new upstream release cannot change this step's behaviour
python3 -m pip install --quiet --disable-pip-version-check \
  'pyjwt[crypto]==2.13.0' 'requests==2.34.2' 'boto3==1.43.89'

python3 .buildkite/scripts/post_e2e_commit_status.py \
  "$STATE" \
  "desktop: $DESKTOP, mobile: $MOBILE"
