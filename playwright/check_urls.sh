#!/usr/bin/env bash

yarn url-checker \
  --base-url $BASE_URL \
  --input-file ./expected_200_urls.txt \
  --expected-status 200

yarn url-checker \
  --base-url $BASE_URL \
  --input-file ./expected_404_urls.txt \
  --expected-status 404
