#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o verbose

ROOT="$(git rev-parse --show-toplevel)"
ASSETS="$ROOT/assets"

aws s3 cp "$ASSETS/humans.txt" s3://i.wellcomecollection.org/humans.txt --acl public-read
aws s3 cp "$ASSETS/robots.txt" s3://i.wellcomecollection.org/robots.txt --acl public-read

aws s3 sync "$ASSETS/fonts" s3://i.wellcomecollection.org/assets/fonts --acl public-read
aws s3 sync "$ASSETS/icons" s3://i.wellcomecollection.org/assets/icons --acl public-read
aws s3 sync "$ASSETS/images" s3://i.wellcomecollection.org/assets/images --acl public-read
