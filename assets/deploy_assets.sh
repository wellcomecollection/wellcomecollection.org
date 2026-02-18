#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o verbose

ROOT="$(git rev-parse --show-toplevel)"
ASSETS="$ROOT/assets"

aws s3 cp "$ASSETS/humans.txt" s3://i.wellcomecollection.org/humans.txt \
  --acl public-read \
  --content-type "text/plain; charset=utf-8" \
  --content-encoding "utf-8"

# Note: robots.txt is now served dynamically via Next.js API routes
# with environment-specific content selected at runtime.
# See config/robots/ for environment-specific robots.txt files.

# This is used to verify that we own the domain in
# the Google Search Console.
#
# See https://wellcome.slack.com/archives/C3TQSF63C/p1655464291878209
aws s3 cp "$ASSETS/googlea25c86e91ccc343b.html" s3://i.wellcomecollection.org/googlea25c86e91ccc343b.html --acl public-read

aws s3 sync "$ASSETS/fonts" s3://i.wellcomecollection.org/assets/fonts --acl public-read
aws s3 sync "$ASSETS/icons" s3://i.wellcomecollection.org/assets/icons --acl public-read
aws s3 sync "$ASSETS/images" s3://i.wellcomecollection.org/assets/images --acl public-read
