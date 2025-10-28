locals {
  lambda_name = "prismic-snapshot"
  bucket_name = "wellcomecollection-prismic-snapshots"
}

# Source of Prismic access token
data "aws_secretsmanager_secret_version" "prismic_access_token" {
  secret_id = "prismic-model/prod/access-token"
}

# S3 bucket for storing Prismic snapshots
resource "aws_s3_bucket" "prismic_snapshots" {
  bucket = local.bucket_name

  tags = {
    Name        = "Prismic Snapshots"
    Environment = "production"
    Purpose     = "backup"
  }
}

resource "aws_s3_bucket_versioning" "prismic_snapshots" {
  bucket = aws_s3_bucket.prismic_snapshots.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "prismic_snapshots" {
  bucket = aws_s3_bucket.prismic_snapshots.id

  rule {
    id     = "delete_old_snapshots"
    status = "Enabled"

    expiration {
      days = 14
    }

    noncurrent_version_expiration {
      noncurrent_days = 1
    }
  }
}

# IAM role for the Lambda function
resource "aws_iam_role" "prismic_snapshot_lambda_role" {
  name = "${local.lambda_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Lambda to write to S3 and CloudWatch logs
resource "aws_iam_policy" "prismic_snapshot_lambda_policy" {
  name = "${local.lambda_name}-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          aws_s3_bucket.prismic_snapshots.arn,
          "${aws_s3_bucket.prismic_snapshots.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "prismic_snapshot_lambda_policy" {
  role       = aws_iam_role.prismic_snapshot_lambda_role.name
  policy_arn = aws_iam_policy.prismic_snapshot_lambda_policy.arn
}

# Lambda function
resource "aws_lambda_function" "prismic_snapshot" {
  function_name = local.lambda_name
  role          = aws_iam_role.prismic_snapshot_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 900 # 15 minutes
  memory_size   = 1024

  # Initial deployment uses this code - deploy-code.sh handles updates
  filename         = data.archive_file.prismic_snapshot_lambda_zip.output_path
  source_code_hash = data.archive_file.prismic_snapshot_lambda_zip.output_base64sha256

  environment {
    variables = {
      BUCKET_NAME          = aws_s3_bucket.prismic_snapshots.bucket
      NODE_OPTIONS         = "--enable-source-maps"
      PRISMIC_ACCESS_TOKEN = data.aws_secretsmanager_secret_version.prismic_access_token.secret_string
    }
  }

  tags = {
    Name        = "Prismic Snapshot Lambda"
    Environment = "production"
    Purpose     = "backup"
  }

  # Ignore code changes after initial deployment - deploy-code.sh handles updates
  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
      last_modified,
    ]
  }
}

# Create a zip file for the Lambda function with dependencies
resource "null_resource" "lambda_build" {
  triggers = {
    # Rebuild when the Lambda code changes
    lambda_code = filemd5("${path.module}/lambda/prismic_snapshot.js")
    # Rebuild when the build script changes
    build_script = filemd5("${path.module}/build-lambda.sh")
  }

  provisioner "local-exec" {
    command = "${path.module}/build-lambda.sh ${path.module}/prismic_snapshot_lambda.zip"
  }
}

data "archive_file" "prismic_snapshot_lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/prismic_snapshot_lambda.zip"
  
  # This creates a minimal zip if the build script hasn't run yet
  source {
    content  = "// Placeholder - will be replaced by build script"
    filename = "index.js"
  }

  # Depend on the build to ensure it runs first
  depends_on = [null_resource.lambda_build]
}

# EventBridge Scheduler for daily execution at 11 PM UTC
resource "aws_scheduler_schedule" "prismic_snapshot_daily" {
  name       = "${local.lambda_name}-schedule"
  group_name = "default"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(0 23 * * ? *)" # 11 PM UTC daily

  target {
    arn      = aws_lambda_function.prismic_snapshot.arn
    role_arn = aws_iam_role.prismic_snapshot_scheduler_role.arn
  }
}

# IAM role for EventBridge Scheduler
resource "aws_iam_role" "prismic_snapshot_scheduler_role" {
  name = "${local.lambda_name}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "prismic_snapshot_scheduler_policy" {
  name = "${local.lambda_name}-scheduler-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "lambda:InvokeFunction"
        Resource = aws_lambda_function.prismic_snapshot.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "prismic_snapshot_scheduler_policy" {
  role       = aws_iam_role.prismic_snapshot_scheduler_role.name
  policy_arn = aws_iam_policy.prismic_snapshot_scheduler_policy.arn
}

# Allow EventBridge Scheduler to invoke the Lambda
resource "aws_lambda_permission" "allow_scheduler" {
  statement_id  = "AllowExecutionFromScheduler"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.prismic_snapshot.function_name
  principal     = "scheduler.amazonaws.com"
  source_arn    = aws_scheduler_schedule.prismic_snapshot_daily.arn
}

# CloudWatch Log Group for the Lambda function
resource "aws_cloudwatch_log_group" "prismic_snapshot_lambda_logs" {
  name              = "/aws/lambda/${local.lambda_name}"
  retention_in_days = 14
}
