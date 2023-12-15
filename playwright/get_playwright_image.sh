#!/usr/bin/env bash
# The Docker image we use for Playwright testing is quite large and takes
# a while to build (~3m), but doesn't change that much -- it's self-contained
# and only needs to change when we add new tests.
#
# To save us building it every time we use it, this script caches built
# images in an ECR repo.
#
# In particular, it pushes new Docker images with two tags:
#
#   - latest
#   - the Git commit ref
#
# so downstream builds can just pull "weco/playwright:latest", and this
# script makes sure that tag always reflects the latest copy of these tests.

set -o errexit
set -o nounset

ROOT=$(git rev-parse --show-toplevel)

ECR_REPO_PREFIX="130871440101.dkr.ecr.eu-west-1.amazonaws.com"

# Get the last commit that modified the "playwright" folder
LAST_PLAYWRIGHT_COMMIT=$(git log -n 1 --pretty=format:%H -- "$ROOT/playwright")

# Log in to ECR
aws ecr get-login-password \
| docker login \
    --username AWS \
    --password-stdin 760097843905.dkr.ecr.eu-west-1.amazonaws.com

# This looks in the "weco/playwright" repo for an image tagged "latest",
# and then it looks for an image tag "ref.abc…" and extracts the commit.
#
# This is the commit of the latest Playwright image.
#
# See the jq() manual for a detailed explanation of the syntax:
# https://stedolan.github.io/jq/manual/#Basicfilters
#
# We get a JSON object from the 'describe-images' command like:
#
#     {
#       "imageDetails": [
#         {
#           ...
#           "imageTags": [
#             "latest",
#             "7dbca1eff7dc6444a25593ccd37f5f26f335d9dd",
#           ],
#         }
#       ]
#     }
#
# and we want to get that Git commit ID without

LATEST_ECR_COMMIT=$(
  aws ecr describe-images \
    --repository-name=weco/playwright \
    --image-ids='imageTag=latest' |
  jq -r '
    .imageDetails[0]
      | .imageTags
      | map(select(. | contains("latest") | not))
      | .[0]'
)

if [[ "$LATEST_ECR_COMMIT" == "$LAST_PLAYWRIGHT_COMMIT" ]]
then
  echo "Latest image in ECR reflects what's in Git, nothing to do ($LAST_PLAYWRIGHT_COMMIT)"
  exit 0
else
  echo "Latest image in ECR ($LATEST_ECR_COMMIT) isn't what's in Git ($LAST_PLAYWRIGHT_COMMIT), so pushing a new image"
  set -o verbose
  docker build --tag "weco/playwright:$LAST_PLAYWRIGHT_COMMIT" --file "$ROOT/playwright/Dockerfile" .

  docker tag "weco/playwright:$LAST_PLAYWRIGHT_COMMIT" "$ECR_REPO_PREFIX/weco/playwright:$LAST_PLAYWRIGHT_COMMIT"
  docker push "$ECR_REPO_PREFIX/weco/playwright:$LAST_PLAYWRIGHT_COMMIT"

  docker tag "weco/playwright:$LAST_PLAYWRIGHT_COMMIT" "$ECR_REPO_PREFIX/weco/playwright:latest"
  docker push "$ECR_REPO_PREFIX/weco/playwright:latest"
fi
