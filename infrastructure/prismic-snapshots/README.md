# Prismic Snapshots - Infrastructure

This directory contains Terraform infrastructure for daily Prismic content snapshots.

## Purpose

Maintains 14 days of rolling snapshots for all Prismic document content. Snapshots are generated at 11 PM UTC.

## File Structure

```
infrastructure/prismic-snapshots/
├── terraform.tf              # Provider configuration
├── main.tf                   # Main infrastructure
├── outputs.tf               # Terraform outputs
├── README.md                # This file
├── lambda/
│   └── prismic_snapshot.js   # Lambda function code for creating snapshots
└── prismic_snapshot_lambda.zip # Generated zip file
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ EventBridge     │───▶│ Lambda Function  │───▶│ S3 Bucket       │
│ (Daily 11 PM)   │    │ (Download)       │    │ (Store + Clean) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ CloudWatch Logs  │
                       │ (Monitoring)     │
                       └──────────────────┘
```

## Configuration

### Schedule

The Lambda runs daily at **11 PM UTC**. To change this, modify the `schedule_expression` in `main.tf`:

```hcl
schedule_expression = "cron(0 23 * * ? *)" # 11 PM UTC daily
```

### Retention

Snapshots are kept for **14 days**. To change this, modify the `days` in the lifecycle configuration in `main.tf`:

```hcl
expiration {
  days = 14  # Change this value
}
```

### Memory/Timeout

Lambda is configured with:

- **1GB memory**
- **15 minute timeout**

Adjust in `main.tf` if needed based on Prismic content size.

## Deployment

### Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Terraform installed** (>= 0.12)
3. **Prismic access token** stored in AWS Secrets Manager

N.B. The Prismic access token is already stored in AWS Secrets Manager as `prismic-model/prod/access-token` and is used by other services. You can verify it exists:

```bash
AWS_PROFILE=experience-developer aws secretsmanager describe-secret --secret-id "prismic-model/prod/access-token"
```

### Full Deployment (Rare)

- **What**: Creates S3 bucket, IAM roles, EventBridge schedule + deploys Lambda funtion with snapshot code
- **When**: Initial setup, permission changes, schedule changes
- **Impact**: Complete infrastructure deployment, requires planning
- **How**:

```bash
cd infrastructure/prismic-snapshots
./deploy.sh
```

### Update Lambda Code Only (As required)

- **What**: Updates Lambda function code only
- **When**: Bug fixes, feature updates, logic changes
- **Impact**: Safe to run anytime
- **How**:

```bash
cd infrastructure/prismic-snapshots
./deploy-code.sh
```

## Testing

### Manual Lambda Invocation/Snapshot Creation

```bash
# Test the Lambda function
AWS_PROFILE=experience-developer aws lambda invoke \
  --function-name prismic-snapshot \
  --payload '{}' \
  response.json

# Check the response
cat response.json
```

### Checking S3 snapshots

```bash
# List all snapshots
AWS_PROFILE=experience-developer aws s3 ls s3://wellcomecollection-prismic-snapshots/

# Download latest snapshot
AWS_PROFILE=experience-developer aws s3 cp s3://wellcomecollection-prismic-snapshots/ ./snapshots/ --recursive
```

## Monitoring

### CloudWatch Logs

```bash
# Check recent logs
AWS_PROFILE=experience-developer aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/prismic-snapshot"

# Follow logs in real-time
AWS_PROFILE=experience-developer aws logs tail /aws/lambda/prismic-snapshot --follow
```

## Cleanup/Destruction\*\*

To completely remove all infrastructure:

```bash
cd infrastructure/prismic-snapshots

# Review what will be destroyed
terraform plan -destroy

# Destroy all resources
terraform destroy
```

**⚠️ Warning**: This will delete all snapshots and cannot be undone!
