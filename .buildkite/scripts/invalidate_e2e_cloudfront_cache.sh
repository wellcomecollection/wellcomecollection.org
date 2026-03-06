#!/usr/bin/env bash
# Invalidate CloudFront cache for the e2e environment
#
# Usage:
#   .buildkite/scripts/invalidate_e2e_cloudfront_cache.sh
#
# This script creates a CloudFront invalidation for all paths in the e2e
# distribution. This is necessary after deploying to ensure tests run against
# the latest code, not cached responses.

# Exit immediately if any command fails
set -o errexit
# Exit if we try to use an unset variable
set -o nounset

# CloudFront distribution ID for e2e environment
DISTRIBUTION_ID="E24KUWI00L6FA3"

echo "Creating CloudFront invalidation for e2e distribution $DISTRIBUTION_ID..."

# Create an invalidation for all paths (/*) in the distribution
# - This tells CloudFront to clear all cached content
# - Returns the invalidation ID which we need to track completion
INVALIDATION_ID=$(
  aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text
)

echo "Invalidation created with ID: $INVALIDATION_ID"
echo "Waiting for invalidation to complete..."

# Wait for the invalidation to complete before proceeding
# - This ensures subsequent steps (like e2e tests) run against fresh content
# - Typically takes 1-2 minutes but can vary
aws cloudfront wait invalidation-completed \
  --distribution-id "$DISTRIBUTION_ID" \
  --id "$INVALIDATION_ID"

echo "CloudFront cache successfully invalidated for e2e environment"
