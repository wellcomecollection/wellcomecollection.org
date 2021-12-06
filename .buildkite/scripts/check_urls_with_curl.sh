#!/usr/bin/env bash
# This script does some very basic checking of URLs on the site.
# It fetches them with cURL and compares the status code to the
# expected status code.

set -o errexit
set -o nounset

BASE="https://wellcomecollection.org"

for url in $(cat .buildkite/expected_200_urls.txt)
do
  echo -n "Checking $BASE$url... "

  STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$BASE$url")
  echo "$STATUS"

  if (( $STATUS != 200 ))
  then
    echo "!!! Expected 200 OK, got $STATUS"
    exit 1
  fi
done

for url in $(cat .buildkite/expected_404_urls.txt)
do
  echo -n "Checking $BASE$url... "

  STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$BASE$url")
  echo "$STATUS"

  if (( $STATUS != 404 ))
  then
    echo "!!! Expected 404 Not Found, got $STATUS"
    exit 1
  fi
done
