locals {
  lambda_name = "prismic-snapshot"
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

  # Ignore code changes after initial deployment - deploy-code.sh handles updates
  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }
}

# Create a zip file for the Lambda function with dependencies
resource "null_resource" "lambda_build" {
  triggers = {
    # Rebuild when the Lambda code changes
    lambda_code = filemd5("${path.module}/lambda/prismic_snapshot.js")
    # Rebuild when the build script changes
    build_script = filemd5("${path.module}/scripts/build-lambda.sh")
  }

  provisioner "local-exec" {
    command = "${path.module}/scripts/build-lambda.sh ${path.module}/prismic_snapshot_lambda.zip"
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

# CloudWatch Log Group for the Lambda function
resource "aws_cloudwatch_log_group" "prismic_snapshot_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.prismic_snapshot.function_name}"
  retention_in_days = 14
} 

resource "aws_iam_role_policy_attachment" "prismic_snapshot_lambda_policy" {
  role       = aws_iam_role.prismic_snapshot_lambda_role.name
  policy_arn = aws_iam_policy.prismic_snapshot_lambda_policy.arn
}