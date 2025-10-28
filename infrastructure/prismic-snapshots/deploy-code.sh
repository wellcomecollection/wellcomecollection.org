#!/bin/bash

# Deploy Prismic Snapshot Lambda Code

set -euo pipefail

# Configuration
LAMBDA_NAME="prismic-snapshot"
SOURCE_DIR="prismic-model"
LAMBDA_CODE_FILE="lambda-deployment.zip"

echo "Deploying Prismic Snapshot Lambda Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if we're in the right directory
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Expected to be run from repository root (missing $SOURCE_DIR directory)"
    exit 1
fi

# Check if Lambda function exists
if ! AWS_PROFILE=experience-developer aws lambda get-function --function-name "$LAMBDA_NAME" > /dev/null 2>&1; then
    echo "Lambda function '$LAMBDA_NAME' not found."
    echo "Please deploy the infrastructure first using:"
    echo "cd infrastructure/prismic-snapshots && ./deploy.sh"
    exit 1
fi

echo "Lambda function '$LAMBDA_NAME' found"

echo "Building Lambda package..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Use the shared build script that Terraform uses
"$SCRIPT_DIR/build-lambda.sh" "$SCRIPT_DIR/$LAMBDA_CODE_FILE"

# Deploy Lambda
echo "Updating Lambda function code..."
AWS_PROFILE=experience-developer aws lambda update-function-code \
    --function-name "$LAMBDA_NAME" \
    --zip-file "fileb://$SCRIPT_DIR/$LAMBDA_CODE_FILE"

echo "Waiting for update to complete..."
AWS_PROFILE=experience-developer aws lambda wait function-updated --function-name "$LAMBDA_NAME"

# Get function info
FUNCTION_INFO=$(AWS_PROFILE=experience-developer aws lambda get-function --function-name "$LAMBDA_NAME")
LAST_MODIFIED=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.LastModified')
CODE_SIZE=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.CodeSize')

echo ""
echo "Lambda code deployment completed!"
echo "Function: $LAMBDA_NAME"
echo "Last Modified: $LAST_MODIFIED"
echo "Code Size: $(numfmt --to=iec --suffix=B $CODE_SIZE)"

# Cleanup
rm -f "$SCRIPT_DIR/$LAMBDA_CODE_FILE"

echo ""
echo "Test the deployment:"
echo "AWS_PROFILE=experience-developer aws lambda invoke --function-name $LAMBDA_NAME --payload '{}' response.json"
