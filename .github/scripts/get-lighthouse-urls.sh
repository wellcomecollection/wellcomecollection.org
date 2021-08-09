#!/usr/bin/env bash

PATHS_FILE=.github/scripts/lighthouse_integration_paths.txt

# get the environment URL from the deployment status API
# TODO: this will be unecessary once this feature is out of
# preview as the URL will be in the event payload
# See https://developer.github.com/changes/2016-04-06-deployment-and-deployment-status-enhancements/
DEPLOYMENT_STATUS_URL="https://api.github.com/repos/wellcomecollection/wellcomecollection.org/deployments/${DEPLOYMENT_ID}/statuses/${DEPLOYMENT_STATUS_ID}"
ENVIRONMENT_URL=$(curl -s -H "Accept: application/vnd.github.ant-man-preview+json" $DEPLOYMENT_STATUS_URL | jq -r '.environment_url')

# prepend the deployment URL to all the paths
URLS=$(awk -v prefix_url="$ENVIRONMENT_URL" '{print prefix_url $0}' $PATHS_FILE)

# say what we're going to do
echo "Reporting on:"
echo $URLS

# escape the newlines as per:
# https://trstringer.com/github-actions-multiline-strings/
URLS="${URLS//'%'/'%25'}"
URLS="${URLS//$'\n'/'%0A'}"
URLS="${URLS//$'\r'/'%0D'}"

# set the step output
echo "::set-output name=list::$URLS"
