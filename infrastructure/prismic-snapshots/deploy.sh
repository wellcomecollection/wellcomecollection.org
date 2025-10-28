#!/bin/bash

# Deploy Prismic Snapshot Infrastructure
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Deploying Prismic Snapshot Infrastructure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if AWS CLI is configured
if ! AWS_PROFILE=experience-developer aws sts get-caller-identity > /dev/null 2>&1; then
    echo "AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if Prismic secret exists
echo "Checking for Prismic access token in Secrets Manager..."
if ! AWS_PROFILE=experience-developer aws secretsmanager describe-secret --secret-id "prismic-model/prod/access-token" > /dev/null 2>&1; then
    echo "Prismic access token not found in Secrets Manager."
    echo "This secret should already exist (used by other services)."
    echo "If it's missing, please create it:"
    echo "aws secretsmanager create-secret \\"
    echo "--name \"prismic-model/prod/access-token\" \\"
    echo "--description \"Access token for Prismic API\" \\"
    echo "--secret-string \"your-prismic-access-token-here\""
    exit 1
fi

echo "Prismic access token found (shared with other services)"

# Initialize Terraform if needed
if [ ! -f ".terraform/terraform.tfstate" ]; then
    echo "Initializing Terraform..."
    terraform init
fi

# Plan the deployment
echo "Planning deployment..."
terraform plan -out=tfplan

# Ask for confirmation
echo ""
read -p "Deploy the above infrastructure? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deploying infrastructure..."
    terraform apply tfplan

    echo ""
    echo "Deployment complete!"
    echo ""
    echo "Infrastructure Summary:"
    terraform output

    echo ""
    echo "Test the deployment:"
    echo "AWS_PROFILE=experience-developer aws lambda invoke --function-name prismic-snapshot --payload '{}' response.json"
    echo ""
    echo "View snapshots:"
    echo "AWS_PROFILE=experience-developer aws s3 ls s3://wellcomecollection-prismic-snapshots/"

else
    echo "Deployment cancelled"
    rm -f tfplan
    exit 1
fi

# Cleanup
rm -f tfplan

echo ""
echo "All done, the Lambda will run daily at 11 PM UTC."
