#!/usr/bin/env bash
# TODO: Add terraform if we think it's worth it

set -o errexit
set -o nounset
shopt -u dotglob


if [ $# -lt 2 ]; then
    echo "⚡ Usage: ./create_webapp <WEBAPP_NAME> <PORT>"
    exit 1
fi

WEBAPP_NAME=$1
WEBAPP_PORT=$2
PROJECT_ROOT_DIR="$( git rev-parse --show-toplevel )"
WEBAPP_DIR="$WEBAPP_NAME/webapp"

# We start in the root as we want symlinks to be relative
pushd $PROJECT_ROOT_DIR
  mkdir -p "$WEBAPP_DIR"
  pushd $WEBAPP_DIR
    for filename in ../../.scripts/webapp/development/*
      do
        ln -sf $filename $(basename $filename)
      done

    # We copy prod files so they can be edited, and also work with babel etc
    for filename in ../../.scripts/webapp/production/*
      do
        cp -Xf "$filename" $(basename $filename)
        sed -i '' "s/{WEBAPP_PORT}/$WEBAPP_PORT/g" $(basename $filename)
      done

    # Static assets for dev
    ln -s ../../dist/assets/ ./static

    # Let's get going
    yarn
  popd
popd

