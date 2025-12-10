resource "aws_iam_role" "prismic_snapshot_lambda_role" {
  name = "${local.lambda_snapshot_name}-role"

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

resource "aws_iam_role" "prismic_backup_trigger_lambda_role" {
  name = "${local.lambda_backup_trigger_name}-role"

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

resource "aws_iam_role" "prismic_backup_download_lambda_role" {
  name = "${local.lambda_backup_download_name}-role"

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

# IAM policy for Lambda to write to CloudWatch logs
resource "aws_iam_policy" "lambda_cloudwatch_policy" {
  name = "prismic-lambda-cloudwatch-policy"

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
      }
    ]
  })
}

# IAM policy for Lambda to write to S3
resource "aws_iam_policy" "lambda_s3_policy" {
  name = "prismic-lambda-s3-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
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

# IAM role for EventBridge Scheduler
resource "aws_iam_role" "prismic_snapshot_scheduler_role" {
  name = "${local.lambda_snapshot_name}-scheduler-role"

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
  name = "${local.lambda_snapshot_name}-scheduler-policy"

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