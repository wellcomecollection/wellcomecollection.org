#!/bin/bash

# Build Lambda deployment package with dependencies
# This script is called by Terraform to create a proper Lambda zip

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="$1"

# Create temporary directory for Lambda package
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "Building Lambda package for Terraform..."

# Copy the Lambda function code
cp "$SCRIPT_DIR/lambda/prismic_snapshot.js" "$TEMP_DIR/index.js"

# Create package.json for Lambda dependencies
cat > "$TEMP_DIR/package.json" << 'EOF'
{
  "name": "prismic-snapshot-lambda",
  "version": "1.0.0",
  "description": "Lambda function to download Prismic snapshots",
  "main": "index.js",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.899.0",
    "@prismicio/client": "^7.0.0"
  }
}
EOF

# Install dependencies
cd "$TEMP_DIR"
npm install --production --silent

# Create deployment package
zip -r "$OUTPUT_FILE" . > /dev/null

echo "Lambda package created: $OUTPUT_FILE"