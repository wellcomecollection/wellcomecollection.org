#!/usr/bin/env bash
# This script does some very basic checking of URLs on the site.
# It fetches them with cURL and compares the status code to the
# expected status code.
#
# It takes two input files:
#
#     expected_200_urls.txt
#     expected_404_urls.txt
#
# Each line of these files should contain a URL path/query that
# you want to assert is either 200 OK or 404 Not Found.
#
# The file can include newlines and comments to keep it organised.
#
# It's meant to be a barebones regression test for the entire site.

set -o errexit
set -o nounset

if [[ "${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT:-prod}" == "stage" ]]
then
  BASE="https://www-stage.wellcomecollection.org"
else
  BASE="https://wellcomecollection.org"
fi

for url in $(grep ^/ .buildkite/expected_200_urls.txt)
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

for url in $(grep ^/ .buildkite/expected_404_urls.txt)
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
