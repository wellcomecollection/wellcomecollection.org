#!/usr/bin/env bash
set -eo pipefail

# The contents of 'urls' should be mounted into the docker-compose container with a volume

yarn url-checker \
  --base-url $BASE_URL \
  --input-file ./urls/expected_200_urls.txt \
  --expected-status 200 \
  --no-tty

yarn url-checker \
  --base-url $BASE_URL \
  --input-file ./urls/expected_404_urls.txt \
  --expected-status 404 \
  --no-tty
