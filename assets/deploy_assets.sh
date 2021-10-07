#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o verbose

ROOT="$(git rev-parse --show-toplevel)"
ASSETS="$ROOT/assets"

aws s3 cp "$ASSETS/humans.txt" s3://i.wellcomecollection.org/humans.txt
aws s3 cp "$ASSETS/robots.txt" s3://i.wellcomecollection.org/robots.txt

aws s3 sync "$ASSETS/fonts" s3://i.wellcomecollection.org/assets/fonts
aws s3 sync "$ASSETS/icons" s3://i.wellcomecollection.org/assets/icons
aws s3 sync "$ASSETS/images" s3://i.wellcomecollection.org/assets/images
