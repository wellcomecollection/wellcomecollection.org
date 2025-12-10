locals {
  lambda_backup_download_name = "prismic-backup-download"
}


# Lambda function
resource "aws_lambda_function" "prismic_backup_download" {
  function_name = local.lambda_backup_download_name
  role          = aws_iam_role.prismic_backup_download_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 900 # 15 minutes
  memory_size   = 1024

  # Initial deployment uses this code - deploy-code.sh handles updates
  filename         = data.archive_file.prismic_backup_download_lambda_zip.output_path
  source_code_hash = data.archive_file.prismic_backup_download_lambda_zip.output_base64sha256

  environment {
    variables = {
      BUCKET_NAME          = aws_s3_bucket.prismic_snapshots.bucket
      NODE_OPTIONS         = "--enable-source-maps"
    }
  }

  # Ignore code changes after initial deployment - deploy-code.sh handles updates
  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }
}

# Create a zip file for the Lambda function with dependencies
resource "null_resource" "lambda_backup_download_build" {
  triggers = {
    # Rebuild when the Lambda code changes
    lambda_code = filemd5("${path.module}/lambda/prismic_backup_download.js")
    # Rebuild when the build script changes
    build_script = filemd5("${path.module}/scripts/build-lambda.sh")
  }

  provisioner "local-exec" {
    command = "${path.module}/scripts/build-lambda.sh prismic_backup_download ${path.module}/prismic_backup_download_lambda.zip"
  }
}

data "archive_file" "prismic_backup_download_lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/prismic_backup_download_lambda.zip"

  # This creates a minimal zip if the build script hasn't run yet
  source {
    content  = "// Placeholder - will be replaced by build script"
    filename = "index.js"
  }

  # Depend on the build to ensure it runs first
  depends_on = [null_resource.lambda_backup_download_build]
}

# CloudWatch Log Group for the Lambda function
resource "aws_cloudwatch_log_group" "prismic_backup_download_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.prismic_backup_download.function_name}"
  retention_in_days = 14
} 

resource "aws_iam_role_policy_attachment" "prismic_backup_download_lambda_cloudwatch_policy" {
  role       = aws_iam_role.prismic_backup_download_lambda_role.name
  policy_arn = aws_iam_policy.lambda_cloudwatch_policy.arn
}

resource "aws_iam_role_policy_attachment" "prismic_backup_download_lambda_s3_policy" {
  role       = aws_iam_role.prismic_backup_download_lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}