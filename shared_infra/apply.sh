#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ $# -lt 1 ]; then
    echo "⚡ Usage: apply.sh"
    exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd "$DIR/terraform"
  echo "Applying plan ... Terraforming"

  if [ -e "terraform.plan" ]
  then
    terraform apply terraform.plan
    rm -f "terraform.plan"
  else
    echo "No terraform.plan found!"
    exit 1
  fi
popd

echo "Applied $CONTAINER_TAG."
