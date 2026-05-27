#!/usr/bin/env bash
set -eo pipefail

# Runs the Prismic diff and records pass/fail as Buildkite metadata.
# This is intentionally non-blocking so deploys can continue when Prismic is unavailable.
run_diff() {
  if docker compose run -e CI prismic_model yarn diffCustomTypes; then
    buildkite-agent meta-data set prismic-diff-failed "no"
    echo "Prismic custom types diff passed."
  else
    buildkite-agent meta-data set prismic-diff-failed "yes"
    buildkite-agent annotate \
      "Prismic custom type diff failed. Deployment is non-blocking, but acknowledgement is required before continuing." \
      --style "warning" \
      --context "prismic-diff"
    echo "Prismic custom types diff failed. This is non-blocking, but will require acknowledgement."
  fi
}

# Checks metadata from run_diff and, if it failed, uploads a required
# Buildkite block step so a human must acknowledge before continuing.
upload_acknowledgement_block() {
  if [[ "$(buildkite-agent meta-data get prismic-diff-failed --default no)" != "yes" ]]; then
    echo "No Prismic diff acknowledgement needed."
    exit 0
  fi

  cat <<'YAML' | buildkite-agent pipeline upload
steps:
  - block: ":warning: Acknowledge Prismic diff failure"
    prompt: "Prismic custom type diff failed. Confirm you've checked and accepted this risk before deployment continues."
    fields:
      - text: "Acknowledged by"
        key: "prismic-diff-acknowledged-by"
      - text: "Reason for continuing"
        key: "prismic-diff-acknowledgement-reason"
YAML
}

# Dispatch based on the first argument:
# - run: execute the diff check
# - acknowledge: upload a manual acknowledgement block if needed
case "${1:-}" in
  run)
    run_diff
    ;;
  acknowledge)
    upload_acknowledgement_block
    ;;
  *)
    echo "Usage: $0 {run|acknowledge}"
    exit 1
    ;;
esac